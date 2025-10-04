import { supabaseAdmin } from "@/utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
      const { data, error } = await supabaseAdmin
        .from("program_pricing")
        .select("*")
        .eq("program_name", "Code Ninjas Club")
  
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
  