from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
import urllib.parse
from bson.objectid import ObjectId
from bson import ObjectId
from flask import abort


# Load .env variables
load_dotenv()

# Encode username and password
username = urllib.parse.quote_plus(os.getenv("MONGO_USER"))
password = urllib.parse.quote_plus(os.getenv("MONGO_PASS"))
cluster = os.getenv("MONGO_CLUSTER")

# Construct URI
mongo_uri = f"mongodb+srv://{username}:{password}@{cluster}"
client = MongoClient(mongo_uri)

# Select database and collection
db = client[os.getenv("DB_NAME")]
collection = db[os.getenv("COLLECTION_NAME")]

# Flask app setup
app = Flask(__name__)
CORS(app)

# Health check
@app.route("/")
def home():
    return "Insurance Policy Tracker API running ✅"

# Add a policy
@app.route("/api/policies", methods=["POST"])
def add_policy():
    data = request.json
    data["createdAt"] = datetime.utcnow()
    collection.insert_one(data)
    return jsonify({"message": "Policy added!"}), 201

# Get all policies
@app.route("/api/policies", methods=["GET"])
def get_policies():
    policies = list(collection.find({}, {"_id": 0}))  # Hide MongoDB ID
    return jsonify(policies)

@app.route("/api/policies/<application_number>", methods=["DELETE"])
def delete_policy(application_number):
    result = collection.delete_one({"applicationNumber": application_number})
    if result.deleted_count == 1:
        return jsonify({"message": "Policy deleted"}), 200
    else:
        return jsonify({"error": "Policy not found"}), 404

@app.route("/api/policies/<application_number>", methods=["PUT"])
def update_policy(application_number):
    data = request.json
    result = collection.update_one(
        { "applicationNumber": application_number },
        { "$set": data }
    )
    if result.matched_count == 0:
        return jsonify({"error": "Policy not found"}), 404
    return jsonify({"message": "Policy updated!"})


if __name__ == "__main__":
    app.run(debug=True)
