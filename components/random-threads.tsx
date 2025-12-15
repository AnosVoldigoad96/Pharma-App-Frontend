import { getThreads } from "@/lib/supabase/queries";
import Link from "next/link";
import { MessageSquare, User, Calendar } from "lucide-react";

interface RandomThreadsProps {
    currentThreadId?: string;
}

export async function RandomThreads({ currentThreadId }: RandomThreadsProps) {
    // Fetch more threads than needed to randomize
    const { data: allThreads } = await getThreads(20);

    if (!allThreads || allThreads.length === 0) return null;

    // Filter out current thread
    const availableThreads = allThreads.filter(t => t.id !== currentThreadId);

    // Shuffle and take 5
    const randomThreads = availableThreads
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

    if (randomThreads.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <MessageSquare className="w-5 h-5" />
                <h3>More Discussions</h3>
            </div>
            <div className="space-y-4">
                {randomThreads.map((thread) => (
                    <Link
                        key={thread.id}
                        href={`/threads/${thread.slug}`}
                        className="group block bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50"
                    >
                        <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {thread.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{thread.author_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                    {new Date(thread.created_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
