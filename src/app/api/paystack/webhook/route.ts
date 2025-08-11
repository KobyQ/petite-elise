import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { ETransactionStatus } from "@/utils/misc";
import { 
  generateReceiptEmailContent, 
  ReceiptData
} from "@/utils/template";
import { transporter } from "../../../../../config/nodemailer";

const PAYSTACK_SECRET_KEY = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

export async function GET() {
  return NextResponse.json({ 
    message: "Webhook endpoint is working",
    timestamp: new Date().toISOString(),
    env_check: {
      has_secret_key: !!process.env.PAYSTACK_SECRET_KEY,
      secret_key_length: process.env.PAYSTACK_SECRET_KEY?.length || 0
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== WEBHOOK STARTED ===");
    console.log("Environment check - PAYSTACK_SECRET_KEY exists:", !!process.env.PAYSTACK_SECRET_KEY);
    
    const { event, data } = await request.json();
    console.log("Webhook received:", { event, reference: data?.reference });
    
    if (event !== "charge.success") {
      console.log("Invalid webhook event:", event);
      throw new Error("Invalid event")
    }

    const reference = data.reference;
    if (!reference) {
      console.error("No reference in webhook data");
      return NextResponse.json({ error: "No reference provided" }, { status: 400 });
    }

    console.log("Processing webhook for reference:", reference);

    // Retrieve transaction from Supabase
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("reference", reference)
      .single();

    if (transactionError || !transaction) {
      console.error("Transaction not found for reference:", reference, transactionError);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    console.log("Transaction found:", { 
      id: transaction.id, 
      status: transaction.status, 
      program_type: transaction.details?.program_type 
    });

    if (transaction.status !== ETransactionStatus.pending) {
      console.log("Transaction is not pending, status:", transaction.status);
      return NextResponse.json({ error: "Transaction is not pending" }, { status: 400 });
    }

    console.log("About to verify payment with Paystack...");
    console.log("PAYSTACK_VERIFY_URL:", PAYSTACK_VERIFY_URL);
    console.log("Reference:", reference);

    // Verify payment with Paystack
    const response = await fetch(`${PAYSTACK_VERIFY_URL}/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    console.log("Paystack response status:", response.status);
    console.log("Paystack response headers:", Object.fromEntries(response.headers.entries()));

    const paymentData = await response.json();
    console.log("Paystack verification response:", paymentData);

    if (!paymentData.status || paymentData.data.status !== "success") {
      console.error("Payment verification failed:", paymentData);
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    console.log("Payment verified successfully, updating transaction status...");

    // Update transaction status to prevent infinite webhook calls
    const { error: updateError } = await supabase
      .from("transactions")
      .update({ status: paymentData.data.status })
      .eq("reference", reference);

    if (updateError) {
      console.error("Error updating transaction status:", updateError);
      return NextResponse.json({ error: "Failed to update transaction status" }, { status: 500 });
    }

    console.log("Transaction status updated to success");

    // Extract registration data from transaction details
    const registrationData = transaction.details;
    if (!registrationData) {
      console.error("No registration data in transaction");
      return NextResponse.json({ error: "No registration data found" }, { status: 400 });
    }

    console.log("Processing registration for program type:", registrationData.program_type);

    // Save registration based on program type
    if (registrationData.program_type === "Code Ninjas Club") {
      // Save to code-ninjas table
      const codeNinjasData = {
        parentName: registrationData.parentName,
        phoneNumber: registrationData.phoneNumber,
        email: registrationData.email,
        contactMode: registrationData.contactMode,
        childName: registrationData.childName,
        ageGroup: registrationData.ageGroup,
        schedule: registrationData.schedule,
        hasCodingExperience: registrationData.hasCodingExperience,
        codingExperience: registrationData.codingExperience,
        paymentMethod: registrationData.paymentMethod,
        specialRequests: registrationData.specialRequests,
        dropOffNames: registrationData.dropOffNames,
        dropChildOffSelf: registrationData.dropChildOffSelf,
        photographUsageConsent: registrationData.photographUsageConsent,
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
    } else if (registrationData.program_type === "School Fees") {
      // Fetch fee request details to get missing fields
      const { data: feeRequest, error: feeRequestError } = await supabase
        .from("fee_requests")
        .select("*")
        .eq("id", registrationData.request_id)
        .single();

      if (feeRequestError || !feeRequest) {
        console.error("Error fetching fee request:", feeRequestError);
        return NextResponse.json({ error: "Failed to fetch fee request details" }, { status: 500 });
      }

      // Update fee request status to paid
      const { error: updateError } = await supabase
        .from("fee_requests")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("id", registrationData.request_id);

      if (updateError) {
        console.error("Error updating fee request:", updateError);
        return NextResponse.json({ error: "Failed to update fee request" }, { status: 500 });
      }

      // Save to school_fees_payments table
      const schoolFeesPaymentData = {
        request_id: registrationData.request_id,
        parent_name: registrationData.parentName,
        child_name: registrationData.childName,
        email: feeRequest.email,
        phone_number: feeRequest.phone_number,
        programs: registrationData.programs,
        day_care_schedule: registrationData.dayCareSchedule,
        additional_notes: feeRequest.additional_notes || "",
        amount: transaction.amount, // Amount in cedis
        reference: reference,
        order_id: transaction.order_id,
        status: "paid",
      };

      console.log("Attempting to insert school fees payment:", schoolFeesPaymentData);

      const { error: paymentError } = await supabase
        .from("school_fees_payments")
        .insert(schoolFeesPaymentData);

      if (paymentError) {
        console.error("Error saving school fees payment:", paymentError);
        return NextResponse.json({ error: "Failed to save school fees payment" }, { status: 500 });
      }
      
      console.log("Successfully saved to school_fees_payments table");
    } else if (registrationData.program_type === "Shop Order") {
      // Handle shop orders
      console.log("Processing shop order for reference:", reference);
      console.log("Shop order data:", registrationData);
      console.log("Items structure:", {
        items_type: typeof registrationData.items,
        items_is_array: Array.isArray(registrationData.items),
        items_length: registrationData.items?.length || 0,
        first_item: registrationData.items?.[0]
      });
      
      try {
        // Validate required fields
        if (!registrationData.customer_name || !registrationData.customer_email || !registrationData.customer_phone || !registrationData.items) {
          console.error("Missing required fields for shop order:", {
            has_customer_name: !!registrationData.customer_name,
            has_customer_email: !!registrationData.customer_email,
            has_customer_phone: !!registrationData.customer_phone,
            has_items: !!registrationData.items,
            items_length: registrationData.items?.length || 0
          });
          return NextResponse.json({ error: "Missing required fields for shop order" }, { status: 400 });
        }

        const shopOrderData = {
          customer_name: registrationData.customer_name,
          customer_email: registrationData.customer_email,
          customer_phone: registrationData.customer_phone,
          items: registrationData.items,
          total_amount: transaction.amount, // Amount in cedis
          discount_code: registrationData.discount_code,
          discount_data: registrationData.discount_data,
          reference: reference,
          order_id: transaction.order_id,
          status: "paid",
          payment_date: new Date().toISOString(),
        };

        console.log("Attempting to insert shop order:", shopOrderData);

        const { data: insertedOrder, error: shopOrderError } = await supabase
          .from("shop_orders")
          .insert(shopOrderData)
          .select()
          .single();

        if (shopOrderError) {
          console.error("Error saving shop order:", shopOrderError);
          console.error("Shop order data that failed:", shopOrderData);
          console.error("Error details:", {
            code: shopOrderError.code,
            message: shopOrderError.message,
            details: shopOrderError.details,
            hint: shopOrderError.hint
          });
          
          // Try to get more details about the error
          if (shopOrderError.code === '23505') {
            console.error("Duplicate key error - order might already exist");
            // Check if order already exists
            const { data: existingOrder } = await supabase
              .from("shop_orders")
              .select("*")
              .eq("reference", reference)
              .single();
            
            if (existingOrder) {
              console.log("Order already exists:", existingOrder);
            }
          }
          
          return NextResponse.json({ error: "Failed to save shop order" }, { status: 500 });
        }

        console.log("Successfully saved shop order to database:", insertedOrder);

        // Update product stock quantities
        for (const item of registrationData.items) {
          try {
            // Get current stock quantity
            const { data: product, error: fetchError } = await supabase
              .from("products")
              .select("stock_quantity")
              .eq("id", item.product_id)
              .single();

            if (fetchError) {
              console.error(`Error fetching product ${item.product_id}:`, fetchError);
              continue;
            }

            const currentStock = product.stock_quantity || 0;
            const newStock = Math.max(0, currentStock - item.quantity);

            // Update stock quantity
            const { error: stockUpdateError } = await supabase
              .from("products")
              .update({ 
                stock_quantity: newStock
              })
              .eq("id", item.product_id);

            if (stockUpdateError) {
              console.error(`Error updating stock for product ${item.product_id}:`, stockUpdateError);
              // Don't fail the entire process if stock update fails
            } else {
              console.log(`Successfully updated stock for product ${item.product_id}: ${currentStock} -> ${newStock}`);
            }
          } catch (stockError) {
            console.error(`Exception updating stock for product ${item.product_id}:`, stockError);
          }
        }
        
        console.log("Successfully saved shop order and updated stock");
      } catch (shopOrderException) {
        console.error("Exception during shop order processing:", shopOrderException);
        return NextResponse.json({ error: "Exception during shop order processing" }, { status: 500 });
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

    // Update discount code usage count if a discount was applied
    if (registrationData.discount_code && registrationData.discount_data) {
      try {
        const { error: discountUpdateError } = await supabase
          .from("discount_codes")
          .update({ 
            usage_count: registrationData.discount_data.usage_count + 1 
          })
          .eq("discount_code", registrationData.discount_code);
 
        if (discountUpdateError) {
          console.error("Error updating discount code usage:", discountUpdateError);
          // Don't fail the entire process if discount update fails
        } else {
          console.log(`Updated usage count for discount code: ${registrationData.discount_code}`);
        }
      } catch (discountError) {
        console.error("Error updating discount code:", discountError);
        // Don't fail the entire process if discount update fails
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
      } else if (registrationData.program_type === "Baby & Me") {
        programName = "Baby & Me Program";
        schedule = "Monthly";
      } else if (registrationData.program_type === "Developmental Playgroup") {
        programName = "Developmental Playgroup Program";
        schedule = "Monthly";
      } else if (registrationData.program_type === "School Fees") {
        programName = registrationData.programs ? registrationData.programs.join(", ") : "School Fees";
        schedule = registrationData.day_care_schedule || "N/A";
      } else if (registrationData.program_type === "Shop Order") {
        programName = "Shop Order";
        schedule = `${registrationData.items?.length || 0} items`;
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
        to: registrationData.program_type === "Code Ninjas Club" ? registrationData.email : 
            registrationData.program_type === "School Fees" ? registrationData.email : 
            registrationData.program_type === "Shop Order" ? registrationData.customer_email :
            registrationData.parentEmail,
        subject: registrationData.program_type === "School Fees" 
          ? `Payment Receipt - School Fees Payment` 
          : registrationData.program_type === "Shop Order"
          ? `Payment Receipt - Shop Order #${transaction.order_id}`
          : `Payment Receipt - ${receiptData.program} Registration`,
        ...emailContent,
      });

      // Send receipt to admin as well
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: process.env.EMAIL, // Admin email
        subject: registrationData.program_type === "School Fees" 
          ? `Payment Receipt - School Fees Payment (Admin Copy)` 
          : registrationData.program_type === "Shop Order"
          ? `Payment Receipt - Shop Order #${transaction.order_id} (Admin Copy)`
          : `Payment Receipt - ${receiptData.program} Registration (Admin Copy)`,
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