import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { sendRegistrationEmail } from "@/utils/helper";

const PAYSTACK_SECRET_KEY = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();

    if (event !== "charge.success") {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const reference = data.reference;

    // Retrieve transaction from Supabase
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("reference", reference)
      .single();

    if (transactionError || !transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (transaction.status !== "pending") {
      return NextResponse.json({ error: "Transaction is not pending" }, { status: 400 });
    }

    // Verify payment with Paystack
    const response = await fetch(`${PAYSTACK_VERIFY_URL}/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const paymentData = await response.json();

    if (!paymentData.status || paymentData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Update transaction status
    await supabase
      .from("transactions")
      .update({ status: paymentData.data.status })
      .eq("reference", reference);

    // Extract registration data from transaction details
    const registrationData = transaction.details;

    // Save registration to children table ONLY after successful payment verification
    const childrenData = {
      childName: registrationData.childName,
      childDOB: registrationData.childDOB,
      childAge: registrationData.childAge,
      parentName: registrationData.parentName,
      parentEmail: registrationData.parentEmail,
      parentPhoneNumber: registrationData.parentPhoneNumber,
      parentWhatsappNumber: registrationData.parentWhatsappNumber,
      address: registrationData.address,
      emergencyContactName: registrationData.emergencyContactName,
      emergencyContactPhoneNumber: registrationData.emergencyContactPhoneNumber,
      emergencyContactWhatsappNumber: registrationData.emergencyContactWhatsappNumber,
      emergencyContactRelationshipToChild: registrationData.emergencyContactRelationshipToChild,
      dropChildOffSelf: registrationData.dropChildOffSelf,
      dropOffNames: registrationData.dropOffNames,
      programs: registrationData.programs,
      dayCareSchedule: registrationData.dayCareSchedule,
      hasAllergies: registrationData.hasAllergies,
      allergies: registrationData.allergies,
      hasSpecialHealthConditions: registrationData.hasSpecialHealthConditions,
      specialHealthConditions: registrationData.specialHealthConditions,
      photograpghUsageConsent: registrationData.photograpghUsageConsent,
      feeding: registrationData.feeding,
      hasSiblings: registrationData.hasSiblings,
      sibling: registrationData.sibling,
      saturdayClubSchedule: registrationData.saturdayClubSchedule,
      summerCampSchedule: registrationData.summerCampSchedule,
      familyId: registrationData.familyId,
      childMindingSchedule: registrationData.childMindingSchedule,
      is_active: true,
      order_id: transaction.order_id,
      reference: reference,
    };

    // Save registration to children table
    const { error: registrationError } = await supabase
      .from("children")
      .insert(childrenData);

    if (registrationError) {
      console.error("Registration error:", registrationError);
      return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
    }

    // Send confirmation email
    try {
      const emailData = {
        childName: registrationData.childName,
        parentEmail: registrationData.parentEmail,
        parentPhoneNumber: registrationData.parentPhoneNumber,
        childDOB: registrationData.childDOB,
      };

      await sendRegistrationEmail(emailData);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the webhook if email fails
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Payment verified and registration completed successfully",
    });
  } catch (error: unknown) {
    console.error("Error verifying payment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      {
        error: errorMessage,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
} 