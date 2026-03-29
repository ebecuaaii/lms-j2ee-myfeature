"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { courseService, chapterService } from "@/services/courseService";
import { enrollmentService } from "@/services/enrollmentService";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice, formatDuration } from "@/lib/utils";

export default function CourseDetailPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    const { data: course, isLoading: loadingCourse } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => courseService.getById(courseId),
    });

    const { data: chapters = [], isLoading: loadingChapters } = useQuery({
        queryKey: ["chapters", courseId],
        queryFn: () => chapterService.getByCourse(courseId),
    });

    const { data: enrollCheck } = useQuery({
        queryKey: ["enroll-check", courseId],
        queryFn: () => enrollmentService.checkEnrollment(courseId),
        enabled: !!user,
    });

    const isFree = (course?.price ?? 0) === 0;
    const isEnrolled = enrollCheck?.enrolled ?? false;

    const enrollMutation = useMutation({
        mutationFn: () => enrollmentService.enrollFree(courseId),
        onSuccess: () => router.push(`/learn/${courseId}`),
    });

    const payMutation = useMutation({
        mutationFn: () => enrollmentService.createPayment(courseId),
        onSuccess: (data) => {
            // redirect to VNPay
            window.location.href = data.paymentUrl;
        },
    });

    const handleEnrollClick = () => {
        if (!user) { router.push("/login"); return; }
        if (isFree) enrollMutation.mutate();
        else payMutation.mutate();
    };

    if (loadingCourse) return <><Navbar /><div className="loading-page">Loading...</div></>;
    if (!course) return <><Navbar /><div className="loading-page">Course not found.</div></>;

    const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length ?? 0), 0);

    return (
        <>
            <Navbar />
            <main>
                {/* Hero */}
                <div className="course-hero">
                    <div className="container hero-inner">
                        <div className="hero-text">
                            <h1 className="course-title">{course.title}</h1>
                            {course.description && (
                                <p className="course-desc">{course.description}</p>
                            )}
                            <div className="course-stats">
                                <span>{chapters.length} chapters</span>
                                <span>·</span>
                                <span>{totalLessons} lessons</span>
                            </div>
                        </div>

                        {/* Enroll card */}
                        <div className="enroll-card">
                            {course.thumbnailUrl && (
                                <div
                                    className="card-thumb"
                                    style={{ background: `url(${course.thumbnailUrl}) center/cover` }}
                                />
                            )}
                            <div className="card-body">
                                <div className="card-price">{formatPrice(course.price)}</div>

                                {isEnrolled ? (
                                    <Link href={`/learn/${courseId}`} className="btn btn-primary enroll-btn">
                                        Continue Learning →
                                    </Link>
                                ) : (
                                    <button
                                        className="btn btn-primary enroll-btn"
                                        onClick={handleEnrollClick}
                                        disabled={enrollMutation.isPending || payMutation.isPending}
                                    >
                                        {enrollMutation.isPending || payMutation.isPending
                                            ? "Processing..."
                                            : isFree ? "Enroll for Free" : `Buy Now — ${formatPrice(course.price)}`}
                                    </button>
                                )}

                                {!isFree && !isEnrolled && (
                                    <p className="card-hint">Secure payment via VNPay</p>
                                )}
                                {isFree && (
                                    <p className="card-hint">Free · No credit card required</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Curriculum */}
                <div className="container curriculum">
                    <h2 className="section-heading">Course Curriculum</h2>
                    {loadingChapters ? (
                        <p>Loading...</p>
                    ) : chapters.length === 0 ? (
                        <p className="empty">No content yet.</p>
                    ) : (
                        <div className="chapters">
                            {chapters.map((chapter) => (
                                <div key={chapter.id} className="chapter">
                                    <div className="chapter-header">
                                        <span className="chapter-index">{chapter.orderIndex + 1}</span>
                                        <h3 className="chapter-title">{chapter.title}</h3>
                                        {chapter.lessons && (
                                            <span className="chapter-count">{chapter.lessons.length} lessons</span>
                                        )}
                                    </div>
                                    {chapter.lessons && chapter.lessons.length > 0 && (
                                        <ul className="lessons">
                                            {chapter.lessons.map((lesson) => (
                                                <li key={lesson.id} className="lesson-item">
                                                    <span className="lesson-icon">
                                                        {lesson.isPreview ? "▶" : isEnrolled ? "▶" : "🔒"}
                                                    </span>
                                                    <span className="lesson-title">{lesson.title}</span>
                                                    {lesson.isPreview && !isEnrolled && (
                                                        <span className="preview-tag">Preview</span>
                                                    )}
                                                    {lesson.duration > 0 && (
                                                        <span className="lesson-duration">{formatDuration(lesson.duration)}</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .loading-page { padding: 4rem; text-align: center; color: var(--text-secondary); }
                .course-hero {
                    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
                    padding: 4rem 0;
                }
                .hero-inner {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 3rem;
                    align-items: start;
                }
                .hero-text { color: white; }
                .course-title { font-size: 2rem; color: white; margin-bottom: 1rem; line-height: 1.3; }
                .course-desc { color: #cbd5e1; font-size: 1rem; margin-bottom: 1rem; line-height: 1.6; }
                .course-stats { display: flex; gap: 0.5rem; color: #94a3b8; font-size: 0.875rem; }

                /* Enroll card */
                .enroll-card {
                    background: white; border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }
                .card-thumb { height: 180px; }
                .card-body { padding: 1.5rem; }
                .card-price { font-size: 1.75rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-primary); }
                .enroll-btn { width: 100%; padding: 0.875rem; font-size: 1rem; }
                .enroll-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
                .card-hint { font-size: 0.8rem; color: var(--text-secondary); text-align: center; margin-top: 0.75rem; }

                /* Curriculum */
                .curriculum { padding: 3rem 0 6rem; }
                .section-heading { font-size: 1.5rem; margin-bottom: 1.5rem; }
                .empty { color: var(--text-secondary); }
                .chapters { display: flex; flex-direction: column; gap: 0.75rem; }
                .chapter { border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
                .chapter-header {
                    display: flex; align-items: center; gap: 0.75rem;
                    padding: 1rem 1.25rem; background: #f9fafb;
                    border-bottom: 1px solid #e5e7eb;
                }
                .chapter-index {
                    width: 26px; height: 26px; background: var(--primary); color: white;
                    border-radius: 50%; display: flex; align-items: center;
                    justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
                }
                .chapter-title { font-size: 0.95rem; font-weight: 600; flex: 1; }
                .chapter-count { font-size: 0.78rem; color: var(--text-secondary); }
                .lessons { list-style: none; }
                .lesson-item {
                    display: flex; align-items: center; gap: 0.75rem;
                    padding: 0.7rem 1.25rem; border-bottom: 1px solid #f3f4f6;
                    font-size: 0.875rem;
                }
                .lesson-item:last-child { border-bottom: none; }
                .lesson-icon { font-size: 0.75rem; color: var(--text-secondary); }
                .lesson-title { flex: 1; }
                .preview-tag {
                    font-size: 0.7rem; background: #dbeafe; color: #1d4ed8;
                    padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 600;
                }
                .lesson-duration { font-size: 0.78rem; color: var(--text-secondary); }

                @media (max-width: 768px) {
                    .hero-inner { grid-template-columns: 1fr; }
                    .enroll-card { margin-top: 1.5rem; }
                }
            `}</style>
        </>
    );
}
