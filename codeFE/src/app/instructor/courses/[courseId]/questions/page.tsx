"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { questionService } from "@/services/questionService";
import type { QuestionResponse } from "@/types";

const optionSchema = z.object({ key: z.string(), content: z.string().min(1, "Required") });

const schema = z.object({
    content: z.string().min(1, "Question content is required"),
    type: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]),
    options: z.array(optionSchema).min(2, "At least 2 options"),
    correctAnswers: z.array(z.string()).min(1, "Select at least one correct answer"),
    explanation: z.string().optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    topic: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const DEFAULT_OPTIONS = [
    { key: "A", content: "" },
    { key: "B", content: "" },
    { key: "C", content: "" },
    { key: "D", content: "" },
];

export default function QuestionBankPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);

    const { data: questions = [], isLoading } = useQuery<QuestionResponse[]>({
        queryKey: ["questions", courseId],
        queryFn: () => questionService.getByCourse(courseId),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => questionService.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questions", courseId] }),
    });

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: "SINGLE_CHOICE",
            difficulty: "MEDIUM",
            options: DEFAULT_OPTIONS,
            correctAnswers: [],
        },
    });

    const { fields } = useFieldArray({ control, name: "options" });
    const watchType = watch("type");
    const watchCorrect = watch("correctAnswers");

    const addMutation = useMutation({
        mutationFn: (data: FormData) =>
            questionService.create(courseId, {
                content: data.content,
                type: data.type,
                options: data.options,
                correctAnswers: data.correctAnswers,
                explanation: data.explanation,
                difficulty: data.difficulty,
                topic: data.topic,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["questions", courseId] });
            reset({ type: "SINGLE_CHOICE", difficulty: "MEDIUM", options: DEFAULT_OPTIONS, correctAnswers: [] });
            setShowForm(false);
        },
    });

    const toggleCorrect = (key: string) => {
        if (watchType === "SINGLE_CHOICE") {
            setValue("correctAnswers", [key]);
        } else {
            const current = watchCorrect ?? [];
            setValue("correctAnswers",
                current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
            );
        }
    };

    const diffColor = (d: string) => d === "EASY" ? "#16a34a" : d === "MEDIUM" ? "#ca8a04" : "#dc2626";

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <Link href={`/instructor/courses/${courseId}`} className="back-link">← Back to Course</Link>
                            <h1>Question Bank</h1>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Cancel" : "+ Add Question"}
                        </button>
                    </div>

                    {/* Add question form */}
                    {showForm && (
                        <div className="form-card">
                            <h2 className="card-title">New Question</h2>
                            <form onSubmit={handleSubmit((d) => addMutation.mutate(d))} className="q-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Type</label>
                                        <select {...register("type")}>
                                            <option value="SINGLE_CHOICE">Single Choice</option>
                                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Difficulty</label>
                                        <select {...register("difficulty")}>
                                            <option value="EASY">Easy</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HARD">Hard</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Topic</label>
                                        <input type="text" placeholder="e.g. Arrays" {...register("topic")} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Question *</label>
                                    <textarea rows={2} placeholder="Enter question content..." {...register("content")} />
                                    {errors.content && <span className="field-error">{errors.content.message}</span>}
                                </div>

                                <div className="options-section">
                                    <label className="options-label">
                                        Options — click to mark correct answer{watchType === "MULTIPLE_CHOICE" ? "s" : ""}
                                    </label>
                                    {fields.map((field, idx) => {
                                        const key = field.key as string;
                                        const optKey = DEFAULT_OPTIONS[idx]?.key ?? String.fromCharCode(65 + idx);
                                        const isCorrect = (watchCorrect ?? []).includes(optKey);
                                        return (
                                            <div key={field.id} className={`opt-row ${isCorrect ? "correct" : ""}`}>
                                                <button
                                                    type="button"
                                                    className={`opt-key-btn ${isCorrect ? "correct" : ""}`}
                                                    onClick={() => toggleCorrect(optKey)}
                                                    title="Click to mark as correct"
                                                >
                                                    {optKey}
                                                </button>
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${optKey}`}
                                                    {...register(`options.${idx}.content`)}
                                                    className="opt-input"
                                                />
                                                {isCorrect && <span className="correct-mark">✓</span>}
                                            </div>
                                        );
                                    })}
                                    {errors.correctAnswers && (
                                        <span className="field-error">{errors.correctAnswers.message}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Explanation (optional)</label>
                                    <textarea rows={2} placeholder="Explain the correct answer..." {...register("explanation")} />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={addMutation.isPending}>
                                        {addMutation.isPending ? "Adding..." : "Add Question"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Question list */}
                    <div className="q-stats">
                        <span>{questions.length} question{questions.length !== 1 ? "s" : ""} in bank</span>
                    </div>

                    {isLoading ? (
                        <p className="loading-text">Loading...</p>
                    ) : questions.length === 0 ? (
                        <div className="empty-state">No questions yet. Add your first question above.</div>
                    ) : (
                        <div className="q-list">
                            {questions.map((q, idx) => (
                                <div key={q.id} className="q-item">
                                    <div className="q-item-header">
                                        <span className="q-idx">Q{idx + 1}</span>
                                        <span className="q-type-tag">{q.type === "MULTIPLE_CHOICE" ? "Multiple" : "Single"}</span>
                                        <span className="q-diff-tag" style={{ color: diffColor(q.difficulty) }}>{q.difficulty}</span>
                                        {q.topic && <span className="q-topic-tag">{q.topic}</span>}
                                        <button
                                            className="delete-btn"
                                            onClick={() => { if (confirm("Delete this question?")) deleteMutation.mutate(q.id); }}
                                        >✕</button>
                                    </div>
                                    <p className="q-content">{q.content}</p>
                                    <div className="q-options">
                                        {q.options.map((opt) => (
                                            <span
                                                key={opt.key}
                                                className={`q-opt ${q.correctAnswers.includes(opt.key) ? "correct" : ""}`}
                                            >
                                                <strong>{opt.key}.</strong> {opt.content}
                                                {q.correctAnswers.includes(opt.key) && " ✓"}
                                            </span>
                                        ))}
                                    </div>
                                    {q.explanation && (
                                        <p className="q-explanation">💡 {q.explanation}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                .page { padding: 2.5rem 0 6rem; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
                .back-link { font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem; }
                .back-link:hover { color: var(--primary); }
                .page-header h1 { font-size: 1.75rem; }
                .form-card {
                    background: white; border: 1px solid #e5e7eb; border-radius: 12px;
                    padding: 1.5rem; margin-bottom: 1.5rem;
                }
                .card-title { font-size: 1rem; font-weight: 700; margin-bottom: 1rem; }
                .q-form { display: flex; flex-direction: column; gap: 1rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
                .form-group label { font-size: 0.8rem; font-weight: 600; }
                .form-group input, .form-group textarea, .form-group select {
                    padding: 0.65rem 0.9rem; border: 1.5px solid #e5e7eb;
                    border-radius: 8px; font-size: 0.875rem; font-family: inherit; outline: none;
                }
                .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
                    border-color: var(--primary);
                }
                .form-group textarea { resize: vertical; }
                .field-error { font-size: 0.78rem; color: #dc2626; }
                .options-section { display: flex; flex-direction: column; gap: 0.5rem; }
                .options-label { font-size: 0.8rem; font-weight: 600; }
                .opt-row {
                    display: flex; align-items: center; gap: 0.6rem;
                    padding: 0.4rem 0.6rem; border-radius: 8px;
                    border: 1.5px solid #e5e7eb; transition: border-color 0.15s;
                }
                .opt-row.correct { border-color: #86efac; background: #f0fdf4; }
                .opt-key-btn {
                    width: 28px; height: 28px; border-radius: 50%;
                    background: #f3f4f6; font-size: 0.8rem; font-weight: 700;
                    flex-shrink: 0; cursor: pointer; transition: all 0.15s;
                    display: flex; align-items: center; justify-content: center;
                }
                .opt-key-btn.correct { background: #16a34a; color: white; }
                .opt-input {
                    flex: 1; border: none !important; padding: 0.3rem 0 !important;
                    font-size: 0.875rem; background: transparent; outline: none;
                }
                .correct-mark { color: #16a34a; font-weight: 700; font-size: 0.875rem; }
                .form-actions { display: flex; justify-content: flex-end; }
                .q-stats { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem; }
                .loading-text { color: var(--text-secondary); }
                .empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); }
                .q-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .q-item {
                    background: white; border: 1px solid #e5e7eb;
                    border-radius: 10px; padding: 1.25rem;
                }
                .q-item-header {
                    display: flex; align-items: center; gap: 0.5rem;
                    margin-bottom: 0.75rem; flex-wrap: wrap;
                }
                .q-idx {
                    background: var(--primary); color: white;
                    padding: 0.15rem 0.5rem; border-radius: 4px;
                    font-size: 0.75rem; font-weight: 700;
                }
                .q-type-tag, .q-topic-tag {
                    font-size: 0.72rem; padding: 0.15rem 0.45rem;
                    border-radius: 4px; background: #f3f4f6; color: var(--text-secondary); font-weight: 600;
                }
                .q-diff-tag { font-size: 0.72rem; font-weight: 700; }
                .delete-btn {
                    margin-left: auto; color: #dc2626; padding: 0.2rem 0.4rem;
                    border-radius: 4px; font-size: 0.875rem;
                }
                .delete-btn:hover { background: #fef2f2; }
                .q-content { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; line-height: 1.4; }
                .q-options { display: flex; flex-direction: column; gap: 0.3rem; }
                .q-opt {
                    font-size: 0.825rem; color: var(--text-secondary);
                    padding: 0.3rem 0.6rem; border-radius: 4px;
                }
                .q-opt.correct { background: #f0fdf4; color: #16a34a; font-weight: 600; }
                .q-explanation {
                    margin-top: 0.75rem; font-size: 0.8rem; color: #92400e;
                    background: #fef9c3; padding: 0.5rem 0.75rem; border-radius: 6px;
                }
            `}</style>
        </>
    );
}
