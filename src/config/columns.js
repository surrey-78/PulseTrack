// src/config/columns.js

// Numerical features used for StandardScaler
// This list is synchronized with the inputs required for the Python StandardScaler.
export const TRAINING_NUMERICAL_COLS = [
    'age', 'height_cm', 'weight_kg', 'bmi', 'systolic_bp', 'diastolic_bp', 
    'blood_glucose_level', 'cholesterol_level', 'heart_rate', 'sleep_hours', 
    'stress_level', 'physical_activity_level', 'diet_quality_score'
];

// Categorical features used for OneHotEncoder
// This list is CRITICAL: It MUST contain the exact column names expected by the saved OneHotEncoder (including 'sex' and 'diet_type').
export const TRAINING_CATEGORICAL_COLS = [
    'gender', 
    'sex', // Included for synchronization with the backend model
    'ethnicity', 
    'family_history_diabetes', 'family_history_hypertension',
    'family_history_heart_disease', 'alcohol_frequency', 'smoking_frequency', 
    'exercise_type', 
    'diet_type', // Included for synchronization with the backend model
    'chronic_conditions_list', 'allergies_list', 
    'current_medications_list', 'city', 'state' 
];

// Define options for Select inputs for easier rendering
export const CATEGORICAL_OPTIONS = {
    // Both 'gender' and 'sex' use the same options, synchronized in PredictionForm.jsx
    gender: ['Male', 'Female', 'Other'],
    sex: ['Male', 'Female', 'Other'], 
    
    ethnicity: ['Asian', 'Caucasian', 'African', 'Hispanic'],
    family_history_diabetes: ['Yes', 'No'],
    family_history_hypertension: ['Yes', 'No'],
    family_history_heart_disease: ['Yes', 'No'],
    alcohol_frequency: ['None', 'Occasional', 'Daily'],
    smoking_frequency: ['None', 'Occasional', 'Daily'],
    exercise_type: ['Cardio', 'Strength', 'Yoga', 'None'],
    diet_type: ['Standard', 'Vegetarian', 'Keto', 'Vegan', 'Other'], 
    
    chronic_conditions_list: ['None', 'Asthma', 'High Cholesterol', 'Diabetes'], 
    allergies_list: ['None', 'Pollen', 'Food', 'Medication'], 
    current_medications_list: ['None', 'Statins', 'Insulin', 'BP Medication'], 
    
    city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'], 
    state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'], 
};  