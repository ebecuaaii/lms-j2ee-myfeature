"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { lessonService } from "@/services/courseService";
import { formatDuration } from "@/lib/utils";
import type { LessonResponse } from "@/types";

const lessonSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    duration: z.coerce.number().min(0),
    isPreview: z.boolean(),
});

type LessonForm = z.infer<typeof lessonSchema>;

export default function ManageLessonsPage() {
    const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);

    const { data: lessons = [], isLoading } = useQuery<LessonResponse[]>({
        queryKey: ["lessons", chapterId],
        queryFn: () => lessonService.getByChapter(chapterId),
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<LessonForm>({
        resolver: zodResolver(lessonSchema),
        defaultValues: { duration: 0, isPreview: false },
    });

    const addLesson = useMutation({
        mutationFn: (data: LessonForm) =>
            lessonService.create(chapterId, {
                title: data.title,
                description: data.description,
                videoUrl: data.videoUrl || undefined,
                documentUrl: undefined,
                duration: data.duration,
                orderIndex: lessons.length,
                isPreview: data.isPreview,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] });
            reset();
            setShowForm(false);
        },
    });

    const deleteLesson = useMutation({
        mutationFn: (lessonId: string) => lessonService.delete(chapterId, lessonId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lessons", chapterId] }),
    });

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container">
                    <div className="page-header">
                        <Link href={`/instructor/courses/${courseId}`} className="back-link">
                            ← Back to Course
                        </Link>
                        <h1>Manage Lessons</h1>
                    </div>

                    <div className="section-header">
                        <h2>Lessons ({lessons.length})</h2>
                        <button className="btn btn-secondary add-btn" onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Cancel" : "+ Add Lesson"}
                        </button>
                    </div>

                    {/* Add lesson form */}
                    {showForm && (
                        <div className="lesson-form-card">
                            <h3>New Lesson</h3>
                            <form onSubmit={handleSubmit((d) => addLesson.mutate(d))} className="lesson-form">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input type="text" placeholder="Lesson title" {...register("title")} />
                                    {errors.title && <span className="field-error">{errors.title.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea rows={2} placeholder="Optional description" {...register("description")} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Video URL</label>
                                        <input type="text" placeholder="https://..." {...register("videoUrl")} />
                                        {errors.videoUrl && <span className="field-error">{errors.videoUrl.message}</span>}
                                    </div>
                                    <div className="form-group">
                                        <label>Duration (seconds)</label>
                                        <input type="number" min="0" {...register("duration")} />
                                    </div>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" id="isPreview" {...register("isPreview")} />
                                    <label htmlFor="isPreview">Free preview</label>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary" disabled={addLesson.isPending}>
                                        {addLesson.isPending ? "Adding..." : "Add Lesson"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lessons list */}
                    {isLoading ? (
                        <p className="loading-text">Loading...</p>
                    ) : lessons.length === 0 ? (
                        <div className="empty-state">No lessons yet.</div>
                    ) : (
                        <div className="lessons-list">
                            {lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="lesson-row">
                                    <div className="lesson-left">
                                        <span className="lesson-num">{idx + 1}</span>
                                        <div>
                                            <div className="lesson-title">{lesson.title}</div>
                                            {lesson.duration > 0 && (
                                                <div className="lesson-meta">{formatDuration(lesson.duration)}</div>
                                            )}
                                        </div>
                                        {lesson.isPreview && <span className="preview-badge">Preview</span>}
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteLesson.mutate(lesson.id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
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
        .section-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 1rem;
        }
        .section-header h2 { font-size: 1.1rem; }
        .add-btn { padding: 0.5rem 1rem; font-size: 0.875rem; }
        .lesson-form-card {
          background: white; border: 1px solid #e5e7eb;
          border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;
        }
        .lesson-form-card h3 { font-size: 1rem; margin-bottom: 1rem; }
        .lesson-form { display: flex; flex-direction: column; gap: 1rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.35rem; }
        .form-group label { font-size: 0.8rem; font-weight: 600; }
        .form-group input, .form-group textarea {
          padding: 0.65rem 0.9rem; border: 1.5px solid #e5e7eb;
          border-radius: 8px; font-size: 0.9rem; font-family: inherit; outline: none;
        }
        .form-group input:focus, .form-group textarea:focus { border-color: var(--primary); }
        .form-group textarea { resize: vertical; }
        .form-check { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
        .field-error { font-size: 0.78rem; color: #dc2626; }
        .form-actions { display: flex; justify-content: flex-end; }
        .loading-text { color: var(--text-secondary); }
        .empty-state { color: var(--text-secondary); padding: 2rem; text-align: center; }
        .lessons-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .lesson-row {
          display: flex; justify-content: space-between; align-items: center;
          background: white; border: 1px solid #e5e7eb; border-radius: 8px;
          padding: 0.875rem 1.25rem;
        }
        .lesson-left { display: flex; align-items: center; gap: 0.75rem; }
        .lesson-num {
          width: 24px; height: 24px; background: #f3f4f6;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 0.75rem; font-weight: 700;
          flex-shrink: 0;
        }
        .lesson-title { font-size: 0.9rem; font-weight: 600; }
        .lesson-meta { font-size: 0.78rem; color: var(--text-secondary); }
        .preview-badge {
          background: #dbeafe; color: #1d4ed8;
          padding: 0.2rem 0.5rem; border-radius: 4px;
          font-size: 0.72rem; font-weight: 600;
        }
        .delete-btn {
          color: #dc2626; font-size: 0.875rem;
          padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;
        }
        .delete-btn:hover { background: #fef2f2; }
      `}</style>
        </>
    );
}
