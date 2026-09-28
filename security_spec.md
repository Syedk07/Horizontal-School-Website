# Security Specification: HORIZONTAL School Platform

## 1. System Invariants
- Public users can submit Admission Enquiries and Contact Messages with strict schema limits (maximum lengths, required contact fields).
- Public users can read official announcements, events, and news articles.
- Only authenticated and trusted administrators can read/update admission enquiries and contact messages, or publish announcements, events, and news.
- The default catch-all rule denies all operations.
- Admin status is verified via `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or matching bootstrapped admin email `afnanbajhao05@gmail.com`.
- No ID poisoning: all path IDs must satisfy `isValidId()`.
- Timestamps and required keys are strictly guarded.

## 2. Dirty Dozen Threat Payloads
1. **Unauthenticated Read on Admissions**: Attacker attempts `get /databases/{db}/documents/admissions/enquiry_1` -> DENIED.
2. **Unauthenticated Read on Contacts**: Attacker attempts `list /databases/{db}/documents/contacts` -> DENIED.
3. **Ghost Field Poisoning on Contact Creation**: Submitting contact message with unauthorized field `isAdmin: true` -> DENIED.
4. **Oversized String Attack**: Submitting an enquiry message with > 5000 characters -> DENIED.
5. **ID Path Injection**: Creating document at `users/../../hacked` -> DENIED (fails `isValidId`).
6. **Privilege Escalation on User Record**: Non-admin user sets `role: 'admin'` in `users/{uid}` -> DENIED.
7. **Admissions Status Tampering**: Non-admin user updates enquiry status to `'Accepted'` -> DENIED.
8. **Spoofed Unverified Admin Email**: Request with `email: 'afnanbajhao05@gmail.com'` but `email_verified == false` -> DENIED.
9. **Blanket List Read Vulnerability**: Querying `/users` without scoping -> DENIED.
10. **Public Overwrite of Campus News**: Malicious client issues `delete /databases/{db}/documents/news/news_1` -> DENIED.
11. **Malicious Announcement Update**: Non-admin issues `update /databases/{db}/documents/announcements/ann_1` -> DENIED.
12. **Malformed Payload on Admission**: Submitting admission enquiry missing `parent_name` or `phone` -> DENIED.
