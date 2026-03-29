"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { examService } from "@/services/examService";
import type { QuestionForExamResponse } from "@/types";

export default function ExamPage() {
    const { examId } = useParams<{ examId: string }>();
    const router = useRouter();

    const { data: exam, isLoading } = useQuery({
        queryKey: ["exam-take", examId],
        queryFn: () => examService.getForStudent(examId),
    });

    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const autoSubmitRef = useRef(false);

    // init timer once exam loads
    useEffect(() => {
        if (exam && timeLeft === null) {
            setTimeLeft(exam.duration * 60);
        }
    }, [exam, timeLeft]);

    const submitMutation = useMutation({
        mutationFn: () =>
            examService.submit(
                examId,
                Object.entries(answers).map(([questionId, selectedOptions]) => ({
                    questionId,
                    selectedOptions,
                }))
            ),
        onSuccess: () => {
            setSubmitted(true);
            router.push(`/exams/${examId}/result`);
        },
    });

    // countdown + auto-submit when time runs out
    useEffect(() => {
        if (timeLeft === null || submitted) return;
        if (timeLeft <= 0 && !autoSubmitRef.current) {
            autoSubmitRef.current = true;
            submitMutation.mutate();
            return;
        }
        const t = setTimeout(() => setTimeLeft((s) => (s ?? 1) - 1), 1000);
        return () => clearTimeout(t);
    }, [timeLeft, submitted]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSelect = useCallback(
        (questionId: string, optionKey: string, type: string) => {
            setAnswers((prev) => {
                const current = prev[questionId] ?? [];
                if (type === "SINGLE_CHOICE") {
                    return { ...prev, [questionId]: [optionKey] };
                }
                const next = current.includes(optionKey)
                    ? current.filter((k) => k !== optionKey)
                    : [...current, optionKey];
                return { ...prev, [questionId]: next };
            });
        },
        []
    );

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const answeredCount = Object.keys(answers).length;
    const totalQ = exam?.questions.length ?? 0;
    const unanswered = totalQ - answeredCount;

    if (isLoading) return <><Navbar /><div className="loading-page">Loading exam...</div></>;
    if (!exam) return <><Navbar /><div className="loading-page">Exam not found.</div></>;

    return (
        <>
            <Navbar />

            {/* Confirm submit dialog */}
            {showConfirm && (
                <div className="overlay">
                    <div className="confirm-dialog">
                        <h3>Submit Exam?</h3>
                        {unanswered > 0 ? (
                            <p className="warn-text">
                                You have <strong>{unanswered}</strong> unanswered question{unanswered > 1 ? "s" : ""}.
                                Are you sure you want to submit?
                            </p>
                        ) : (
                            <p>All questions answered. Ready to submit?</p>
                        )}
                        <div className="confirm-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowConfirm(false)}
                            >
                                Continue Exam
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => { setShowConfirm(false); submitMutation.mutate(); }}
                                disabled={submitMutation.isPending}
                            >
                                {submitMutation.isPending ? "Submitting..." : "Yes, Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="exam-layout">
                {/* Sticky top bar */}
                <div className="exam-topbar">
                    <div className="exam-title-wrap">
                        <h1 className="exam-title">{exam.title}</h1>
                        {exam.description && (
                            <p className="exam-desc">{exam.description}</p>
                        )}
                    </div>
                    <div className="exam-controls">
                        <div className="answered-badge">
                            {answeredCount}/{totalQ} answered
                        </div>
                        {timeLeft !== null && (
                            <div className={`timer-badge ${timeLeft < 300 ? "danger" : timeLeft < 600 ? "warn" : ""}`}>
                                ⏱ {formatTime(timeLeft)}
                                {timeLeft < 300 && <span className="timer-label"> — Hurry up!</span>}
                            </div>
                        )}
                        <button
                            className="btn btn-primary submit-btn"
                            onClick={() => setShowConfirm(true)}
                            disabled={submitMutation.isPending || submitted}
                        >
                            Submit Exam
                        </button>
                    </div>
                </div>

                {/* Question navigator dots */}
                <div className="q-nav">
                    {exam.questions.map((q, idx) => (
                        <a
                            key={q.id}
                            href={`#q-${idx}`}
                            className={`q-dot ${answers[q.id]?.length ? "answered" : ""}`}
                            title={`Q${idx + 1}`}
                        >
                            {idx + 1}
                        </a>
                    ))}
                </div>

                {/* Questions */}
                <div className="questions-list">
                    {exam.questions.map((q, idx) => (
                        <div key={q.id} id={`q-${idx}`}>
                            <QuestionCard
                                question={q}
                                index={idx}
                                selected={answers[q.id] ?? []}
                                onSelect={(key) => handleSelect(q.id, key, q.type)}
                            />
                        </div>
                    ))}

                    <div className="submit-bottom">
                        <p className="submit-hint">
                            {unanswered > 0
                                ? `${unanswered} question${unanswered > 1 ? "s" : ""} unanswered`
                                : "All questions answered ✓"}
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowConfirm(true)}
                            disabled={submitMutation.isPending || submitted}
                        >
                            Submit Exam
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .loading-page { padding: 4rem; text-align: center; color: var(--text-secondary); }

                /* Overlay */
                .overlay {
                    position: fixed; inset: 0; z-index: 200;
                    background: rgba(0,0,0,0.5);
                    display: flex; align-items: center; justify-content: center;
                    padding: 1rem;
                }
                .confirm-dialog {
                    background: white; border-radius: 16px;
                    padding: 2rem; max-width: 420px; width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                }
                .confirm-dialog h3 { font-size: 1.25rem; margin-bottom: 0.75rem; }
                .confirm-dialog p { color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6; }
                .warn-text strong { color: #dc2626; }
                .confirm-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }

                /* Layout */
                .exam-layout { max-width: 800px; margin: 0 auto; padding: 0 1.5rem 6rem; }

                /* Top bar */
                .exam-topbar {
                    position: sticky; top: 64px; z-index: 10;
                    background: white; border-bottom: 1px solid #e5e7eb;
                    padding: 0.875rem 0;
                    display: flex; justify-content: space-between;
                    align-items: center; gap: 1rem;
                    margin-bottom: 1.25rem;
                }
                .exam-title-wrap { min-width: 0; }
                .exam-title { font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .exam-desc { font-size: 0.78rem; color: var(--text-secondary); margin-top: 0.2rem; }
                .exam-controls { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
                .answered-badge {
                    font-size: 0.8rem; color: var(--text-secondary);
                    background: #f3f4f6; padding: 0.3rem 0.75rem; border-radius: 20px;
                }
                .timer-badge {
                    font-size: 0.95rem; font-weight: 700;
                    background: #f3f4f6; padding: 0.35rem 0.85rem;
                    border-radius: 8px; white-space: nowrap;
                }
                .timer-badge.warn { background: #fef9c3; color: #ca8a04; }
                .timer-badge.danger { background: #fef2f2; color: #dc2626; animation: pulse 1s infinite; }
                .timer-label { font-size: 0.75rem; font-weight: 500; }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
                .submit-btn { padding: 0.45rem 1.1rem; font-size: 0.875rem; }

                /* Question navigator */
                .q-nav {
                    display: flex; flex-wrap: wrap; gap: 0.4rem;
                    margin-bottom: 1.5rem;
                }
                .q-dot {
                    width: 32px; height: 32px; border-radius: 6px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 700;
                    background: #f3f4f6; color: var(--text-secondary);
                    border: 1.5px solid #e5e7eb; transition: all 0.15s;
                    text-decoration: none;
                }
                .q-dot:hover { border-color: var(--primary); color: var(--primary); }
                .q-dot.answered { background: var(--primary); color: white; border-color: var(--primary); }

                /* Questions list */
                .questions-list { display: flex; flex-direction: column; gap: 1.25rem; }
                .submit-bottom {
                    display: flex; flex-direction: column; align-items: center;
                    gap: 0.75rem; padding-top: 1.5rem;
                }
                .submit-hint { font-size: 0.875rem; color: var(--text-secondary); }
            `}</style>
        </>
    );
}

function QuestionCard({
    question, index, selected, onSelect,
}: {
    question: QuestionForExamResponse;
    index: number;
    selected: string[];
    onSelect: (key: string) => void;
}) {
    const isMultiple = question.type === "MULTIPLE_CHOICE";

    return (
        <div className="q-card">
            <div className="q-header">
                <span className="q-num">Q{index + 1}</span>
                <span className="q-type-badge">
                    {isMultiple ? "Multiple choice" : "Single choice"}
                </span>
                {isMultiple && (
                    <span className="q-hint">Select all that apply</span>
                )}
            </div>

            <p className="q-content">{question.content}</p>

            <div className="options">
                {question.options.map((opt) => {
                    const isSelected = selected.includes(opt.key);
                    return (
                        <button
                            key={opt.key}
                            className={`opt-btn ${isSelected ? "selected" : ""}`}
                            onClick={() => onSelect(opt.key)}
                        >
                            <span className={`opt-indicator ${isMultiple ? "checkbox" : "radio"} ${isSelected ? "checked" : ""}`}>
                                {isMultiple
                                    ? (isSelected ? "✓" : "")
                                    : (isSelected ? "●" : "")}
                            </span>
                            <span className="opt-key">{opt.key}</span>
                            <span className="opt-text">{opt.content}</span>
                        </button>
                    );
                })}
            </div>

            <style jsx>{`
                .q-card {
                    background: white; border: 1px solid #e5e7eb;
                    border-radius: 12px; padding: 1.5rem;
                    scroll-margin-top: 140px;
                }
                .q-header {
                    display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem;
                }
                .q-num {
                    background: var(--primary); color: white;
                    padding: 0.2rem 0.55rem; border-radius: 6px;
                    font-size: 0.78rem; font-weight: 700;
                }
                .q-type-badge {
                    font-size: 0.75rem; color: var(--text-secondary);
                    background: #f3f4f6; padding: 0.2rem 0.5rem; border-radius: 4px;
                }
                .q-hint { font-size: 0.72rem; color: #7c3aed; font-style: italic; }
                .q-content {
                    font-size: 1rem; font-weight: 600; line-height: 1.55;
                    margin-bottom: 1.25rem; color: var(--text-primary);
                }
                .options { display: flex; flex-direction: column; gap: 0.5rem; }
                .opt-btn {
                    display: flex; align-items: center; gap: 0.75rem;
                    padding: 0.75rem 1rem; border: 1.5px solid #e5e7eb;
                    border-radius: 8px; text-align: left; width: 100%;
                    transition: all 0.15s; background: white;
                }
                .opt-btn:hover { border-color: #93c5fd; background: #f0f9ff; }
                .opt-btn.selected { border-color: var(--primary); background: #eff6ff; }
                .opt-indicator {
                    width: 22px; height: 22px; flex-shrink: 0;
                    border: 2px solid #d1d5db; display: flex;
                    align-items: center; justify-content: center;
                    font-size: 0.75rem; font-weight: 700; color: white;
                    transition: all 0.15s;
                }
                .opt-indicator.radio { border-radius: 50%; }
                .opt-indicator.checkbox { border-radius: 4px; }
                .opt-indicator.checked { background: var(--primary); border-color: var(--primary); }
                .opt-key {
                    font-size: 0.8rem; font-weight: 700; color: var(--text-secondary);
                    min-width: 20px;
                }
                .opt-btn.selected .opt-key { color: var(--primary); }
                .opt-text { font-size: 0.9rem; line-height: 1.4; }
            `}</style>
        </div>
    );
}
