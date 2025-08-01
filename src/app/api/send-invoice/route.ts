import { NextRequest, NextResponse } from "next/server";
import { formatMoneyToCedis } from "@/utils/constants";
import { transporter } from "../../../../config/nodemailer";
import supabase from "@/utils/supabaseClient";

interface InvoiceData {
  requestId: string;
  parentName: string;
  email: string;
  childName: string;
  programs: string[];
  dayCareSchedule?: string;
  amount: number;
  programBreakdown?: { [key: string]: number };
}

// Helper function to convert amount to words
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

const generateInvoiceEmailContent = (data: InvoiceData, paymentPageUrl: string) => {
  const invoiceNumber = `PetiteElise-${data.requestId.slice(0, 8)}`;
  const formattedAmount = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(data.amount);
  
  const logoUrl = "https://zakrttfpwuwyrsqvjvnx.supabase.co/storage/v1/object/public/petite-elise//logo.jpg";
  const primaryColor = "#007f94";
  const backgroundColor = "#007f94";

  // Generate program breakdown HTML if available
  let programBreakdownHtml = "";
  if (data.programBreakdown && Object.keys(data.programBreakdown).length > 0) {
    programBreakdownHtml = `
      <div class="program-breakdown">
        <h4 style="margin: 15px 0 10px 0; color: #333; font-size: 16px;">Program Breakdown:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold;">Program</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Amount</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    Object.entries(data.programBreakdown).forEach(([program, price]) => {
      programBreakdownHtml += `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${program}</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">${formatMoneyToCedis(price * 100)}</td>
        </tr>
      `;
    });
    
    programBreakdownHtml += `
          </tbody>
        </table>
      </div>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>School Fees Invoice - Petite Elise Preschool</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .invoice-container {
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
            .invoice-title {
                font-size: 22px;
                font-weight: bold;
                margin: 0;
            }
            .invoice-details {
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
            .payment-button {
                display: inline-block;
                background-color: ${primaryColor};
                color: white !important;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
            }
            .payment-button:hover {
                background-color: #005a7a;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
            .program-breakdown table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
            }
            .program-breakdown th,
            .program-breakdown td {
                padding: 8px;
                border: 1px solid #ddd;
                text-align: left;
            }
            .program-breakdown th {
                background-color: #f8f9fa;
                font-weight: bold;
            }
            .program-breakdown td:last-child {
                text-align: right;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <img src="${logoUrl}" alt="Petite Elise Preschool Logo" class="logo">
                <div class="header-content">
                    <div class="school-name">PETITE ELISE PRESCHOOL</div>
                    <div class="school-address">1 LIBREVILLE LAKE ACCRA</div>
                    <div class="invoice-title">School Fees Invoice</div>
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="detail-row">
                    <span class="detail-label">Invoice No.:</span>
                    <span class="detail-value">${invoiceNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Dated:</span>
                    <span class="detail-value">${new Date().toLocaleDateString()}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Parent:</span>
                    <span class="detail-value">${data.parentName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Student:</span>
                    <span class="detail-value">${data.childName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${data.email}</span>
                </div>
                
                <div class="payment-purpose">
                    <div class="detail-label">Programs:</div>
                    <div class="detail-value"><strong>${data.programs.join(", ").toUpperCase()}</strong></div>
                    ${data.dayCareSchedule ? `<div class="detail-label" style="margin-top: 10px;">Schedule:</div><div class="detail-value"><strong>${data.dayCareSchedule.toUpperCase()}</strong></div>` : ''}
                    <div class="amount-words">
                        Amount (in words): <strong>${amountInWords(data.amount)} GHC Only</strong>
                    </div>
                </div>
                
                ${programBreakdownHtml}
                
                <div class="detail-row">
                    <div class="amount-box" style="margin: 0 auto;">${formattedAmount}</div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${paymentPageUrl}" class="payment-button">
                        Review Invoice & Make Payment
                    </a>
                </div>
                
                <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                        <strong>Payment Instructions:</strong><br>
                        Click the button above to review your invoice and complete your payment securely through our website.
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <span style="word-break: break-all; color: ${primaryColor}; font-size: 12px;">${paymentPageUrl}</span>
                    </p>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing Petite Elise Preschool!</p>
                <p>If you have any questions, please contact us at <a href="mailto:${process.env.EMAIL}" style="color: ${primaryColor};">${process.env.EMAIL}</a></p>
                <p>This is an automated invoice. Please keep this for your records.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textData = `
    PETITE ELISE PRESCHOOL
    1 LIBREVILLE LAKE ACCRA
    
    SCHOOL FEES INVOICE
    
    Invoice No.: ${invoiceNumber}
    Dated: ${new Date().toLocaleDateString()}
    
    Parent: ${data.parentName}
    Student: ${data.childName}
    Email: ${data.email}
    
    Programs: ${data.programs.join(", ")}
    ${data.dayCareSchedule ? `Schedule: ${data.dayCareSchedule}` : ''}
    
    ${data.programBreakdown ? `Program Breakdown:\n${Object.entries(data.programBreakdown).map(([program, price]) => `- ${program}: ${formatMoneyToCedis(price * 100)}`).join('\n')}\n` : ''}
    
    Total Amount: ${formattedAmount}
    Amount (in words): ${amountInWords(data.amount)} GHC Only
    
    Payment Page: ${paymentPageUrl}
    
    Please click the link above to review your invoice and complete your payment securely through our website.
    
    If you have any questions, please contact us at ${process.env.EMAIL}.
    
    Thank you for choosing Petite Elise Preschool!
  `;

  return {
    text: textData,
    html,
  };
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Input validation
    if (
      !data.requestId ||
      !data.parentName ||
      !data.email ||
      !data.childName ||
      !data.programs ||
      data.programs.length === 0 ||
      !data.amount
    ) {
      return NextResponse.json(
        { error: "All required fields are missing." },
        { status: 400 }
      );
    }

    // Generate payment page URL with encrypted data
    const paymentPageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/fee-payment?requestId=${data.requestId}`;

    // Send invoice email
    const emailContent = generateInvoiceEmailContent(data as InvoiceData, paymentPageUrl);
    
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: data.email,
      subject: `School Fees Invoice - ${data.programs.join(", ")}`,
      ...emailContent,
    });

    // Send copy to admin
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `Invoice Sent - ${data.programs.join(", ")} (Admin Copy)`,
      text: `
        Invoice sent to ${data.parentName} (${data.email})
        
        Child: ${data.childName}
        Programs: ${data.programs.join(", ")}
        ${data.dayCareSchedule ? `Daycare Schedule: ${data.dayCareSchedule}` : ''}
        Amount: ${formatMoneyToCedis(data.amount * 100)}
        ${data.programBreakdown ? `Program Breakdown: ${Object.entries(data.programBreakdown).map(([program, price]) => `${program}: ${formatMoneyToCedis((price as number) * 100)}`).join(", ")}` : ''}
        Payment Page: ${paymentPageUrl}
      `,
      html: `
        <h2>Invoice Sent</h2>
        <p><strong>Parent:</strong> ${data.parentName} (${data.email})</p>
        <p><strong>Child:</strong> ${data.childName}</p>
        <p><strong>Programs:</strong> ${data.programs.join(", ")}</p>
        ${data.dayCareSchedule ? `<p><strong>Daycare Schedule:</strong> ${data.dayCareSchedule}</p>` : ''}
        <p><strong>Amount:</strong> ${formatMoneyToCedis(data.amount * 100)}</p>
        ${data.programBreakdown ? `<p><strong>Program Breakdown:</strong> ${Object.entries(data.programBreakdown).map(([program, price]) => `<strong>${program}:</strong> ${formatMoneyToCedis((price as number) * 100)}`).join(", ")}</p>` : ''}
        <p><strong>Payment Page:</strong> <a href="${paymentPageUrl}">${paymentPageUrl}</a></p>
      `,
    });

    return NextResponse.json(
      { 
        message: "Invoice sent successfully",
        paymentPageUrl: paymentPageUrl
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending invoice:", error);
    return NextResponse.json(
      {
        error: "Failed to send invoice",
        message: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
} 