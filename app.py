from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/software_requests'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    staff_code = db.Column(db.String(50))
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

class InstallationRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    software = db.Column(db.String(100))
    version = db.Column(db.String(50))
    staff_code = db.Column(db.String(50))
    contact = db.Column(db.String(50))
    ip = db.Column(db.String(50))
    os = db.Column(db.String(50))
    department = db.Column(db.String(50))
    team = db.Column(db.String(50))
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='Pending')
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(name=data['name'], staff_code=data['staffCode'], email=data['email'], password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        # For simplicity, returning user info (in real app use JWT tokens or sessions)
        return jsonify({"id": user.id, "name": user.name, "role": user.role}), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/requests', methods=['POST'])
def create_request():
    data = request.json
    req = InstallationRequest(
        software=data.get('software'),
        version=data.get('version'),
        staff_code=data.get('staffCode'),
        contact=data.get('contact'),
        ip=data.get('ip'),
        os=data.get('os'),
        department=data.get('department'),
        team=data.get('team'),
        message=data.get('message'),
        status='Pending'
    )
    db.session.add(req)
    db.session.commit()
    return jsonify({"message": "Request submitted successfully"}), 201

@app.route('/requests', methods=['GET'])
def get_requests():
    # Optionally add filters, pagination, auth checks here
    reqs = InstallationRequest.query.all()
    return jsonify([{
        "id": r.id,
        "software": r.software,
        "version": r.version,
        "staffCode": r.staff_code,
        "contact": r.contact,
        "ip": r.ip,
        "os": r.os,
        "department": r.department,
        "team": r.team,
        "message": r.message,
        "status": r.status,
        "date": r.date_created.isoformat()
    } for r in reqs])

@app.route('/requests/<int:req_id>/complete', methods=['POST'])
def mark_complete(req_id):
    req = InstallationRequest.query.get_or_404(req_id)
    req.status = 'Complete'
    db.session.commit()
    return jsonify({"message": "Request marked complete"}), 200

if __name__ == '__main__':
    app.run(debug=True)
