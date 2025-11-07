const express = require("express");
const XLSX = require("xlsx");
const app = express();
const PORT = 5000;

app.use(express.json());

// Load Excel file
const workbook = XLSX.readFile("Form.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// GET all forms
app.get("/forms", (req, res) => {
  const formNames = [...new Set(sheet.map(row => row.Form || row.form))].filter(Boolean);
  res.json({ unique_HrDocuments: formNames });
});

// POST - Get specific form details
app.post("/form", (req, res) => {
  const { formName } = req.body;

  if (!formName) {
    return res.status(400).json({ error: "Missing 'formName' in request body" });
  }

  const filtered = sheet.filter(
    row => (row.Form || row.form)?.toLowerCase() === formName.toLowerCase()
  );

  if (filtered.length === 0) {
    return res.status(404).json({ error: `Form '${formName}' not found` });
  }

  const result = filtered.map(row => {
    let type = (row.Type || row.type || "").toLowerCase().trim();
    let optionData = row.Option || row.option || "";

    let options = [];
    if (optionData && optionData.toLowerCase() !== "na") {
      options = optionData.split(",").map(opt => opt.trim());
    }

    let typeName = "Single Input";
    if (type.includes("multiple")) typeName = "Multiple Choice";
    else if (type.includes("date")) typeName = "Date Picker";

    return {
      question: (row.Question || row.question || "").trim(),
      type: typeName,
      options
    };
  });

  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
