# leaderboard.py
import os
import hmac
import hashlib
from flask import request
from flask_restx import Namespace, Resource, fields
from backend.models import Leaderboard

SECRET_KEY = os.getenv("HMAC_SECRET_KEY", "default").encode('utf-8')

def generate_hmac(username, score):
    """Generate an HMAC for the given username and score."""
    message = f"{username}:{score}".encode('utf-8')
    newHmac =  hmac.new(SECRET_KEY, message, hashlib.sha256).hexdigest()
    return newHmac

def verify_hmac(username, score, received_hmac):
    """Verify the received HMAC with the generated one."""
    expected_hmac = generate_hmac(username, score)
    return hmac.compare_digest(expected_hmac, received_hmac)

leaderboard_ns = Namespace("leaderboard", description="Leaderboard operations")

# Flask-Restx model definition
leaderboard_model = leaderboard_ns.model(
    "leaderboard",
    {
        "id": fields.Integer,
        "username": fields.String,
        "score": fields.Integer,
        "hmac": fields.String,
    },
)

# Helper function to convert a Leaderboard entry to a dictionary
def to_dict(entry):
    return {
        "id": entry.id,
        "username": entry.username,
        "score": entry.score,
        "hmac": entry.hmac,
    }

@leaderboard_ns.route("/")
class LeaderboardList(Resource):
    def get(self):
        """Get the leaderboard and sort by score in Python."""
        try:
            leaderboard = Leaderboard.query.all()  # Get all leaderboard entries without SQL ordering
            if not leaderboard:
                return []  # Return an empty list if no entries
            # Sort the leaderboard in Python by score in descending order
            sorted_leaderboard = sorted(leaderboard, key=lambda x: x.score, reverse=True)


            response = []
            for entry in sorted_leaderboard:
                fixed_entry = to_dict(entry) 
                if verify_hmac(fixed_entry["username"], fixed_entry["score"], fixed_entry["hmac"]):
                    response.append(fixed_entry)

            return response, 200
        except Exception as e:
            return {"message": str(e)}, 500

    @leaderboard_ns.expect(leaderboard_model)
    def post(self):
        """Create a new leaderboard entry, ensuring only the top 30 scores are stored and each username is unique with the highest score."""
        try:
            data = request.get_json()
            username = data.get('username')
            score = data.get('score')

            if not username or score is None:
                return {"message": "Username and score are required"}, 400
            
            # Generate HMAC
            hmac_value = generate_hmac(username, score)

            # Check if the user already exists in the leaderboard
            existing_entry = Leaderboard.query.filter_by(username=username).first()

            if existing_entry:
                # If the new score is higher than the existing score, update it
                if score > existing_entry.score:
                    existing_entry.score = score
                    existing_entry.hmac = hmac_value  # Update HMAC too
                    existing_entry.save()
                    return {"message": "Score updated successfully"}, 200
                else:
                    return {"message": "New score is not higher than the existing score"}, 200

            # If user doesn't exist, proceed to check leaderboard count
            total_scores = Leaderboard.query.count()

            # If there are fewer than 30 scores, add the new entry
            if total_scores < 30:
                new_entry = Leaderboard(username=username, score=score, hmac=hmac_value)
                new_entry.save()
            else:
                # Get the lowest score from the leaderboard
                lowest_score_entry = Leaderboard.query.order_by(Leaderboard.score.asc()).first()

                if score > lowest_score_entry.score:
                    # Replace the lowest score with the new entry if the new score is higher
                    lowest_score_entry.username = username
                    lowest_score_entry.score = score
                    lowest_score_entry.hmac = hmac_value
                    lowest_score_entry.save()
                else:
                    return {"message": "Score not high enough to enter the leaderboard"}, 200

            return {"message": "Score added/updated successfully"}, 201

        except Exception as e:
            return {"message": str(e)}, 500
            