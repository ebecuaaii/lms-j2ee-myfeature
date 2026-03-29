"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { examManageService } from "@/services/examManageService";
import type { ExamResponse } from "@/types";

export default function ExamListPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const queryClient = useQueryClient();

    const { data: exams = [], isLoading } = useQuery<ExamResponse[]>({
        queryKey: ["instructor-exams", courseId],
        queryFn: () => examManageService.getByCourse(courseId),
    });

    const publishMutation = useMutation({
        mutationFn: (examId: string) => examManageService.publish(examId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instructor-exams", courseId] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (examId: string) => examManageService.delete(examId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instructor-exams", courseId] }),
    });

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <Link href={`/instructor/courses/${courseId}`} className="back-link">← Back to Course</Link>
                            <h1>Exam Management</h1>
                        </div>
                        <Link href={`/instructor/courses/${courseId}/exams/new`} className="btn btn-primary">
                            + New Exam
                        </Link>
                    </div>

                    {isLoading ? (
                        <p className="loading-text">Loading...</p>
                    ) : exams.length === 0 ? (
                        <div className="empty-state">
                            <p>No exams yet.</p>
                            <Link href={`/instructor/courses/${courseId}/exams/new`} className="btn btn-primary" style={{ marginTop: "1rem" }}>
                                Create first exam
                            </Link>
                        </div>
                    ) : (
                        <div className="exam-list">
                            {exams.map((exam) => (
                                <ExamRow
                                    key={exam.id}
                                    exam={exam}
                                    courseId={courseId}
                                    onPublish={() => publishMutation.mutate(exam.id)}
                                    onDelete={() => {
                                        if (confirm(`Delete "${exam.title}"?`)) deleteMutation.mutate(exam.id);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .page { padding: 2.5rem 0 6rem; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .back-link { font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem; }
                .back-link:hover { color: var(--primary); }
                .page-header h1 { font-size: 1.75rem; }
                .loading-text { color: var(--text-secondary); }
                .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
                .exam-list { display: flex; flex-direction: column; gap: 0.75rem; }
            `}</style>
        </>
    );
}

function ExamRow({ exam, courseId, onPublish, onDelete }: {
    exam: ExamResponse;
    courseId: string;
    onPublish: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="exam-row">
            <div className="exam-info">
                <div className="exam-name">{exam.title}</div>
                <div className="exam-meta">
                    {exam.totalQuestions} questions · {exam.duration} min · Pass: {exam.passingScore}%
                </div>
            </div>
            <div className="exam-actions">
                <span className={`status-badge ${exam.isPublished ? "published" : "draft"}`}>
                    {exam.isPublished ? "Published" : "Draft"}
                </span>
                <Link href={`/instructor/courses/${courseId}/exams/${exam.id}`} className="btn btn-secondary small-btn">
                    Edit
                </Link>
                <Link href={`/instructor/courses/${courseId}/exams/${exam.id}/submissions`} className="btn btn-secondary small-btn">
                    Results
                </Link>
                {!exam.isPublished && (
                    <button className="btn btn-primary small-btn" onClick={onPublish}>Publish</button>
                )}
                <button className="delete-btn" onClick={onDelete}>✕</button>
            </div>

            <style jsx>{`
                .exam-row {
                    display: flex; justify-content: space-between; align-items: center;
                    background: white; border: 1px solid #e5e7eb; border-radius: 10px;
                    padding: 1rem 1.25rem; gap: 1rem;
                }
                .exam-info { min-width: 0; }
                .exam-name { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem; }
                .exam-meta { font-size: 0.8rem; color: var(--text-secondary); }
                .exam-actions { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
                .status-badge { padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
                .published { background: #dcfce7; color: #16a34a; }
                .draft { background: #fef9c3; color: #ca8a04; }
                .small-btn { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
                .delete-btn { color: #dc2626; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
                .delete-btn:hover { background: #fef2f2; }
            `}</style>
        </div>
    );
}
