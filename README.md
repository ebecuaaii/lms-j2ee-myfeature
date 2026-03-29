# EduPlatform — Learning Management System

Hệ thống quản lý học tập (LMS) full-stack với Spring Boot + MongoDB (Backend) và Next.js + TypeScript (Frontend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.5, MongoDB Atlas, JWT, VNPay |
| Frontend | Next.js 14, TypeScript, TanStack Query, Zustand |
| Auth | JWT Access Token + Refresh Token |
| Payment | VNPay Sandbox |
| API Docs | Swagger UI (`/swagger-ui/index.html`) |

---

## Cài đặt & Chạy

### Yêu cầu
- Java 22+
- Node.js 18+
- MongoDB Atlas (đã cấu hình sẵn trong `application.properties`)

### Backend

```bash
cd lms-exam-j2ee/code_BE/lms
./mvnw spring-boot:run
# hoặc chạy LmsApplication.java từ IDE
```

Backend chạy tại: `http://localhost:8080`  
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Frontend

```bash
cd lms-exam-j2ee/codeFE
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:3000`

---

## Tài khoản mặc định

Tự đăng ký tại `/register`. Mật khẩu phải có:
- Ít nhất 8 ký tự
- 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt (`@$!%*?&`)

Ví dụ hợp lệ: `Password1@`

---

## Phân quyền

| Role | Mô tả |
|---|---|
| `STUDENT` | Đăng ký mặc định. Xem/mua/học khóa học, làm bài thi |
| `INSTRUCTOR` | Cần gửi yêu cầu, ADMIN duyệt. Tạo/quản lý khóa học, bài thi |
| `ADMIN` | Quản trị toàn hệ thống |

---

## Chức năng & Giao diện

### Trang chủ — `/`
- Landing page giới thiệu nền tảng
- Nút "Start Learning" → đăng ký hoặc vào danh sách khóa học
- Nút "Browse Courses" → danh sách khóa học
- Header hiển thị tên user + nút Logout khi đã đăng nhập

---

### Auth

| Trang | URL | Mô tả |
|---|---|---|
| Đăng nhập | `/login` | Form email + password, tự redirect theo role sau khi login |
| Đăng ký | `/register` | Form fullName + email + password + confirm, auto-login sau khi tạo |

---

### STUDENT

| Trang | URL | Mô tả |
|---|---|---|
| Danh sách khóa học | `/courses` | Xem tất cả khóa học đã publish, badge "Enrolled" / "Free", section "Continue Learning" |
| Chi tiết khóa học | `/courses/[courseId]` | Thông tin, curriculum, nút Enroll (free) hoặc Buy Now (paid) |
| Học bài | `/learn/[courseId]` | Sidebar curriculum + progress bar, video player (YouTube/Vimeo/MP4), mark complete |
| Làm bài thi | `/exams/[examId]` | Countdown timer, navigator dots, single/multiple choice, auto-submit khi hết giờ |
| Kết quả thi | `/exams/[examId]/result` | Score card, pass/fail, review đáp án + giải thích |
| Payment thành công | `/payment/success` | Xác nhận thanh toán, nút "Start Learning" |
| Payment thất bại | `/payment/failed` | Thông báo lỗi |

**Flow học:**
1. Vào `/courses` → chọn khóa học
2. Khóa FREE: bấm "Enroll for Free" → vào `/learn` ngay
3. Khóa PAID: bấm "Buy Now" → redirect VNPay → thanh toán → `/payment/success` → học

---

### INSTRUCTOR

| Trang | URL | Mô tả |
|---|---|---|
| Dashboard | `/instructor` | Stats (total/published/draft courses), danh sách course |
| Tạo khóa học | `/instructor/courses/new` | Form title, description, price, thumbnail URL |
| Quản lý khóa học | `/instructor/courses/[courseId]` | Thêm/xóa chapter, nút Publish, Edit, Question Bank, Exams |
| Sửa khóa học | `/instructor/courses/[courseId]/edit` | Cập nhật thông tin course |
| Quản lý lessons | `/instructor/courses/[courseId]/chapters/[chapterId]` | Thêm/xóa lesson, nhập video URL (YouTube/Vimeo), duration, free preview |
| Question Bank | `/instructor/courses/[courseId]/questions` | Tạo câu hỏi single/multiple choice, chọn đáp án đúng, difficulty, topic |
| Danh sách exam | `/instructor/courses/[courseId]/exams` | Xem/publish/xóa exam |
| Tạo exam | `/instructor/courses/[courseId]/exams/new` | Cấu hình exam + chọn câu hỏi từ question bank |
| Sửa exam | `/instructor/courses/[courseId]/exams/[examId]` | Cập nhật cấu hình + câu hỏi |
| Kết quả học viên | `/instructor/courses/[courseId]/exams/[examId]/submissions` | Bảng kết quả, pass rate, avg score |

**Flow tạo khóa học:**
1. `/instructor` → "+ New Course"
2. Điền thông tin → tạo course (DRAFT)
3. Vào "Manage" → thêm chapters → thêm lessons (paste YouTube URL)
4. Vào "Question Bank" → tạo câu hỏi
5. Vào "Exams" → tạo exam → chọn câu hỏi → Publish exam
6. Bấm "Publish Course" → student có thể thấy

---

### Video trong Lesson

Instructor chỉ cần paste link vào field `Video URL`:

| Loại | Ví dụ |
|---|---|
| YouTube | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` |
| YouTube short | `https://youtu.be/dQw4w9WgXcQ` |
| Vimeo | `https://vimeo.com/123456789` |
| File MP4 | `https://example.com/video.mp4` |

---

### Payment (VNPay Sandbox)

Thông tin test card VNPay:
- **Ngân hàng:** NCB
- **Số thẻ:** `9704198526191432198`
- **Tên chủ thẻ:** `NGUYEN VAN A`
- **Ngày phát hành:** `07/15`
- **OTP:** `123456`

---

## Cấu trúc dự án

```
lms-exam-j2ee/
├── code_BE/lms/          # Spring Boot backend
│   └── src/main/java/com/lms/lms/
│       ├── controller/   # REST endpoints
│       ├── service/      # Business logic
│       ├── repository/   # MongoDB repositories
│       ├── entity/       # MongoDB documents
│       ├── dto/          # Request/Response DTOs
│       ├── config/       # Security, CORS, Swagger
│       ├── exception/    # Global error handling
│       └── utils/        # JWT, VNPay, ResponseCode
│
├── codeFE/               # Next.js frontend
│   └── src/
│       ├── app/          # Pages (App Router)
│       ├── components/   # Shared components
│       ├── services/     # API calls
│       ├── stores/       # Zustand auth store
│       ├── types/        # TypeScript interfaces
│       └── lib/          # Utils, axios instance
│
├── task.md               # Tiến độ & task tracker
└── README.md             # File này
```

---

## API Endpoints chính

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/courses` | Danh sách khóa học public |
| POST | `/api/courses` | Tạo khóa học (INSTRUCTOR) |
| GET | `/api/courses/{id}/chapters` | Curriculum |
| POST | `/api/enrollments/{courseId}` | Enroll free |
| POST | `/api/payments/create/{courseId}` | Tạo payment VNPay |
| GET | `/api/payments/vnpay/callback` | VNPay callback |
| POST | `/api/progress/lessons/{id}/complete` | Mark lesson complete |
| GET | `/api/progress/courses/{id}` | Course progress |
| GET | `/api/exams/{id}/take` | Fetch đề thi (không có đáp án) |
| POST | `/api/exams/{id}/submit` | Nộp bài |

Xem đầy đủ tại Swagger: `http://localhost:8080/swagger-ui/index.html`
