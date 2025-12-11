import { useLocation, Link, Navigate } from "react-router-dom";
import "../styles/results.css";

export default function Results() {
    const { state } = useLocation();

    // 1. Safety Check: If no data exists, redirect back to Predict page
    if (!state) {
        return <Navigate to="/predict" replace />;
    }

    // Helper function to determine color class based on risk level
    const getRiskClass = (riskLevel) => {
        const level = riskLevel?.toLowerCase() || "";
        if (level.includes("high")) return "risk-card high";
        if (level.includes("medium")) return "risk-card medium";
        return "risk-card low"; // Default to low/safe
    };

    return (
        <div className="results-container">
            <div className="results-header">
                <h1>Medical Analysis Report</h1>
                <p>AI-generated health assessment based on provided vitals.</p>
            </div>

            <div className="results-grid">
                {/* Diabetes Card */}
                <div className={getRiskClass(state.diabetes_risk)}>
                    <div className="card-header">
                        <h3>Diabetes</h3>
                        <span className="risk-badge">{state.diabetes_risk} Risk</span>
                    </div>
                    <div className="card-body">
                        <h4>Recommendation:</h4>
                        <p>{state.diabetes_recommendation}</p>
                    </div>
                </div>

                {/* Hypertension Card */}
                <div className={getRiskClass(state.hypertension_risk)}>
                    <div className="card-header">
                        <h3>Hypertension</h3>
                        <span className="risk-badge">{state.hypertension_risk} Risk</span>
                    </div>
                    <div className="card-body">
                        <h4>Recommendation:</h4>
                        <p>{state.hypertension_recommendation}</p>
                    </div>
                </div>

                {/* Heart Disease Card */}
                <div className={getRiskClass(state.heart_risk)}>
                    <div className="card-header">
                        <h3>Heart Disease</h3>
                        <span className="risk-badge">{state.heart_risk} Risk</span>
                    </div>
                    <div className="card-body">
                        <h4>Recommendation:</h4>
                        <p>{state.heart_recommendation}</p>
                    </div>
                </div>
            </div>

            <div className="action-area">
                <Link to="/predict" className="btn-restart">
                    &larr; Analyze New Patient
                </Link>
                <button className="btn-print" onClick={() => window.print()}>
                    Print Report
                </button>
            </div>
        </div>
    );
}