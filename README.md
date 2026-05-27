# Decode Labs Backend - Week 2 Project

A functional, lightweight local backend application built with **Node.js** and the **Express** framework. This project serves as a foundational REST API designed to store and manage student intern profiles dynamically.

---

## 🛠️ Tech Stack & Tools Used
* **Runtime Environment:** Node.js
* **Web Framework:** Express.js
* **API Testing Tool:** Thunder Client (VS Code Extension)
* **Version Control:** Git & GitHub

---

## 🚀 Features & Logic Built
* **JSON Parsing Middleware:** Configured to instantly accept incoming request data packages.
* **Data Validation Security:** Blocks incomplete input objects immediately to avoid data corruption.
* **Dynamic Data Storage:** Simulates a local data system via a stateful runtime array.

---

## 📡 API Endpoints Developed

### 1. Fetch All Students
* **Method:** `GET`
* **URL Path:** `/api/students`
* **Success Status:** `200 OK`

### 2. Register New Student
* **Method:** `POST`
* **URL Path:** `/api/students`
* **Required Body Payload (JSON):**
    ```json
    {
      "name": "Student Name",
      "role": "Intern Assignment"
    }
    ```
* **Success Status:** `201 Created`

---

## ⚙️ How to Install and Run Locally

1. Clone this repository to your desktop machine.
2. Open your terminal in the root folder and restore dependency tools:
   ```bash
   npm install
   
