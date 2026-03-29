"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { examService } from "@/services/examService";

export default function ExamResultPage() {
    const { examId } = useParams<{ examId: string }>();

    const { data: result, isLoading } = useQuery({
        queryKey: ["exam-result", examId],
        queryFn: () => examService.getMyResult(examId),
    });

    if (isLoading) return <><Navbar /><div className="loading-page">Loading result...</div></>;
    if (!result) return <><Navbar /><div className="loading-page">Result not found.</div></>;

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container result-container">
                    {/* Score card */}
                    <div className={`score-card ${result.isPassed ? "passed" : "failed"}`}>
                        <div className="score-circle">
                            <span className="score-value">{result.score.toFixed(1)}</span>
                            <span className="score-label">/ 100</span>
                        </div>
                        <div className="score-status">
                            {result.isPassed ? "🎉 Passed!" : "❌ Not Passed"}
                        </div>
                        <div className="score-stats">
                            <div className="stat">
                                <div className="stat-val">{result.correctCount}</div>
                                <div className="stat-lbl">Correct</div>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <div className="stat-val">{result.totalQuestions - result.correctCount}</div>
                                <div className="stat-lbl">Wrong</div>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat">
                                <div className="stat-val">{result.totalQuestions}</div>
                                <div className="stat-lbl">Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Review */}
                    {result.gradingDetails && result.gradingDetails.length > 0 && (
                        <div className="review-section">
                            <h2>Review Answers</h2>
                            <div className="review-list">
                                {result.gradingDetails.map((detail, idx) => (
                                    <div key={detail.questionId} className={`review-item ${detail.isCorrect ? "correct" : "wrong"}`}>
                                        <div className="review-header">
                                            <span className="review-num">Q{idx + 1}</span>
                                            <span className={`review-badge ${detail.isCorrect ? "correct" : "wrong"}`}>
                                                {detail.isCorrect ? "✓ Correct" : "✗ Wrong"}
                                            </span>
                                        </div>
                                        <div className="review-answers">
                                            <div className="answer-row">
                                                <span className="answer-label">Your answer:</span>
                                                <span className={`answer-val ${detail.isCorrect ? "green" : "red"}`}>
                                                    {detail.selectedOptions.length > 0 ? detail.selectedOptions.join(", ") : "No answer"}
                                                </span>
                                            </div>
                                            {!detail.isCorrect && (
                                                <div className="answer-row">
                                                    <span className="answer-label">Correct answer:</span>
                                                    <span className="answer-val green">{detail.correctAnswers.join(", ")}</span>
                                                </div>
                                            )}
                                            {detail.explanation && (
                                                <div className="explanation">💡 {detail.explanation}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="result-actions">
                        <Link href="/courses" className="btn btn-secondary">Back to Courses</Link>
                    </div>
                </div>
            </main>

            <style jsx>{`
        .loading-page { padding: 4rem; text-align: center; color: var(--text-secondary); }
        .page { padding: 3rem 0 6rem; }
        .result-container { max-width: 720px; }
        .score-card {
          border-radius: 16px; padding: 2.5rem;
          text-align: center; margin-bottom: 2rem;
          border: 2px solid;
        }
        .score-card.passed { background: #f0fdf4; border-color: #86efac; }
        .score-card.failed { background: #fef2f2; border-color: #fca5a5; }
        .score-circle {
          display: inline-flex; align-items: baseline; gap: 0.25rem;
          margin-bottom: 0.75rem;
        }
        .score-value { font-size: 4rem; font-weight: 800; line-height: 1; }
        .score-card.passed .score-value { color: #16a34a; }
        .score-card.failed .score-value { color: #dc2626; }
        .score-label { font-size: 1.5rem; color: var(--text-secondary); }
        .score-status { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
        .score-stats {
          display: flex; justify-content: center; align-items: center;
          gap: 2rem;
        }
        .stat { text-align: center; }
        .stat-val { font-size: 1.5rem; font-weight: 800; }
        .stat-lbl { font-size: 0.8rem; color: var(--text-secondary); }
        .stat-divider { width: 1px; height: 40px; background: #e5e7eb; }
        .review-section { margin-bottom: 2rem; }
        .review-section h2 { font-size: 1.25rem; margin-bottom: 1rem; }
        .review-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .review-item {
          border-radius: 10px; padding: 1.25rem;
          border: 1px solid;
        }
        .review-item.correct { background: #f0fdf4; border-color: #bbf7d0; }
        .review-item.wrong { background: #fef2f2; border-color: #fecaca; }
        .review-header {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
        }
        .review-num {
          background: #f3f4f6; padding: 0.2rem 0.5rem;
          border-radius: 4px; font-size: 0.8rem; font-weight: 700;
        }
        .review-badge {
          font-size: 0.8rem; font-weight: 700;
          padding: 0.2rem 0.6rem; border-radius: 4px;
        }
        .review-badge.correct { background: #dcfce7; color: #16a34a; }
        .review-badge.wrong { background: #fee2e2; color: #dc2626; }
        .review-answers { display: flex; flex-direction: column; gap: 0.4rem; }
        .answer-row { display: flex; gap: 0.5rem; font-size: 0.875rem; }
        .answer-label { color: var(--text-secondary); flex-shrink: 0; }
        .answer-val { font-weight: 600; }
        .answer-val.green { color: #16a34a; }
        .answer-val.red { color: #dc2626; }
        .explanation {
          margin-top: 0.5rem; font-size: 0.875rem;
          color: #92400e; background: #fef3c7;
          padding: 0.5rem 0.75rem; border-radius: 6px;
        }
        .result-actions { display: flex; justify-content: center; gap: 1rem; }
      `}</style>
        </>
    );
}
