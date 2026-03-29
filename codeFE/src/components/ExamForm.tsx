"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { questionService } from "@/services/questionService";
import type { ExamResponse, QuestionResponse } from "@/types";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    duration: z.coerce.number().min(1, "At least 1 minute"),
    passingScore: z.coerce.number().min(0).max(100),
    shuffleQuestions: z.boolean(),
    shuffleOptions: z.boolean(),
    showResultAfterSubmit: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ExamFormProps {
    courseId: string;
    initialData?: ExamResponse;
    onSubmit: (data: FormData & { questionIds: string[] }) => Promise<void>;
}

export default function ExamForm({ courseId, initialData, onSubmit }: ExamFormProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>(initialData ? [] : []);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const { data: questions = [] } = useQuery<QuestionResponse[]>({
        queryKey: ["questions", courseId],
        queryFn: () => questionService.getByCourse(courseId),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            duration: 30,
            passingScore: 60,
            shuffleQuestions: false,
            shuffleOptions: false,
            showResultAfterSubmit: true,
        },
    });

    // populate form when editing
    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title,
                description: initialData.description ?? "",
                duration: initialData.duration,
                passingScore: initialData.passingScore,
                shuffleQuestions: initialData.shuffleQuestions,
                shuffleOptions: initialData.shuffleOptions,
                showResultAfterSubmit: initialData.showResultAfterSubmit,
            });
        }
    }, [initialData, reset]);

    const toggleQuestion = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleFormSubmit = async (data: FormData) => {
        setSaving(true);
        setError("");
        try {
            await onSubmit({ ...data, questionIds: selectedIds });
        } catch {
            setError("Failed to save exam.");
        } finally {
            setSaving(false);
        }
    };

    const difficultyColor = (d: string) => {
        if (d === "EASY") return "#16a34a";
        if (d === "MEDIUM") return "#ca8a04";
        return "#dc2626";
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="exam-form">
            {error && <div className="form-error">{error}</div>}

            {/* Basic info */}
            <div className="form-card">
                <h2 className="card-title">Basic Info</h2>

                <div className="form-group">
                    <label>Title *</label>
                    <input type="text" placeholder="e.g. Midterm Exam" {...register("title")} />
                    {errors.title && <span className="field-error">{errors.title.message}</span>}
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea rows={2} placeholder="Optional instructions for students" {...register("description")} />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Duration (minutes) *</label>
                        <input type="number" min="1" {...register("duration")} />
                        {errors.duration && <span className="field-error">{errors.duration.message}</span>}
                    </div>
                    <div className="form-group">
                        <label>Passing Score (%) *</label>
                        <input type="number" min="0" max="100" {...register("passingScore")} />
                        {errors.passingScore && <span className="field-error">{errors.passingScore.message}</span>}
                    </div>
                </div>

                <div className="toggles">
                    <label className="toggle-row">
                        <input type="checkbox" {...register("shuffleQuestions")} />
                        <span>Shuffle question order</span>
                    </label>
                    <label className="toggle-row">
                        <input type="checkbox" {...register("shuffleOptions")} />
                        <span>Shuffle answer options</span>
                    </label>
                    <label className="toggle-row">
                        <input type="checkbox" {...register("showResultAfterSubmit")} />
                        <span>Show result & review after submit</span>
                    </label>
                </div>
            </div>

            {/* Question picker */}
            <div className="form-card">
                <div className="card-header-row">
                    <h2 className="card-title">Questions</h2>
                    <span className="selected-count">{selectedIds.length} selected</span>
                </div>

                {questions.length === 0 ? (
                    <div className="empty-q">
                        No questions in question bank yet.{" "}
                        <a href={`/instructor/courses/${courseId}/questions`}>Add questions first →</a>
                    </div>
                ) : (
                    <div className="question-picker">
                        {questions.map((q) => {
                            const checked = selectedIds.includes(q.id);
                            return (
                                <label key={q.id} className={`q-pick-row ${checked ? "checked" : ""}`}>
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleQuestion(q.id)}
                                    />
                                    <div className="q-pick-info">
                                        <span className="q-pick-content">{q.content}</span>
                                        <div className="q-pick-meta">
                                            <span className="q-type-tag">{q.type === "MULTIPLE_CHOICE" ? "Multiple" : "Single"}</span>
                                            <span className="q-diff-tag" style={{ color: difficultyColor(q.difficulty) }}>
                                                {q.difficulty}
                                            </span>
                                            {q.topic && <span className="q-topic-tag">{q.topic}</span>}
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : initialData ? "Save Changes" : "Create Exam"}
                </button>
            </div>

            <style jsx>{`
                .exam-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .form-error {
                    background: #fef2f2; color: #dc2626; padding: 0.75rem 1rem;
                    border-radius: 8px; font-size: 0.9rem; border: 1px solid #fecaca;
                }
                .form-card {
                    background: white; border: 1px solid #e5e7eb;
                    border-radius: 12px; padding: 1.5rem;
                    display: flex; flex-direction: column; gap: 1.1rem;
                }
                .card-title { font-size: 1rem; font-weight: 700; }
                .card-header-row { display: flex; justify-content: space-between; align-items: center; }
                .selected-count {
                    font-size: 0.8rem; font-weight: 600; color: var(--primary);
                    background: #eff6ff; padding: 0.2rem 0.6rem; border-radius: 20px;
                }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
                .form-group label { font-size: 0.875rem; font-weight: 600; }
                .form-group input, .form-group textarea {
                    padding: 0.7rem 0.9rem; border: 1.5px solid #e5e7eb;
                    border-radius: 8px; font-size: 0.9rem; font-family: inherit; outline: none;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--primary); box-shadow: 0 0 0 3px rgba(19,91,236,0.1);
                }
                .form-group textarea { resize: vertical; }
                .field-error { font-size: 0.78rem; color: #dc2626; }
                .toggles { display: flex; flex-direction: column; gap: 0.6rem; }
                .toggle-row {
                    display: flex; align-items: center; gap: 0.6rem;
                    font-size: 0.875rem; cursor: pointer;
                }
                .toggle-row input { width: 16px; height: 16px; cursor: pointer; }
                .empty-q { font-size: 0.875rem; color: var(--text-secondary); }
                .empty-q a { color: var(--primary); font-weight: 600; }
                .question-picker { display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto; }
                .q-pick-row {
                    display: flex; align-items: flex-start; gap: 0.75rem;
                    padding: 0.75rem 1rem; border: 1.5px solid #e5e7eb;
                    border-radius: 8px; cursor: pointer; transition: all 0.15s;
                }
                .q-pick-row:hover { border-color: #93c5fd; background: #f0f9ff; }
                .q-pick-row.checked { border-color: var(--primary); background: #eff6ff; }
                .q-pick-row input { margin-top: 2px; flex-shrink: 0; }
                .q-pick-info { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
                .q-pick-content { font-size: 0.875rem; font-weight: 500; line-height: 1.4; }
                .q-pick-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }
                .q-type-tag, .q-diff-tag, .q-topic-tag {
                    font-size: 0.72rem; padding: 0.15rem 0.45rem;
                    border-radius: 4px; font-weight: 600;
                }
                .q-type-tag { background: #f3f4f6; color: var(--text-secondary); }
                .q-topic-tag { background: #f3f4f6; color: var(--text-secondary); }
                .form-actions { display: flex; justify-content: flex-end; }
            `}</style>
        </form>
    );
}
