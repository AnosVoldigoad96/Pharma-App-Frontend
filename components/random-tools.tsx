import { getTools } from "@/lib/supabase/queries";
import { ToolCard } from "@/components/tool-card";
import { Shuffle } from "lucide-react";

interface RandomToolsProps {
    currentToolId?: string;
}

export async function RandomTools({ currentToolId }: RandomToolsProps) {
    // Fetch more tools than needed to randomize
    const { data: allTools } = await getTools(20);

    if (!allTools || allTools.length === 0) return null;

    // Filter out current tool
    const availableTools = allTools.filter(t => t.id !== currentToolId);

    // Shuffle and take 4
    const randomTools = availableTools
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    if (randomTools.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-bold text-primary">
                <Shuffle className="w-5 h-5" />
                <h3>Explore More Tools</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {randomTools.map((tool) => (
                    <div key={tool.id} className="h-[200px]">
                        <ToolCard tool={tool} />
                    </div>
                ))}
            </div>
        </div>
    );
}
