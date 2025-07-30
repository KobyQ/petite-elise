/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ReceiptData {
  order_id: string;
  amount: number;
  program_type?: string;
  paymentDate: string;
  parentName: string;
  program: string;
  schedule: string;
  reference: string;
}

export interface AdminNotificationData {
  childName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  childDOB: string;
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

// Function to generate receipt email content
export const generateReceiptEmailContent = (data: ReceiptData) => {
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

// Function to generate admin notification email content
export const generateAdminNotificationEmailContent = (data: AdminNotificationData) => {

  console.log(data);
  const textData = `A new child registration has been made.\n\n
  Child Name: ${data.childName}\n
  Parent Email: ${data.parentEmail}\n
  Phone Number: ${data.parentPhoneNumber}\n
  Child Date of Birth: ${data.childDOB}\n
  \nLogin to the admin panel to view more details.`;

  const htmlData = `
    <h3 class="form-heading" align="left">A new child registration has been made.</h3>
    <p class="form-answer" align="left">Child Name: ${data.childName}</p>
    <p class="form-answer" align="left">Parent Email: ${data.parentEmail}</p>
    <p class="form-answer" align="left">Phone Number: ${data.parentPhoneNumber}</p>
    <p class="form-answer" align="left">Child Date of Birth: ${data.childDOB}</p>
    <p class="form-answer" align="left"><strong>Login to the admin panel to view more details.</strong></p>
  `;

  return {
    text: textData,
    html: emailHtmlTemplate(htmlData),
  };
};

export function emailHtmlTemplate(htmlData: any) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <title>New Registration Request</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: #0056b3;
          color: white;
          text-align: center;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
        }
        .content {
          padding: 24px;
          color: #333;
        }
        .content h2 {
          font-size: 20px;
          color: #0056b3;
          margin-bottom: 12px;
        }
        .card {
          background: #f4f4f4;
          padding: 16px;
          border-radius: 6px;
          margin-top: 12px;
          font-size: 14px;
        }
      
        @media (max-width: 600px) {
          .content { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">New Registration Request</div>
        <div class="content">
          <h2>Details</h2>
          <div class="card">${htmlData}</div>
        </div>
     
      </div>
    </body>
  </html>
  `;
}

  