import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import './styles/global.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const API_ENDPOINT = 'http://127.0.0.1:5000/predict_risks';

// You need to ensure ALL columns are included, like this:
function collectFormData() {
    const patientData = {
        // NUMERICAL (Use parseInt or parseFloat)
        "age": parseInt(document.getElementById('age').value), 
        "height_cm": parseFloat(document.getElementById('height').value),
        "weight_kg": parseFloat(document.getElementById('weight_kg').value),
        // ... (Include ALL other 10+ numerical features here) ...

        // CATEGORICAL (Use .value, which returns a string)
        "gender": document.getElementById('gender').value,
        "ethnicity": document.getElementById('ethnicity').value,
        // ... (Include ALL other categorical features here) ...
        "city": document.getElementById('city').value,
        "state": document.getElementById('state').value
    };
    return patientData;
}
// ... (rest of your functions like sendPredictionRequest, handleFormSubmit, displayResults) ...

// Attach the handler AFTER the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('predictionForm').addEventListener('submit', handleFormSubmit);
});