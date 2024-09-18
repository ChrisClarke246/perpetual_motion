import os
import hmac
import hashlib
from flask import request
from flask_restx import Namespace, Resource, fields, abort
from backend.models import Leaderboard

leaderboard_ns = Namespace("Leaderboard", description="Leaderboard operations")

leaderboard_model = leaderboard_ns.model(
    "Leaderboard",
    {
        "id": fields.Integer,
        "username": fields.String,
        "score": fields.Integer,
    },
)
# Get the secret key from the environment variable or use 'default' if not set
SECRET_KEY = os.getenv("HMAC_SECRET_KEY", "default").encode('utf-8')

def generate_hmac(username, score):
    message = f"{username}:{score}".encode('utf-8')
    return hmac.new(SECRET_KEY, message, hashlib.sha256).hexdigest()

# Function to verify HMAC
def verify_hmac(username, score, received_hmac):
    expected_hmac = generate_hmac(username, score)
    return hmac.compare_digest(expected_hmac, received_hmac)


@leaderboard_ns.route("/")
class LeaderboardList(Resource):
    def get(self):
        return Leaderboard.query.order_by(Leaderboard.score.desc()).all(), 200

    @leaderboard_ns.expect(leaderboard_model)
    @leaderboard_ns.marshal_with(leaderboard_model)
    def post(self):
        # Get the data from the request payload
        data = leaderboard_ns.payload
        username = data.get("username")
        score = data.get("score")
        received_hmac = request.headers.get("HMAC")  # Assume HMAC is sent in headers

        # Verify the HMAC
        if not verify_hmac(username, score, received_hmac):
            return abort(400, "HMAC verification failed")

        # If HMAC is valid, save the leaderboard entry
        leaderboard = Leaderboard(username=username, score=score)
        leaderboard.save()
        return leaderboard, 201


@leaderboard_ns.route("/<string:username>/")
class LeaderboardByUsername(Resource):
    @leaderboard_ns.marshal_with(leaderboard_model)
    def get(self, username):
        leaderboard = Leaderboard.query.filter_by(username=username).first_or_404()
        return leaderboard, 200

    @leaderboard_ns.expect(leaderboard_model)
    @leaderboard_ns.marshal_with(leaderboard_model)
    def put(self, username):
        # Get the data from the request payload
        data = leaderboard_ns.payload
        score = data.get("score")
        received_hmac = request.headers.get("HMAC")

        # Verify the HMAC
        if not verify_hmac(username, score, received_hmac):
            return abort(400, "HMAC verification failed")

        # Find the leaderboard entry and update its score
        leaderboard = Leaderboard.query.filter_by(username=username).first_or_404()
        leaderboard.update(score=score)
        return leaderboard, 200

    def delete(self, username):
        leaderboard = Leaderboard.query.filter_by(username=username).first_or_404()
        leaderboard.delete()
        return {"message": "Leaderboard entry deleted"}, 200
    