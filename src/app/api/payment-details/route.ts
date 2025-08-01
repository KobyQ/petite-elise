import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    // Fetch transaction details
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("reference", reference)
      .single();

    if (error || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Extract program information from transaction details
    const details = transaction.details;
    let program = "Unknown Program";
    
    if (details.program_type === "Code Ninjas Club") {
      program = "Code Ninjas Club";
    } else if (details.program_type === "School Fees") {
      program = details.program || "School Fees";
    } else if (details.program_type === "Childminding") {
      program = "Childminding Program";
    } else if (details.program_type === "Summer Camp") {
      program = "Summer Camp Program";
    } else if (details.program_type === "Christmas Camp") {
      program = "Christmas Camp Program";
    } else {
      program = "Saturday Kids Club";
    }

    return NextResponse.json({
      reference: transaction.reference,
      amount: transaction.amount,
      email: transaction.email,
      program: program,
      created_at: transaction.created_at,
      status: transaction.status,
    });
  } catch (error: any) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch payment details",
        message: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
} 