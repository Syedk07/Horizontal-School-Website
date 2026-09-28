from models import (
    db, User, Student, Teacher, Admin, AdmissionEnquiry,
    ContactMessage, Announcement, Event, News, GalleryItem,
    Assignment, Attendance, TimetableEntry
)

def seed_database():
    """Populates the database with realistic initial data."""
    # Check if data already exists
    if User.query.first():
        print("Database already contains records. Skipping seed.")
        return

    print("Seeding database with realistic HORIZONTAL school data...")

    # 1. Admin Account
    admin_user = User(
        email="admin@horizontal.edu",
        username="admin",
        role="admin"
    )
    admin_user.set_password("Admin@2026")
    db.session.add(admin_user)
    db.session.flush()

    admin_profile = Admin(
        user_id=admin_user.id,
        full_name="Dr. Marcus Vance",
        title="Head of School & Principal",
        department="Executive Leadership"
    )
    db.session.add(admin_profile)

    # 2. Teacher Account
    teacher_user = User(
        email="teacher@horizontal.edu",
        username="teacher",
        role="teacher"
    )
    teacher_user.set_password("Teacher@2026")
    db.session.add(teacher_user)
    db.session.flush()

    teacher_profile = Teacher(
        user_id=teacher_user.id,
        employee_id="HOR-FAC-104",
        full_name="Prof. Sarah Jenkins",
        department="Mathematics & Computational Thinking",
        designation="Head of Department & Senior Faculty",
        qualification="Ph.D. in Applied Mathematics (MIT), M.Ed.",
        phone="+1 (555) 349-2180",
        office_room="North Quad, Science Wing 304",
        avatar_url="/src/assets/images/principal_portrait_1790610534155.jpg"
    )
    db.session.add(teacher_profile)

    # Additional Faculty for department visibility
    extra_teachers = [
        ("David Chen", "Physics & Robotics", "HOR-FAC-108", "M.Sc. Robotics Engineering", "physics.chen@horizontal.edu"),
        ("Elena Rostova", "Humanities & World Literature", "HOR-FAC-112", "M.A. Comparative Literature", "rostova.lit@horizontal.edu"),
        ("Marcus Bennett", "Athletics & Physical Conditioning", "HOR-FAC-115", "B.S. Kinesiology, Olympic Trainer", "bennett.pe@horizontal.edu"),
        ("Amina Al-Mansoor", "Fine Arts & Digital Media", "HOR-FAC-121", "M.F.A. Visual Design", "almansoor.art@horizontal.edu")
    ]
    for name, dept, empid, qual, email in extra_teachers:
        u = User(email=email, username=email.split('@')[0], role="teacher")
        u.set_password("Teacher@2026")
        db.session.add(u)
        db.session.flush()
        tp = Teacher(
            user_id=u.id,
            employee_id=empid,
            full_name=name,
            department=dept,
            designation="Faculty Member",
            qualification=qual,
            phone="+1 (555) 400-0199",
            office_room="Academic Block B",
            avatar_url="/src/assets/images/principal_portrait_1790610534155.jpg"
        )
        db.session.add(tp)

    # 3. Student Account
    student_user = User(
        email="student@horizontal.edu",
        username="student",
        role="student"
    )
    student_user.set_password("Student@2026")
    db.session.add(student_user)
    db.session.flush()

    primary_student = Student(
        user_id=student_user.id,
        student_id="HOR-2026-081",
        full_name="Alexander Hayes",
        grade="Grade 11-A",
        section="A",
        roll_no="14",
        attendance_percentage=96.4,
        parent_name="Catherine & Robert Hayes",
        parent_phone="+1 (555) 782-9912",
        address="42 Horizon Ridge Way, Campus Heights",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    )
    db.session.add(primary_student)
    db.session.flush()

    # Classmates in Grade 11-A
    classmates = [
        ("Maya Patel", "HOR-2026-082", "01", 98.2, "Arun Patel"),
        ("Liam O'Connor", "HOR-2026-083", "02", 92.5, "Brigid O'Connor"),
        ("Zoe Washington", "HOR-2026-084", "03", 95.0, "Derrick Washington"),
        ("Julian Thorne", "HOR-2026-085", "04", 94.1, "Victoria Thorne"),
        ("Sophia Lin", "HOR-2026-086", "05", 99.0, "Hao Lin")
    ]
    student_objs = [primary_student]
    for name, sid, roll, att, parent in classmates:
        u = User(email=f"{sid.lower()}@horizontal.edu", username=sid.lower(), role="student")
        u.set_password("Student@2026")
        db.session.add(u)
        db.session.flush()
        s = Student(
            user_id=u.id,
            student_id=sid,
            full_name=name,
            grade="Grade 11-A",
            section="A",
            roll_no=roll,
            attendance_percentage=att,
            parent_name=parent,
            parent_phone="+1 (555) 300-4491",
            address="Campus Neighborhood Residential District",
            avatar_url=""
        )
        db.session.add(s)
        student_objs.append(s)

    # 4. Announcements
    announcements = [
        Announcement(
            title="Admissions for Academic Year 2026–2027 Are Now Open",
            description="Applications for Early Decision and Regular Admissions across Primary, Middle, and Senior Secondary levels are now open. Prospective families are invited to register for our upcoming Open House Campus Tour.",
            category="Academics",
            target_audience="All",
            date="September 26, 2026",
            is_pinned=True
        ),
        Announcement(
            title="Senior Secondary Term-I Examination Schedule Released",
            description="The comprehensive syllabus breakdown and timetables for Grades 10 through 12 have been published to the student portal. Review dates, laboratory practical windows, and invigilation guidelines.",
            category="Examination",
            target_audience="Students",
            date="September 24, 2026",
            is_pinned=True
        ),
        Announcement(
            title="HORIZONTAL STEM Robotics Team Qualifies for National Finals",
            description="Congratulations to our HorizonBots Vanguard squad for clinching First Place in the State Autonomous Robotics Championship. The team will represent our region in Washington D.C.",
            category="Events",
            target_audience="All",
            date="September 20, 2026",
            is_pinned=False
        ),
        Announcement(
            title="Annual Parent-Teacher Collaborative Forum on October 15",
            description="Parents are requested to reserve their 20-minute consultation slots with homeroom advisors and subject heads via the parent portal before October 5.",
            category="General",
            target_audience="Parents",
            date="September 18, 2026",
            is_pinned=False
        ),
        Announcement(
            title="Inter-House Autumn Sports Gala & Track Trials",
            description="Preliminary heats for 100m, 400m, relay, and high-jump will commence on the main athletic grounds this Friday afternoon. All participating student-athletes must report to Coach Bennett by 14:00.",
            category="Sports",
            target_audience="Students",
            date="September 15, 2026",
            is_pinned=False
        )
    ]
    for ann in announcements:
        db.session.add(ann)

    # 5. Events
    events = [
        Event(
            title="Annual Founder's Day & Academic Convocation",
            date="October 28, 2026",
            time="09:30 AM – 02:00 PM",
            location="Vance Grand Auditorium & Centennial Quad",
            description="A solemn celebration honoring 35 years of educational integrity, student scholarship awards, keynote address by pioneering educator Dr. Marcus Vance, and orchestral performances by our Symphony Society.",
            category="Annual Day",
            image_url="/src/assets/images/hero_school_campus_1790610519961.jpg"
        ),
        Event(
            title="Regional STEM & Sustainable Science Fair",
            date="November 12, 2026",
            time="10:00 AM – 04:30 PM",
            location="Horizon Innovation Hub & Robotics Arena",
            description="Over 60 juried scientific investigations presented by Middle and Senior students, ranging from atmospheric micro-particulate telemetry to renewable biofuels and automated agricultural rovers.",
            category="Science Exhibition",
            image_url="/src/assets/images/campus_robotics_lab_1790610559170.jpg"
        ),
        Event(
            title="Autumn Inter-School Athletics Championship",
            date="November 20, 2026",
            time="08:00 AM – 05:00 PM",
            location="HORIZONTAL Olympic Athletics Complex",
            description="Track, field, soccer, and basketball competitions featuring 14 visiting preparatory schools. Spectator seating open to all families and alumni.",
            category="Sports",
            image_url="/src/assets/images/campus_sports_track_1790610573352.jpg"
        ),
        Event(
            title="Harvest Fine Arts Showcase & Classical Evening",
            date="December 04, 2026",
            time="06:00 PM – 08:30 PM",
            location="North Atrium Gallery & Recital Hall",
            description="An exhibition of student paintings, architectural ceramics, and digital graphic design accompanied by chamber music ensembles and poetry recitals.",
            category="Cultural",
            image_url="/src/assets/images/school_art_studio_1790610590851.jpg"
        ),
        Event(
            title="Parent-Teacher Academic Growth Symposium (PTM)",
            date="October 15, 2026",
            time="08:30 AM – 03:30 PM",
            location="Main Academic Pavilions A & B",
            description="One-on-one structured progress dialogues between parents and educators focusing on student holistic development, continuous assessment metrics, and goal setting.",
            category="PTM",
            image_url="/src/assets/images/hero_school_campus_1790610519961.jpg"
        ),
        Event(
            title="Algorithmic Thinking & AI Ethics Workshop",
            date="December 14, 2026",
            time="01:30 PM – 04:00 PM",
            location="Computer Science Laboratory 3",
            description="Hands-on masterclass for secondary school students led by visiting researchers from MIT and industry pioneers on responsible artificial intelligence principles and Python machine learning.",
            category="Workshop",
            image_url="/src/assets/images/campus_robotics_lab_1790610559170.jpg"
        )
    ]
    for ev in events:
        db.session.add(ev)

    # 6. News
    news_items = [
        News(
            title="HORIZONTAL Unveils State-of-the-Art Clean Energy Science Wing",
            date="September 22, 2026",
            category="Campus",
            description="The 18,000 sq ft expansion integrates net-zero carbon architecture with university-level laboratories for biotechnology, quantum computing foundations, and environmental analytics.",
            content="""HORIZONTAL today marked the official opening of the Vance Centre for Sustainable Sciences, an 18,000-square-foot teaching pavilion designed to prepare students for next-generation scientific inquiry.

Funded through our institutional endowment and green-building grants, the facility features rooftop photovoltaic solar arrays, rainwater reclamation systems, and 6 dedicated student research bays. Students in Grades 9 through 12 will carry out independent laboratory investigations under faculty mentorship.

'True education does not merely teach past discoveries; it empowers young minds to interrogate tomorrow's challenges,' noted Dr. Marcus Vance during the ribbon-cutting ceremony.""",
            image_url="/src/assets/images/hero_school_campus_1790610519961.jpg",
            author="Office of Institutional Advancement"
        ),
        News(
            title="Student Debate Guild Wins First Place in Tri-State Model UN",
            date="September 16, 2026",
            category="Achievement",
            description="Representing delegates on environmental resilience and international cybersecurity, our 8-member delegation secured Best Delegation and three Outstanding Delegate gavels.",
            content="""After three intensive days of diplomatic debate, draft resolution synthesis, and crisis committee simulations, HORIZONTAL's Model United Nations delegation emerged victorious at the 28th Tri-State Youth Assembly.

Our students drafted key policy frameworks on transboundary water resource governance and digital civil liberties. Faculty advisor Elena Rostova praised the delegation's rigorous research and rhetorical poise under pressure.""",
            image_url="/src/assets/images/campus_robotics_lab_1790610559170.jpg",
            author="Humanities Faculty"
        ),
        News(
            title="New Global Apprenticeship Partnership with International Tech Labs",
            date="September 08, 2026",
            category="Research",
            description="Senior students in advanced computing will have the opportunity to engage in 8-week summer research fellowships alongside leading AI researchers and bioengineers.",
            content="""HORIZONTAL is proud to announce a formal educational partnership establishing the Horizon Scholars Fellowship. Under this initiative, selected Grade 11 and 12 scholars will spend summer terms collaborating on computational biology and data visualization projects.

This hands-on initiative bridges classroom theory with practical research methodologies, reinforcing our institution's commitment to experiential academic rigor.""",
            image_url="/src/assets/images/campus_sports_track_1790610573352.jpg",
            author="Academic Council"
        ),
        News(
            title="Community Harvest Drive Collects 3,400 lbs of Essentials for Local Pantries",
            date="August 29, 2026",
            category="Community",
            description="Organized entirely by our Student Service Council, the fortnight initiative rallied parents, faculty, and neighborhood partners to support regional food security.",
            content="""In keeping with our core value of Responsibility, students across all age cohorts participated in the annual Autumn Harvest Drive. Over two weeks, student volunteers collected, inventoried, and delivered over 3,400 pounds of nutritional non-perishables to regional community centers.

The initiative taught vital logistics coordination, community empathy, and shared civic responsibility.""",
            image_url="/src/assets/images/school_art_studio_1790610590851.jpg",
            author="Student Service Council"
        )
    ]
    for n in news_items:
        db.session.add(n)

    # 7. Gallery Items
    gallery_items = [
        GalleryItem(
            title="Centennial Campus Quad & Academic Pavilion",
            category="Campus",
            image_url="/src/assets/images/hero_school_campus_1790610519961.jpg",
            caption="Architectural harmony of sustainable brick, glass corridors, and native oak groves."
        ),
        GalleryItem(
            title="STEM Innovation & Autonomous Robotics Lab",
            category="Classrooms",
            image_url="/src/assets/images/campus_robotics_lab_1790610559170.jpg",
            caption="Senior students calibrating precision servo mechanisms and real-time control software."
        ),
        GalleryItem(
            title="Olympic-Standard All-Weather Athletics Track",
            category="Sports",
            image_url="/src/assets/images/campus_sports_track_1790610573352.jpg",
            caption="Track & field team training during golden morning drills."
        ),
        GalleryItem(
            title="Sunlit Visual Arts & Ceramic Studio",
            category="Activities",
            image_url="/src/assets/images/school_art_studio_1790610590851.jpg",
            caption="Spacious north-lit studios fostering painting, sculpture, and design creativity."
        ),
        GalleryItem(
            title="Principal's Academic Address & Leadership",
            category="Events",
            image_url="/src/assets/images/principal_portrait_1790610534155.jpg",
            caption="Dr. Marcus Vance conferring honors in the Horizon Centennial Library."
        ),
        GalleryItem(
            title="Student Collaborative Discovery Circle",
            category="Students",
            image_url="/src/assets/images/campus_robotics_lab_1790610559170.jpg",
            caption="Peer-to-peer problem solving and cross-disciplinary group projects."
        ),
        GalleryItem(
            title="Varsity Soccer & Conditioning Grounds",
            category="Sports",
            image_url="/src/assets/images/campus_sports_track_1790610573352.jpg",
            caption="Championship grass turf and athletic training pavilions."
        ),
        GalleryItem(
            title="Advanced Digital Fabrication & Design Center",
            category="Campus",
            image_url="/src/assets/images/campus_robotics_lab_1790610559170.jpg",
            caption="3D printing, laser-cutting, and rapid prototyping workstations."
        ),
        GalleryItem(
            title="Annual Symphony Orchestra Concert",
            category="Events",
            image_url="/src/assets/images/school_art_studio_1790610590851.jpg",
            caption="Student musicians performing classical repertoire in the main auditorium."
        )
    ]
    for g in gallery_items:
        db.session.add(g)

    # 8. Assignments for Alexander Hayes (Grade 11-A)
    assignments = [
        Assignment(
            title="Differential Calculus & Optimization Modeling",
            subject="Mathematics",
            grade="Grade 11-A",
            teacher_name="Prof. Sarah Jenkins",
            due_date="October 08, 2026",
            description="Complete Problem Set 4 on extrema analysis, concavity points, and practical optimization of thermal container geometries. Submit clean step-by-step proofs.",
            max_score=100
        ),
        Assignment(
            title="Electromagnetic Field Lines & Induction Lab Report",
            subject="Physics",
            grade="Grade 11-A",
            teacher_name="David Chen",
            due_date="October 12, 2026",
            description="Synthesize experimental measurements from Faraday's law coils. Include uncertainty error bounds and comparative LaTeX graphs.",
            max_score=100
        ),
        Assignment(
            title="Comparative Analysis: Post-Industrial Urban Sociologies",
            subject="Social Sciences",
            grade="Grade 11-A",
            teacher_name="Elena Rostova",
            due_date="October 16, 2026",
            description="Write a 1,500-word structured critical essay assessing demographic urbanization trends and green space distribution in mid-20th century European cities.",
            max_score=50
        ),
        Assignment(
            title="Data Structures: Binary Tree Traversal in Python",
            subject="Computer Science",
            grade="Grade 11-A",
            teacher_name="David Chen",
            due_date="October 20, 2026",
            description="Implement balanced BST insertion, in-order/pre-order traversal, and node deletion algorithms with full unit test coverage.",
            max_score=100
        )
    ]
    for a in assignments:
        db.session.add(a)

    # 9. Timetable for Grade 11-A
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    schedule_template = [
        (1, "08:30 - 09:25", "Advanced Mathematics", "Prof. Sarah Jenkins", "Sci-304"),
        (2, "09:30 - 10:25", "AP Physics Mechanics", "David Chen", "Lab-2"),
        (3, "10:40 - 11:35", "World Literature & Composition", "Elena Rostova", "Hum-102"),
        (4, "11:40 - 12:35", "Computer Science & Algorithms", "David Chen", "CS-1"),
        (5, "13:30 - 14:25", "Physical Education / Athletics", "Marcus Bennett", "Field / Gym"),
        (6, "14:30 - 15:25", "Studio Arts & Digital Media", "Amina Al-Mansoor", "Art-Studio")
    ]
    for day in days:
        for period, slot, subj, tname, room in schedule_template:
            tt = TimetableEntry(
                grade="Grade 11-A",
                day_of_week=day,
                period=period,
                time_slot=slot,
                subject=subj,
                teacher_name=tname,
                room=room
            )
            db.session.add(tt)

    # 10. Attendance Records for primary student
    attendance_records = [
        ("2026-09-22", "Present", "On time, active participation in calculus seminar."),
        ("2026-09-23", "Present", "Participated in physics lab experiments."),
        ("2026-09-24", "Present", "Attended student council morning assembly."),
        ("2026-09-25", "Present", "Full day attendance."),
        ("2026-09-26", "Late", "Delayed 10 mins due to regional transit maintenance.")
    ]
    for d, st, rem in attendance_records:
        rec = Attendance(
            student_id=primary_student.id,
            student_name=primary_student.full_name,
            grade=primary_student.grade,
            date=d,
            status=st,
            remarks=rem
        )
        db.session.add(rec)

    # 11. Initial Admission Enquiries (to populate Admin Dashboard)
    enquiries = [
        AdmissionEnquiry(
            student_name="Chloe Montgomery",
            parent_name="Dr. Julian Montgomery",
            email="j.montgomery@clinic.org",
            phone="+1 (555) 890-1234",
            date_of_birth="2010-04-12",
            grade_applying_for="Grade 11 - Senior Secondary",
            previous_school="St. Jude Preparatory Academy",
            message="We are relocating to the district next month. Chloe has a strong background in competitive mathematics and varsity swimming and wishes to join the STEM honors stream.",
            status="Reviewed"
        ),
        AdmissionEnquiry(
            student_name="Oliver Sterling",
            parent_name="Nadia Sterling",
            email="nadia.sterling@techpartners.com",
            phone="+1 (555) 431-7788",
            date_of_birth="2012-08-25",
            grade_applying_for="Grade 9 - Secondary School",
            previous_school="Oakridge International Middle School",
            message="Oliver is deeply interested in robotics and debate. We were impressed by your robotics team results and would love to schedule a personal campus walkthrough.",
            status="Pending"
        ),
        AdmissionEnquiry(
            student_name="Samuel K. Thorne",
            parent_name="Arthur & Grace Thorne",
            email="thorne.family@horizonmail.net",
            phone="+1 (555) 234-9011",
            date_of_birth="2014-11-03",
            grade_applying_for="Grade 7 - Middle School",
            previous_school="Crestview Elementary School",
            message="Looking for a structured, caring environment that fosters curiosity, foundational coding, and chamber music.",
            status="Accepted"
        )
    ]
    for enq in enquiries:
        db.session.add(enq)

    # 12. Initial Contact Messages (to populate Admin Dashboard)
    contacts = [
        ContactMessage(
            name="Margaret Holloway",
            email="holloway.m@alumni-network.org",
            phone="+1 (555) 761-0021",
            subject="Alumni Mentorship Circle 2026",
            message="Class of 2012 alumna here! A group of alumni working in aerospace and biotech would like to host a quarterly mentorship evening for graduating seniors.",
            status="Unread"
        ),
        ContactMessage(
            name="Robert Davenport",
            email="davenport.rob@communitysports.com",
            phone="+1 (555) 672-9900",
            subject="Joint Track & Field Invitational Inquiry",
            message="We would like to propose co-hosting the regional youth track relay at your athletic facilities this December. Please connect us with Athletic Director Marcus Bennett.",
            status="Read"
        )
    ]
    for msg in contacts:
        db.session.add(msg)

    db.session.commit()
    print("Database seeding completed successfully!")
