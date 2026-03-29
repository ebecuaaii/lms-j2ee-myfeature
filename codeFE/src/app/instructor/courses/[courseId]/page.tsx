"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { courseService, chapterService } from "@/services/courseService";
import type { ChapterResponse } from "@/types";

export default function ManageCoursePage() {
    const { courseId } = useParams<{ courseId: string }>();
    const queryClient = useQueryClient();
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [chapterTitle, setChapterTitle] = useState("");
    const [publishing, setPublishing] = useState(false);

    const { data: course } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => courseService.getById(courseId),
    });

    const { data: chapters = [], isLoading } = useQuery<ChapterResponse[]>({
        queryKey: ["chapters", courseId],
        queryFn: () => chapterService.getByCourse(courseId),
    });

    const addChapter = useMutation({
        mutationFn: () =>
            chapterService.create(courseId, {
                title: chapterTitle,
                orderIndex: chapters.length,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chapters", courseId] });
            setChapterTitle("");
            setShowChapterForm(false);
        },
    });

    const deleteChapter = useMutation({
        mutationFn: (chapterId: string) => chapterService.delete(courseId, chapterId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chapters", courseId] }),
    });

    const handlePublish = async () => {
        setPublishing(true);
        try {
            await courseService.publish(courseId);
            queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        } finally {
            setPublishing(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <Link href="/instructor" className="back-link">← Dashboard</Link>
                            <h1>{course?.title ?? "Loading..."}</h1>
                        </div>
                        <div className="header-actions">
                            <Link href={`/instructor/courses/${courseId}/edit`} className="btn btn-secondary">
                                Edit
                            </Link>
                            {course?.status === "DRAFT" && (
                                <button className="btn btn-primary" onClick={handlePublish} disabled={publishing}>
                                    {publishing ? "Publishing..." : "Publish Course"}
                                </button>
                            )}
                            {course?.status === "PUBLISHED" && (
                                <span className="published-badge">✓ Published</span>
                            )}
                        </div>
                    </div>

                    {/* Chapters */}
                    <div className="section-header">
                        <h2>Curriculum</h2>
                        <div className="section-actions">
                            <Link href={`/instructor/courses/${courseId}/questions`} className="btn btn-secondary add-btn">
                                Question Bank
                            </Link>
                            <Link href={`/instructor/courses/${courseId}/exams`} className="btn btn-secondary add-btn">
                                Exams
                            </Link>
                            <button className="btn btn-secondary add-btn" onClick={() => setShowChapterForm(true)}>
                                + Add Chapter
                            </button>
                        </div>
                    </div>

                    {showChapterForm && (
                        <div className="inline-form">
                            <input
                                type="text"
                                placeholder="Chapter title"
                                value={chapterTitle}
                                onChange={(e) => setChapterTitle(e.target.value)}
                                autoFocus
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => addChapter.mutate()}
                                disabled={!chapterTitle.trim() || addChapter.isPending}
                            >
                                {addChapter.isPending ? "Adding..." : "Add"}
                            </button>
                            <button className="btn btn-secondary" onClick={() => setShowChapterForm(false)}>
                                Cancel
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <p className="loading-text">Loading curriculum...</p>
                    ) : chapters.length === 0 ? (
                        <div className="empty-state">No chapters yet. Add your first chapter.</div>
                    ) : (
                        <div className="chapters-list">
                            {chapters.map((chapter, idx) => (
                                <ChapterItem
                                    key={chapter.id}
                                    chapter={chapter}
                                    index={idx}
                                    courseId={courseId}
                                    onDelete={() => deleteChapter.mutate(chapter.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
        .page { padding: 2.5rem 0 6rem; }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        .back-link { font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem; }
        .back-link:hover { color: var(--primary); }
        .page-header h1 { font-size: 1.75rem; }
        .header-actions { display: flex; align-items: center; gap: 1rem; }
        .published-badge {
          background: #dcfce7;
          color: #16a34a;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .section-header h2 { font-size: 1.25rem; }
        .section-actions { display: flex; gap: 0.5rem; }
        .add-btn { padding: 0.5rem 1rem; font-size: 0.875rem; }
        .inline-form {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          align-items: center;
        }
        .inline-form input {
          flex: 1;
          padding: 0.65rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
        }
        .inline-form input:focus { border-color: var(--primary); }
        .loading-text { color: var(--text-secondary); }
        .empty-state { color: var(--text-secondary); padding: 2rem; text-align: center; }
        .chapters-list { display: flex; flex-direction: column; gap: 0.75rem; }
      `}</style>
        </>
    );
}

function ChapterItem({
    chapter, index, courseId, onDelete,
}: {
    chapter: ChapterResponse;
    index: number;
    courseId: string;
    onDelete: () => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="chapter-item">
            <div className="chapter-row" onClick={() => setOpen(!open)}>
                <div className="chapter-left">
                    <span className="chapter-num">{index + 1}</span>
                    <span className="chapter-title">{chapter.title}</span>
                </div>
                <div className="chapter-right">
                    <Link
                        href={`/instructor/courses/${courseId}/chapters/${chapter.id}`}
                        className="btn btn-secondary small-btn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Manage Lessons
                    </Link>
                    <button
                        className="delete-btn"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        ✕
                    </button>
                    <span className="toggle">{open ? "▲" : "▼"}</span>
                </div>
            </div>

            {open && chapter.lessons && chapter.lessons.length > 0 && (
                <ul className="lesson-preview">
                    {chapter.lessons.map((l) => (
                        <li key={l.id}>{l.title}</li>
                    ))}
                </ul>
            )}

            <style jsx>{`
        .chapter-item {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          background: white;
        }
        .chapter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          cursor: pointer;
        }
        .chapter-row:hover { background: #f9fafb; }
        .chapter-left { display: flex; align-items: center; gap: 0.75rem; }
        .chapter-num {
          width: 26px; height: 26px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
        }
        .chapter-title { font-weight: 600; font-size: 0.95rem; }
        .chapter-right { display: flex; align-items: center; gap: 0.75rem; }
        .small-btn { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
        .delete-btn {
          color: #dc2626; font-size: 0.9rem; padding: 0.25rem 0.5rem;
          border-radius: 4px; cursor: pointer;
        }
        .delete-btn:hover { background: #fef2f2; }
        .toggle { color: var(--text-secondary); font-size: 0.75rem; }
        .lesson-preview {
          list-style: none;
          border-top: 1px solid #f3f4f6;
          padding: 0.5rem 1.25rem 0.75rem 3.5rem;
        }
        .lesson-preview li {
          font-size: 0.875rem;
          color: var(--text-secondary);
          padding: 0.3rem 0;
        }
      `}</style>
        </div>
    );
}
