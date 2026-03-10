## 1. Project Overview

This is a simple **Task Manager** full‑stack application built with **React**, **Flask**, and **MySQL**.  
Users can create tasks, view them in a list, update their status through a controlled workflow, and delete them.  
The backend enforces valid status transitions and returns clear JSON error messages for invalid actions.

## 2. Tech Stack

- **Frontend**: React, Axios
- **Backend**: Python, Flask, flask-cors
- **Database**: MySQL
- **ORM / DB Driver**: `mysql-connector-python`

## 3. Architecture

- **React frontend** (on `http://localhost:3000`) calls the Flask API using Axios.
- **Flask backend** (on `http://localhost:5000`) exposes REST endpoints and contains the business logic:
  - Input validation
  - Task status workflow rules
  - Error handling and JSON responses
- **MySQL database** stores all tasks.
- **CORS** is enabled on the backend to allow calls from the React frontend.

High‑level flow:

1. User interacts with the React UI (create, update, delete tasks).
2. React sends HTTP requests to Flask.
3. Flask validates data and enforces workflow rules.
4. Flask reads/writes tasks in MySQL.
5. Flask returns JSON responses, which React renders in the UI.

## 4. Features

- **Create tasks** with title and description (default status `TODO`).
- **View tasks** in a styled list.
- **Update task status** using a dropdown that follows the workflow.
- **Delete tasks**.
- **Enforced status transitions** on the backend.
- **Error handling**:
  - Backend returns JSON errors for invalid transitions or bad input.
  - Frontend shows alerts when API errors occur.

## 5. Task Status Workflow

Each task has a `status` with the following allowed values:

- `TODO`
- `IN_PROGRESS`
- `DONE`

Valid transitions:

- `TODO` → `IN_PROGRESS`
- `IN_PROGRESS` → `DONE`

Invalid transitions (examples):

- `DONE` → `TODO`
- `DONE` → `IN_PROGRESS`
- `IN_PROGRESS` → `TODO`

The **backend** enforces these rules:

- If a client attempts an invalid transition, the API responds with:

```json
{ "error": "Invalid status transition" }
```

and the database is **not** updated.

The **frontend** also reflects these rules by:

- Only showing valid next statuses in the dropdown.
- Disabling the dropdown when a task is already `DONE`.

## 6. API Endpoints

Base URL: `http://localhost:5000`

- **GET `/tasks`**
  - Returns a JSON array of all tasks.
  - Each task includes: `id`, `title`, `description`, `status`.

- **POST `/tasks`**
  - Creates a new task.
  - Request body (JSON):

    ```json
    {
      "title": "Task title",
      "description": "Task description"
    }
    ```

  - Response on success (201):

    ```json
    { "message": "Task created successfully" }
    ```

- **PATCH `/tasks/<id>`**
  - Updates the status of an existing task.
  - Request body (JSON):

    ```json
    {
      "status": "IN_PROGRESS"
    }
    ```

  - Enforces:
    - Allowed statuses: `TODO`, `IN_PROGRESS`, `DONE`.
    - Valid transitions only: `TODO -> IN_PROGRESS`, `IN_PROGRESS -> DONE`.
  - Error responses:

    ```json
    { "error": "Invalid status value" }
    ```

    ```json
    { "error": "Invalid status transition" }
    ```

    ```json
    { "error": "Task not found" }
    ```

- **DELETE `/tasks/<id>`**
  - Deletes the task with the given `id`.
  - Response on success:

    ```json
    { "message": "Task deleted successfully" }
    ```

## 7. Project Structure

High‑level structure (simplified):

```text
Better Assignment/
├─ task-manager/
│  ├─ backend/
│  │  ├─ app.py           # Flask app factory and CORS setup
│  │  ├─ routes.py        # REST API routes for tasks
│  │  ├─ database.py      # MySQL connection helper (get_db_connection)
│  │  └─ requirement.txt  # Python backend dependencies
│  └─ frontend/
│     ├─ package.json
│     └─ src/
│        ├─ index.js     # React entry point
│        └─ App.js       # Main Task Manager UI
└─ README.md             # Project documentation
```

## 8. How to Run Backend

1. **Create and activate a virtual environment** (recommended):

```bash
cd "Better Assignment/task-manager/backend"
python3 -m venv .venv
source .venv/bin/activate
```

2. **Install Python dependencies** (using the provided `requirement.txt` file):

```bash
pip install -r requirement.txt
```

3. **Configure database connection**:

- Edit `database.py` and ensure the connection values match your MySQL/XAMPP setup:

  - `host` (usually `localhost`)
  - `user` (e.g. `root`)
  - `password`
  - `database` (e.g. `task_manager`)

4. **Run the Flask app**:

```bash
python app.py
```

The backend will run on `http://localhost:5000`.

## 9. How to Run Frontend

1. Navigate to the frontend folder:

```bash
cd "Better Assignment/task-manager/frontend"
```

2. Install dependencies:

```bash
npm install
```

3. Start the React development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000` and will communicate with the Flask backend at `http://localhost:5000`.

## 10. Database Setup

1. **Start MySQL** (e.g. via XAMPP or local MySQL service).

2. **Create database**:

```sql
CREATE DATABASE task_manager;
```

3. **Create `tasks` table** (example schema):

```sql
USE task_manager;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL
);
```

4. Ensure `database.py` points to this `task_manager` database and uses valid credentials.

## 11. AI Usage

This project was developed with assistance from an AI coding assistant to:

- Bootstrap the Flask backend and React frontend.
- Implement REST endpoints and status workflow logic.
- Generate frontend components that interact with the API via Axios.
- Produce this README and various small refinements (error handling, CORS, styling).

All generated code was reviewed and integrated into the project structure.

## 12. Future Improvements

Potential enhancements:

- **Authentication & authorization**:
  - User accounts and per‑user task lists.
- **Input validation & security**:
  - Stronger validation, request schemas, and better error messages.
- **Pagination & filtering**:
  - Paginate task lists and filter by status (TODO / IN_PROGRESS / DONE).
- **UI/UX improvements**:
  - Dedicated components, better layout, and responsive design.
- **Testing**:
  - Unit tests for Flask routes and React components.
- **Dockerization**:
  - Docker Compose setup for backend, frontend, and MySQL.
- **Logging & monitoring**:
  - Centralized logging for backend errors and access logs.

