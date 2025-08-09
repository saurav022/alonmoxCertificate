
import React, { useState } from "react";
import { Loader2, RefreshCcw, Plus, Search, CheckCircle } from "lucide-react"; // or wherever your icons come from
import "./certificatemanager.css"; // Custom CSS file

const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbw6q5hT_0WoEQ2V26VWkEw0QNtGfI-aPRJlf8hZQjXp24UfwE7-dau7bnRUakS6bD3ZAQ/exec"; // Replace with your Apps Script URL

function SheetManager() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    dateOfIssue: "",
    certificateNumber: "",
  });
  const [checkNumber, setCheckNumber] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCertNumber, setCreatedCertNumber] = useState("");
  
  const formatDate = (isoDate) => {
    if (!isoDate || isNaN(new Date(isoDate).getTime())) return "N/A";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
  };

  /* const generateCertificateNumber = async () => {
    setIsGenerating(true);
    let unique = false;
    let number;
    
    try {
      while (!unique) {
        number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const res = await fetch(SHEET_API_URL, {
          method: "POST",
          body: JSON.stringify({ action: "check", certificateNumber: number }),
        });
        const json = await res.json();
        if (!json.exists) {
          unique = true;
        }
      }
      setForm({ ...form, certificateNumber: number });
      showMessage("Certificate number generated successfully!");
    } catch (error) {
      console.error("Error checking for unique number:", error);
      showMessage("Failed to generate a unique number.", true);
    } finally {
      setIsGenerating(false);
    }
  }; */

  const generateCertificateNumber = async () => {
  setIsGenerating(true);
  let unique = false;
  let certificateNumber;

  try {
    const currentYear = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year

    while (!unique) {
      const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12-digit number
      certificateNumber = `Al/${currentYear}/${randomDigits}`;

      const res = await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "check", certificateNumber }),
      });

      const json = await res.json();
      if (!json.exists) {
        unique = true;
      }
    }

    setForm({ ...form, certificateNumber });
    showMessage("Certificate number generated successfully!");
  } catch (error) {
    console.error("Error checking for unique number:", error);
    showMessage("Failed to generate a unique number.", true);
  } finally {
    setIsGenerating(false);
  }
};

 /*  const handleCreate = async () => {
    // Validation check for all fields
    if (!form.name || !form.email || !form.dob || !form.dateOfIssue || !form.certificateNumber) {
      showMessage("❌ All fields are mandatory. Please fill them out.", true);
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "create", ...form }),
      });
      const json = await res.json();
      if (json.success) {
        setCreatedCertNumber(json.certificateNumber);
        setShowSuccessModal(true);
        setForm({ name: "", email: "", dob: "", dateOfIssue: "", certificateNumber: "" });
      } else {
        showMessage("❌ Failed to save record.", true);
      }
    } catch (error) {
      console.error("Error creating record:", error);
      showMessage("❌ Failed to create record. Please check network.", true);
    } finally {
      setIsCreating(false);
    }
  }; */
const handleCreate = async () => {
  const enteredPin = window.prompt("🔐 Enter 4-digit PIN to proceed:");

  if (enteredPin !== "al0909") {
    showMessage("❌ Incorrect PIN. Access denied.", true);
    return;
  }

  if (!form.name || !form.email || !form.dob || !form.dateOfIssue || !form.certificateNumber) {
    showMessage("❌ All fields are mandatory. Please fill them out.", true);
    return;
  }

  setIsCreating(true);
  try {
    const res = await fetch(SHEET_API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "create", ...form }),
    });
    const json = await res.json();
    if (json.success) {
      setCreatedCertNumber(json.certificateNumber);
      setShowSuccessModal(true);
      setForm({ name: "", email: "", dob: "", dateOfIssue: "", certificateNumber: "" });
    } else {
      showMessage("❌ Failed to save record.", true);
    }
  } catch (error) {
    console.error("Error creating record:", error);
    showMessage("❌ Failed to create record. Please check network.", true);
  } finally {
    setIsCreating(false);
  }
};

  const handleCheck = async () => {
    setIsChecking(true);
    setCheckResult(null);
    try {
      const res = await fetch(SHEET_API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "check", certificateNumber: checkNumber }),
      });
      const json = await res.json();
      setCheckResult(json.exists ? json : { exists: false });
      if (json.exists) {
        showMessage("Certificate found!");
      } else {
        showMessage("Certificate not found.", true);
      }
    } catch (error) {
      console.error("Error checking certificate:", error);
      showMessage("❌ Failed to check certificate. Please check network.", true);
    } finally {
      setIsChecking(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setCreatedCertNumber("");
  };

  return (
   <div className="container">
      <div className="card">
        <h2>🎓 Alomonx Certificate Manager</h2>

       

        <div className="form-section">
          <label>Name:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter name"
          />

          <label>Email:</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter email"
          />

          <label>Date of Birth:</label>
          <input
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />

          <label>Date of Issue:</label>
          <input
            type="date"
            value={form.dateOfIssue}
            onChange={(e) => setForm({ ...form, dateOfIssue: e.target.value })}
          />

          <label>Certificate Number:</label>
          <div className="inline-group">
            <input
            
              type="text"
              value={form.certificateNumber}
              onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })}
              placeholder="Generate or enter manually"
              disabled={true}
            />
            <button onClick={generateCertificateNumber} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>

          <button className="primary" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Record"}
          </button>
           {message && (
          <div className={`message ${message.includes("❌") ? "error" : "success"}`}>
            {message}
          </div>
        )}
        </div>

        <div className="form-section">
          <label>Check Certificate Number:</label>
          <div className="inline-group">
            <input
              type="text"
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
              placeholder="Enter certificate number"
              disabled={isChecking}
            />
            <button onClick={handleCheck} disabled={isChecking}>
              {isChecking ? "Checking..." : "Check"}
            </button>
          </div>

          {checkResult && (
            <div className="result">
              {checkResult.exists ? (
                <>
                  <p><strong>Name:</strong> {checkResult.name}</p>
                  <p><strong>Email:</strong> {checkResult.email}</p>
                  <p><strong>DOB:</strong> {formatDate(checkResult.dob)}</p>
                  <p><strong>Date of Issue:</strong> {formatDate(checkResult.dateOfIssue)}</p>
                  <p><strong>Certificate Number:</strong> {checkResult.certificateNumber}</p>
                </>
              ) : (
                <p className="error">❌ Certificate number not found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>✅ Success!</h3>
            <p>Record created with certificate number:</p>
            <p className="cert-number">{createdCertNumber}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SheetManager;
