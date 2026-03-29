"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PaymentSuccessPage() {
    const params = useSearchParams();
    const courseId = params.get("courseId");

    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container result-box">
                    <div className="icon success-icon">🎉</div>
                    <h1>Payment Successful!</h1>
                    <p>Your enrollment has been confirmed. You can start learning now.</p>
                    <div className="actions">
                        {courseId && (
                            <Link href={`/learn/${courseId}`} className="btn btn-primary">
                                Start Learning →
                            </Link>
                        )}
                        <Link href="/courses" className="btn btn-secondary">Browse Courses</Link>
                    </div>
                </div>
            </main>
            <style jsx>{`
                .page { padding: 6rem 0; }
                .result-box {
                    max-width: 480px; text-align: center;
                    background: white; border-radius: 16px;
                    padding: 3rem; border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
                }
                .icon { font-size: 4rem; margin-bottom: 1rem; }
                h1 { font-size: 1.75rem; margin-bottom: 0.75rem; }
                p { color: var(--text-secondary); margin-bottom: 2rem; }
                .actions { display: flex; flex-direction: column; gap: 0.75rem; }
            `}</style>
        </>
    );
}
