import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import OrdinalEncoder, OneHotEncoder, StandardScaler

# --- Configuration for Preprocessing ---
# You MUST verify these lists against your original Colab notebook 
# where you trained and saved the scaler/encoder artifacts!

# List of columns that were scaled (StandardScaler)
TRAINING_NUMERICAL_COLS = [
    'age', 'height_cm', 'weight_kg', 'bmi', 'systolic_bp', 'diastolic_bp', 
    'blood_glucose_level', 'cholesterol_level', 'heart_rate', 'sleep_hours', 
    'stress_level', 'physical_activity_level', 'diet_quality_score'
]

# List of columns that were One-Hot Encoded (OneHotEncoder)
# Note: I have included 'gender', 'ethnicity', 'city', and 'state' from your dummy data.
# If your original training data had 'diet_type' or 'sex' (as suggested by the error trace), 
# you MUST ensure they are in this list and in your dummy data.
TRAINING_CATEGORICAL_COLS = [
    'gender', 'ethnicity', 'family_history_diabetes', 'family_history_hypertension',
    'family_history_heart_disease', 'alcohol_frequency', 'smoking_frequency', 
    'exercise_type', 'chronic_conditions_list', 'allergies_list', 
    'current_medications_list', 'city', 'state' 
]


# --- File Paths ---
MODEL_DIABETES_PATH = 'diabetics.pkl'
MODEL_HYPERTENSION_PATH = 'hypertension.pkl'
MODEL_HEART_PATH = 'heart_disease.pkl'
SCALER_PATH = 'scaler.pkl'
ONEHOT_ENCODER_PATH = 'onehot_encoder.pkl'
FEATURE_NAMES_PATH = 'feature_names.pkl'

# --- The Recommendation Function (Unchanged) ---
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
# --- End of Recommendation Function ---


def load_artifacts():
    """Loads all saved models and preprocessing objects."""
    print("Loading ML artifacts...")
    try:
        models = {
            'risk_diabetes': joblib.load(MODEL_DIABETES_PATH),
            'risk_hypertension': joblib.load(MODEL_HYPERTENSION_PATH),
            'risk_heart_disease': joblib.load(MODEL_HEART_PATH)
        }
        scaler = joblib.load(SCALER_PATH)
        onehot_encoder = joblib.load(ONEHOT_ENCODER_PATH)
        feature_names = joblib.load(FEATURE_NAMES_PATH)
        print("Artifacts loaded successfully.")
        return models, scaler, onehot_encoder, feature_names
    except FileNotFoundError as e:
        print(f"ERROR: Artifact file not found. Have you downloaded all files? Missing file: {e}")
        return None, None, None, None
    except Exception as e:
        print(f"An unexpected error occurred during loading: {e}")
        return None, None, None, None


def preprocess_new_data(new_data_df, scaler, onehot_encoder, feature_names):
    """Applies the exact same preprocessing steps as used during training."""
    print("Preprocessing new data...")

    # 1. Use hardcoded lists from the training phase for robust preprocessing
    numerical_cols = TRAINING_NUMERICAL_COLS
    categorical_cols = TRAINING_CATEGORICAL_COLS

    # CRITICAL CHECK: Ensure all expected columns are present in the input data
    missing_cols = [col for col in numerical_cols + categorical_cols if col not in new_data_df.columns]
    if missing_cols:
        raise ValueError(f"Input data is missing critical columns: {missing_cols}")


    # 2. Handle Missing Values (Must match step 2 in notebook)
    columns_to_fill_none = [
        'alcohol_frequency', 'smoking_frequency', 'exercise_type',
        'chronic_conditions_list', 'allergies_list', 'current_medications_list'
    ]
    for col in columns_to_fill_none:
        if col in new_data_df.columns:
            # Ensure the column is of type object before filling with 'None' string
            if new_data_df[col].dtype != 'object':
                 new_data_df[col] = new_data_df[col].astype(str)
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
    print("Data preprocessing complete and features aligned.")
    return df_final


def predict_and_recommend(new_data_path):
    """Main function to run prediction pipeline."""
    
    # --- TEMPLATE DATA LOADING ---
    # Load your original data to get column names for the dummy patient
    try:
        # Use the correct file name based on your file structure
        original_df = pd.read_csv('extended_health_dataset.csv') 
        
        feature_cols = [col for col in original_df.columns if col not in ['risk_diabetes', 'risk_hypertension', 'risk_heart_disease']]
        
        # Create a single dummy patient's data (customize these values)
        # IMPORTANT: Ensure your dummy data includes ALL columns listed in the 
        # TRAINING_NUMERICAL_COLS and TRAINING_CATEGORICAL_COLS lists above.
        dummy_patient_data = {
            'age': [55], 'height_cm': [170], 'weight_kg': [85], 'bmi': [29.4], 'systolic_bp': [145], 'diastolic_bp': [95], 
            'blood_glucose_level': [150], 'cholesterol_level': [220], 'heart_rate': [78], 'sleep_hours': [6], 
            'stress_level': [7], 'physical_activity_level': [3], 'diet_quality_score': [5],
            'gender': ['Male'], 'ethnicity': ['Asian'], 'family_history_diabetes': ['Yes'], 
            'family_history_hypertension': ['No'], 'family_history_heart_disease': ['Yes'], 
            'alcohol_frequency': ['Daily'], 'smoking_frequency': ['Occasional'], 'exercise_type': ['Cardio'],
            'chronic_conditions_list': ['Asthma, High Cholesterol'], 'allergies_list': ['None'],
            'current_medications_list': ['Statins'], 'city': ['Mumbai'], 'state': ['Maharashtra']
        }
        
        new_data_df = pd.DataFrame(dummy_patient_data)
        
    except Exception as e:
        print(f"Error creating dummy data. Make sure the original CSV is accessible: {e}")
        return

    # --- Pipeline Execution ---
    
    # 1. Load Artifacts
    models, scaler, onehot_encoder, feature_names = load_artifacts()
    if models is None:
        return

    # 2. Preprocess Data
    # This step will now use the hardcoded column lists
    processed_data = preprocess_new_data(new_data_df.copy(), scaler, onehot_encoder, feature_names)

    # 3. Make Predictions
    print("Generating predictions...")
    predicted_diabetes_risk = models['risk_diabetes'].predict(processed_data)[0]
    predicted_hypertension_risk = models['risk_hypertension'].predict(processed_data)[0]
    predicted_heart_disease_risk = models['risk_heart_disease'].predict(processed_data)[0]
    
    risk_map_display = {0.0: 'Low', 1.0: 'Medium', 2.0: 'High'}

    print("\n--- Predicted Risk Profile ---")
    print(f"Diabetes Risk: {risk_map_display.get(predicted_diabetes_risk)} (Code: {predicted_diabetes_risk})")
    print(f"Hypertension Risk: {risk_map_display.get(predicted_hypertension_risk)} (Code: {predicted_hypertension_risk})")
    print(f"Heart Disease Risk: {risk_map_display.get(predicted_heart_disease_risk)} (Code: {predicted_heart_disease_risk})")
    print("------------------------------")

    # 4. Generate Recommendations
    recommendations = generate_recommendations(
        predicted_diabetes_risk,
        predicted_hypertension_risk,
        predicted_heart_disease_risk
    )

    print('\n--- Personalized Recommendations ---')
    print('Food:')
    for rec in recommendations['food_recommendations']:
        print(f'  - {rec}')

    print('\nMedicine:')
    for rec in recommendations['medicine_recommendations']:
        print(f'  - {rec}')
    print('----------------------------------')


if __name__ == '__main__':
    predict_and_recommend(new_data_path='new_patient_data.csv')