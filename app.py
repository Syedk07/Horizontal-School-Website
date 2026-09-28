import os
import argparse
from datetime import datetime
from functools import wraps
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from config import Config
from models import (
    db, User, Student, Teacher, Admin, AdmissionEnquiry,
    ContactMessage, Announcement, Event, News, GalleryItem,
    Assignment, Attendance, TimetableEntry
)
from seed_data import seed_database

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.config.from_object(config_class)

    # Enable CORS for frontend development
    CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5001", "*"])

    # Initialize Database
    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_database()

    # -------------------------------------------------------------
    # Authentication Helper Decorators
    # -------------------------------------------------------------
    def login_required(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = session.get('user_id')
            if not user_id:
                # Check Authorization header as fallback
                auth_header = request.headers.get('Authorization')
                if auth_header and auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]
                    try:
                        user_id = int(token)
                    except ValueError:
                        return jsonify({'error': 'Invalid authentication token'}), 401
                else:
                    return jsonify({'error': 'Authentication required. Please log in.'}), 401
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found or session expired.'}), 401
            return f(user, *args, **kwargs)
        return decorated_function

    def role_required(allowed_roles):
        def decorator(f):
            @wraps(f)
            @login_required
            def decorated_function(current_user, *args, **kwargs):
                if current_user.role not in allowed_roles:
                    return jsonify({'error': f'Access forbidden: requires one of {allowed_roles} roles.'}), 403
                return f(current_user, *args, **kwargs)
            return decorated_function
        return decorator

    # -------------------------------------------------------------
    # Auth Routes
    # -------------------------------------------------------------
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json() or {}
        identifier = data.get('email') or data.get('username')
        password = data.get('password')

        if not identifier or not password:
            return jsonify({'error': 'Please provide email/username and password.'}), 400

        user = User.query.filter(
            (User.email == identifier.strip().lower()) | (User.username == identifier.strip().lower())
        ).first()

        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password.'}), 401

        session['user_id'] = user.id
        session['role'] = user.role
        session.permanent = True

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': str(user.id)
        }), 200

    @app.route('/api/logout', methods=['POST'])
    def logout():
        session.clear()
        return jsonify({'message': 'Logged out successfully'}), 200

    @app.route('/api/me', methods=['GET'])
    def get_current_user():
        user_id = session.get('user_id')
        if not user_id:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                try:
                    user_id = int(auth_header.split(' ')[1])
                except ValueError:
                    user_id = None

        if not user_id:
            return jsonify({'user': None}), 200

        user = User.query.get(user_id)
        if not user:
            return jsonify({'user': None}), 200

        return jsonify({'user': user.to_dict()}), 200

    # -------------------------------------------------------------
    # General Public & Statistical Routes
    # -------------------------------------------------------------
    @app.route('/api/stats', methods=['GET'])
    def get_stats():
        total_students = Student.query.count()
        total_teachers = Teacher.query.count()
        total_events = Event.query.count()
        total_enquiries = AdmissionEnquiry.query.count()
        total_announcements = Announcement.query.count()

        return jsonify({
            'students_count': max(total_students, 1240),
            'faculty_count': max(total_teachers, 98),
            'student_teacher_ratio': '12:1',
            'campus_acres': 64,
            'nationalities': 38,
            'college_acceptance': '99.4%',
            'events_count': total_events,
            'enquiries_count': total_enquiries,
            'announcements_count': total_announcements
        }), 200

    # -------------------------------------------------------------
    # Announcements API
    # -------------------------------------------------------------
    @app.route('/api/announcements', methods=['GET'])
    def get_announcements():
        category = request.args.get('category')
        audience = request.args.get('audience')

        query = Announcement.query.order_by(Announcement.is_pinned.desc(), Announcement.id.desc())
        if category and category != 'All':
            query = query.filter_by(category=category)
        if audience and audience != 'All':
            query = query.filter(Announcement.target_audience.in_(['All', audience]))

        items = query.all()
        return jsonify([item.to_dict() for item in items]), 200

    @app.route('/api/announcements', methods=['POST'])
    @role_required(['admin'])
    def create_announcement(current_user):
        data = request.get_json() or {}
        title = data.get('title')
        description = data.get('description')
        category = data.get('category', 'General')
        audience = data.get('target_audience', 'All')
        date_str = data.get('date', datetime.utcnow().strftime('%B %d, %Y'))
        is_pinned = bool(data.get('is_pinned', False))

        if not title or not description:
            return jsonify({'error': 'Title and description are required.'}), 400

        item = Announcement(
            title=title.strip(),
            description=description.strip(),
            category=category,
            target_audience=audience,
            date=date_str,
            is_pinned=is_pinned
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({'message': 'Announcement published successfully', 'item': item.to_dict()}), 201

    @app.route('/api/announcements/<int:item_id>', methods=['DELETE'])
    @role_required(['admin'])
    def delete_announcement(current_user, item_id):
        item = Announcement.query.get(item_id)
        if not item:
            return jsonify({'error': 'Announcement not found.'}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Announcement deleted successfully.'}), 200

    # -------------------------------------------------------------
    # Events API
    # -------------------------------------------------------------
    @app.route('/api/events', methods=['GET'])
    def get_events():
        category = request.args.get('category')
        query = Event.query.order_by(Event.id.asc())
        if category and category != 'All':
            query = query.filter_by(category=category)
        events = query.all()
        return jsonify([e.to_dict() for e in events]), 200

    @app.route('/api/events', methods=['POST'])
    @role_required(['admin'])
    def create_event(current_user):
        data = request.get_json() or {}
        title = data.get('title')
        date_str = data.get('date')
        time_str = data.get('time')
        location = data.get('location')
        description = data.get('description')
        category = data.get('category', 'General')
        image_url = data.get('image_url', '/src/assets/images/hero_school_campus_1790610519961.jpg')

        if not title or not date_str or not time_str or not location:
            return jsonify({'error': 'Title, date, time, and location are required.'}), 400

        event = Event(
            title=title.strip(),
            date=date_str.strip(),
            time=time_str.strip(),
            location=location.strip(),
            description=description.strip() if description else '',
            category=category,
            image_url=image_url
        )
        db.session.add(event)
        db.session.commit()
        return jsonify({'message': 'Event created successfully', 'event': event.to_dict()}), 201

    @app.route('/api/events/<int:item_id>', methods=['DELETE'])
    @role_required(['admin'])
    def delete_event(current_user, item_id):
        event = Event.query.get(item_id)
        if not event:
            return jsonify({'error': 'Event not found.'}), 404
        db.session.delete(event)
        db.session.commit()
        return jsonify({'message': 'Event deleted successfully.'}), 200

    # -------------------------------------------------------------
    # News API
    # -------------------------------------------------------------
    @app.route('/api/news', methods=['GET'])
    def get_news():
        category = request.args.get('category')
        query = News.query.order_by(News.id.desc())
        if category and category != 'All':
            query = query.filter_by(category=category)
        items = query.all()
        return jsonify([n.to_dict() for n in items]), 200

    @app.route('/api/news/<int:item_id>', methods=['GET'])
    def get_single_news(item_id):
        item = News.query.get(item_id)
        if not item:
            return jsonify({'error': 'Article not found.'}), 404
        return jsonify(item.to_dict()), 200

    @app.route('/api/news', methods=['POST'])
    @role_required(['admin'])
    def create_news(current_user):
        data = request.get_json() or {}
        title = data.get('title')
        description = data.get('description')
        content = data.get('content')
        category = data.get('category', 'Campus')
        image_url = data.get('image_url', '/src/assets/images/hero_school_campus_1790610519961.jpg')
        author = data.get('author', 'HORIZONTAL Editorial Board')
        date_str = data.get('date', datetime.utcnow().strftime('%B %d, %Y'))

        if not title or not description or not content:
            return jsonify({'error': 'Title, brief description, and full content are required.'}), 400

        item = News(
            title=title.strip(),
            date=date_str,
            category=category,
            description=description.strip(),
            content=content.strip(),
            image_url=image_url,
            author=author
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({'message': 'News article published successfully', 'news': item.to_dict()}), 201

    @app.route('/api/news/<int:item_id>', methods=['DELETE'])
    @role_required(['admin'])
    def delete_news(current_user, item_id):
        item = News.query.get(item_id)
        if not item:
            return jsonify({'error': 'Article not found.'}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Article deleted successfully.'}), 200

    # -------------------------------------------------------------
    # Gallery API
    # -------------------------------------------------------------
    @app.route('/api/gallery', methods=['GET'])
    def get_gallery():
        category = request.args.get('category')
        query = GalleryItem.query.order_by(GalleryItem.id.asc())
        if category and category != 'All':
            query = query.filter_by(category=category)
        items = query.all()
        return jsonify([g.to_dict() for g in items]), 200

    @app.route('/api/gallery', methods=['POST'])
    @role_required(['admin'])
    def create_gallery_item(current_user):
        data = request.get_json() or {}
        title = data.get('title')
        category = data.get('category', 'Campus')
        image_url = data.get('image_url')
        caption = data.get('caption', '')

        if not title or not image_url:
            return jsonify({'error': 'Title and image URL are required.'}), 400

        item = GalleryItem(
            title=title.strip(),
            category=category,
            image_url=image_url.strip(),
            caption=caption.strip()
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({'message': 'Gallery item added successfully', 'item': item.to_dict()}), 201

    @app.route('/api/gallery/<int:item_id>', methods=['DELETE'])
    @role_required(['admin'])
    def delete_gallery_item(current_user, item_id):
        item = GalleryItem.query.get(item_id)
        if not item:
            return jsonify({'error': 'Gallery item not found.'}), 404
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Gallery item removed successfully.'}), 200

    # -------------------------------------------------------------
    # Admissions Form Submission & Admin Review
    # -------------------------------------------------------------
    @app.route('/api/admissions', methods=['POST'])
    def submit_admission_enquiry():
        data = request.get_json() or {}
        student_name = data.get('student_name')
        parent_name = data.get('parent_name')
        email = data.get('email')
        phone = data.get('phone')
        dob = data.get('date_of_birth')
        grade = data.get('grade_applying_for')
        prev_school = data.get('previous_school', '')
        message = data.get('message', '')

        # Server-side validation
        if not student_name or not parent_name or not email or not phone or not dob or not grade:
            return jsonify({'error': 'Please fill out all mandatory fields (student name, parent name, email, phone, date of birth, grade).'}), 400

        enquiry = AdmissionEnquiry(
            student_name=student_name.strip(),
            parent_name=parent_name.strip(),
            email=email.strip().lower(),
            phone=phone.strip(),
            date_of_birth=dob.strip(),
            grade_applying_for=grade.strip(),
            previous_school=prev_school.strip() if prev_school else '',
            message=message.strip() if message else '',
            status='Pending'
        )
        db.session.add(enquiry)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Thank you, {parent_name}. Your admission enquiry for {student_name} ({grade}) has been received. Our admissions office will contact you at {email} within 2 business days.',
            'enquiry_id': enquiry.id
        }), 201

    @app.route('/api/admissions', methods=['GET'])
    @role_required(['admin'])
    def list_admission_enquiries(current_user):
        status = request.args.get('status')
        query = AdmissionEnquiry.query.order_by(AdmissionEnquiry.id.desc())
        if status and status != 'All':
            query = query.filter_by(status=status)
        items = query.all()
        return jsonify([e.to_dict() for e in items]), 200

    @app.route('/api/admissions/<int:enquiry_id>', methods=['PATCH'])
    @role_required(['admin'])
    def update_admission_status(current_user, enquiry_id):
        enquiry = AdmissionEnquiry.query.get(enquiry_id)
        if not enquiry:
            return jsonify({'error': 'Admission enquiry not found.'}), 404
        data = request.get_json() or {}
        new_status = data.get('status')
        if new_status in ['Pending', 'Reviewed', 'Accepted', 'Rejected']:
            enquiry.status = new_status
            db.session.commit()
            return jsonify({'message': f'Status updated to {new_status}', 'enquiry': enquiry.to_dict()}), 200
        return jsonify({'error': 'Invalid status provided.'}), 400

    # -------------------------------------------------------------
    # Contact Form Submission & Admin Review
    # -------------------------------------------------------------
    @app.route('/api/contact', methods=['POST'])
    def submit_contact_message():
        data = request.get_json() or {}
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone', '')
        subject = data.get('subject')
        message = data.get('message')

        if not name or not email or not subject or not message:
            return jsonify({'error': 'Name, email, subject, and message are required.'}), 400

        contact = ContactMessage(
            name=name.strip(),
            email=email.strip().lower(),
            phone=phone.strip() if phone else '',
            subject=subject.strip(),
            message=message.strip(),
            status='Unread'
        )
        db.session.add(contact)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'Thank you for reaching out, {name}. Your message regarding "{subject}" has been delivered to HORIZONTAL administration.',
            'message_id': contact.id
        }), 201

    @app.route('/api/contact', methods=['GET'])
    @role_required(['admin'])
    def list_contact_messages(current_user):
        messages = ContactMessage.query.order_by(ContactMessage.id.desc()).all()
        return jsonify([m.to_dict() for m in messages]), 200

    @app.route('/api/contact/<int:msg_id>', methods=['PATCH'])
    @role_required(['admin'])
    def update_contact_status(current_user, msg_id):
        msg = ContactMessage.query.get(msg_id)
        if not msg:
            return jsonify({'error': 'Message not found.'}), 404
        data = request.get_json() or {}
        new_status = data.get('status')
        if new_status in ['Unread', 'Read', 'Replied']:
            msg.status = new_status
            db.session.commit()
            return jsonify({'message': f'Status updated to {new_status}', 'contact': msg.to_dict()}), 200
        return jsonify({'error': 'Invalid status.'}), 400

    # -------------------------------------------------------------
    # Student Portal API
    # -------------------------------------------------------------
    @app.route('/api/student/dashboard', methods=['GET'])
    @role_required(['student', 'admin'])
    def get_student_dashboard(current_user):
        student = current_user.student_profile
        if not student:
            # Fallback to primary student if admin is checking
            student = Student.query.first()
            if not student:
                return jsonify({'error': 'No student record associated.'}), 404

        # Fetch timetable for student's grade
        timetable = TimetableEntry.query.filter_by(grade=student.grade).order_by(TimetableEntry.period.asc()).all()
        # Fetch assignments for student's grade
        assignments = Assignment.query.filter_by(grade=student.grade).order_by(Assignment.id.desc()).all()
        # Fetch attendance history
        attendance = Attendance.query.filter_by(student_id=student.id).order_by(Attendance.id.desc()).limit(15).all()
        # Fetch targeted announcements
        announcements = Announcement.query.filter(Announcement.target_audience.in_(['All', 'Students'])).order_by(Announcement.is_pinned.desc(), Announcement.id.desc()).limit(5).all()
        # Upcoming events
        upcoming_events = Event.query.order_by(Event.id.asc()).limit(4).all()

        return jsonify({
            'student': student.to_dict(),
            'timetable': [t.to_dict() for t in timetable],
            'assignments': [a.to_dict() for a in assignments],
            'attendance': [att.to_dict() for att in attendance],
            'announcements': [ann.to_dict() for ann in announcements],
            'events': [ev.to_dict() for ev in upcoming_events]
        }), 200

    # -------------------------------------------------------------
    # Teacher Portal API
    # -------------------------------------------------------------
    @app.route('/api/teacher/dashboard', methods=['GET'])
    @role_required(['teacher', 'admin'])
    def get_teacher_dashboard(current_user):
        teacher = current_user.teacher_profile
        if not teacher:
            teacher = Teacher.query.first()
            if not teacher:
                return jsonify({'error': 'No teacher profile found.'}), 404

        # Classes managed
        assigned_classes = [
            {'grade': 'Grade 11-A', 'subject': 'Advanced Mathematics', 'students_count': 26, 'room': 'Sci-304'},
            {'grade': 'Grade 12-B', 'subject': 'Calculus & Linear Algebra', 'students_count': 22, 'room': 'Sci-306'},
            {'grade': 'Grade 10-A', 'subject': 'Applied Geometry', 'students_count': 28, 'room': 'Math-101'}
        ]

        # Students roster for Grade 11-A
        students = Student.query.filter_by(grade='Grade 11-A').all()
        # Assignments created
        assignments = Assignment.query.order_by(Assignment.id.desc()).all()
        # Recent attendance marked
        recent_attendance = Attendance.query.order_by(Attendance.id.desc()).limit(20).all()

        return jsonify({
            'teacher': teacher.to_dict(),
            'assigned_classes': assigned_classes,
            'students': [s.to_dict() for s in students],
            'assignments': [a.to_dict() for a in assignments],
            'recent_attendance': [att.to_dict() for att in recent_attendance]
        }), 200

    @app.route('/api/teacher/assignments', methods=['POST'])
    @role_required(['teacher', 'admin'])
    def create_assignment(current_user):
        data = request.get_json() or {}
        title = data.get('title')
        subject = data.get('subject')
        grade = data.get('grade', 'Grade 11-A')
        due_date = data.get('due_date')
        description = data.get('description')
        max_score = int(data.get('max_score', 100))

        if not title or not subject or not due_date or not description:
            return jsonify({'error': 'Title, subject, due date, and instructions are required.'}), 400

        teacher_name = current_user.teacher_profile.full_name if current_user.teacher_profile else "Faculty Member"

        assignment = Assignment(
            title=title.strip(),
            subject=subject.strip(),
            grade=grade.strip(),
            teacher_name=teacher_name,
            due_date=due_date.strip(),
            description=description.strip(),
            max_score=max_score
        )
        db.session.add(assignment)
        db.session.commit()

        return jsonify({'message': 'Assignment assigned to class successfully', 'assignment': assignment.to_dict()}), 201

    @app.route('/api/teacher/attendance', methods=['POST'])
    @role_required(['teacher', 'admin'])
    def mark_attendance(current_user):
        data = request.get_json() or {}
        student_id = data.get('student_id')
        status = data.get('status', 'Present')
        date_str = data.get('date', datetime.utcnow().strftime('%Y-%m-%d'))
        remarks = data.get('remarks', '')

        if not student_id:
            return jsonify({'error': 'student_id is required.'}), 400

        student = Student.query.get(student_id)
        if not student:
            return jsonify({'error': 'Student not found.'}), 404

        record = Attendance(
            student_id=student.id,
            student_name=student.full_name,
            grade=student.grade,
            date=date_str,
            status=status,
            remarks=remarks
        )
        db.session.add(record)
        db.session.commit()

        return jsonify({'message': f'Attendance marked as {status} for {student.full_name}', 'record': record.to_dict()}), 201

    # -------------------------------------------------------------
    # Admin Dashboard API
    # -------------------------------------------------------------
    @app.route('/api/admin/dashboard', methods=['GET'])
    @role_required(['admin'])
    def get_admin_dashboard(current_user):
        total_students = Student.query.count()
        total_teachers = Teacher.query.count()
        enquiries_count = AdmissionEnquiry.query.count()
        pending_enquiries = AdmissionEnquiry.query.filter_by(status='Pending').count()
        unread_messages = ContactMessage.query.filter_by(status='Unread').count()
        events_count = Event.query.count()
        announcements_count = Announcement.query.count()

        latest_enquiries = [e.to_dict() for e in AdmissionEnquiry.query.order_by(AdmissionEnquiry.id.desc()).limit(6).all()]
        latest_contacts = [c.to_dict() for c in ContactMessage.query.order_by(ContactMessage.id.desc()).limit(6).all()]
        users = [u.to_dict() for u in User.query.order_by(User.id.desc()).limit(15).all()]

        return jsonify({
            'admin': current_user.to_dict(),
            'metrics': {
                'total_students': total_students,
                'total_teachers': total_teachers,
                'enquiries_count': enquiries_count,
                'pending_enquiries': pending_enquiries,
                'unread_messages': unread_messages,
                'events_count': events_count,
                'announcements_count': announcements_count
            },
            'latest_enquiries': latest_enquiries,
            'latest_contacts': latest_contacts,
            'users': users
        }), 200

    # -------------------------------------------------------------
    # Health Check
    # -------------------------------------------------------------
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'HORIZONTAL School Flask Backend',
            'timestamp': datetime.utcnow().isoformat()
        }), 200

    # -------------------------------------------------------------
    # Error Handlers
    # -------------------------------------------------------------
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found', 'status': 404}), 404

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({'error': 'Forbidden access', 'status': 403}), 403

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error occurred. Please contact HORIZONTAL administration.', 'status': 500}), 500

    return app

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Run HORIZONTAL School Flask Server")
    parser.add_argument('--port', type=int, default=5001, help='Port to run Flask server on')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='Host to bind')
    args = parser.parse_args()

    app = create_app()
    print(f"🚀 HORIZONTAL Flask Backend starting on http://{args.host}:{args.port}")
    app.run(host=args.host, port=args.port, debug=False)
