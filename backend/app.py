from flask import Flask
from flask_cors import CORS

from routes import init_routes


def create_app() -> Flask:
    app = Flask(__name__)
    # Allow requests from the React frontend at http://localhost:3000
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
    init_routes(app)
    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
