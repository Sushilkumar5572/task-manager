## AI Guidance for This Repository

This document explains how AI tools should be used responsibly when working on this Task Manager project.

### Purpose of AI Usage

- **Assist with boilerplate**: Generate repetitive code such as React components, Flask route skeletons, and configuration files.
- **Speed up development**: Suggest implementations for standard patterns (CRUD endpoints, Axios calls, form handling, etc.).
- **Improve documentation**: Help draft or refine README files, comments, and other documentation.
- **Support refactoring**: Propose safer, clearer structures for existing code while preserving behavior.

### Allowed AI Actions

- Generate or update **non‑critical boilerplate**:
  - React components and hooks following the existing patterns.
  - Flask route handlers that match the current REST API style.
  - Utility functions that do not change business rules.
- Propose **UI enhancements** that do not alter backend contracts.
- Suggest **error handling** and validation improvements consistent with current behavior.
- Add or refine **documentation** and comments to explain existing logic and architecture.
- Help maintain consistency with:
  - Existing file layout under `task-manager/backend` and `task-manager/frontend`.
  - Current API endpoints:
    - `GET /tasks`
    - `POST /tasks`
    - `PATCH /tasks/<id>`
    - `DELETE /tasks/<id>`

### Constraints for AI-Generated Code

- **Manual review required**:
  - All AI‑generated or AI‑modified code **must be reviewed by a human** before being committed.
  - The reviewer is responsible for checking correctness, security, and performance.
- **Do not change business rules**:
  - The task status workflow is fixed:
    - `TODO -> IN_PROGRESS -> DONE`
  - Invalid transitions (e.g. `DONE -> TODO`, `IN_PROGRESS -> TODO`) must continue to be blocked by the backend.
  - AI should **not** change these rules or introduce new ones without explicit human design decisions.
- **Preserve REST API contracts**:
  - Existing routes, HTTP methods, and response shapes must remain backward‑compatible unless a human explicitly approves a breaking change.
  - Error response format (e.g. `{ "error": "..." }`) should be respected.
- **Respect project structure**:
  - Backend code stays under `task-manager/backend` (e.g. `app.py`, `routes.py`, `database.py`).
  - Frontend code stays under `task-manager/frontend/src` (e.g. `App.js`, `index.js`).
  - Shared or new modules should fit logically within this structure.
- **Avoid introducing sensitive data**:
  - AI must not hard‑code real passwords, API keys, or secrets.
  - Database credentials must remain configurable via local settings (e.g. in `database.py`, environment, or config files).

### Coding Standards

- **Backend (Flask / Python)**:
  - Follow **PEP 8** style guidelines where practical.
  - Use clear, descriptive function and variable names (e.g. `get_db_connection`, `update_task`).
  - Return **JSON responses** consistently using Flask response helpers and follow the existing patterns:
    - Success: `{ "message": "..." }` or lists/objects of tasks.
    - Errors: `{ "error": "..." }` with appropriate HTTP status codes.
  - Keep database access through clearly defined helpers (e.g. `get_db_connection`).
- **Frontend (React / JavaScript)**:
  - Use **functional components** and React hooks (`useState`, `useEffect`).
  - Use Axios for HTTP calls, matching the existing base URLs and endpoints.
  - Keep components small, focused, and consistent with current style (inline styles are acceptable but can be refactored later).
  - Handle API errors gracefully (e.g. alerts, error messages) without breaking the UI.
- **General**:
  - Keep code **readable and simple** over clever or overly abstract solutions.
  - Favor explicitness over magic; avoid hiding important logic behind complex helper abstractions.

### Review Process

1. **Proposal**  
   - The AI suggests changes (code, configuration, or documentation) clearly and in context, indicating which files and sections are affected.

2. **Human Review**  
   - A developer reviews all proposed changes, ensuring:
     - Business rules (especially task status transitions) are unchanged unless explicitly intended.
     - REST API contracts remain correct and consistent.
     - Code follows the coding standards above.
     - No credentials or sensitive data are introduced.

3. **Testing**  
   - Run the backend and frontend locally.
   - Manually verify:
     - Creating, viewing, updating, and deleting tasks.
     - Task status workflow behavior (`TODO -> IN_PROGRESS -> DONE`) and rejection of invalid transitions.
     - Error handling paths (e.g. invalid status, missing fields).

4. **Refinement**  
   - If issues are found, the developer either:
     - Fixes them manually, or
     - Uses the AI for targeted assistance and then re‑reviews.

5. **Commit and Documentation**  
   - Only after passing review and tests are changes committed.
   - Update documentation (including this guidance, if needed) when the architecture, APIs, or rules meaningfully evolve.

