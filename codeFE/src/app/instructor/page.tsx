"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { courseService } from "@/services/courseService";
import { formatPrice } from "@/lib/utils";
import type { CourseResponse } from "@/types";

export default function InstructorDashboard() {
    const { data: courses = [], isLoading } = useQuery<CourseResponse[]>({
        queryKey: ["my-courses"],
        queryFn: courseService.getMyCourses,
    });

    const published = courses.filter((c) => c.status === "PUBLISHED").length;
    const drafts = courses.filter((c) => c.status === "DRAFT").length;

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container">
                    <div className="dashboard-header">
                        <div>
                            <h1>Instructor Dashboard</h1>
                            <p>Manage your courses and content</p>
                        </div>
                        <Link href="/instructor/courses/new" className="btn btn-primary">
                            + New Course
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{courses.length}</div>
                            <div className="stat-label">Total Courses</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{published}</div>
                            <div className="stat-label">Published</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{drafts}</div>
                            <div className="stat-label">Drafts</div>
                        </div>
                    </div>

                    {/* Course list */}
                    <h2 className="section-heading">My Courses</h2>
                    {isLoading ? (
                        <p className="loading-text">Loading...</p>
                    ) : courses.length === 0 ? (
                        <div className="empty-state">
                            <p>No courses yet.</p>
                            <Link href="/instructor/courses/new" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                                Create your first course
                            </Link>
                        </div>
                    ) : (
                        <div className="course-table">
                            {courses.map((course) => (
                                <CourseRow key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
        .page { padding: 2.5rem 0 6rem; }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .dashboard-header h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }
        .stat-value { font-size: 2rem; font-weight: 800; color: var(--primary); }
        .stat-label { font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem; }
        .section-heading { font-size: 1.25rem; margin-bottom: 1rem; }
        .loading-text { color: var(--text-secondary); }
        .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
        .course-table { display: flex; flex-direction: column; gap: 0.75rem; }
      `}</style>
        </>
    );
}

function CourseRow({ course }: { course: CourseResponse }) {
    return (
        <div className="course-row">
            <div className="course-info">
                <h3 className="course-name">{course.title}</h3>
                <span className="course-price">{formatPrice(course.price)}</span>
            </div>
            <div className="course-actions">
                <span className={`status-badge ${course.status === "PUBLISHED" ? "published" : "draft"}`}>
                    {course.status}
                </span>
                <Link href={`/instructor/courses/${course.id}`} className="btn btn-secondary action-btn">
                    Manage
                </Link>
            </div>

            <style jsx>{`
        .course-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 1rem 1.25rem;
        }
        .course-info { display: flex; align-items: center; gap: 1rem; }
        .course-name { font-size: 0.95rem; font-weight: 600; }
        .course-price { font-size: 0.875rem; color: var(--text-secondary); }
        .course-actions { display: flex; align-items: center; gap: 0.75rem; }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .published { background: #dcfce7; color: #16a34a; }
        .draft { background: #fef9c3; color: #ca8a04; }
        .action-btn { padding: 0.4rem 1rem; font-size: 0.875rem; }
      `}</style>
        </div>
    );
}
