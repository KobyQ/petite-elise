import { NextRequest, NextResponse } from "next/server";
import { mailOptions, transporter } from "../../../../config/nodemailer";
import { emailHtmlTemplate } from "@/utils/template";

interface IAccountDeletionRequest {
  phoneNumber: string;
  email: string;
}

const generateAccountDeletionEmailContent = (data: IAccountDeletionRequest) => {
  const textData = `Account Deletion Request - Petite Elise App\n\n
  Phone Number: ${data.phoneNumber}\n
  Email Address: ${data.email}\n
  Request Date: ${new Date().toLocaleString()}\n
  Platform: Petite Elise App\n
  \nThis user has requested to delete their account from the Petite Elise app. Please process this account deletion request within 30 days as required by data protection regulations.`;

  const htmlData = `
    <h3 class="form-heading" align="left">Account Deletion Request - Petite Elise App</h3>
    <p class="form-answer" align="left"><strong>Phone Number:</strong> ${data.phoneNumber}</p>
    <p class="form-answer" align="left"><strong>Email Address:</strong> ${data.email}</p>
    <p class="form-answer" align="left"><strong>Request Date:</strong> ${new Date().toLocaleString()}</p>
    <p class="form-answer" align="left"><strong>Platform:</strong> Petite Elise App</p>
    <p class="form-answer" align="left"><strong>Action Required:</strong> This user has requested to delete their account from the Petite Elise app. Please process this account deletion request within 30 days as required by data protection regulations.</p>
    <p class="form-answer" align="left"><strong>Note:</strong> This request is specifically for deleting the user's account from the Petite Elise mobile application and associated web services.</p>
  `;

  return {
    text: textData,
    html: emailHtmlTemplate(htmlData),
  };
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.phoneNumber || !data.email) {
      return NextResponse.json(
        { error: "Phone number and email are required" },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      ...mailOptions,
      ...generateAccountDeletionEmailContent(data as IAccountDeletionRequest),
      subject: "Account Deletion Request - Petite Elise Preschool",
    });

    return NextResponse.json(
      { message: "Account deletion request submitted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending account deletion request:", error);
    return NextResponse.json(
      {
        error: error?.response || "An unexpected error occurred.",
        message: error?.message || null,
      },
      { status: 500 }
    );
  }
} 