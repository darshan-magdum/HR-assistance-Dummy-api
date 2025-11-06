const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 1️⃣ Fetch all HR Forms
// 1️⃣ Fetch all HR Forms
app.get("/api/hr/forms", (req, res) => {
  const forms = [
    { id: "leave_request", name: "Leave Request" },
    { id: "sick_leave", name: "Sick Leave" },
    { id: "onboarding_form", name: "Employee Onboarding" },
    { id: "reimbursement", name: "Expense Reimbursement" }
  ];

  // ✅ Return in required format
  res.json({
    unique_HrDocuments: forms.map(f => f.name)
  });
});

// 2️⃣ Get questions for selected form
app.post("/api/hr/questions", (req, res) => {
  const { form_id } = req.body;

  const questionSets = {
    sick_leave: [
      { options: [], question: "Subject", type: "Single Line Text" },
      { options: [], question: "Request Description", type: "Single Line Text" }
    ],
    onboarding_form: [
      { options: [], question: "Full Name", type: "Single Line Text" },
      { options: ["HR", "Finance", "IT"], question: "Department", type: "Dropdown" }
    ],
    reimbursement: [
      { options: ["Travel", "Meals", "Supplies"], question: "Expense Type", type: "Dropdown" },
      { options: [], question: "Amount", type: "Single Line Text" }
    ]
  };

  // Return directly as an array
  res.json(questionSets[form_id] || []);
});


// 3️⃣ Submit form answers
app.post("/api/hr/submit", (req, res) => {
  const { form_id, result } = req.body;

  console.log("Form Submitted:", form_id, result);

  // Simulate DB insert or SharePoint write
  const success = true;

  if (success) {
    res.json({
      status: "success",
      message: "Request submitted successfully",
      Request_id: "HR" + Math.floor(Math.random() * 10000)
    });
  } else {
    res.json({ status: "error", message: "Failed to submit request" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ HR API running on port ${PORT}`));
