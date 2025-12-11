// src/components/ResultsDisplay.jsx (Updated with Tabbed Recommendations)
import React, { useState } from 'react';

// --- Utility Functions (Risk Style) ---

const getRiskStyle = (risk) => {
    switch (risk) {
        case 'Low':
            return { color: '#4CAF50', backgroundColor: '#E8F5E9', borderColor: '#4CAF50' };
        case 'Medium':
            return { color: '#FFC107', backgroundColor: '#FFFDE7', borderColor: '#FFC107' };
        case 'High':
            return { color: '#D32F2F', backgroundColor: '#FFEBEE', borderColor: '#D32F2F' };
        default:
            return { color: '#333333', backgroundColor: '#F4F7FF', borderColor: '#CCC' };
    }
};

const RiskCard = ({ title, risk }) => {
    const style = getRiskStyle(risk);
    return (
        <div className="risk-card" style={{ borderLeft: `5px solid ${style.borderColor}`, backgroundColor: style.backgroundColor }}>
            <h4>{title}</h4>
            <span className="risk-level" style={{ color: style.color }}>{risk}</span>
        </div>
    );
};


// --- ResultsDisplay Component ---

export default function ResultsDisplay({ result }) {
    // State to manage which recommendation tab is currently active
    const [activeTab, setActiveTab] = useState('food'); // 'food' or 'medicine'

    if (!result || !result.risks) {
        return null;
    }

    const { risks, recommendations } = result;
    
    // Define the content for the active tab
    const activeContent = activeTab === 'food' 
        ? recommendations.food_recommendations 
        : recommendations.medicine_recommendations;

    const TabButton = ({ tabId, label }) => (
        <button
            className={`tab-button ${activeTab === tabId ? 'active' : ''}`}
            onClick={() => setActiveTab(tabId)}
            aria-selected={activeTab === tabId}
        >
            {label}
        </button>
    );

    return (
        <div className="results-container">
            <h2>📊 Predicted Risk Profile</h2>
            <div className="risks-summary-grid">
                <RiskCard title="Diabetes Risk" risk={risks.diabetes} />
                <RiskCard title="Hypertension Risk" risk={risks.hypertension} />
                <RiskCard title="Heart Disease Risk" risk={risks.heart_disease} />
            </div>
            

            <h2>💊 Personalized Recommendations</h2>
            
            <div className="tabs-header">
                <TabButton tabId="food" label="Food & Diet" />
                <TabButton tabId="medicine" label="Medicine & Lifestyle" />
            </div>

            <div className="recommendation-box tab-content">
                <ul>
                    {activeContent.length > 0 ? (
                        activeContent.map((rec, index) => (
                            <li key={`${activeTab}-${index}`}>{rec}</li>
                        ))
                    ) : (
                        <li>No specific recommendations in this category based on your data.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}