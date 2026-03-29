"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import { courseService, chapterService } from "@/services/courseService";
import { progressService } from "@/services/progressService";
import { formatDuration } from "@/lib/utils";
import type { LessonResponse, ChapterResponse } from "@/types";

export default function LearnPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const queryClient = useQueryClient();
    const [activeLesson, setActiveLesson] = useState<LessonResponse | null>(null);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: course } = useQuery({
        queryKey: ["course", courseId],
        queryFn: () => courseService.getById(courseId),
    });

    const { data: chapters = [] } = useQuery<ChapterResponse[]>({
        queryKey: ["chapters", courseId],
        queryFn: () => chapterService.getByCourse(courseId),
    });

    const { data: progress } = useQuery({
        queryKey: ["progress", courseId],
        queryFn: () => progressService.getCourseProgress(courseId),
    });

    // auto-select first lesson
    useEffect(() => {
        if (!activeLesson && chapters.length > 0) {
            const first = chapters[0];
            if (first.lessons && first.lessons.length > 0) {
                setActiveLesson(first.lessons[0]);
            }
        }
    }, [chapters, activeLesson]);

    const markCompleted = useMutation({
        mutationFn: (lessonId: string) => progressService.markCompleted(lessonId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress", courseId] }),
    });

    // debounce save watch position (only for direct video, YouTube/Vimeo don't expose time)
    const saveWatch = useCallback((lessonId: string, second: number) => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            progressService.saveWatch(lessonId, second);
        }, 3000);
    }, []);

    const isCompleted = (lessonId: string) =>
        progress?.lessonProgresses.some((p) => p.lessonId === lessonId && p.isCompleted) ?? false;

    const percentage = progress?.completionPercentage ?? 0;
    const completedCount = progress?.completedLessons ?? 0;
    const totalCount = progress?.totalLessons ?? 0;

    return (
        <>
            <Navbar />
            <div className="learn-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2 className="course-name">{course?.title}</h2>
                        <div className="progress-wrap">
                            <div className="progress-row">
                                <span className="progress-text">{completedCount}/{totalCount} lessons</span>
                                <span className="progress-pct">{percentage}%</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${percentage}%` }} />
                            </div>
                        </div>
                    </div>

                    <nav className="chapters-nav">
                        {chapters.map((chapter, ci) => (
                            <div key={chapter.id} className="chapter-group">
                                <div className="chapter-label">
                                    <span className="chapter-num">{ci + 1}</span>
                                    {chapter.title}
                                </div>
                                {chapter.lessons?.map((lesson) => {
                                    const done = isCompleted(lesson.id);
                                    const active = activeLesson?.id === lesson.id;
                                    return (
                                        <button
                                            key={lesson.id}
                                            className={`lesson-btn ${active ? "active" : ""} ${done ? "done" : ""}`}
                                            onClick={() => setActiveLesson(lesson)}
                                        >
                                            <span className={`lesson-icon ${done ? "done" : ""}`}>
                                                {done ? "✓" : "▶"}
                                            </span>
                                            <span className="lesson-name">{lesson.title}</span>
                                            {lesson.duration > 0 && (
                                                <span className="lesson-dur">{formatDuration(lesson.duration)}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main */}
                <main className="learn-main">
                    {activeLesson ? (
                        <LessonViewer
                            lesson={activeLesson}
                            completed={isCompleted(activeLesson.id)}
                            onComplete={() => markCompleted.mutate(activeLesson.id)}
                            onTimeUpdate={(sec) => saveWatch(activeLesson.id, sec)}
                            completing={markCompleted.isPending}
                        />
                    ) : (
                        <div className="empty-state">Select a lesson to start learning</div>
                    )}
                </main>
            </div>

            <style jsx>{`
        .learn-layout {
          display: grid;
          grid-template-columns: 300px 1fr;
          height: calc(100vh - 64px);
          overflow: hidden;
        }
        .sidebar {
          border-right: 1px solid #e5e7eb;
          overflow-y: auto;
          background: white;
          display: flex;
          flex-direction: column;
        }
        .sidebar-header {
          padding: 1.25rem;
          border-bottom: 1px solid #f3f4f6;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }
        .course-name {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          color: var(--text-primary);
        }
        .progress-wrap { display: flex; flex-direction: column; gap: 0.35rem; }
        .progress-row { display: flex; justify-content: space-between; }
        .progress-text { font-size: 0.75rem; color: var(--text-secondary); }
        .progress-pct { font-size: 0.75rem; font-weight: 700; color: #10b981; }
        .progress-track {
          height: 5px; background: #e5e7eb; border-radius: 3px; overflow: hidden;
        }
        .progress-fill {
          height: 100%; background: #10b981; border-radius: 3px; transition: width 0.4s;
        }
        .chapters-nav { flex: 1; padding-bottom: 1rem; }
        .chapter-group { margin-bottom: 0.25rem; }
        .chapter-label {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1rem;
          font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--text-secondary); background: #f9fafb;
        }
        .chapter-num {
          width: 18px; height: 18px; background: #e5e7eb;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 0.65rem; font-weight: 800;
          flex-shrink: 0;
        }
        .lesson-btn {
          display: flex; align-items: center; gap: 0.6rem;
          width: 100%; padding: 0.6rem 1rem;
          text-align: left; font-size: 0.85rem;
          color: var(--text-primary);
          border-bottom: 1px solid #f9fafb;
          transition: background 0.15s;
        }
        .lesson-btn:hover { background: #f3f4f6; }
        .lesson-btn.active { background: #eff6ff; color: var(--primary); }
        .lesson-btn.done { color: var(--text-secondary); }
        .lesson-icon {
          font-size: 0.65rem; flex-shrink: 0; color: var(--text-secondary);
          width: 14px; text-align: center;
        }
        .lesson-icon.done { color: #10b981; }
        .lesson-btn.active .lesson-icon { color: var(--primary); }
        .lesson-name { flex: 1; line-height: 1.3; }
        .lesson-dur { font-size: 0.72rem; color: var(--text-secondary); flex-shrink: 0; }
        .learn-main { overflow-y: auto; background: #0f172a; }
        .empty-state {
          display: flex; align-items: center; justify-content: center;
          height: 100%; color: #64748b;
        }
      `}</style>
        </>
    );
}

function LessonViewer({
    lesson, completed, onComplete, onTimeUpdate, completing,
}: {
    lesson: LessonResponse;
    completed: boolean;
    onComplete: () => void;
    onTimeUpdate: (sec: number) => void;
    completing: boolean;
}) {
    return (
        <div className="viewer">
            {/* Video area */}
            <div className="video-area">
                {lesson.videoUrl ? (
                    <VideoPlayer url={lesson.videoUrl} onTimeUpdate={onTimeUpdate} />
                ) : (
                    <div className="no-video">No video for this lesson</div>
                )}
            </div>

            {/* Info area */}
            <div className="info-area">
                <div className="info-header">
                    <h1 className="lesson-title">{lesson.title}</h1>
                    {completed ? (
                        <span className="badge-done">✓ Completed</span>
                    ) : (
                        <button
                            className="btn btn-primary complete-btn"
                            onClick={onComplete}
                            disabled={completing}
                        >
                            {completing ? "Saving..." : "✓ Mark Complete"}
                        </button>
                    )}
                </div>

                {lesson.description && (
                    <p className="lesson-desc">{lesson.description}</p>
                )}

                {lesson.documentUrl && (
                    <a
                        href={lesson.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="doc-link"
                    >
                        📄 Download Document
                    </a>
                )}

                {/* Video URL hint for instructor */}
                {!lesson.videoUrl && (
                    <div className="no-video-hint">
                        No video attached. Supports YouTube, Vimeo, or direct .mp4 links.
                    </div>
                )}
            </div>

            <style jsx>{`
        .viewer { display: flex; flex-direction: column; min-height: 100%; }
        .video-area { background: black; }
        .no-video {
          height: 280px; display: flex; align-items: center;
          justify-content: center; color: #475569; font-size: 0.9rem;
        }
        .info-area { padding: 1.75rem 2rem; background: white; flex: 1; }
        .info-header {
          display: flex; justify-content: space-between;
          align-items: flex-start; gap: 1rem; margin-bottom: 1rem;
        }
        .lesson-title { font-size: 1.4rem; line-height: 1.3; }
        .complete-btn { padding: 0.55rem 1.25rem; font-size: 0.875rem; white-space: nowrap; }
        .complete-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .badge-done {
          background: #dcfce7; color: #16a34a;
          padding: 0.45rem 1rem; border-radius: 20px;
          font-size: 0.875rem; font-weight: 700; white-space: nowrap;
        }
        .lesson-desc {
          color: var(--text-secondary); line-height: 1.7;
          margin-bottom: 1.5rem; font-size: 0.95rem;
        }
        .doc-link {
          display: inline-flex; align-items: center; gap: 0.5rem;
          color: var(--primary); font-weight: 600; font-size: 0.875rem;
          padding: 0.5rem 1rem; border: 1px solid var(--primary);
          border-radius: 8px; transition: background 0.2s;
        }
        .doc-link:hover { background: #eff6ff; }
        .no-video-hint {
          margin-top: 1rem; font-size: 0.8rem; color: #94a3b8;
          background: #f8fafc; padding: 0.75rem 1rem; border-radius: 8px;
        }
      `}</style>
        </div>
    );
}
