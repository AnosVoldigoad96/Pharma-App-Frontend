"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookPlus, Loader2, CheckCircle2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";

export function BookRequestSection() {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (!title.trim()) {
            setError("Book title is required");
            return;
        }

        setIsSubmitting(true);
        setError("");

        if (!turnstileToken) {
            setError("Please complete the CAPTCHA");
            setIsSubmitting(false);
            return;
        }

        try {
            // Verify Turnstile token
            const verifyRes = await fetch("/api/verify-turnstile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: turnstileToken }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
                setError(verifyData.message || "CAPTCHA verification failed");
                setIsSubmitting(false);
                return;
            }

            const supabase = createClient();
            const { error: submitError } = await supabase
                .from("requests")
                .insert([
                    {
                        type: "book",
                        title: title.trim(),
                        description: `Author: ${author.trim()}\n\n${description.trim()}`,
                        status: "pending",
                        user_name: user.user_metadata?.full_name || user.email,
                        user_email: user.email
                    },
                ]);

            if (submitError) throw submitError;

            setSuccess(true);
            setTitle("");
            setAuthor("");
            setDescription("");

            // Reset success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error("Error submitting request:", err);
            setError("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-16 relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-4 relative z-10">
                <Card className="bg-background/40 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

                    <CardHeader className="text-center pb-8">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <BookPlus className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-bold">Request a Book</CardTitle>
                        <CardDescription className="text-lg mt-2 max-w-lg mx-auto">
                            Can't find what you're looking for? Submit a request and we'll try to add it to our library.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {user ? (
                            success ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Request Submitted!</h3>
                                    <p className="text-muted-foreground max-w-md">
                                        Thank you for your suggestion. We'll review your request and notify you if we add this book to our collection.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-6"
                                        onClick={() => setSuccess(false)}
                                    >
                                        Submit Another Request
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                                    <div className="space-y-2">
                                        <label htmlFor="title" className="text-sm font-medium">Book Title <span className="text-red-500">*</span></label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Clinical Pharmacology"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            className="bg-background/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="author" className="text-sm font-medium">Author (Optional)</label>
                                        <Input
                                            id="author"
                                            placeholder="e.g. Katzung"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                            className="bg-background/50"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="description" className="text-sm font-medium">Additional Details (Optional)</label>
                                        <Textarea
                                            id="description"
                                            placeholder="Edition, ISBN, or why this book would be useful..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-background/50 min-h-[100px]"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-md">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <Turnstile
                                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                                            onSuccess={(token) => setTurnstileToken(token)}
                                            onError={() => setError("CAPTCHA error")}
                                            onExpire={() => setTurnstileToken(null)}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Request"
                                        )}
                                    </Button>
                                </form>
                            )
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-6">
                                    You must be signed in to submit book requests.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Button asChild variant="default">
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href="/signup">Create Account</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
