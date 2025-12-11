// src/components/PredictionForm.jsx (FINAL VERSION - Hiding Redundant 'sex' Input)
import React, { useState } from 'react';
import { getPrediction } from '../api/predictionApi';
import { TRAINING_NUMERICAL_COLS, TRAINING_CATEGORICAL_COLS, CATEGORICAL_OPTIONS } from '../config/columns';

// --- CORE CALCULATION FUNCTIONS (UNCHANGED) ---

const calculateBMI = (weight_kg, height_cm) => {
    const height_m = height_cm / 100;
    if (weight_kg > 0 && height_m > 0) {
        const bmi = weight_kg / (height_m * height_m);
        return parseFloat(bmi.toFixed(1));
    }
    return 0;
};

const calculatePAL = (exerciseType, smokingFrequency) => {
    let score = 5; 
    if (exerciseType === 'Cardio' || exerciseType === 'Strength') {
        score += 3;
    } else if (exerciseType === 'Yoga') {
        score += 1;
    } else { 
        score -= 2;
    }
    if (smokingFrequency === 'Daily') {
        score -= 3;
    } else if (smokingFrequency === 'Occasional') {
        score -= 1;
    }
    return Math.min(10, Math.max(1, score));
};

const calculateDQS = (alcoholFrequency, cholesterolLevel) => {
    let score = 8; 
    if (alcoholFrequency === 'Daily') {
        score -= 3;
    } else if (alcoholFrequency === 'Occasional') {
        score -= 1;
    }
    if (cholesterolLevel > 240) { 
        score -= 3;
    } else if (cholesterolLevel > 200) { 
        score -= 1;
    }
    return Math.min(10, Math.max(1, score));
};


// --- Helper Functions ---
const convertValue = (name, value) => {
    if (TRAINING_NUMERICAL_COLS.includes(name)) {
        return value === '' ? 0 : parseFloat(value);
    }
    return value;
};

const getInitialState = () => {
    const state = {};
    TRAINING_NUMERICAL_COLS.forEach(col => state[col] = 0);
    TRAINING_CATEGORICAL_COLS.forEach(col => state[col] = CATEGORICAL_OPTIONS[col] ? CATEGORICAL_OPTIONS[col][0] : 'None');
    
    // Ensure initial state reflects synchronized values for 'gender'/'sex'
    if (state.gender && !state.sex) state.sex = state.gender;
    if (state.sex && !state.gender) state.gender = state.sex;
    
    state.bmi = 0;
    state.physical_activity_level = calculatePAL(state.exercise_type || 'None', state.smoking_frequency || 'None');
    state.diet_quality_score = calculateDQS(state.alcohol_frequency || 'None', state.cholesterol_level || 0);
    
    return state;
};


export default function PredictionForm({ onPredictionSuccess }) {
    const [formData, setFormData] = useState(getInitialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target;
        const newValue = convertValue(id, value);
        
        let newFormData = {
            ...formData,
            [id]: newValue,
        };

        // --- SYNCHRONIZATION LOGIC: Mirror 'gender' and 'sex' ---
        if (id === 'gender') {
            newFormData.sex = newValue;
        } else if (id === 'sex') {
            // If somehow 'sex' is changed (e.g., if you temporarily un-hide it), mirror it back to 'gender'
            newFormData.gender = newValue;
        }
        // --- END SYNCHRONIZATION LOGIC ---


        // --- CORE CALCULATION INTERCEPTION (UNCHANGED) ---
        
        // 1. BMI Calculation
        if (id === 'height_cm' || id === 'weight_kg') {
            const currentWeight = id === 'weight_kg' ? newValue : formData.weight_kg;
            const currentHeight = id === 'height_cm' ? newValue : formData.height_cm;
            newFormData.bmi = calculateBMI(currentWeight, currentHeight);
        }

        // 2. Physical Activity Level (PAL) Calculation
        if (id === 'exercise_type' || id === 'smoking_frequency') {
            const currentExercise = id === 'exercise_type' ? newValue : formData.exercise_type;
            const currentSmoking = id === 'smoking_frequency' ? newValue : formData.smoking_frequency;
            newFormData.physical_activity_level = calculatePAL(currentExercise, currentSmoking);
        }

        // 3. Diet Quality Score (DQS) Calculation
        if (id === 'alcohol_frequency' || id === 'cholesterol_level') {
            const currentAlcohol = id === 'alcohol_frequency' ? newValue : formData.alcohol_frequency;
            const currentCholesterol = id === 'cholesterol_level' ? newValue : formData.cholesterol_level;
            newFormData.diet_quality_score = calculateDQS(currentAlcohol, currentCholesterol);
        }
        // --- END CALCULATION INTERCEPTION ---

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await getPrediction(formData);
            onPredictionSuccess(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (col, type) => {
        // --- HIDE REDUNDANT INPUT ---
        // If we choose to keep only 'gender' in the form, skip rendering 'sex'.
        if (col === 'sex') return null; 
        // -----------------------------
        
        const label = col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Identify fields that should be disabled (auto-calculated)
        const isDisabled = ['bmi', 'physical_activity_level', 'diet_quality_score'].includes(col);
        
        if (type === 'categorical') {
            const options = CATEGORICAL_OPTIONS[col] || [];
            return (
                <div key={col} className="input-group">
                    <label htmlFor={col}>{label}:</label>
                    <select id={col} value={formData[col]} onChange={handleChange} required>
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
            );
        }

        return (
            <div key={col} className="input-group">
                <label htmlFor={col}>{label}:</label>
                <input 
                    type="number" 
                    id={col} 
                    value={formData[col]} 
                    onChange={handleChange} 
                    required 
                    step={col.includes('bmi') || col.includes('height') || col.includes('weight') ? "0.1" : "1"}
                    disabled={isDisabled}
                    title={isDisabled ? "This field is automatically calculated based on other inputs." : ""}
                />
            </div>
        );
    };


    return (
        <form onSubmit={handleSubmit} className="prediction-form">
            <h2>Enter Patient Metrics</h2>
            
            <fieldset>
                <legend>Vitals & Core Metrics</legend>
                {TRAINING_NUMERICAL_COLS.map(col => renderInput(col, 'numerical'))}
            </fieldset>

            <fieldset>
                <legend>Background & Lifestyle</legend>
                {/* Note: 'sex' is now filtered out here, but its value is synced to 'gender' */}
                {TRAINING_CATEGORICAL_COLS.map(col => renderInput(col, 'categorical'))}
            </fieldset>
            
            <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Analyzing...' : 'Generate Personalized Risk Report'}
            </button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}