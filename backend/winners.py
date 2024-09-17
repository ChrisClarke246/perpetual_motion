from flask import request
from flask_restx import Namespace, Resource, fields, abort
from backend.models import Winners
from flask_jwt_extended import jwt_required

# Define a namespace for message-related operations
winner_ns = Namespace("winners", description="Winner operations")

# Define the data model for winner using Flask-RESTx fields
# This model helps in validating and documenting the API
winner_model = winner_ns.model(
    "Winners",
    {
        "winid": fields.Integer,  
        "prize": fields.String,  
        "code": fields.Integer,  
        "winner": fields.String,  
    },
)

# Route for operations on multiple winner
# @winner_ns.route("/")
class Winner(Resource):
    # GET endpoint to retrieve all winner
    @winner_ns.marshal_list_with(winner_model)
    def get(self):
        # Query and return all winner
        return Winners.query.all(), 200

    # POST endpoint to create a new Winners
    @winner_ns.expect(winner_model)
    @winner_ns.marshal_with(winner_model)
    def post(self):
        # Create a Winners object from the provided payload and save it to the database
        winner = Winners(**winner_ns.payload)
        winner.save()
        return winner, 201

# Route for operations on a specific Winners identified by its ID
# @winner_ns.route("/<int:msgid>")
class WinnerById(Resource):
    # GET endpoint to retrieve a Winners by its ID
    @winner_ns.marshal_with(winner_model)
    def get(self, winid):
        # Query for the Winners by ID or return a 404 if not found
        winner = Winners.query.get_or_404(winid)
        return winner, 200

    # PUT endpoint to update a specific Winners
    @winner_ns.expect(winner_model)
    @winner_ns.marshal_with(winner_model)
    def put(self, winid):
        # Find the Winners and update its details
        winner = Winners.query.get_or_404(winid)
        winner.update(**winner_ns.payload)
        return winner, 200

    # DELETE endpoint to delete a specific Winners
    def delete(self, winid):
        # Delete the Winners by ID
        winner = Winners.query.get_or_404(winid)
        winner.delete()
        return {"Winners": "Winners deleted"}, 200

# Route for retrieving winner for a specific account
# @winner_ns.route("/account/<int:account_id>")
class WinnerByCode(Resource):
    # GET endpoint to retrieve winner by account ID
    # GET endpoint to retrieve a Winners by its ID
    @winner_ns.marshal_with(winner_model)
    def get(self, code):
        # Query for the Winners by ID or return a 404 if not found
        winner = Winners.query.filter_by(code=code).first()
        return winner or {"winid":0}, 200

    # PUT endpoint to update a specific Winners
    @winner_ns.expect(winner_model)
    @winner_ns.marshal_with(winner_model)
    def put(self, code):
        # Find the Winners and update its details
        winner = Winners.query.get_or_404(code)
        winner.update(**winner_ns.payload)
        return winner, 200
