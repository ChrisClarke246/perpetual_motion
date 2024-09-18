from flask import request
from flask_restx import Namespace, Resource, fields
from backend.models import Leaderboard

leaderboard_ns = Namespace("leaderboard", description="Leaderboard operations")

# Flask-Restx model definition
leaderboard_model = leaderboard_ns.model(
    "leaderboard",
    {
        "id": fields.Integer,
        "username": fields.String,
        "score": fields.Integer,
    },
)

# Helper function to convert a Leaderboard entry to a dictionary
def to_dict(entry):
    return {
        "id": entry.id,
        "username": entry.username,
        "score": entry.score,
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
            jsonified_response = [to_dict(entry) for entry in sorted_leaderboard]

            # print(f"\n\n\n{jsonified_response}\n\n\n\n")

            return jsonified_response, 200
        except Exception as e:
            return {"message": str(e)}, 500

    @leaderboard_ns.expect(leaderboard_model)
    def post(self):
        """Create a new leaderboard entry."""
        try:
            data = request.get_json()
            username = data.get('username')
            score = data.get('score')

            if not username or score is None:
                return {"message": "Username and score are required"}, 400

            # Save the leaderboard entry
            leaderboard = Leaderboard(username=username, score=score)
            leaderboard.save()
            return to_dict(leaderboard), 201  # Return JSON-serializable dict
        except Exception as e:
            return {"message": str(e)}, 500

@leaderboard_ns.route("/<string:username>/")
class LeaderboardByUsername(Resource):
    def get(self, username):
        """Get a specific leaderboard entry by username."""
        try:
            leaderboard = Leaderboard.query.filter_by(username=username).first_or_404()
            return to_dict(leaderboard), 200  # Convert to dict and jsonify
        except Exception as e:
            return {"message": str(e)}, 500

    @leaderboard_ns.expect(leaderboard_model)
    def put(self, username):
        """Update the score for a specific leaderboard entry."""
        try:
            data = request.get_json()
            score = data.get("score")

            if score is None:
                return {"message": "Score is required"}, 400

            leaderboard = Leaderboard.query.filter_by(username=username).first_or_404()
            leaderboard.update(score=score)
            return to_dict(leaderboard), 200  # Convert to dict and jsonify
        except Exception as e:
            return {"message": str(e)}, 500

    def delete(self, username):
        """Delete a leaderboard entry by username."""
        try:
            leaderboard = Leaderboard.query.filter_by(username=username).first_or_404()
            leaderboard.delete()
            return {"message": "Leaderboard entry deleted"}, 200
        except Exception as e:
            return {"message": str(e)}, 500
