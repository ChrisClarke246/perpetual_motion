from backend.exts import db
from flask_login import UserMixin

class Leaderboard(db.Model):
    __tablename__ = "leaderboard"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    score = db.Column(db.Integer)

    def __init__(self, username, score):
        self.username = username
        self.score = score

    def __repr__(self):
        return f"<Leaderboard {self.id} {self.username} {self.score}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, username=None, score=None):
        if username is not None:
            self.username = username
        if score is not None:
            self.score = score
        db.session.commit()
        