from backend.exts import db
from sqlalchemy.dialects.postgresql import JSON
from flask_login import UserMixin

class Winners(db.Model):
    __tablename__ = "winners"
    winid = db.Column(db.Integer, primary_key=True)
    prize = db.Column(db.String(255), nullable=False)
    code = db.Column(db.Integer)
    winner =  db.Column(db.String(255), nullable=True)

    def __init__(self, prize, code, winner=None):
        self.prize = prize
        self.code = code
        self.winner = winner
        db.session.commit()

    def __repr__(self):
        return f"<Winners {self.winid} {self.prize} {self.code} {self.winner}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, prize=None, code=None, winner=None):
        if prize is not None:
            self.prize = prize
        if code is not None:
            self.code = code
        if winner is not None:
            self.winner = winner 

        db.session.commit()
