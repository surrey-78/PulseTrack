from flask import Flask, request, jsonify
from flask_cors import CORS 
import numpy as np
import pandas as pd
import joblib

# --- Configuration ---
app = Flask(__name__)
CORS(app) 

# --- File Paths ---
MODEL_DIABETES_PATH = 'diabetics.pkl'
MODEL_HYPERTENSION_PATH = 'hypertension.pkl'
MODEL_HEART_PATH = 'heart_disease.pkl'
SCALER_PATH = 'scaler.pkl'
ONEHOT_ENCODER_PATH = 'onehot_encoder.pkl'
FEATURE_NAMES_PATH = 'feature_names.pkl'

# --- Hardcoded Column Lists (Synchronized with frontend config) ---
TRAINING_NUMERICAL_COLS = [
    'age', 'height_cm', 'weight_kg', 'bmi', 'systolic_bp', 'diastolic_bp', 
    'blood_glucose_level', 'cholesterol_level', 'heart_rate', 'sleep_hours', 
    'stress_level', 'physical_activity_level', 'diet_quality_score'
]

TRAINING_CATEGORICAL_COLS = [
    'gender', 'sex', 'ethnicity', 'family_history_diabetes', 'family_history_hypertension',
    'family_history_heart_disease', 'alcohol_frequency', 'smoking_frequency', 
    'exercise_type', 'diet_type', 'chronic_conditions_list', 'allergies_list', 
    'current_medications_list', 'city', 'state' 
]
# -----------------------------------------------------------------


# PASTE generate_recommendations FUNCTION HERE:
def generate_recommendations(risk_diabetes_level, risk_hypertension_level, risk_heart_disease_level):
    food_recommendations = []
    medicine_recommendations = []
    risk_map = {0.0: 'Low', 1.0: 'Medium', 2.0: 'High'}

    risk_diabetes_cat = risk_map.get(risk_diabetes_level, 'Unknown')
    risk_hypertension_cat = risk_map.get(risk_hypertension_level, 'Unknown')
    risk_heart_disease_cat = risk_map.get(risk_heart_disease_level, 'Unknown')

    # Food Recommendations
    if risk_diabetes_cat == 'Low':
        food_recommendations.append('Balanced diet with moderate sugar intake.')
    elif risk_diabetes_cat == 'Medium':
        food_recommendations.append('Diet focused on whole grains, lean protein, and reduced refined sugars.')
    elif risk_diabetes_cat == 'High':
        food_recommendations.append('Strict low-sugar, high-fiber diet, consult a nutritionist.')

    if risk_hypertension_cat == 'Low':
        food_recommendations.append('Maintain a balanced diet, limit processed foods.')
    elif risk_hypertension_cat == 'Medium':
        food_recommendations.append('Low-sodium diet, rich in fruits, vegetables, and potassium.')
    elif risk_hypertension_cat == 'High':
        food_recommendations.append('Strict DASH diet, avoid high-sodium foods, consult a dietitian.')

    if risk_heart_disease_cat == 'Low':
        food_recommendations.append('Heart-healthy diet, including whole foods and healthy fats.')
    elif risk_heart_disease_cat == 'Medium':
        food_recommendations.append('Mediterranean-style diet, limit saturated and trans fats.')
    elif risk_heart_disease_cat == 'High':
        food_recommendations.append('Very low-fat, low-cholesterol diet, regular consultation with a cardiologist and dietitian.')

    # Medicine Recommendations
    if risk_diabetes_cat == 'Low':
        medicine_recommendations.append('Regular check-ups, maintain healthy lifestyle.')
    elif risk_diabetes_cat == 'Medium':
        medicine_recommendations.append('Monitor blood glucose, discuss preventive medication with doctor.')
    elif risk_diabetes_cat == 'High':
        medicine_recommendations.append('Consult endocrinologist for medication review and management plan.')

    if risk_hypertension_cat == 'Low':
        medicine_recommendations.append('Regular blood pressure monitoring.')
    elif risk_hypertension_cat == 'Medium':
        medicine_recommendations.append('Discuss lifestyle changes and potential medication with doctor.')
    elif risk_hypertension_cat == 'High':
        medicine_recommendations.append('Adhere strictly to prescribed antihypertensive medication, regular doctor visits.')

    if risk_heart_disease_cat == 'Low':
        medicine_recommendations.append('Regular cardiovascular check-ups.')
    elif risk_heart_disease_cat == 'Medium':
        medicine_recommendations.append('Discuss cholesterol-lowering medication or other preventive measures with doctor.')
    elif risk_heart_disease_cat == 'High':
        medicine_recommendations.append('Strict adherence to cardiac medications, regular follow-ups with cardiologist.')

    return {
        'food_recommendations': food_recommendations,
        'medicine_recommendations': medicine_recommendations
    }
# END of generate_recommendations


# PASTE preprocess_new_data FUNCTION HERE (MODIFIED):
def preprocess_new_data(new_data_df, scaler, onehot_encoder, feature_names):
    """Applies the exact same preprocessing steps as used during training."""
    
    # 1. Use hardcoded lists from the training phase for robust preprocessing
    numerical_cols = TRAINING_NUMERICAL_COLS
    categorical_cols = TRAINING_CATEGORICAL_COLS

    # CRITICAL CHECK: Ensure all expected columns are present in the input data
    missing_cols = [col for col in numerical_cols + categorical_cols if col not in new_data_df.columns]
    if missing_cols:
        raise ValueError(f"Input data is missing critical columns: {missing_cols}")

    # 1.5. Explicitly set data types for consistency before scaling/encoding
    for col in numerical_cols:
        new_data_df[col] = pd.to_numeric(new_data_df[col], errors='coerce') # Coerce non-numeric to NaN
    for col in categorical_cols:
        new_data_df[col] = new_data_df[col].astype(str)
        

    # 2. Handle Missing Values (Must match step 2 in notebook)
    columns_to_fill_none = [
        'alcohol_frequency', 'smoking_frequency', 'exercise_type',
        'chronic_conditions_list', 'allergies_list', 'current_medications_list'
    ]
    for col in columns_to_fill_none:
        if col in new_data_df.columns:
             new_data_df[col] = new_data_df[col].fillna('None')


    # 3. Apply saved One-Hot Encoder
    onehot_encoded_features = onehot_encoder.transform(new_data_df[categorical_cols])
    onehot_df = pd.DataFrame(
        onehot_encoded_features,
        columns=onehot_encoder.get_feature_names_out(categorical_cols),
        index=new_data_df.index
    )

    # 4. Apply saved Standard Scaler
    scaled_numerical_features = scaler.transform(new_data_df[numerical_cols])
    scaled_numerical_df = pd.DataFrame(scaled_numerical_features, columns=numerical_cols, index=new_data_df.index)

    # 5. Concatenate and reindex features to match the training data
    df_preprocessed = pd.concat([scaled_numerical_df, onehot_df], axis=1)

    # CRITICAL: Reindex to ensure feature order is identical to X_train
    df_final = df_preprocessed.reindex(columns=feature_names, fill_value=0.0)
    return df_final
# END of preprocess_new_data
# --- End of Utility Functions ---


# --- Load ML Artifacts Globally (Runs once when server starts) ---
try:
    models = {
        'risk_diabetes': joblib.load(MODEL_DIABETES_PATH),
        'risk_hypertension': joblib.load(MODEL_HYPERTENSION_PATH),
        'risk_heart_disease': joblib.load(MODEL_HEART_PATH)
    }
    scaler = joblib.load(SCALER_PATH)
    onehot_encoder = joblib.load(ONEHOT_ENCODER_PATH)
    feature_names = joblib.load(FEATURE_NAMES_PATH)
    print("All ML artifacts loaded successfully for the API server.")
except FileNotFoundError as e:
    print(f"FATAL ERROR: Missing artifact file: {e}. Cannot start API.")
    exit()

@app.route('/predict_risks', methods=['POST'])
def predict_risks():
    try:
        data = request.get_json(force=True)
        # Convert the incoming JSON data (single patient) into a DataFrame.
        input_df = pd.DataFrame([data]) 

        processed_data = preprocess_new_data(input_df.copy(), scaler, onehot_encoder, feature_names)

        # 3. Make Predictions
        predicted_diabetes_risk = models['risk_diabetes'].predict(processed_data)[0]
        predicted_hypertension_risk = models['risk_hypertension'].predict(processed_data)[0]
        predicted_heart_disease_risk = models['risk_heart_disease'].predict(processed_data)[0]
        
        # 4. Generate Recommendations
        recommendations = generate_recommendations(
            predicted_diabetes_risk,
            predicted_hypertension_risk,
            predicted_heart_disease_risk
        )
        
        risk_map_display = {0.0: 'Low', 1.0: 'Medium', 2.0: 'High'}

        # 5. Return JSON response
        response = {
            'status': 'success',
            'risks': {
                'diabetes': risk_map_display.get(predicted_diabetes_risk, 'Unknown'),
                'hypertension': risk_map_display.get(predicted_hypertension_risk, 'Unknown'),
                'heart_disease': risk_map_display.get(predicted_heart_disease_risk, 'Unknown')
            },
            'recommendations': recommendations
        }
        return jsonify(response)

    except Exception as e:
        # This will now print the specific error (like the ValueError) to your console
        print(f"Prediction Error: {e}") 
        return jsonify({'status': 'error', 'message': f"An error occurred: {str(e)} check server logs."}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)