"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PaymentFailedPage() {
    return (
        <>
            <Navbar />
            <main className="page">
                <div className="container result-box">
                    <div className="icon">❌</div>
                    <h1>Payment Failed</h1>
                    <p>Something went wrong with your payment. No charges were made.</p>
                    <div className="actions">
                        <Link href="/courses" className="btn btn-primary">Back to Courses</Link>
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
                .actions { display: flex; justify-content: center; }
            `}</style>
        </>
    );
}
