import { NextRequest, NextResponse } from "next/server";
import supabase from "@/utils/supabaseClient";
import { sendRegistrationEmail } from "@/utils/helper";
import { ETransactionStatus } from "@/utils/misc";
import { emailHtmlTemplate } from "@/utils/template";
import { mailOptions, transporter } from "../../../../../config/nodemailer";

interface ReceiptData {
  order_id: string;
  amount: number;
  program_type?: string;
  paymentDate: string;
  parentName: string;
  program: string;
  schedule: string;
  reference: string;
}

// Function to generate receipt email content
const generateReceiptEmailContent = (data: ReceiptData) => {
  const receiptNumber = data.order_id;
  const formattedAmount = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(data.amount);
  
  // Determine branding based on program type
  const isCodeNinjas = data.program_type === "Code Ninjas Club";
  const schoolName = isCodeNinjas ? "CODE NINJAS CLUB" : "PETITE ELISE PRESCHOOL";
  const logoUrl = isCodeNinjas 
    ? "https://zakrttfpwuwyrsqvjvnx.supabase.co/storage/v1/object/public/petite-elise//coding-ninja-logo-black.jpg"
    : "https://zakrttfpwuwyrsqvjvnx.supabase.co/storage/v1/object/public/petite-elise//logo.jpg";
  const primaryColor = isCodeNinjas ? "#8ac23d" : "#007f94";
  const backgroundColor = isCodeNinjas ? "#000000" : "#007f94";

  const amountInWords = (amount: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    if (amount === 0) return 'Zero';
    if (amount < 10) return ones[amount];
    if (amount < 20) return teens[amount - 10];
    if (amount < 100) {
      return tens[Math.floor(amount / 10)] + (amount % 10 !== 0 ? ' ' + ones[amount % 10] : '');
    }
    if (amount < 1000) {
      return ones[Math.floor(amount / 100)] + ' Hundred' + (amount % 100 !== 0 ? ' and ' + amountInWords(amount % 100) : '');
    }
    if (amount < 100000) {
      return amountInWords(Math.floor(amount / 1000)) + ' Thousand' + (amount % 1000 !== 0 ? ' ' + amountInWords(amount % 1000) : '');
    }
    return 'Amount too large';
  };

  const htmlData = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt - ${schoolName}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .receipt-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: ${backgroundColor};
                color: white;
                padding: 20px 30px;
                display: flex;
                align-items: center;
                gap: 20px;
            }
            .logo {
                width: 60px;
                height: 60px;
                flex-shrink: 0;
            }
            .header-content {
                flex: 1;
                text-align: left;
            }
            .school-name {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 3px;
            }
            .school-address {
                font-size: 12px;
                opacity: 0.9;
                margin-bottom: 8px;
            }
            .receipt-title {
                font-size: 22px;
                font-weight: bold;
                margin: 0;
            }
            .receipt-details {
                padding: 30px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .detail-label {
                font-weight: bold;
                color: #333;
                min-width: 120px;
            }
            .detail-value {
                color: #666;
                text-align: right;
                flex: 1;
            }
            .amount-box {
                background-color: #f8f9fa;
                border: 2px solid ${primaryColor};
                border-radius: 4px;
                padding: 10px 15px;
                font-weight: bold;
                color: ${primaryColor};
                font-size: 18px;
            }
            .payment-purpose {
                background-color: #e8f5e8;
                border-left: 4px solid ${primaryColor};
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .amount-words {
                font-style: italic;
                color: #666;
                margin-top: 10px;
            }
            .signature-section {
                margin-top: 30px;
                display: flex;
                justify-content: space-between;
            }
            .signature-box {
                text-align: center;
                flex: 1;
                margin: 0 10px;
            }
            .signature-line {
                border-top: 1px solid #333;
                margin-top: 40px;
                padding-top: 5px;
                font-size: 12px;
                color: #666;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <img src="${logoUrl}" alt="${schoolName} Logo" class="logo">
                <div class="header-content">
                    <div class="school-name">${schoolName}</div>
                    <div class="school-address">1 LIBREVILLE LAKE ACCRA</div>
                    <div class="receipt-title">Receipt Voucher</div>
                </div>
            </div>
            
            <div class="receipt-details">
                <div class="detail-row">
                    <span class="detail-label">Receipt No.:</span>
                    <span class="detail-value">${receiptNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Dated:</span>
                    <span class="detail-value">${data.paymentDate}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Account:</span>
                    <span class="detail-value">${data.parentName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Through:</span>
                    <span class="detail-value"><strong>PAYSTACK</strong></span>
                </div>
                
                <div class="payment-purpose">
                    <div class="detail-label">On Account of:</div>
                    <div class="detail-value"><strong>BEING RECEIPT FOR ${data.program.toUpperCase()} - ${data.schedule.toUpperCase()}.</strong></div>
                    <div class="amount-words">
                        Amount (in words): <strong>${amountInWords(data.amount)} GHC Only</strong>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="amount-box" style="margin: 0 auto;">${formattedAmount}</div>
                </div>
                
                <div class="signature-section">
                    <div class="signature-box">
                        <div class="signature-line">Receiver's Signature</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line">Authorized Signatory</div>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing Petite Elise Preschool!</p>
                <p>This is an automated receipt. Please keep this for your records.</p>
                <p>Reference: ${data.reference}</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textData = `
    PETITE ELISE PRESCHOOL
    1 LIBREVILLE LAKE ACCRA
    
    RECEIPT VOUCHER
    
    Receipt No.: ${receiptNumber}
    Dated: ${data.paymentDate}
    
    Account: ${data.parentName}
    Amount: ${formattedAmount}
    
    Through: PAYSTACK
    
    On Account of: BEING RECEIPT FOR ${data.program.toUpperCase()} - ${data.schedule.toUpperCase()}.
    
    Amount (in words): ${amountInWords(data.amount)} GHC Only
    
    Reference: ${data.reference}
    
    Thank you for choosing Petite Elise Preschool!
  `;

  return {
    text: textData,
    html: htmlData,
  };
};

const PAYSTACK_SECRET_KEY = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
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

    // Send receipt email to parent
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

      const receiptData = {
        childName: registrationData.childName,
        parentName: registrationData.parentName,
        parentEmail: registrationData.parentEmail,
        program: programName,
        schedule: schedule,
        amount: transaction.amount, // This is in cedis
        reference: reference,
        order_id: transaction.order_id,
        paymentDate: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
        program_type: registrationData.program_type,
      };

      // Send receipt email directly using nodemailer
      const emailContent = generateReceiptEmailContent(receiptData);
      
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: receiptData.parentEmail,
        subject: `Payment Receipt - ${receiptData.program} Registration`,
        ...emailContent,
      });

    } catch (receiptError) {
      console.error("Receipt email sending error:", receiptError);
      // Don't fail the webhook if receipt email fails
    }

    // Send admin notification email
    try {
      const emailData = {
        childName: registrationData.childName,
        parentEmail: registrationData.parentEmail,
        parentPhoneNumber: registrationData.parentPhoneNumber,
        childDOB: registrationData.childDOB,
      };

      // Send admin email directly using nodemailer

      const textData = `A new child registration has been made.\n\n
      Child Name: ${emailData.childName}\n
      Parent Email: ${emailData.parentEmail}\n
      Phone Number: ${emailData.parentPhoneNumber}\n
      Child Date of Birth: ${emailData.childDOB}\n
      \nLogin to the admin panel to view more details.`;

      const htmlData = `
        <h3 class="form-heading" align="left">A new child registration has been made.</h3>
        <p class="form-answer" align="left">Child Name: ${emailData.childName}</p>
        <p class="form-answer" align="left">Parent Email: ${emailData.parentEmail}</p>
        <p class="form-answer" align="left">Phone Number: ${emailData.parentPhoneNumber}</p>
        <p class="form-answer" align="left">Child Date of Birth: ${emailData.childDOB}</p>
        <p class="form-answer" align="left"><strong>Login to the admin panel to view more details.</strong></p>
      `;

      await transporter.sendMail({
        ...mailOptions,
        subject: "New Child Registration",
        text: textData,
        html: emailHtmlTemplate(htmlData),
      });

    } catch (emailError) {
      console.error("Admin email sending error:", emailError);
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