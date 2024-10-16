# Import Libraries
# import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
# Load Modules, Functions, Objects
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier

# Load the Dataset into a DataFrame
col_names = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width', 'Class']
df = pd.read_csv("iris.csv", names=col_names)

# Summarize the Dataset
print(df.shape)
print(df.head())
print(df.info())
print(df.describe())
print(df['Class'].value_counts())

# Create Violin Plots to Compare Variable Distribution
sns.violinplot(y='Class', x='Sepal Length', data=df, inner='quartile', hue='Class', palette="YlGnBu")
# Adjust the plot to ensure all labels are visible
plt.tight_layout()
# plt.show()
sns.violinplot(y='Class', x='Sepal Width', data=df, inner='quartile', hue='Class', palette="YlGnBu")
plt.tight_layout()
# plt.show()
sns.violinplot(y='Class', x='Petal Length', data=df, inner='quartile', hue='Class', palette="YlGnBu")
plt.tight_layout()
# plt.show()
sns.violinplot(y='Class', x='Petal Width', data=df, inner='quartile', hue='Class', palette="YlGnBu")
plt.tight_layout()
# plt.show()

# Create Pairs Plot to Check Multiple Pairwise Bivariate Distributions
sns.pairplot(df, hue='Class', palette="YlGnBu")
# plt.show()

# Plot Heatmap to Check Pairwise Correlation
plt.figure(figsize=(7, 5))
# Select only numerical columns for correlation calculation
numerical_data = df.select_dtypes(include=['float64', 'int64'])
sns.heatmap(numerical_data.corr(), annot=True, cmap='Greens')
# plt.show()

# Model Building
x = df.drop(['Class'], axis=1)
y = df['Class']
print(f'x shape: {x.shape} | y shape: {y.shape}')

# Split the Dataset into Train and Test Data
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.20, random_state=1)

# Test Six Different Algorithms in Loop and Print Accuracy
models = []
models.append(('LDA', LinearDiscriminantAnalysis()))
models.append(('KNN', KNeighborsClassifier()))
models.append(('DT', DecisionTreeClassifier()))
models.append(('NB', GaussianNB()))
models.append(('SVC', SVC(gamma='auto')))
models.append(('RF', RandomForestClassifier()))
# Evaluate Each Model
results = []
model_names = []
for name, model in models:
  kfold = StratifiedKFold(n_splits=10, random_state=1, shuffle=True)
  cv_results = cross_val_score(model, x_train, y_train, cv=kfold, scoring='accuracy')
  results.append(cv_results)
  model_names.append(name)
  print('%s: %f (%f)' % (name, cv_results.mean(), cv_results.std()))

# Train the SVC Model and Make Predictions on the Test Dataset
svcmodel = SVC(gamma="auto")
svcmodel.fit(x_train, y_train)
predictions = svcmodel.predict(x_test)

# Evaluate Predictions
print(accuracy_score(y_test, predictions))

print(confusion_matrix(y_test, predictions))

# Plot the Confusion Matrix in a Heatmap
cm = confusion_matrix(y_test, predictions)
# Get Unique ‘Class’ Labels
class_labels = df['Class'].unique()
sns.heatmap(cm, annot=True, fmt='d', cmap='YlGnBu', xticklabels=class_labels, yticklabels=class_labels)
# Rotate x-axis Labels by 45 Degrees for Better Readability
plt.xticks(rotation=45, ha='right')
plt.ylabel('Prediction', fontsize=12)
plt.xlabel('Actual', fontsize=12)
plt.title('Confusion Matrix', fontsize=16)
# Adjust the Plot to Ensure All Labels are Visible
plt.tight_layout()
# plt.show()

print(classification_report(y_test, predictions))

# The classification report shows excellent results.
# Here’s a breakdown of the information in the classification report:
# - Precision — the percentage of the predictions that were correct:
#   True Positives divided by the sum of True Positives and False Positives.
# - Recall — the percentage of the positive instances found correctly:
#   True Positives divided by the sum of True Positives and False Negatives.
# - F1 Score — the percentage of positive predictions that were correct:
#   2 times Precision times Recall divided by the sum of Precision and Recall.
# - Support — the actual number of occurrences of the class in the specified dataset.