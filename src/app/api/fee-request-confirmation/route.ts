import { NextRequest, NextResponse } from "next/server";
import { transporter } from "../../../../config/nodemailer";

interface FeeRequestData {
  parentName: string;
  email: string;
  childName: string;
  programs: string[];
  dayCareSchedule?: string;
}

const generateEmailContent = (data: FeeRequestData) => {
  const requestTypeLabels = {
    current_term: "Current Term Fees",
    next_term: "Next Term Fees (Early Payment)",
    outstanding: "Outstanding Balance",
    other: "Other"
  };

  const stringData = `
    Dear ${data.parentName},

    Thank you for submitting your fee request for ${data.childName}.

    Request Details:
    - Programs: ${data.programs.join(", ")}
    - Child Name: ${data.childName}

    We have received your request and our admin team will review it shortly. You will receive an invoice with payment instructions within 24-48 hours.

    If you have any urgent questions, please contact us at ${process.env.EMAIL}.

    Best regards,
    Petite Elise Preschool Team
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Fee Request Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007f94; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #007f94; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fee Request Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear ${data.parentName},</p>
          
          <p>Thank you for submitting your fee request for <strong>${data.childName}</strong>.</p>
          
                      <div class="details">
              <h3>Request Details:</h3>
              <ul>
                <li><strong>Programs:</strong> ${data.programs.join(", ")}</li>
                <li><strong>Child Name:</strong> ${data.childName}</li>
                ${data.dayCareSchedule ? `<li><strong>Daycare Schedule:</strong> ${data.dayCareSchedule}</li>` : ''}
              </ul>
            </div>
          
          <p>We have received your request and our admin team will review it shortly. You will receive an invoice with payment instructions within 24-48 hours.</p>
          
          <p>If you have any urgent questions, please contact us at <a href="mailto:${process.env.EMAIL}">${process.env.EMAIL}</a>.</p>
          
          <p>Best regards,<br>
          <strong>Petite Elise Preschool Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    text: stringData,
    html,
  };
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Input validation
    if (
      !data.parentName ||
      !data.email ||
      !data.childName ||
      !data.programs ||
      data.programs.length === 0
    ) {
      return NextResponse.json(
        { error: "All required fields are missing." },
        { status: 400 }
      );
    }

    // Send the confirmation email
    const emailContent = generateEmailContent(data as FeeRequestData);
    
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: data.email,
      subject: `Fee Request Confirmation - ${data.programs.join(", ")}`,
      ...emailContent,
    });

    // Also send notification to admin
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `New Fee Request - ${data.programs.join(", ")}`,
      text: `
        New fee request received:
        
        Parent: ${data.parentName}
        Email: ${data.email}
        Child: ${data.childName}
        Programs: ${data.programs.join(", ")}
        ${data.dayCareSchedule ? `Daycare Schedule: ${data.dayCareSchedule}` : ''}
        
        Please review and send invoice.
      `,
      html: `
        <h2>New Fee Request Received</h2>
        <p><strong>Parent:</strong> ${data.parentName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Child:</strong> ${data.childName}</p>
        <p><strong>Programs:</strong> ${data.programs.join(", ")}</p>
        ${data.dayCareSchedule ? `<p><strong>Daycare Schedule:</strong> ${data.dayCareSchedule}</p>` : ''}
        <p>Please review and send invoice.</p>
      `,
    });

    return NextResponse.json(
      { message: "Confirmation email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
    return NextResponse.json(
      {
        error: "Failed to send confirmation email",
        message: error?.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
} 