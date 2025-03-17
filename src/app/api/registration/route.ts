/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { mailOptions, transporter } from "../../../../config/nodemailer";
import { emailHtmlTemplate } from "@/utils/template";

interface IRegistration {
  childName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  childDOB: number;
}

const generateRegistrationEmailContent = (data: IRegistration) => {
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.childName || !data.parentEmail || !data.parentPhoneNumber || data.childDOB === undefined) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    await transporter.sendMail({
      ...mailOptions,
      ...generateRegistrationEmailContent(data as IRegistration),
      subject: "New Child Registration",
    });

    return NextResponse.json(
      { message: "Registration email has been sent successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.response || "An unexpected error occurred.",
        message: error?.message || null,
      },
      { status: 500 }
    );
  }
}
