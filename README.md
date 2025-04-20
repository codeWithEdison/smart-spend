# **SmartSpend - Personal Budget Management App**

Welcome to **SmartSpend**, an intuitive and user-friendly Progressive Web App (PWA) designed to help you track, manage, and visualize your personal finances. Whether you're a student, a professional, or anyone looking to get better at budgeting, SmartSpend is here to simplify the process with powerful features and an easy-to-use interface.

**Visit SmartSpend App:** [smartspend.codewithedison.com](https://smartspend.codewithedison.com/)

---

## 🚀 **Features**

- **User Authentication**
  - Sign up/log in with email & password
  - Optionally use Google/Apple sign-in for quicker access
- **Budget Management**
  - Create and categorize income and expenses (e.g., Food, Rent, Entertainment)
  - Set monthly or weekly budgets per category to track your financial goals
- **Smart Dashboard**
  - Overview of total income vs expenses
  - Category-wise spending breakdown (pie chart & bar graphs)
  - Budget utilization and savings progress
- **Transaction History**
  - View, search, filter, edit, and delete transactions
- **Financial Reports & Insights**
  - Monthly/weekly reports with visualizations
  - Tips based on your spending behavior
- **Loan Management**
  - Track loan amounts, interest rates, and repayment schedules
  - Set reminders for upcoming payments
  - Visualize loan balance over time
- **PWA Features**
  - Offline access for full functionality
  - Installable to the home screen for easy access
  - Fast, responsive performance across all devices

---

## 💻 **Tech Stack**

- **Frontend**: Flutter (Web) or React.js for PWA
- **Charts & Visualization**: `fl_chart` (Flutter) or `Chart.js` (React)
- **Local Storage**: `Hive`, `IndexedDB`, or Firebase for cloud sync
- **PWA Tools**: Service Workers, manifest.json for offline capability and installation
- **State Management**: `Provider`, `Riverpod`, or `Redux`
- **Hosting**: Firebase Hosting, Vercel, or Netlify

---

## 🛠 **Installation & Setup**

### **Prerequisites**

- Node.js (for React.js version)
- Flutter SDK (for Flutter Web version)

### **Cloning the Repository**

To get started with SmartSpend, clone this repository to your local machine:

```bash
git clone https://github.com/codeWithEdison/smart-spend.git
cd smart-spend
```

### **For React.js Version**

1. Install the dependencies:

```bash
npm install
```

2. Start the local development server:

```bash
npm start
```

3. Visit [http://localhost:3000](http://localhost:3000) to see the app in action.

### **For Flutter Web Version**

1. Ensure you have Flutter installed and configured for web development.
2. Run the following command to get the dependencies:

```bash
flutter pub get
```

3. Run the app locally:

```bash
flutter run -d chrome
```

4. Visit [http://localhost:8000](http://localhost:8000) to see the app.

---

## 🎨 **UI/UX Design**

- A clean, minimalistic mobile-first design, with a focus on ease of use and clarity
- Responsive, data-driven dashboard to quickly overview your financial health
- Simple workflows for adding transactions, managing budgets, loan tracking, and viewing reports
- Visualizations to make financial data digestible, with charts and graphs

---

## 🔄 **PWA Features**

- **Offline Access**: Full functionality even without an internet connection
- **Home Screen Installability**: Add SmartSpend to your device’s home screen for quick access
- **Fast Loading**: Optimized for a smooth experience on mobile and desktop

---

## 🤖 **Development Phases**

1. **UI Design & Prototyping**
2. **Budget Management Features Implementation**
3. **Loan Management Integration**
4. **Dashboard Integration**
5. **Transaction History & Reports**
6. **PWA Features Integration**
7. **Testing & Optimization**

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 **Feedback & Contributions**

We welcome contributions to make SmartSpend better! If you find bugs, have suggestions, or want to contribute, feel free to fork the repo and submit a pull request. For issues, please open an issue on GitHub.

---

### **Follow CodeWithEdison**
- **Website**: [codewithedison.com](https://codewithedison.com/)
- **GitHub**: [@codeWithEdison](https://github.com/codeWithEdison)
- **Twitter**: [@codewithedison](https://twitter.com/codewithedison)

## 🚀 **iOS Development Guide**

### **Prerequisites**

- **macOS** (required for iOS development)
- **Xcode** (latest version from App Store)
- **Node.js** and **npm**
- **Capacitor CLI** installed globally
- **iOS Simulator** or physical iOS device

### **Setting Up for iOS**

1. **Install Capacitor iOS Platform**
```bash
npm install @capacitor/ios
npx cap sync
```

2. **Open the Project in Xcode**
```bash
npx cap open ios
```

3. **Configure Signing**
- Open Xcode
- Select your target in the project navigator
- Go to "Signing & Capabilities" tab
- Select your Team for code signing
- Choose a unique Bundle Identifier

### **Running the App**

#### **In Simulator**
```bash
npx cap run ios
```

#### **On Physical Device**
- Connect your iOS device to your Mac
- In Xcode, select your device from the run destination dropdown
- Click the "Run" button

### **Troubleshooting**

- Ensure Xcode Command Line Tools are installed
- Check Capacitor and iOS platform compatibility
- Verify code signing and provisioning profiles
- Clean the project in Xcode if you encounter build issues

### **Deployment Considerations**

- Use Xcode Archive and Distribute functionality for App Store submission
- Ensure your app meets Apple's App Store guidelines
- Test thoroughly on different iOS devices and versions
