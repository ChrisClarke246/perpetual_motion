# models.py
from backend.exts import db
from flask_login import UserMixin

class Leaderboard(db.Model):
    __tablename__ = "leaderboard"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer)
    hmac = db.Column(db.String(255), nullable=False)

    def __init__(self, username, score, hmac):
        self.username = username
        self.score = score
        self.hmac = hmac

    def __repr__(self):
        return f"<Leaderboard {self.id} {self.username} {self.score} {self.hmac}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, username=None, score=None, hmac=None):
        if username is not None:
            self.username = username
        if score is not None:
            self.score = score
        if hmac is not None:
            self.hmac = hmac
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "score": self.score,
            "hmac": self.hmac
        }
