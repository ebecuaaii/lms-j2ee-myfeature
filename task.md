# LMS Project — Task Tracker

## Progress Overview

| Layer | Status |
|---|---|
| Backend (Spring Boot + MongoDB) | ~85% |
| Frontend (Next.js + TypeScript) | ~65% |
| Integration (FE ↔ BE) | ~50% |

---

## BACKEND

### Done
- [x] Module 1 — Auth: register, login, logout, refresh token, JWT filter
- [x] Module 2 — User profile: view/update profile, change password
- [x] Module 3 — Instructor approval: student request, admin approve/reject
- [x] Module 4 — Curriculum: Course / Chapter / Lesson CRUD, soft delete, publish
- [x] Module 5 — Progress tracking: mark lesson completed, save lastWatchedSecond, course completion %
- [x] Module 6 — Exam engine: Question bank, Exam config, auto-grading, submission history
- [x] Swagger / OpenAPI with JWT bearer auth
- [x] GlobalExceptionHandler, AppException, ResponseCode
- [x] SecurityConfig with role-based rules for all endpoints
- [x] Soft delete on Course, Chapter, Lesson, Question, Exam
- [x] Enrollment entity + repository (stub, ready for module)

### Not Done
- [ ] Module 7 — Enrollment: student enroll course (free/paid), check enrollment before access
- [ ] Module 8 — Payment: integrate payment gateway (VNPay / Stripe) for paid courses
- [ ] Module 9 — Notification: notify student when course published, exam result
- [ ] Module 10 — Admin dashboard API: user stats, revenue, course stats
- [ ] Certificate generation after course completion
- [ ] Email verification on register
- [ ] Password reset via email
- [ ] Rate limiting / API throttling
- [ ] CORS config for production

---

## FRONTEND

### Done
- [x] Project setup: Next.js 14, TypeScript, Tailwind, TanStack Query, Zustand, React Hook Form + Zod
- [x] Auth store with cookie sync for middleware
- [x] Middleware: route protection + role-based redirect
- [x] Axios instance with JWT interceptor + 401 auto-logout
- [x] Types: all DTOs mapped from backend responses
- [x] Services: authService, courseService, chapterService, lessonService, examService, examManageService, questionService, progressService
- [x] Page: Login
- [x] Page: Register
- [x] Page: Course list (student)
- [x] Page: Course detail with curriculum accordion
- [x] Page: Learn — video player (YouTube/Vimeo/direct), sidebar curriculum, progress tracking, mark complete
- [x] Page: Exam — countdown timer, auto-submit, confirm dialog, question navigator dots
- [x] Page: Exam result — score card, pass/fail, review answers with explanation
- [x] Page: Instructor dashboard — stats, course list
- [x] Page: Create course
- [x] Page: Edit course
- [x] Page: Manage course — chapters, publish
- [x] Page: Manage lessons in chapter
- [x] Page: Question bank — add/delete questions, mark correct answers
- [x] Page: Exam list per course
- [x] Page: Create/Edit exam with question picker
- [x] Page: Exam submissions — pass rate, avg score table
- [x] Component: Navbar with role-aware links
- [x] Component: VideoPlayer (YouTube embed / Vimeo embed / direct video)
- [x] Component: ExamForm (shared create/edit)

### Not Done
- [ ] Page: Enrollment flow — enroll button, payment redirect (blocked by BE module 7/8)
- [ ] Page: Student dashboard — enrolled courses, progress overview
- [ ] Page: User profile — view/edit profile, change password
- [ ] Page: Admin dashboard — user management, approve instructor requests
- [ ] Page: My exams history (student) — list of exams taken
- [ ] Toast notifications (replace browser confirm/alert)
- [ ] Loading skeletons on more pages
- [ ] Mobile responsive layout (learn page sidebar collapses)
- [ ] Dark mode
- [ ] Search/filter courses by category, price, keyword

---

## Integration Gaps

- [ ] Enrollment check: FE calls enroll API before allowing /learn access (BE stub exists, needs full module)
- [ ] Progress API: currently called but enrollment check in BE will block unenrolled students
- [ ] Exam access: same — BE checks enrollment before allowing exam fetch

---

## Suggested Features (Nice to Have)

### High value for CV / demo
- **Certificate PDF** — generate certificate when student completes 100% of course + passes exam
- **Discussion / Q&A** per lesson — students ask questions, instructor answers
- **Course rating & review** — students rate course after completion

### Practical
- **Email notifications** — exam result, course published, instructor approved
- **Student dashboard** — enrolled courses with progress bars, upcoming exams
- **Admin panel** — approve instructor requests, view all users, basic revenue stats

### Polish
- **Toast notifications** — replace `confirm()` / `alert()` with proper toast (react-hot-toast)
- **Responsive mobile** — learn page sidebar as drawer on mobile
- **Search & filter** — course list with keyword search, filter by price/category

---

## Next Recommended Steps

1. Enrollment module (BE + FE) — unblocks learn/exam access flow end-to-end
2. Student dashboard — shows enrolled courses + progress
3. User profile page — basic but expected in any LMS
4. Toast notifications — quick win, improves UX significantly
5. Admin panel — approve instructor requests (BE already done, just needs FE)
