# 🩺 Patient Registration App (React + Pglite)

A frontend-only patient registration system built with **React** and **Pglite** (SQLite in the browser) for persistent local data storage.  
The app supports patient registration, SQL-based querying, and works seamlessly across page refreshes and browser tabs.

---

## 🚀 Live Demo

👉 [View the deployed app](https://patient-registration-app-pearl.vercel.app/)

---

## ✨ Features (Documented via individual Git commits)

- 🧾 **Patient Registration Form**  
  Add new patients with fields like name, age, gender, etc.

- 🔍 **Search by Name or Disease**  
  Search for patient records by name or disease through a simple search bar.

- 💾 **Persistent Local Storage**  
  Uses `Pglite` to store data in IndexedDB, allowing it to survive page reloads.

- 🧠 **Multi-Tab Synchronization**  
  Supports working with multiple browser tabs simultaneously — changes reflect consistently.

- ✔️ **Form Validation**  
  Basic validation ensures required fields are filled correctly.

---

## 🛠️ Tech Stack

- **React**
- **Vite** (for fast dev builds)
- **Pglite** for SQLite in the browser
- **CSS** 
- **Vercel** for deployment

---

## 📦 Setup Instructions

> Requires **Node.js** installed on your system.

>bash
# 1. Clone the repository
git clone https://github.com/ddhanushd/patient-registration-app
cd patient-registration-app

# 2. Install dependencies
npm install

# 3. Run the app locally
npm run dev

# Visit http://localhost:5173 to view the app.

📖 Usage
Register patients via the form on the main screen.

Use the Search by Name or Disease feature to find specific patients.

Data remains intact across reloads and visible in multiple open tabs.

🌐 Deployment
The app is deployed on Vercel:
🔗 https://patient-registration-app-pearl.vercel.app/

To deploy yourself:

Push your code to GitHub.

Visit https://patient-registration-app-pearl.vercel.app/

Vercel auto-detects React + Vite settings.

⚠️ Limitations

Data is browser-specific. Switching devices/browsers won't retain the data.

Some advanced SQL operations might not be fully supported via Pglite.

🧩 Challenges Faced

Integrating Pglite in a React lifecycle while ensuring smooth local DB operations.

Maintaining data persistence across tab reloads and syncing changes across tabs.

Building a minimal search UI that allows users to search patients by name or disease.

Ensuring good UX without backend logic or database.

🧑‍💻 Author

D Dhanush

GitHub
