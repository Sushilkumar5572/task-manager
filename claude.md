## AI Coding Guidelines for This Repository

This project is a **React + Flask + MySQL** task manager. These rules define how AI tools should generate and modify code here.

### Architecture Expectations

- **Frontend**: React (functional components, hooks) under `task-manager/frontend/src`.
- **Backend**: Flask REST API under `task-manager/backend` (`app.py`, `routes.py`, `database.py`).
- **Database**: MySQL, accessed via the backend only.
- **Flow**: React → HTTP (Axios/fetch) → Flask routes → database helpers → MySQL.

### Responsibilities and Boundaries

- **Routes handle HTTP**:
  - Flask routes are responsible for request parsing, validation, and HTTP responses (status codes + JSON).
  - AI‑generated endpoints must follow existing patterns for:
    - URL shapes: `/tasks`, `/tasks/<id>`
    - Methods: `GET`, `POST`, `PATCH`, `DELETE`
    - JSON response format: `{ "message": "..." }` or `{ "error": "..." }`.

- **Database access via connection module**:
  - All DB queries go through the existing connection helper in `database.py` (e.g. `get_db_connection()`).
  - AI must not embed raw connection logic directly into route files or React components.

- **Business logic lives in the backend**:
  - Task workflow rules and validation **must stay in Flask routes / backend logic**.
  - React should not enforce core business rules; it may *mirror* them in the UI, but the backend is the source of truth.

### Task Status Rules (Must Not Be Broken)

- Allowed statuses: `TODO`, `IN_PROGRESS`, `DONE`.
- Valid transitions:
  - `TODO -> IN_PROGRESS`
  - `IN_PROGRESS -> DONE`
- Invalid transitions (e.g. `DONE -> TODO`, `IN_PROGRESS -> TODO`) must remain blocked by the backend.
- AI must **not**:
  - Change these rules.
  - Add new statuses.
  - Allow direct writes that bypass current validation logic.

### Code Quality Requirements for AI

- **Readable code**:
  - Prefer clear, straightforward implementations over clever or heavily abstracted solutions.
  - Use descriptive names (`create_task`, `update_task_status`, `get_db_connection`).
  - Keep functions small and focused on a single responsibility.

- **Follow REST API patterns**:
  - Use proper HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`) for their intended purposes.
  - Use consistent paths (`/tasks`, `/tasks/<int:id>`).
  - Always return JSON with clear keys:
    - Success: `{ "message": "..." }` or structured data.
    - Error: `{ "error": "..." }` with appropriate status code.

- **Avoid unnecessary complexity**:
  - No premature abstractions or frameworks beyond React, Flask, MySQL, and existing libraries.
  - Avoid deep nesting, complex meta‑programming, or generic over‑engineering.
  - Reuse existing helpers and patterns instead of introducing competing ones.

### Practical Guidance for AI Changes

- When adding a **new backend feature**:
  - Implement a Flask route in `routes.py`.
  - Use `get_db_connection()` (or equivalent) for all DB access.
  - Validate inputs and respect existing error response style.

- When updating the **frontend**:
  - Use Axios to call the existing endpoints.
  - Keep components functional and hook‑based.
  - Handle API errors gracefully (e.g. alerts or visible messages).

- When in doubt:
  - Prefer minimal, incremental changes that align with existing code.
  - Do not invent new architecture layers without explicit human direction.

