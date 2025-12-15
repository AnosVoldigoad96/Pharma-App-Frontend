"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface AccessButtonProps {
    fileUrl: string;
    isAuthenticated: boolean;
}

export function AccessButton({ fileUrl, isAuthenticated }: AccessButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (isAuthenticated) {
        return (
            <Button asChild variant="outline" className="gap-2">
                <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" />
                    Download
                </a>
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Access
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sign in Required</DialogTitle>
                    <DialogDescription>
                        You need to be signed in to download this book. Please sign in or create an account to continue.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="secondary" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
