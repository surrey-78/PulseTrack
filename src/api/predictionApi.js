// src/api/predictionApi.js

const API_ENDPOINT = 'http://127.0.0.1:5000/predict_risks';

export async function getPrediction(patientData) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patientData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Prediction API Request Failed:", error);
        throw new Error(`Failed to get prediction: ${error.message}`);
    }
}