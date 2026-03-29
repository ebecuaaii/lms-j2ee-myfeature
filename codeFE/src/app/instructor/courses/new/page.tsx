"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { courseService } from "@/services/courseService";

const schema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    thumbnailUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    price: z.coerce.number().min(0, "Price must be >= 0"),
    categoryId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewCoursePage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { price: 0 },
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError("");
        try {
            const course = await courseService.create({
                title: data.title,
                description: data.description,
                thumbnailUrl: data.thumbnailUrl || undefined,
                price: data.price,
                categoryId: data.categoryId,
            });
            router.push(`/instructor/courses/${course.id}`);
        } catch {
            setError("Failed to create course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container form-container">
                    <div className="form-header">
                        <Link href="/instructor" className="back-link">← Back</Link>
                        <h1>Create New Course</h1>
                    </div>

                    <div className="form-card">
                        {error && <div className="form-error">{error}</div>}

                        <form onSubmit={handleSubmit(onSubmit)} className="course-form">
                            <div className="form-group">
                                <label>Title *</label>
                                <input type="text" placeholder="e.g. Introduction to React" {...register("title")} />
                                {errors.title && <span className="field-error">{errors.title.message}</span>}
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows={4} placeholder="What will students learn?" {...register("description")} />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (USD)</label>
                                    <input type="number" min="0" step="0.01" {...register("price")} />
                                    {errors.price && <span className="field-error">{errors.price.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Category ID</label>
                                    <input type="text" placeholder="Optional" {...register("categoryId")} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Thumbnail URL</label>
                                <input type="text" placeholder="https://..." {...register("thumbnailUrl")} />
                                {errors.thumbnailUrl && <span className="field-error">{errors.thumbnailUrl.message}</span>}
                            </div>

                            <div className="form-actions">
                                <Link href="/instructor" className="btn btn-secondary">Cancel</Link>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? "Creating..." : "Create Course"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <style jsx>{`
        .page { padding: 2.5rem 0 6rem; }
        .form-container { max-width: 720px; }
        .form-header { margin-bottom: 1.5rem; }
        .back-link { font-size: 0.9rem; color: var(--text-secondary); display: block; margin-bottom: 0.75rem; }
        .back-link:hover { color: var(--primary); }
        .form-header h1 { font-size: 1.75rem; }
        .form-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
        }
        .form-error {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          border: 1px solid #fecaca;
        }
        .course-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
        .form-group input, .form-group textarea {
          padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(19,91,236,0.1);
        }
        .form-group textarea { resize: vertical; }
        .field-error { font-size: 0.8rem; color: #dc2626; }
        .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
      `}</style>
        </>
    );
}
