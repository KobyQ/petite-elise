import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { ETransactionStatus } from "@/utils/misc";
import { 
  generateReceiptEmailContent, 
  ReceiptData
} from "@/utils/template";
import { transporter } from "../../../../../config/nodemailer";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();
    if (event !== "charge.success") {
      throw new Error("Invalid event")
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

    if (transaction.status !== ETransactionStatus.pending) {
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

    // Update transaction status to prevent infinite webhook calls
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ status: paymentData.data.status })
      .eq("reference", reference);

    if (updateError) {
      console.error("Error updating transaction status:", updateError);
      return NextResponse.json({ error: "Failed to update transaction status" }, { status: 500 });
    }

    // Extract registration data from transaction details
    const registrationData = transaction.details;

    // Save registration based on program type
    if (registrationData.program_type === "Code Ninjas Club") {
      // Save to code-ninjas table
      const codeNinjasData = {
        parentName: registrationData.parentName,
        phoneNumber: registrationData.parentPhoneNumber,
        email: registrationData.parentEmail,
        contactMode: registrationData.contactMode,
        childName: registrationData.childName,
        ageGroup: registrationData.ageGroup,
        hasCodingExperience: registrationData.hasCodingExperience,
        codingExperience: registrationData.codingExperience,
        paymentMethod: registrationData.paymentMethod,
        specialRequests: registrationData.specialRequests,
        dropOffNames: registrationData.dropOffNames,
        photographConsent: registrationData.photographUsageConsent,
        is_active: true,
        reference: reference,
      };

      const { error: registrationError } = await supabase
        .from("code-ninjas")
        .insert(codeNinjasData);

      if (registrationError) {
        console.error("Registration error:", registrationError);
        return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
      }
    } else {
      // Save to children table for other programs
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
        photographUsageConsent: registrationData.photographUsageConsent,
        feeding: registrationData.feeding,
        hasSiblings: registrationData.hasSiblings,
        sibling: registrationData.sibling,
        saturdayClubSchedule: registrationData.saturdayClubSchedule,
        summerCampSchedule: registrationData.summerCampSchedule,
        familyId: registrationData.familyId,
        childMindingSchedule: registrationData.childMindingSchedule,
        christmasCampSchedule: registrationData.christmasCampSchedule,
        is_active: true,
        order_id: transaction.order_id,
        reference: reference,
      };

      const { error: registrationError } = await supabase
        .from("children")
        .insert(childrenData);

      if (registrationError) {
        console.error("Registration error:", registrationError);
        return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
      }
    }

    // Send receipt email to parent and admin
    try {
      let programName = "Saturday Kids Club";
      let schedule = registrationData.saturdayClubSchedule;
      
      // Determine program and schedule based on program type
      if (registrationData.program_type === "Code Ninjas Club") {
        programName = "Code Ninjas Club";
        schedule = registrationData.schedule;
      } else if (registrationData.program_type === "Childminding") {
        programName = "Childminding Program";
        schedule = registrationData.childMindingSchedule;
      } else if (registrationData.program_type === "Summer Camp") {
        programName = "Summer Camp Program";
        schedule = registrationData.summerCampSchedule;
      } else if (registrationData.program_type === "Christmas Camp") {
        programName = "Christmas Camp Program";
        schedule = registrationData.christmasCampSchedule;
      }

      const receiptData: ReceiptData = {
        order_id: transaction.order_id,
        amount: transaction.amount, // This is in cedis
        program_type: registrationData.program_type,
        paymentDate: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
        parentName: registrationData.parentName,
        program: programName,
        schedule: schedule,
        reference: reference,
      };

      // Send receipt email directly using nodemailer
      const emailContent = generateReceiptEmailContent(receiptData);
      
      // Send receipt to parent
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: registrationData.parentEmail,
        subject: `Payment Receipt - ${receiptData.program} Registration`,
        ...emailContent,
      });

      // Send receipt to admin as well
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL, // Admin email
        subject: `Payment Receipt - ${receiptData.program} Registration (Admin Copy)`,
        ...emailContent,
      });

    } catch (receiptError) {
      console.error("Receipt email sending error:", receiptError);
      // Don't fail the webhook if receipt email fails
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