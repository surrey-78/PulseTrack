// src/pages/PulseTrackPage.jsx (ENHANCED with Footer)
import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import ResultsDisplay from '../components/ResultsDisplay';
// import AppFooter from '../components/AppFooter'; // Import the new Footer component

export default function PulseTrackPage() {
    const [predictionResult, setPredictionResult] = useState(null);

    const handleSuccess = (result) => {
        // Scroll to the results when they appear for a better user experience
        setPredictionResult(result);
        if (result) {
            document.getElementById('results-panel-anchor').scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="pulse-track-page">
            <header className="page-header">
                <h1>PulseTrack Health Risk System</h1>
            </header>
            
            {/* The main content area, structured in a grid */}
            <main className="main-content-grid">
                
                <div className="input-panel">
                    <PredictionForm onPredictionSuccess={handleSuccess} />
                </div>
                
                {/* Anchor point for scrolling to results */}
                <div id="results-panel-anchor" className="results-panel">
                    {predictionResult ? (
                        <ResultsDisplay result={predictionResult} />
                    ) : (
                        <div className="placeholder">
                            <h2>Submit Data to See Analysis</h2>
                            <p>Your personalized risk profile and recommendations will appear here. </p>
                            <p>All predictions are for informational purposes only and should not replace professional medical advice.</p>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Add the Footer component for compliance and professionalism */}
            {/* <AppFooter /> */} 
            {/* Note: You would create and import AppFooter in src/components/AppFooter.jsx */}
        </div>
    );
}