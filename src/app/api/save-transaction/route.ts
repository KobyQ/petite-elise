import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { ETransactionStatus } from "@/utils/misc";

interface TransactionData {
  reference: string;
  amount: number;
  email: string;
  order_id: string;
  details: any;
}

export async function POST(request: NextRequest) {
  try {
    const data: TransactionData = await request.json();

    // Input validation
    if (!data.reference || !data.amount || !data.email || !data.order_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save transaction to database
    const { error } = await supabase
      .from("transactions")
      .insert({
        reference: data.reference,
        amount: data.amount,
        email: data.email,
        order_id: data.order_id,
        details: data.details,
        status: ETransactionStatus.pending,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error saving transaction:", error);
      return NextResponse.json(
        { error: "Failed to save transaction" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Transaction saved successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error saving transaction:", error);
    return NextResponse.json(
      {
        error: "Failed to save transaction",
        message: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
} 