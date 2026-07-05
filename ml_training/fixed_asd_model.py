
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.metrics import accuracy_score, f1_score, mean_absolute_error, classification_report, confusion_matrix, precision_score, recall_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier, AdaBoostClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import SGDClassifier
import warnings
import pickle



def ignore_warn(*args, **kwargs):
    pass


warnings.warn = ignore_warn

try:
    possible_paths = [


        './Children_ASD.csv',
        'Children_ASD.csv',
        '../ml_training/Children_ASD.csv',
        'starting up(5)/starting up/ml_training/Children_ASD.csv',
        'd:/New folder (2)/New folder/year 4 (S.E)...Senior/2nd semester/Grad2test/Grad2/starting up (5)/starting up/ml_training/Children_ASD.csv'
    ]

    df = None
    for path in possible_paths:
        try:
            df = pd.read_csv(path)
            print(f"Data loaded successfully from: {path}")
            if 'Speech Delay/Language Disorder' in df.columns:
                print("Using NEW dataset with expanded features")
            else:
                print("Using ORIGINAL dataset")
            break
        except FileNotFoundError:
            continue

    if df is None:
        raise FileNotFoundError("CSV file not found in any expected location")

except FileNotFoundError:
    print("CSV file not found. Using sample data for demonstration.")
    df = pd.DataFrame({
        'A1': [0, 1, 0, 1, 0],
        'A2': [1, 0, 1, 0, 1],
        'A3': [0, 1, 0, 1, 0],
        'A4': [1, 0, 1, 0, 1],
        'A5': [0, 1, 0, 1, 0],
        'A6': [1, 0, 1, 0, 1],
        'A7': [0, 1, 0, 1, 0],
        'A8': [1, 0, 1, 0, 1],
        'A9': [0, 1, 0, 1, 0],
        'A10_Autism_Spectrum_Quotient': [1, 0, 1, 0, 1],
        'Age_Years': [5, 7, 6, 8, 4],
        'Sex': ['M', 'F', 'M', 'F', 'M'],
        'Ethnicity': ['White', 'Asian', 'Black', 'Hispanic', 'White'],
        'Who_completed_the_test': ['Parent', 'Teacher', 'Parent', 'Teacher', 'Parent'],
        'Jaundice': ['No', 'Yes', 'No', 'No', 'Yes'],
        'Family_mem_with_ASD': ['No', 'Yes', 'No', 'No', 'Yes'],
        'ASD_traits': ['No', 'Yes', 'No', 'No', 'Yes']
    })

print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())

encoded_data = df.copy()

if 'Age' in encoded_data.columns:
    encoded_data.rename(columns={'Age': 'Age_Years'}, inplace=True)

binary_mapping = {'Yes': 1, 'No': 0, 'yes': 1,
                  'no': 0, 'M': 1, 'F': 0, 'm': 1, 'f': 0}
binary_cols = [
    'Jaundice', 'Family_mem_with_ASD', 'Speech Delay/Language Disorder',
    'Learning disorder', 'Genetic_Disorders', 'Depression', 'Anxiety_disorder',
    'Global developmental delay/intellectual disability', 'Social/Behavioural Issues'
]

for col in binary_cols:
    if col in encoded_data.columns:
        encoded_data[col] = encoded_data[col].map(binary_mapping).fillna(0)

if 'ASD_traits' in encoded_data.columns:
    encoded_data['ASD_traits'] = encoded_data['ASD_traits'].map(
        {'Yes': 1, 'No': 0}).fillna(0)

categorical_cols = ['Sex', 'Ethnicity', 'Who_completed_the_test']

for col in categorical_cols:
    if col in encoded_data.columns:
        encoded_data[col] = encoded_data[col].fillna('Unknown').astype(str)
        le = LabelEncoder()
        encoded_data[f'{col}_en'] = le.fit_transform(encoded_data[col])

q_cols = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
          'A8', 'A9', 'A10_Autism_Spectrum_Quotient']
q_cols = [c for c in q_cols if c in encoded_data.columns]

if len(q_cols) > 0:
    encoded_data['Result'] = encoded_data[q_cols].sum(axis=1)
else:
    encoded_data['Result'] = 0

other_signs_cols = [c for c in binary_cols if c in encoded_data.columns]
if len(other_signs_cols) > 0:
    encoded_data['Other_signs'] = encoded_data[other_signs_cols].sum(axis=1)
else:
    encoded_data['Other_signs'] = 0

print("Data encoding completed!")

target_col = 'ASD_traits'
if target_col in encoded_data.columns:
    class_counts = encoded_data[target_col].value_counts()
    print(f"Class distribution before balancing: {class_counts.to_dict()}")

    class_0 = encoded_data[encoded_data[target_col] == 0]
    class_1 = encoded_data[encoded_data[target_col] == 1]

    min_count = min(len(class_0), len(class_1))
    if min_count > 0:
        class_0_under = class_0.sample(min_count, random_state=42)
        class_1_under = class_1.sample(min_count, random_state=42)
        balanced_data = pd.concat([class_0_under, class_1_under], axis=0)
        print(f"Balanced dataset shape: {balanced_data.shape}")
        print(
            f"Class distribution after balancing: {balanced_data[target_col].value_counts().to_dict()}")
    else:
        balanced_data = encoded_data
        print("Could not balance data - insufficient samples")
else:
    balanced_data = encoded_data
    print("Target column not found, using original data")

features = [
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10_Autism_Spectrum_Quotient',
    'Age_Years', 'Jaundice', 'Family_mem_with_ASD', 'Sex_en', 'Ethnicity_en'
]

available_features = [f for f in features if f in balanced_data.columns]
print(f"Available features: {available_features}")

if len(available_features) > 0 and target_col in balanced_data.columns:
    X = balanced_data[available_features]
    y = balanced_data[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.4, random_state=42, stratify=y)
    print(f"Training set shape: {X_train.shape}")
    print(f"Test set shape: {X_test.shape}")

    models = {
        'DecisionTree': DecisionTreeClassifier(max_depth=5, min_samples_split=10, min_samples_leaf=5, random_state=42),
        'RandomForest': RandomForestClassifier(n_estimators=100, max_depth=10, min_samples_split=10, min_samples_leaf=5, random_state=42),
        'ExtraTrees': ExtraTreesClassifier(n_estimators=100, max_depth=10, min_samples_split=10, min_samples_leaf=5, random_state=42),
        'SVM': SVC(C=0.1, kernel='rbf', degree=3, gamma='scale', random_state=42),
        'AdaBoost': AdaBoostClassifier(
            DecisionTreeClassifier(
                max_depth=3, min_samples_split=10, random_state=42),
            n_estimators=50,
            random_state=42
        ),
        'KNN': KNeighborsClassifier(n_neighbors=5),
        'NaiveBayes': GaussianNB(),
        'SGD': SGDClassifier(random_state=42, alpha=0.01)
    }

    print("\n=== Model Training Results ===")
    results = {}

    for name, model in models.items():
        try:
            model.fit(X_train, y_train)

            y_train_pred = model.predict(X_train)
            train_accuracy = accuracy_score(y_train, y_train_pred)

            y_pred = model.predict(X_test)

            test_accuracy = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            precision = precision_score(y_test, y_pred, zero_division=0)
            recall = recall_score(y_test, y_pred, zero_division=0)
            mae = mean_absolute_error(y_test, y_pred)
            conf_matrix = confusion_matrix(y_test, y_pred)

            cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
            cv_mean = cv_scores.mean()
            cv_std = cv_scores.std()

            overfit_gap = train_accuracy - test_accuracy
            is_overfitting = overfit_gap > 0.05

            results[name] = {
                'train_accuracy': train_accuracy,
                'test_accuracy': test_accuracy,
                'overfit_gap': overfit_gap,
                'is_overfitting': is_overfitting,
                'cv_mean': cv_mean,
                'cv_std': cv_std,
                'f1': f1,
                'precision': precision,
                'recall': recall,
                'mae': mae,
                'confusion_matrix': conf_matrix
            }

            print(f"{name}:")
            print(f"  Train Accuracy: {train_accuracy:.4f}")
            print(f"  Test Accuracy: {test_accuracy:.4f}")
            print(f"  Precision: {precision:.4f}")
            print(f"  Recall: {recall:.4f}")
            print(f"  F1 Score: {f1:.4f}")
            print(f"  Confusion Matrix: {conf_matrix}")
            print(
                f"  Overfit Gap: {overfit_gap:.4f} {'⚠️ OVERFITTING' if is_overfitting else '✅ OK'}")
            print(f"  CV Score: {cv_mean:.4f} (±{cv_std:.4f})")
            print(f"  MAE: {mae:.4f}")
            print()

        except Exception as e:
            print(f"Error training {name}: {e}")

    if results:
        def model_score(name):
            result = results[name]
            base_score = result['test_accuracy']
            if result['is_overfitting']:
                base_score -= 0.1
            return base_score

        best_model_name = max(results.keys(), key=model_score)
        best_result = results[best_model_name]

        print(f"\n🏆 Best Model: {best_model_name}")
        print(f"   Test Accuracy: {best_result['test_accuracy']:.4f}")
        print(f"   Train Accuracy: {best_result['train_accuracy']:.4f}")
        print(f"   Overfit Gap: {best_result['overfit_gap']:.4f}")
        print(
            f"   CV Score: {best_result['cv_mean']:.4f} (±{best_result['cv_std']:.4f})")

        if best_result['is_overfitting']:
            print("   ⚠️  Some overfitting detected")
        else:
            print("   ✅ Good generalization")

        best_model = models[best_model_name]
        try:
            with open("../ml_service/model.pkl", "wb") as f:
                pickle.dump(best_model, f)
            print("Model saved successfully!")
        except Exception as e:
            print(f"Could not save model to ../ml_service/: {e}")
            try:
                with open("../../ml_service/model.pkl", "wb") as f:
                    pickle.dump(best_model, f)
                print("Model saved successfully to ../../ml_service/!")
            except Exception as e2:
                print(f"Could not save model to ../../ml_service/: {e2}")
                try:
                    with open("model.pkl", "wb") as f:
                        pickle.dump(best_model, f)
                    print("Model saved successfully in current directory!")
                except Exception as e3:
                    print(f"Could not save model locally: {e3}")

        if hasattr(best_model, 'feature_importances_'):
            print(f"\n🏆 Feature Importances for {best_model_name}:")
            feature_importance = pd.DataFrame({
                'Feature': available_features,
                'Importance': best_model.feature_importances_
            }).sort_values('Importance', ascending=False)
            print(feature_importance)

            try:
                plt.figure(figsize=(10, 6))
                sns.barplot(data=feature_importance,
                            x='Importance', y='Feature')
                plt.title(f'Feature Importance - {best_model_name}')
                plt.tight_layout()
                plt.savefig('feature_importance.png', dpi=300,
                            bbox_inches='tight')
                print("Feature importance plot saved as feature_importance.png")
            except Exception as e:
                print(f"Could not plot feature importance: {e}")
        elif hasattr(best_model, 'coef_'):
            print(f"\n🏆 Coefficients for {best_model_name}:")
            if len(best_model.coef_.shape) == 1:
                coef_abs = np.abs(best_model.coef_)
            else:
                coef_abs = np.mean(np.abs(best_model.coef_), axis=0)
            feature_importance = pd.DataFrame({
                'Feature': available_features,
                'Coefficient': best_model.coef_ if len(best_model.coef_.shape) == 1 else best_model.coef_[0],
                'Abs_Coefficient': coef_abs
            }).sort_values('Abs_Coefficient', ascending=False)
            print(
                feature_importance[['Feature', 'Coefficient', 'Abs_Coefficient']])
        else:
            print(
                f"\n⚠️  {best_model_name} does not support feature importance.")

else:
    print("Insufficient features or target column for training")

print("\nScript completed!")
