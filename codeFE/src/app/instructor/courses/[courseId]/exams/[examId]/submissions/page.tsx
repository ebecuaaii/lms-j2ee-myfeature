"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { examManageService } from "@/services/examManageService";

export default function SubmissionsPage() {
    const { courseId, examId } = useParams<{ courseId: string; examId: string }>();

    const { data: exam } = useQuery({
        queryKey: ["instructor-exam", examId],
        queryFn: () => examManageService.getById(examId),
    });

    const { data: submissions = [], isLoading } = useQuery({
        queryKey: ["submissions", examId],
        queryFn: () => examManageService.getSubmissions(examId),
    });

    const passCount = submissions.filter((s) => s.isPassed).length;
    const avgScore = submissions.length
        ? (submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length).toFixed(1)
        : "—";

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <Link href={`/instructor/courses/${courseId}/exams`} className="back-link">← Back to Exams</Link>
                            <h1>{exam?.title ?? "Submissions"}</h1>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-val">{submissions.length}</div>
                            <div className="stat-lbl">Total Submissions</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val">{passCount}</div>
                            <div className="stat-lbl">Passed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val">
                                {submissions.length ? `${((passCount / submissions.length) * 100).toFixed(0)}%` : "—"}
                            </div>
                            <div className="stat-lbl">Pass Rate</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-val">{avgScore}</div>
                            <div className="stat-lbl">Avg Score</div>
                        </div>
                    </div>

                    {isLoading ? (
                        <p className="loading-text">Loading...</p>
                    ) : submissions.length === 0 ? (
                        <div className="empty-state">No submissions yet.</div>
                    ) : (
                        <div className="table-wrap">
                            <table className="sub-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student ID</th>
                                        <th>Score</th>
                                        <th>Correct</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((s, idx) => (
                                        <tr key={s.submissionId}>
                                            <td>{idx + 1}</td>
                                            <td className="student-id">{s.submissionId.slice(0, 8)}...</td>
                                            <td className="score-cell">{s.score.toFixed(1)}</td>
                                            <td>{s.correctCount}/{s.totalQuestions}</td>
                                            <td>
                                                <span className={`status-badge ${s.isPassed ? "passed" : "failed"}`}>
                                                    {s.isPassed ? "Passed" : "Failed"}
                                                </span>
                                            </td>
                                            <td className="date-cell">
                                                {new Date(s.submittedAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .page { padding: 2.5rem 0 6rem; }
                .page-header { margin-bottom: 1.5rem; }
                .back-link { font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem; }
                .back-link:hover { color: var(--primary); }
                .page-header h1 { font-size: 1.75rem; }
                .stats-row {
                    display: grid; grid-template-columns: repeat(4, 1fr);
                    gap: 1rem; margin-bottom: 2rem;
                }
                .stat-card {
                    background: white; border: 1px solid #e5e7eb;
                    border-radius: 12px; padding: 1.25rem; text-align: center;
                }
                .stat-val { font-size: 1.75rem; font-weight: 800; color: var(--primary); }
                .stat-lbl { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem; }
                .loading-text { color: var(--text-secondary); }
                .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
                .table-wrap { overflow-x: auto; }
                .sub-table {
                    width: 100%; border-collapse: collapse;
                    background: white; border-radius: 12px; overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .sub-table th {
                    background: #f9fafb; padding: 0.75rem 1rem;
                    text-align: left; font-size: 0.8rem; font-weight: 700;
                    color: var(--text-secondary); border-bottom: 1px solid #e5e7eb;
                }
                .sub-table td {
                    padding: 0.875rem 1rem; font-size: 0.875rem;
                    border-bottom: 1px solid #f3f4f6;
                }
                .sub-table tr:last-child td { border-bottom: none; }
                .student-id { font-family: monospace; color: var(--text-secondary); }
                .score-cell { font-weight: 700; }
                .date-cell { color: var(--text-secondary); }
                .status-badge {
                    padding: 0.2rem 0.6rem; border-radius: 20px;
                    font-size: 0.75rem; font-weight: 600;
                }
                .passed { background: #dcfce7; color: #16a34a; }
                .failed { background: #fee2e2; color: #dc2626; }
            `}</style>
        </>
    );
}
