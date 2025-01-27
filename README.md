# HTTP Server with Dynamic Routing

This project is a custom HTTP server built with Node.js, designed to handle various types of HTTP requests dynamically. The server includes a custom router for managing routes, middleware support, and body parsing for multiple content types (JSON, XML, text, and form-data).

---

## Features

### 1. HTTP Server
- Handles GET, POST, PUT, PATCH, and DELETE requests.
- Dynamically matches routes with route parameters (e.g., `/user/:id`).

### 2. Custom Router
- Define routes for different HTTP methods using a simple interface.
- Middleware support for pre-processing requests before reaching controllers.

### 3. Request Body Parsing
- Supports multiple content types:
  - **JSON**
  - **Text**
  - **XML** (using `xml2js`)
  - **Form-data** (using `formidable`)

### 4. Error Handling
- Responds with appropriate error messages for undefined routes or invalid methods.

---

## Technology Stack

- **Backend**: Node.js
- **Utilities**:
  - `xml2js` for XML parsing.
  - `formidable` for handling form-data requests.

---

## Getting Started

### Prerequisites
- **Node.js** installed on your machine.
