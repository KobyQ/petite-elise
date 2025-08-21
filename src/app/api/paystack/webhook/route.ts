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

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();
    
    if (event !== "charge.success") {
      throw new Error("Invalid event")
    }

    const reference = data.reference;
    if (!reference) {
      return NextResponse.json({ error: "No reference provided" }, { status: 400 });
    }

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
      return NextResponse.json({ error: "Failed to update transaction status" }, { status: 500 });
    }
    
   

    // Extract registration data from transaction details
    const registrationData = transaction.details;
    if (!registrationData) {
      return NextResponse.json({ error: "No registration data found" }, { status: 400 });
    }
    
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
        return NextResponse.json({ error: "Failed to fetch fee request details" }, { status: 500 });
      }

      // Update fee request status to paid
      const { error: updateError } = await supabase
        .from("fee_requests")
        .update({ status: "paid" })
        .eq("id", registrationData.request_id);

      if (updateError) {
        // Don't fail the entire process if status update fails
        // Continue processing the payment
      }

      // Save to school_fees_payments table
      const schoolFeesPaymentData = {
        request_id: registrationData.request_id,
        parent_name: registrationData.parentName,
        child_name: registrationData.childName,
        email: registrationData.email || feeRequest.email,
        phone_number: feeRequest.phone_number,
        programs: registrationData.programs,
        day_care_schedule: registrationData.dayCareSchedule || null,
        additional_notes: feeRequest.additional_notes || "",
        amount: transaction.amount, // Amount in pesewas (as stored by Paystack)
        reference: reference,
        order_id: transaction.order_id,
        status: "paid",
      };

      const { error: paymentError } = await supabase
        .from("school_fees_payments")
        .insert(schoolFeesPaymentData);
      
      if (paymentError) {
        return NextResponse.json({ error: "Failed to save school fees payment" }, { status: 500 });
      }
    } else if (registrationData.program_type === "Shop Order") {
      // Handle shop orders
      try {
        // Validate required fields
        if (!registrationData.customer_name || !registrationData.customer_email || !registrationData.customer_phone || !registrationData.items) {
          return NextResponse.json({ error: "Missing required fields for shop order" }, { status: 400 });
        }

        const shopOrderData = {
          customer_name: registrationData.customer_name,
          customer_email: registrationData.customer_email,
          customer_phone: registrationData.customer_phone,
          items: registrationData.items,
          total_amount: transaction.amount, // Amount in pesewas (as stored by Paystack)
          discount_code: registrationData.discount_code,
          discount_data: registrationData.discount_data,
          reference: reference,
          order_id: transaction.order_id,
          status: "paid",
          payment_date: new Date().toISOString(),
        };

        const { data: insertedOrder, error: shopOrderError } = await supabase
          .from("shop_orders")
          .insert(shopOrderData)
          .select()
          .single();

        if (shopOrderError) {
          return NextResponse.json({ error: "Failed to save shop order" }, { status: 500 });
        }

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
              // Don't fail the entire process if stock update fails
            }
          } catch (stockError) {
            // Continue processing other items
          }
        }
      } catch (shopOrderException) {
        return NextResponse.json({ error: "Exception during shop order processing" }, { status: 500 });
      }
    } else if (registrationData.program_type === "Christmas Camp") {
      // Handle Christmas Camp registrations (including siblings)
      if (registrationData.children && Array.isArray(registrationData.children)) {
        // Multiple children registration - save each as individual record
        console.log("Processing Christmas Camp children:", registrationData.children.length);
        for (const child of registrationData.children) {
          const childrenData = {
            childName: child.childName || "",
            childDOB: child.childDOB || "",
            childAge: child.childAge || "",
            parentName: child.parentName || "",
            parentEmail: child.parentEmail || "",
            parentPhoneNumber: child.parentPhoneNumber || "",
            parentWhatsappNumber: child.parentWhatsappNumber || "",
            address: child.address || "",
            emergencyContactName: child.emergencyContactName || "",
            emergencyContactPhoneNumber: child.emergencyContactPhoneNumber || "",
            emergencyContactWhatsappNumber: child.emergencyContactWhatsappNumber || "",
            emergencyContactRelationshipToChild: child.emergencyContactRelationshipToChild || "",
            dropChildOffSelf: child.dropChildOffSelf || "",
            dropOffNames: child.dropOffNames || [],
            programs: child.programs || ["Christmas Camp"],
            dayCareSchedule: child.dayCareSchedule || "",
            hasAllergies: child.hasAllergies || "",
            allergies: child.allergies || [],
            hasSpecialHealthConditions: child.hasSpecialHealthConditions || "",
            specialHealthConditions: child.specialHealthConditions || [],
            photographUsageConsent: child.photographUsageConsent || "",
            feeding: child.feeding || "",
            hasSiblings: child.hasSibling || "",
            sibling: child.hasSibling === "true" ? "Yes" : "No",
            saturdayClubSchedule: child.saturdayClubSchedule || "",
            summerCampSchedule: child.summerCampSchedule || "",
            familyId: registrationData.familyId || "",
            childMindingSchedule: child.childMindingSchedule || "",
            christmasCampSchedule: child.christmasCampSchedule || "",
            is_active: true,
            order_id: transaction.order_id,
            reference: reference,
          };

          try {
            console.log(`Inserting child: ${child.childName}`, { 
              childName: child.childName,
              christmasCampSchedule: child.christmasCampSchedule,
              familyId: registrationData.familyId 
            });
            
            const { error: registrationError } = await supabase
              .from("children")
              .insert(childrenData);

            if (registrationError) {
              console.error(`Database error for ${child.childName}:`, registrationError);
              return NextResponse.json({ 
                error: `Failed to save registration for ${child.childName}: ${registrationError.message}` 
              }, { status: 500 });
            }
          } catch (insertError: unknown) {
            console.error(`Insert error for ${child.childName}:`, insertError);
            const errorMessage = insertError instanceof Error ? insertError.message : 'Unknown error';
            return NextResponse.json({ 
              error: `Failed to save registration for ${child.childName}: ${errorMessage}` 
            }, { status: 500 });
          }
        }
      } else {
        // Single child registration (fallback for old format)
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
          return NextResponse.json({ error: "Failed to save registration" }, { status: 500 });
        }
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
          // Don't fail the entire process if discount update fails
        }
      } catch (discountError) {
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
        if (registrationData.children && Array.isArray(registrationData.children)) {
          // Multiple children - show all schedules
          const schedules = registrationData.children.map((child: { christmasCampSchedule?: string }) => child.christmasCampSchedule).filter(Boolean);
          schedule = schedules.length > 1 ? `${schedules.length} children: ${schedules.join(", ")}` : schedules[0] || "N/A";
        } else {
          schedule = registrationData.christmasCampSchedule;
        }
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

      // All amounts are now stored in pesewas, so convert to cedis for display
      const displayAmountCedis = transaction.amount / 100;

      const receiptData: ReceiptData = {
        order_id: transaction.order_id,
        amount: displayAmountCedis,
        program_type: registrationData.program_type,
        paymentDate: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
        parentName: registrationData.children && Array.isArray(registrationData.children) 
          ? registrationData.children[0]?.parentName || registrationData.parentName 
          : registrationData.parentName,
        program: programName,
        schedule: schedule,
        reference: reference,
      };

      // Send receipt email directly using nodemailer
      const emailContent = generateReceiptEmailContent(receiptData);
      
      // Send receipt to parent
      const parentEmail = registrationData.program_type === "Code Ninjas Club" ? registrationData.email : 
          registrationData.program_type === "School Fees" ? registrationData.email : 
          registrationData.program_type === "Shop Order" ? registrationData.customer_email :
          registrationData.children && Array.isArray(registrationData.children) 
            ? registrationData.children[0]?.parentEmail || registrationData.parentEmail
            : registrationData.parentEmail;

      await transporter.sendMail({
        from: process.env.EMAIL,
        to: parentEmail,
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
      // Don't fail the webhook if receipt email fails
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Payment verified and registration completed successfully",
    });
  } catch (error: unknown) {
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