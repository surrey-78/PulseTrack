import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictHealthRisk } from "../api/api";
import "../styles/global.css"; // Using global CSS

export default function Predict() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [form, setForm] = useState({
        age: "",
        bmi: "",
        blood_pressure: "",
        glucose_level: "",
        alcohol_frequency: "None",
        smoking_frequency: "None",
        exercise_type: "None"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const results = await predictHealthRisk(form);
            navigate("/results", { state: results });
        } catch (err) {
            console.error(err);
            setError("Failed to process prediction. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-card">
                <div className="form-header">
                    <h2>Patient Health Data</h2>
                    <p>Enter the patient's vitals and lifestyle habits for AI analysis.</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Section 1: Vitals */}
                    <h3 className="section-title">Medical Vitals</h3>
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Age</label>
                            <input name="age" type="number" min="0" placeholder="e.g. 45" required onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>BMI</label>
                            <input name="bmi" type="number" step="0.1" min="0" placeholder="e.g. 24.5" required onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>Blood Pressure (Systolic)</label>
                            <input name="blood_pressure" type="number" min="0" placeholder="e.g. 120" required onChange={handleChange} />
                        </div>

                        <div className="input-group">
                            <label>Glucose Level (mg/dL)</label>
                            <input name="glucose_level" type="number" min="0" placeholder="e.g. 90" required onChange={handleChange} />
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Section 2: Lifestyle */}
                    <h3 className="section-title">Lifestyle Habits</h3>
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Alcohol Consumption</label>
                            <select name="alcohol_frequency" value={form.alcohol_frequency} onChange={handleChange}>
                                <option value="None">None</option>
                                <option value="Low">Low (Occasional)</option>
                                <option value="Medium">Medium (Weekly)</option>
                                <option value="High">High (Daily)</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Smoking Frequency</label>
                            <select name="smoking_frequency" value={form.smoking_frequency} onChange={handleChange}>
                                <option value="None">None</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Physical Activity</label>
                            <select name="exercise_type" value={form.exercise_type} onChange={handleChange}>
                                <option value="None">Sedentary (None)</option>
                                <option value="Light">Light (Walking)</option>
                                <option value="Moderate">Moderate (Gym/Jogging)</option>
                                <option value="Intense">Intense (Athlete)</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Analyzing Data..." : "Generate Prediction"}
                    </button>
                </form>
            </div>
        </div>
    );
}