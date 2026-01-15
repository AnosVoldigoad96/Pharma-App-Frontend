"use client";

import { AlertTriangle, Heart, Key, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FundingNoticeSection() {
    return (
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="relative">
                    {/* Decorative background elements */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50"></div>

                    <Card className="relative bg-background/80 backdrop-blur-xl border-primary/10 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                        <CardContent className="p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                                        <Heart className="w-4 h-4 fill-primary/20" />
                                        <span>Community Supported Project</span>
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                        A Message to Our Users
                                    </h2>

                                    <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                                        <p>
                                            ePharmatica is currently a passion project funded entirely from our own pockets.
                                            We are committed to providing free access to advanced pharmaceutical knowledge and AI tools.
                                        </p>
                                        <p>
                                            To help us keep this platform free and accessible to everyone, we kindly ask for your cooperation.
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <Link href="/profile">
                                            <Button className="group" size="lg">
                                                <Key className="mr-2 w-4 h-4 group-hover:rotate-45 transition-transform" />
                                                Bring Your Own Key
                                            </Button>
                                        </Link>
                                        <Link href="/about">
                                            <Button variant="outline" size="lg">
                                                Learn More
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="grid gap-6">
                                    <div className="bg-card/50 border border-border/50 rounded-xl p-6 hover:bg-card/80 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500 h-fit">
                                                <ShieldAlert className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">Fair Usage Policy</h3>
                                                <p className="text-muted-foreground">
                                                    Please use our AI features responsibly. Excessive usage strains our limited resources and may affect availability for others.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card/50 border border-border/50 rounded-xl p-6 hover:bg-card/80 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 h-fit">
                                                <Key className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-2">Bring Your Own Key</h3>
                                                <p className="text-muted-foreground">
                                                    We encourage users to provide their own free API keys (Gemini, etc.) in settings. This ensures uninterrupted access and helps sustain the platform.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
