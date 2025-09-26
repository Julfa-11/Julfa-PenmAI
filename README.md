# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.  
It sounds like a great project! Creating an FD (Fixed Deposit) Calculator using React and Material-UI (or Material Design components in a modern framework) is an excellent idea that uses a popular, current tech stack.


Project: FD Calculator
This project is an interactive web application that allows users to calculate the maturity amount and interest earned on a Fixed Deposit (FD) based on their input, following the principles of Material Design for a clean, responsive, and accessible user interface.

1. Tech Stack
Category	Technology	Reasoning & Note
Frontend Framework	React (with Hooks)	Industry standard for building scalable and maintainable single-page applications (SPAs). Hooks simplify state management and side effects.
UI Framework	Material UI (MUI) v5+	The most popular React component library that implements Google's Material Design. Provides high-quality, pre-built, and customizable components (like Sliders, TextFields, Buttons, etc.).
Styling	Styled-components or MUI's sx prop	For component-level styling, ensuring modularity and theming capabilities. MUI's built-in styling solution is excellent for quick customization.
Language	TypeScript (Optional but Recommended)	Adds static typing for better code quality, fewer runtime errors, and improved developer experience.
Build Tool	Vite or Create React App (CRA)	Fast development server and optimized production builds. Vite is often preferred for its speed.

Export to Sheets
2. Key Features and User Flow
The calculator will follow these steps:

Input Collection: User inputs the required FD parameters.

Calculation: The application calculates the maturity value and interest.

Output Display: The results are clearly presented.

Visualization (Optional but Recommended): A simple chart to show the principal vs. maturity amount.

Required User Inputs
Principal Amount (P): Initial investment amount.

Annual Interest Rate (r): The rate offered by the bank (e.g., 7.5%).

Tenure (t): Duration of the FD (e.g., 5 years, 60 months).

Compounding Frequency (n): How often interest is compounded (e.g., Quarterly, Half-yearly, Annually).

Output
Total Interest Earned

Maturity Amount (Principal + Total Interest)

FD Formula
The standard compound interest formula is used:

A=P(1+ 
n
r
​
 ) 
n⋅t
 
Where:

A=Maturity Amount

P=Principal Amount

$r = \text{Annual Interest Rate (decimal form, i.e., 7.5% is 0.075)}$

n=Compounding Frequency per year

t=Tenure in years

3. Material Design Component Structure
The application will be split into logical, reusable components following Atomic Design principles and leveraging MUI components for a Material AI aesthetic.

A. Layout & Structure
Component	MUI Equivalent	Description
App.jsx	Container, ThemeProvider	Sets up the main layout and applies the Material UI theme (e.g., primary color, typography).
Header	AppBar, Toolbar, Typography	Displays the title (e.g., "FD Interest Calculator") and potentially a theme switcher (light/dark mode).
CalculatorCard	Card	The main container for the calculator inputs and results, providing a lifted, shadowed, and focused area.

Export to Sheets
B. Input Components (FDInput.jsx)
This component will manage the user's input state.

Input Field	MUI Component	Details
Principal Amount	TextField	Numeric input. Can use a Slider for a more interactive experience on the desktop, with the TextField showing the exact value. Use InputAdornment for a currency symbol ($ or ₹).
Interest Rate	Slider, TextField	Allows precise and rapid adjustment. Use InputAdornment for a '%' symbol.
Tenure	TextField, Select	A combination field: TextField for the number, and a Select component to switch between Years and Months.
Compounding Freq.	RadioGroup or Select	Options like Quarterly (n=4), Half-yearly (n=2), Annually (n=1), Monthly (n=12).
Calculate Button	Button	A prominent, perhaps contained or elevated button to trigger the final calculation (though calculations should ideally run on every input change for a dynamic experience).

Export to Sheets
C. Output Components (FDResults.jsx)
This section clearly presents the calculated values.

Output Element	MUI Component	Details
Result Panel	Paper or Box	A clean section to display results.
Result Labels	Typography	Use different font weights and sizes (e.g., h4 for Maturity Amount, subtitle1 for Interest Earned) to create a visual hierarchy.
Visualization	Box + A Chart Library (e.g., Recharts, Nivo)	A simple Bar Chart or Pie Chart illustrating the division of the Maturity Amount into Principal and Interest Earned.

Export to Sheets
4. Implementation Details
State Management
Use the useState React hook within the main CalculatorCard or a parent component to manage all input fields (e.g., principal, rate, tenure, frequency).

JavaScript

// Example of state management in the main component
import React, { useState, useEffect } from 'react';

const FDCalculator = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.0);
  const [tenureYears, setTenureYears] = useState(5);
  const [compoundingFreq, setCompoundingFreq] = useState(4); // 4 for quarterly
  const [results, setResults] = useState({ maturity: 0, interest: 0 });

  // Use useEffect to recalculate whenever any input state changes
  useEffect(() => {
    // Calculation Logic goes here...
    // Set results: setResults({ maturity: calculatedA, interest: calculatedI });
  }, [principal, rate, tenureYears, compoundingFreq]);

  // ... JSX for rendering FDInput and FDResults components ...
};
The FD Calculation Logic
A dedicated function or custom hook (useFDCalculation) will handle the mathematical operations to keep the components clean.

Convert the rate to decimal: r_decimal = rate / 100.

Perform the calculation using the formula.

Ensure input validation (e.g., Principal and Rate must be positive numbers).

This structured approach, utilizing the React component model and the pre-styled, accessibility-focused components of MUI, ensures a robust, modern, and user-friendly FD calculator application.
