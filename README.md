# Nineteen99 (⚡)

[![MIT License](https://shields.io)](LICENSE)
[![Fintech Stack](https://shields.io)]()
[![Backend](https://shields.io)]()
[![Frontend](https://shields.io)]()
[![Architecture](https://shields.io)]()

Nineteen99 is a high-performance, regulatory-aware UPI transaction routing engine. It dynamically mitigates interchange fees on high-value retail payments (>₹2,000) by micro-slicing unified merchant invoices into a sequential queue of randomized, natural-looking transactions staying safely below the ₹1,999 network boundary. 

Engineered with a robust **Atomic State-Machine** on the client and an **Idempotent Transactional Ledger** on the backend, Nineteen99 ensures flawless structural execution and complete protection against network drops or mid-queue disconnects.

---

## 🏗️ System Architecture & Data Flow

```text
  [ Merchant QR Sticker ]
             │
             ▼ (Scan & Parse VPA)
     ┌───────────────┐
     │  Nineteen99   │ ──( POST /v1/payments/nineteen99-split )──> ┌────────────────┐
     │  Flutter App  │                                             │ Node.js Engine │
     │ (State Machine)│ <──( JSON Array: Sliced Payments Matrix )─── │  (Backend Core)│
     └───────────────┘                                             └────────────────┘
             │                                                             │
             ▼ (Asynchronous Queue Loop)                                   ▼
     ┌───────────────────────┐                                     ┌────────────────┐
     │  Native UPI PinPad    │ ──( PATCH /verify-chunk Update )──> │ Atomic Memory  │
     │ (Sequentially Prompts)│                                     │ Ledger Database│
     └───────────────────────┘                                     └────────────────┘
```

---

## 🛠️ Repository Blueprint

The workspace is cleanly divided into decoupled core modules:

```text
nineteen99-core/
├── LICENSE                        # Official MIT open-source legal framework
├── README.md                      # Comprehensive developer operation manual
├── backend/
│   ├── .env                       # Environment routing variables
│   ├── package.json               # Backend micro-service dependency ledger
│   ├── database.js                # Atomic, in-memory transactional data store
│   ├── server.js                  # Main REST API router & chunking algorithm
│   └── simulate_browser.js        # Browser sandbox zero-dependency testing script
└── frontend_flutter/
    ├── pubspec.yaml               # Mobile package dependency manifest
    └── lib/
        └── main.dart              # Async state machine client UI & QR scanner
```

---

## ⚡ Technical Core Features

* **Sub-2K Adaptive Slicing Engine:** Automatically structures large amounts into randomized floats (e.g., ₹1,432.54 + ₹1,610.20) rather than clean block metrics to prevent transaction pattern detection by fraud filters.
* **Idempotent Queue Resumption:** If cell signal fails on chunk 3 of 4, the state ledger flags the exact point of failure, enabling the user to resume payments smoothly without duplicate charges.
* **M3 Financial Matrix UI:** A beautiful, dark-slate minimalist interface built on material design principles optimized for instant feedback loops.
* **Hardware-Abstracted Web Sandbox:** Includes a terminal simulator (`simulate_browser.js`) allowing you to verify calculations instantly without native devices.

---

## 🚀 Quick Start & Deployment

### 1. Boot the Backend Service Engine
Ensure you have [Node.js](https://nodejs.org) installed, then run:
```bash
cd backend
npm install
npm start
```
*Expected console confirmation:* `🚀 Nineteen99 Production Engine operational on port 5000`

### 2. Run the Browser Simulation Sandbox
Test the mathematical splitting and payment loop states instantly in your browser window terminal without compiling the mobile app code:
```bash
cd backend
node simulate_browser.js
```

### 3. Launch the Cross-Platform Mobile Client
Ensure you have the [Flutter SDK](https://flutter.dev) installed along with an active Android/iOS emulator:
```bash
cd frontend_flutter
flutter pub get
flutter run
```

---

## ⚖️ Disclaimer & Compliance
Nineteen99 is developed exclusively as an **experimental architectural prototype** demonstrating transaction matrix slicing and client-side queue execution state management. Production deployment on the live UPI payment network requires authorized third-party application provider (TPAP) sponsor bank licensing, NPCI security certification audits, and absolute compliance with Reserve Bank of India (RBI) data localization guidelines.

```text
Distributed under the MIT Open Source License. See LICENSE for details.
```
