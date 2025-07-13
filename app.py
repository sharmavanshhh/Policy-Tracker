from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, errors
from datetime import datetime
import os
from dotenv import load_dotenv
import urllib.parse

# Load .env variables
load_dotenv()

# Encode username and password
username = urllib.parse.quote_plus(os.getenv("MONGO_USER"))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASS"))
cluster = os.getenv("MONGO_CLUSTER")

# Construct URI and connect
mongo_uri = f"mongodb+srv://{username}:{password}@{cluster}"
client = MongoClient(mongo_uri)

# Select database and collection
db = client[os.getenv("DB_NAME")]
collection = db[os.getenv("COLLECTION_NAME")]

# Ensure unique index on applicationNumber
try:
    collection.create_index("applicationNumber", unique=True)
except errors.OperationFailure as e:
    print(f"Index creation failed: {e}")

# Flask app setup
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Health check
@app.route("/")
def home():
    return "Insurance Policy Tracker API running ✅"

# Add policy
@app.route("/api/policies", methods=["POST"])
def add_policy():
    print(f"[POST] /api/policies from {request.remote_addr} - {request.user_agent}")
    data = request.json

    # Check for duplicate applicationNumber
    if collection.find_one({"applicationNumber": data.get("applicationNumber")}):
        return jsonify({"error": "Policy with this application number already exists"}), 400

    data["createdAt"] = datetime.utcnow()

    try:
        collection.insert_one(data)
        return jsonify({"message": "Policy added!"}), 201
    except errors.DuplicateKeyError:
        return jsonify({"error": "Duplicate application number not allowed"}), 400
    except Exception as e:
        print(f"Insert error: {e}")
        return jsonify({"error": "Failed to add policy"}), 500

# Get all policies
@app.route("/api/policies", methods=["GET"])
def get_policies():
    print(f"[GET] /api/policies from {request.remote_addr} - {request.user_agent}")
    policies = list(collection.find({}, {"_id": 0}))
    return jsonify(policies)

# Delete policy by application number
@app.route("/api/policies/<application_number>", methods=["DELETE"])
def delete_policy(application_number):
    result = collection.delete_one({"applicationNumber": application_number})
    if result.deleted_count == 1:
        return jsonify({"message": "Policy deleted"}), 200
    return jsonify({"error": "Policy not found"}), 404

# Update policy by application number
@app.route("/api/policies/<application_number>", methods=["PUT"])
def update_policy(application_number):
    data = request.json
    result = collection.update_one({"applicationNumber": application_number}, {"$set": data})
    if result.matched_count == 0:
        return jsonify({"error": "Policy not found"}), 404
    return jsonify({"message": "Policy updated!"}), 200

# Run locally
if __name__ == "__main__":
    app.run(debug=True)
