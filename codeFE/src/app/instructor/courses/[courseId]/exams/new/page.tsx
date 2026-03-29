"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ExamForm from "@/components/ExamForm";
import { examManageService } from "@/services/examManageService";

export default function NewExamPage() {
    const { courseId } = useParams<{ courseId: string }>();
    const router = useRouter();

    const handleSubmit = async (data: Parameters<typeof examManageService.create>[1]) => {
        const exam = await examManageService.create(courseId, data);
        router.push(`/instructor/courses/${courseId}/exams/${exam.id}`);
    };

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container form-container">
                    <div className="form-header">
                        <Link href={`/instructor/courses/${courseId}/exams`} className="back-link">← Back to Exams</Link>
                        <h1>Create New Exam</h1>
                    </div>
                    <ExamForm courseId={courseId} onSubmit={handleSubmit} />
                </div>
            </main>
            <style jsx>{`
                .page { padding: 2.5rem 0 6rem; }
                .form-container { max-width: 800px; }
                .form-header { margin-bottom: 1.5rem; }
                .back-link { font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem; }
                .back-link:hover { color: var(--primary); }
                .form-header h1 { font-size: 1.75rem; }
            `}</style>
        </>
    );
}
