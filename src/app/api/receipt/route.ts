/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { transporter } from "../../../../config/nodemailer";

interface IReceiptData {
  childName: string;
  parentName: string;
  parentEmail: string;
  program: string;
  schedule: string;
  amount: number;
  reference: string;
  order_id: string;
  paymentDate: string;
}

const generateReceiptEmailContent = (data: IReceiptData) => {
  const receiptNumber = data.order_id;
  const formattedAmount = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(data.amount);

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
        <title>Payment Receipt - Petite Elise Preschool</title>
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
                background: linear-gradient(135deg, #008C7E 0%, #00B597 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .logo {
                width: 80px;
                height: 80px;
                background-color: white;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: #008C7E;
                font-size: 12px;
                line-height: 1.2;
            }
            .school-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .school-address {
                font-size: 14px;
                opacity: 0.9;
            }
            .receipt-title {
                font-size: 28px;
                font-weight: bold;
                margin: 20px 0;
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
                border: 2px solid #008C7E;
                border-radius: 4px;
                padding: 10px 15px;
                font-weight: bold;
                color: #008C7E;
                font-size: 18px;
            }
            .payment-purpose {
                background-color: #e8f5e8;
                border-left: 4px solid #008C7E;
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
                <div class="logo">
                    PETITE ELISE<br>PRESCHOOL
                </div>
                <div class="school-name">PETITE ELISE PRESCHOOL</div>
                <div class="school-address">1 LIBREVILLE LAKE ACCRA</div>
                <div class="receipt-title">Receipt Voucher</div>
            </div>
            
            <div class="receipt-details">
                <div class="detail-row">
                    <span class="detail-label">Receipt No.:</span>
                    <span class="detail-value">${receiptNumber}</span>
                    <span class="detail-label">Dated:</span>
                    <span class="detail-value">${data.paymentDate}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Account:</span>
                    <span class="detail-value">${data.parentName}</span>
                    <div class="amount-box">${formattedAmount}</div>
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.parentEmail || !data.amount || !data.reference) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    const emailContent = generateReceiptEmailContent(data as IReceiptData);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: data.parentEmail,
      subject: `Payment Receipt - ${data.program} Registration`,
      ...emailContent,
    });

    return NextResponse.json(
      { message: "Receipt email has been sent successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Receipt email error:", error);
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