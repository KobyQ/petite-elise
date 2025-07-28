import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { formatMoneyToPesewas } from "@/utils/constants";

const PAYSTACK_SECRET_KEY = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
const PAYSTACK_INITIATE_URL = "https://api.paystack.co/transaction/initialize";

export async function POST(request: NextRequest) {
  try {
    const { email, amount, callback_url, registrationData } = await request.json();

    if (!email || !amount || !callback_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert amount to pesewas (Paystack expects amount in kobo)
    const amountInPesewas = formatMoneyToPesewas(amount);

    const params = {
      email,
      amount: amountInPesewas,
      callback_url,
      metadata: {
        registrationData: JSON.stringify(registrationData),
      },
    };

    // Initialize payment with Paystack
    const response = await fetch(PAYSTACK_INITIATE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to initialize payment");
    }

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Payment initialization failed");
    }

    // Save transaction to database (registration will be saved after payment verification)
    const { error: dbError } = await supabase.from("transactions").insert({
      amount: amount,
      reference: data.data.reference,
      paystack_response: data,
      status: "pending",
      details: registrationData,
      order_id: `SATURDAY-${Date.now()}`,
      program_type: "Saturday Kids Club",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save transaction: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      data: {
        authorization_url: data.data.authorization_url,
        reference: data.data.reference,
      },
    });
  } catch (error: unknown) {
    console.error("Payment initiation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 