import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const threadId = resolvedParams.id;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get current thread
    const { data: thread, error: threadError } = await supabase
      .from("threads")
      .select("view_count")
      .eq("id", threadId)
      .single();

    if (threadError || !thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Increment view count
    const { data, error } = await supabase
      .from("threads")
      .update({ view_count: (thread.view_count || 0) + 1 })
      .eq("id", threadId)
      .select("view_count")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ view_count: data.view_count });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

