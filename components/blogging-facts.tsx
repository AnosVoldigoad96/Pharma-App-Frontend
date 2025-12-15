import { Lightbulb, TrendingUp, Users, Award } from "lucide-react";

export function BloggingFacts() {
    const facts = [
        {
            icon: Lightbulb,
            title: "Share Knowledge",
            description: "Blogging helps you share your expertise and insights with a wider audience.",
        },
        {
            icon: Users,
            title: "Build Community",
            description: "Engage with other professionals and students in the pharmaceutical field.",
        },
        {
            icon: TrendingUp,
            title: "Boost Visibility",
            description: "Regular blogging can increase your professional visibility and establish thought leadership.",
        },
        {
            icon: Award,
            title: "Earn Recognition",
            description: "High-quality posts are featured and recognized by the community.",
        },
    ];

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="bg-primary/10 p-1.5 rounded-md">
                    <Lightbulb className="w-5 h-5 text-primary" />
                </span>
                Why Write?
            </h3>
            <div className="space-y-6">
                {facts.map((fact, index) => (
                    <div key={index} className="flex gap-3">
                        <div className="mt-1">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <fact.icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-sm mb-1">{fact.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {fact.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
