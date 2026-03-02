# Document Management & History System (Node.js & MongoDB)

A robust backend service for managing documents with integrated version tracking and folder-like structure support. This project demonstrates high-level API design, middleware implementation, and advanced MongoDB querying.

---

## Key Features

* **Document Lifecycle:** Full CRUD operations for documents with unique path-based organization.
* **Automated Audit Log:** Every action (Create, Update, Delete) is automatically captured in a history collection via post-operation middleware.
* **Advanced Querying:** Support for path-prefix filtering (folder exploration), dynamic sorting, and multi-field filtering.
* **PDF Generation:** On-the-fly document conversion to PDF files.
* **Security & Validation:** Custom middleware for `X-User-Id` header authentication and strict request body validation.
* **Error Handling:** Global error-handling middleware with detailed server-side logging and clean client-side responses.

---

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Libraries:** PDFKit, Joi/Zod (Validation)
* **Architecture:** Layered Pattern (API -> Service -> DAL)

---

##  Architecture & Design Patterns

### 1. Layered Architecture
The project follows a clean separation of concerns:
* **API/Routes:** Handles HTTP requests and response formatting.
* **Services:** Contains the business logic (e.g., orchestrating history logging and document updates).
* **DAL (Data Access Layer):** Pure database interactions.

### 2. Post-Action Middleware
One of the core highlights is the **History Middleware**. Instead of manually calling the history service in every route, I implemented a middleware that intercepts the response after successful document operations to ensure consistent audit trails.

### 3. Path-Based Navigation
To simplify complex folder structures, I used a **path-prefix** strategy. This allows the system to simulate directory browsing using efficient string indexing in MongoDB.

---

## Getting Started

### Prerequisites
* Node.js (v14+)
* MongoDB instance (Local or Atlas)

### Installation
1.  **Clone the repo:**
    ```bash
    git clone [your-repo-link]
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment variables:**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    ```
4.  **Start the server:**
    ```bash
    npm start
    ```
