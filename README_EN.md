# Wages Calculator README_EN.md

[简体中文](./README_CN.md) | [English](./README_EN.md)

A salary calculation tool tailored for professionals in China, helping you quickly calculate after-tax take-home salary, detailed breakdown of social insurance and housing fund contributions, personal income tax payable. It also supports personal pension income projection and personal income tax preferential policy calculation, to help you clearly understand your salary structure and pension planning.

---

## ✨ Features

- 🧮 **Accurate Salary Calculation**: Full-dimensional calculation of pre-tax salary, social insurance, housing fund, and personal income tax, accurately calculate your after-tax take-home salary in compliance with the latest personal income tax policies.

- 🏙️ **Multi-City Policy Adaptation**: Support customizing contribution base, personal/employer contribution ratios, adaptable to social insurance and housing fund policies of different cities across China.

- 🧓 **Personal Pension Calculation**: Support calculation of personal income tax benefits from personal pension contributions, as well as long-term investment income projection, to assist you with pension planning.

- 📋 **Special Additional Deductions**: Full support for all personal income tax special additional deduction items, including children's education, elderly care, housing loan/rent, continuing education, and more.

- 📊 **Detailed Result Display**: Complete breakdown of every deduction item, with clear visibility of social insurance, housing fund, personal income tax, and special deductions, with separate display of employer and personal contribution portions.

- 🔒 **Local Privacy-First Calculation**: All calculation logic is completed locally on the frontend, no personal data needs to be uploaded, ensuring your privacy and data security.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6.2, Tailwind CSS v4, Framer Motion, Lucide Icons

- **Programming Language**: TypeScript, with full type safety to ensure error-free calculation logic

- **Build Tool**: Vite, with ultra-fast hot reload for a smooth development experience

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)

- npm or yarn

### Installation Steps

1. **Clone the repository:**

    ```bash
    
    git clone https://github.com/HLIANW0137/wages-and-Pension-Insurance-Calculation.git
    cd wages-and-Pension-Insurance-Calculation
    ```

2. **Install dependencies:**

    ```bash
    
    npm install
    ```

3. **Start the development server:**

    ```bash
    
    npm run dev
    ```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000) to start using the tool.

---

## 📖 How to Use

1. **Enter Basic Salary**: Fill in your monthly pre-tax salary in the input field.

2. **Configure Contribution Rules**: Select your city to automatically load the default social insurance and housing fund contribution ratios for the local area, or manually adjust them according to your actual situation.

3. **Fill in Special Deductions**: Fill in the personal income tax special additional deduction items according to your actual situation, including children's education, elderly care, housing loans, etc.

4. **View Calculation Results**: Generate calculation results with one click, view your take-home salary, detailed breakdown of each deduction, and personal pension calculation results.

---

## 🔧 Customization & Adjustment

This project is designed to be highly customizable, you can adjust it to adapt to the latest policies according to your needs:

### 1. Adjust City Default Configurations

If you want to add or modify the default contribution ratios of a city, you can edit the city configuration items in the configuration file to quickly adapt to the latest policies of your city.

### 2. Update Calculation Rules

If the personal income tax/social insurance policies are updated, you can modify the calculation logic in `src/utils/calculation.ts` to quickly adapt to the latest policy rules.

### 3. Adjust UI Styles

The interface is developed with Tailwind CSS. You can edit the components under `src/components/` to adjust the style and layout of the interface to meet your personalized needs.

### 4. Extend Features

You can easily extend more practical features, such as:

- Annual bonus personal income tax calculation (comparison between separate and combined taxation)

- Social insurance contribution period and pension withdrawal projection

- Housing fund loan limit calculation

- Annual income final settlement calculation

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the Project

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)

3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)

4. Push to the Branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
