from flask import jsonify, request

from database import get_db_connection


def init_routes(app):
    @app.get("/hello")
    def hello():
        return jsonify({"message": "Hello from Flask backend"})

    @app.get("/tasks")
    def get_tasks():
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, title, description, status FROM tasks")
        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(rows)

    @app.post("/tasks")
    def create_task():
        data = request.get_json(silent=True) or {}

        title = data.get("title")
        description = data.get("description")

        if not title or not description:
            return jsonify({"error": "Both 'title' and 'description' are required"}), 400

        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        try:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO tasks (title, description, status)
                VALUES (%s, %s, %s)
                """,
                (title, description, "TODO"),
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

        return jsonify({"message": "Task created successfully"}), 201

    @app.patch("/tasks/<int:task_id>")
    def update_task(task_id):
        data = request.get_json(silent=True) or {}
        status = data.get("status")

        if not status:
            return jsonify({"error": "'status' is required"}), 400

        allowed_statuses = {"TODO", "IN_PROGRESS", "DONE"}
        if status not in allowed_statuses:
            return jsonify({"error": "Invalid status value"}), 400

        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        try:
            # Fetch current status for this task
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT status FROM tasks WHERE id = %s", (task_id,))
            row = cursor.fetchone()

            if row is None:
                return jsonify({"error": "Task not found"}), 404

            current_status = row["status"]
            allowed_transitions = {
                ("TODO", "IN_PROGRESS"),
                ("IN_PROGRESS", "DONE"),
            }

            if (current_status, status) not in allowed_transitions:
                return jsonify({"error": "Invalid status transition"}), 400

            # Transition is valid; perform the update
            cursor.execute(
                "UPDATE tasks SET status = %s WHERE id = %s",
                (status, task_id),
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

        return jsonify({"message": "Task updated successfully"})

    @app.delete("/tasks/<int:task_id>")
    def delete_task(task_id):
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        try:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
            conn.commit()
        finally:
            cursor.close()
            conn.close()

        return jsonify({"message": "Task deleted successfully"})
