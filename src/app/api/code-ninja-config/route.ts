import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("code_ninja_config")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch configuration" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationDeadline, cohortStarts, programs } = body;


    // Validate that programs is an array (can be empty)
    if (!Array.isArray(programs)) {
      console.error("Programs validation failed:", programs);
      return NextResponse.json(
        { error: "Programs must be an array" },
        { status: 400 }
      );
    }

    // Convert ISO strings to proper format for Supabase
    const registrationDeadlineFormatted = registrationDeadline ? new Date(registrationDeadline).toISOString() : null;
    const cohortStartsFormatted = cohortStarts ? new Date(cohortStarts).toISOString() : null;


    // Check if config exists
    const { data: existingConfig, error: checkError } = await supabaseAdmin
      .from("code_ninja_config")
      .select("id")
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking existing config:", checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }


    let result;
    if (existingConfig) {
      // Update existing config
      result = await supabaseAdmin
        .from("code_ninja_config")
        .update({
          registration_deadline: registrationDeadlineFormatted,
          cohort_starts: cohortStartsFormatted,
          programs: programs,
        })
        .eq("id", existingConfig.id)
        .select()
        .single();
    } else {
      // Create new config
      result = await supabaseAdmin
        .from("code_ninja_config")
        .insert({
          registration_deadline: registrationDeadlineFormatted,
          cohort_starts: cohortStartsFormatted,
          programs: programs,
        })
        .select()
        .single();
    }


    if (result.error) {
      console.error("Database operation failed:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Unexpected error in POST /api/code-ninja-config:", error);
    return NextResponse.json(
      { error: `Failed to save configuration: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
