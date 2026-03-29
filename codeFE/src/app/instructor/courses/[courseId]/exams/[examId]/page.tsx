"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ExamForm from "@/components/ExamForm";
import { examManageService } from "@/services/examManageService";

export default function EditExamPage() {
    const { courseId, examId } = useParams<{ courseId: string; examId: string }>();
    const router = useRouter();

    const { data: exam, isLoading } = useQuery({
        queryKey: ["instructor-exam", examId],
        queryFn: () => examManageService.getById(examId),
    });

    const handleSubmit = async (data: Parameters<typeof examManageService.update>[1]) => {
        await examManageService.update(examId, data);
        router.push(`/instructor/courses/${courseId}/exams`);
    };

    if (isLoading) return <><Navbar /><div className="loading-page">Loading...</div></>;

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container form-container">
                    <div className="form-header">
                        <Link href={`/instructor/courses/${courseId}/exams`} className="back-link">← Back to Exams</Link>
                        <h1>Edit Exam</h1>
                    </div>
                    {exam && (
                        <ExamForm
                            courseId={courseId}
                            initialData={exam}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            </main>
            <style jsx>{`
                .loading-page { padding: 4rem; text-align: center; color: var(--text-secondary); }
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
