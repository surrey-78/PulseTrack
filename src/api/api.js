export const predictHealthRisk = async (formData) => {
    try {
        // We ensure numeric values are actually numbers before sending
        const cleanData = {
            age: parseInt(formData.age),
            bmi: parseFloat(formData.bmi),
            blood_pressure: parseInt(formData.blood_pressure),
            glucose_level: parseInt(formData.glucose_level),
            alcohol_frequency: formData.alcohol_frequency,
            smoking_frequency: formData.smoking_frequency,
            exercise_type: formData.exercise_type
        };

        // Send data to Python Backend (running on port 8000)
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(cleanData),
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        return await response.json();
        
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};