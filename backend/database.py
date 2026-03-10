import mysql.connector
from mysql.connector import Error


def get_db_connection():
    """
    Create and return a connection to the MySQL database.
    """
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            # password="root",  # replace with your real password
            database="task_manager",
        )

        if connection.is_connected():
            return connection

    except Error as e:
        # You can log this error instead of printing in real apps
        print(f"Error while connecting to MySQL: {e}")

    return None

