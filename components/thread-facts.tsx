import { MessageSquare, Users, HelpCircle, Shield } from "lucide-react";

export function ThreadFacts() {
    const facts = [
        {
            icon: MessageSquare,
            title: "Ask Questions",
            description: "Get answers from experienced professionals and students in the field.",
        },
        {
            icon: Users,
            title: "Connect with Peers",
            description: "Network with others who share your interests and challenges.",
        },
        {
            icon: HelpCircle,
            title: "Solve Problems",
            description: "Collaborate on complex cases and study topics.",
        },
        {
            icon: Shield,
            title: "Safe Environment",
            description: "Our community guidelines ensure a respectful and professional atmosphere.",
        },
    ];

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="bg-primary/10 p-1.5 rounded-md">
                    <MessageSquare className="w-5 h-5 text-primary" />
                </span>
                Community Guidelines
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
