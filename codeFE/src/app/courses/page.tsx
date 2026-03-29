"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { courseService } from "@/services/courseService";
import { enrollmentService } from "@/services/enrollmentService";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice } from "@/lib/utils";
import type { CourseResponse } from "@/types";

export default function CoursesPage() {
  const user = useAuthStore((s) => s.user);

  const { data: courses = [], isLoading } = useQuery<CourseResponse[]>({
    queryKey: ["courses"],
    queryFn: courseService.getPublished,
  });

  const { data: enrollments = [] } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: enrollmentService.getMyEnrollments,
    enabled: !!user,
  });

  const enrolledIds = new Set(enrollments.map((e) => e.courseId));

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container">
          {/* Welcome banner */}
          {user && (
            <div className="welcome-banner">
              <div>
                <h2>Welcome back, {user.fullName || user.email}</h2>
                <p>
                  {enrollments.length > 0
                    ? `You are enrolled in ${enrollments.length} course${enrollments.length > 1 ? "s" : ""}.`
                    : "Browse courses below and start learning today."}
                </p>
              </div>
              {enrollments.length > 0 && (
                <Link href="#my-courses" className="btn btn-primary banner-btn">
                  My Courses
                </Link>
              )}
            </div>
          )}

          {/* My enrolled courses */}
          {enrollments.length > 0 && (
            <section id="my-courses" className="section-block">
              <h2 className="section-title">Continue Learning</h2>
              <div className="courses-grid">
                {courses
                  .filter((c) => enrolledIds.has(c.id))
                  .map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      enrolled
                    />
                  ))}
              </div>
            </section>
          )}

          {/* All published courses */}
          <section className="section-block">
            <div className="section-header">
              <h2 className="section-title">Explore Courses</h2>
              <p className="section-sub">Expand your skills with our curated courses</p>
            </div>

            {isLoading ? (
              <div className="courses-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h3>No courses available yet</h3>
                <p>Check back soon — instructors are creating content.</p>
              </div>
            ) : (
              <div className="courses-grid">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrolled={enrolledIds.has(course.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <style jsx>{`
                .page { padding: 2rem 0 6rem; }

                .welcome-banner {
                    display: flex; justify-content: space-between; align-items: center;
                    background: linear-gradient(135deg, #eff6ff, #f0fdf4);
                    border: 1px solid #dbeafe; border-radius: 12px;
                    padding: 1.5rem 2rem; margin-bottom: 2.5rem; gap: 1rem;
                }
                .welcome-banner h2 { font-size: 1.25rem; margin-bottom: 0.25rem; }
                .welcome-banner p { color: var(--text-secondary); font-size: 0.9rem; }
                .banner-btn { padding: 0.5rem 1.25rem; font-size: 0.875rem; white-space: nowrap; }

                .section-block { margin-bottom: 3rem; }
                .section-header { margin-bottom: 1.5rem; }
                .section-title { font-size: 1.5rem; margin-bottom: 0.25rem; }
                .section-sub { color: var(--text-secondary); font-size: 0.9rem; }

                .courses-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }
                .skeleton-card {
                    height: 260px; background: #f3f4f6;
                    border-radius: 12px; animation: pulse 1.5s infinite;
                }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

                .empty-state {
                    text-align: center; padding: 4rem 2rem;
                    background: #f9fafb; border-radius: 12px;
                    border: 1px dashed #e5e7eb;
                }
                .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
                .empty-state h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
                .empty-state p { color: var(--text-secondary); font-size: 0.9rem; }
            `}</style>
    </>
  );
}

function CourseCard({ course, enrolled }: { course: CourseResponse; enrolled: boolean }) {
  const isFree = course.price === 0;

  return (
    <Link href={`/courses/${course.id}`} className="card-link">
      <div className="card">
        <div
          className="card-thumb"
          style={{
            background: course.thumbnailUrl
              ? `url(${course.thumbnailUrl}) center/cover`
              : "linear-gradient(135deg, #135bec, #4bc0c8)",
          }}
        >
          {enrolled && <span className="enrolled-tag">✓ Enrolled</span>}
          {isFree && !enrolled && <span className="free-tag">Free</span>}
        </div>
        <div className="card-body">
          <h3 className="card-title">{course.title}</h3>
          {course.description && (
            <p className="card-desc">{course.description}</p>
          )}
          <div className="card-footer">
            <span className="card-price">
              {enrolled ? "Enrolled" : formatPrice(course.price)}
            </span>
            <span className="card-cta">
              {enrolled ? "Continue →" : "View Course →"}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
                .card-link { display: block; text-decoration: none; }
                .card {
                    background: white; border-radius: 12px; overflow: hidden;
                    border: 1px solid #e5e7eb; transition: transform 0.2s, box-shadow 0.2s;
                    height: 100%;
                }
                .card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); }
                .card-thumb { height: 160px; position: relative; }
                .enrolled-tag {
                    position: absolute; top: 0.75rem; left: 0.75rem;
                    background: #16a34a; color: white;
                    padding: 0.2rem 0.6rem; border-radius: 20px;
                    font-size: 0.72rem; font-weight: 700;
                }
                .free-tag {
                    position: absolute; top: 0.75rem; left: 0.75rem;
                    background: rgba(0,0,0,0.6); color: white;
                    padding: 0.2rem 0.6rem; border-radius: 20px;
                    font-size: 0.72rem; font-weight: 700;
                }
                .card-body { padding: 1.25rem; }
                .card-title {
                    font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;
                    color: var(--text-primary);
                    display: -webkit-box; -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden;
                }
                .card-desc {
                    font-size: 0.825rem; color: var(--text-secondary); margin-bottom: 1rem;
                    display: -webkit-box; -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden;
                }
                .card-footer {
                    display: flex; justify-content: space-between; align-items: center;
                    padding-top: 0.75rem; border-top: 1px solid #f3f4f6;
                }
                .card-price { font-weight: 700; color: var(--primary); font-size: 0.9rem; }
                .card-cta { font-size: 0.825rem; font-weight: 600; color: var(--primary); }
            `}</style>
    </Link>
  );
}
