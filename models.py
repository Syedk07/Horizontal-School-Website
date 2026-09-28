from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='student')  # 'admin', 'teacher', 'student'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    student_profile = db.relationship('Student', backref='user', uselist=False, cascade='all, delete-orphan')
    teacher_profile = db.relationship('Teacher', backref='user', uselist=False, cascade='all, delete-orphan')
    admin_profile = db.relationship('Admin', backref='user', uselist=False, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        profile = None
        if self.role == 'student' and self.student_profile:
            profile = self.student_profile.to_dict()
        elif self.role == 'teacher' and self.teacher_profile:
            profile = self.teacher_profile.to_dict()
        elif self.role == 'admin' and self.admin_profile:
            profile = self.admin_profile.to_dict()

        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'profile': profile
        }


class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    student_id = db.Column(db.String(30), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    grade = db.Column(db.String(20), nullable=False)
    section = db.Column(db.String(10), default='A')
    roll_no = db.Column(db.String(20))
    attendance_percentage = db.Column(db.Float, default=94.5)
    parent_name = db.Column(db.String(120))
    parent_phone = db.Column(db.String(30))
    address = db.Column(db.String(255))
    avatar_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'student_id': self.student_id,
            'full_name': self.full_name,
            'grade': self.grade,
            'section': self.section,
            'roll_no': self.roll_no,
            'attendance_percentage': self.attendance_percentage,
            'parent_name': self.parent_name,
            'parent_phone': self.parent_phone,
            'address': self.address,
            'avatar_url': self.avatar_url
        }


class Teacher(db.Model):
    __tablename__ = 'teachers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    employee_id = db.Column(db.String(30), unique=True, nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(80), nullable=False)
    designation = db.Column(db.String(100), default='Senior Faculty')
    qualification = db.Column(db.String(120))
    phone = db.Column(db.String(30))
    office_room = db.Column(db.String(50))
    avatar_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'employee_id': self.employee_id,
            'full_name': self.full_name,
            'department': self.department,
            'designation': self.designation,
            'qualification': self.qualification,
            'phone': self.phone,
            'office_room': self.office_room,
            'avatar_url': self.avatar_url
        }


class Admin(db.Model):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    full_name = db.Column(db.String(120), nullable=False)
    title = db.Column(db.String(100), default='Academic Director')
    department = db.Column(db.String(80), default='Administration')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'title': self.title,
            'department': self.department
        }


class AdmissionEnquiry(db.Model):
    __tablename__ = 'admission_enquiries'

    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(120), nullable=False)
    parent_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    date_of_birth = db.Column(db.String(30), nullable=False)
    grade_applying_for = db.Column(db.String(50), nullable=False)
    previous_school = db.Column(db.String(150))
    message = db.Column(db.Text)
    status = db.Column(db.String(30), default='Pending')  # 'Pending', 'Reviewed', 'Accepted', 'Rejected'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_name': self.student_name,
            'parent_name': self.parent_name,
            'email': self.email,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth,
            'grade_applying_for': self.grade_applying_for,
            'previous_school': self.previous_school,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30))
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default='Unread')  # 'Unread', 'Read', 'Replied'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class Announcement(db.Model):
    __tablename__ = 'announcements'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='General')  # 'General', 'Academics', 'Events', 'Examination', 'Sports'
    target_audience = db.Column(db.String(50), default='All')  # 'All', 'Students', 'Teachers', 'Parents'
    date = db.Column(db.String(30), nullable=False)
    is_pinned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'target_audience': self.target_audience,
            'date': self.date,
            'is_pinned': self.is_pinned,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    date = db.Column(db.String(30), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), default='General')  # 'Annual Day', 'Sports', 'Science Exhibition', 'Cultural', 'PTM', 'Workshop'
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date,
            'time': self.time,
            'location': self.location,
            'description': self.description,
            'category': self.category,
            'image_url': self.image_url,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class News(db.Model):
    __tablename__ = 'news'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(30), nullable=False)
    category = db.Column(db.String(50), default='Campus')  # 'Achievement', 'Campus', 'Research', 'Community'
    description = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(255))
    author = db.Column(db.String(100), default='HORIZONTAL Communications')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date,
            'category': self.category,
            'description': self.description,
            'content': self.content,
            'image_url': self.image_url,
            'author': self.author,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class GalleryItem(db.Model):
    __tablename__ = 'gallery_items'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'Campus', 'Events', 'Sports', 'Classrooms', 'Activities', 'Students'
    image_url = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'image_url': self.image_url,
            'caption': self.caption,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class Assignment(db.Model):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    grade = db.Column(db.String(30), nullable=False)
    teacher_name = db.Column(db.String(100), nullable=False)
    due_date = db.Column(db.String(30), nullable=False)
    description = db.Column(db.Text, nullable=False)
    max_score = db.Column(db.Integer, default=100)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subject': self.subject,
            'grade': self.grade,
            'teacher_name': self.teacher_name,
            'due_date': self.due_date,
            'description': self.description,
            'max_score': self.max_score,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    student_name = db.Column(db.String(120), nullable=False)
    grade = db.Column(db.String(30), nullable=False)
    date = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(20), default='Present')  # 'Present', 'Absent', 'Late', 'Excused'
    remarks = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': self.student_name,
            'grade': self.grade,
            'date': self.date,
            'status': self.status,
            'remarks': self.remarks,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }


class TimetableEntry(db.Model):
    __tablename__ = 'timetable'

    id = db.Column(db.Integer, primary_key=True)
    grade = db.Column(db.String(30), nullable=False)
    day_of_week = db.Column(db.String(20), nullable=False)  # 'Monday', 'Tuesday', etc.
    period = db.Column(db.Integer, nullable=False)
    time_slot = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    teacher_name = db.Column(db.String(100), nullable=False)
    room = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'grade': self.grade,
            'day_of_week': self.day_of_week,
            'period': self.period,
            'time_slot': self.time_slot,
            'subject': self.subject,
            'teacher_name': self.teacher_name,
            'room': self.room
        }
