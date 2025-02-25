/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { mailOptions, transporter } from "../../../../config/nodemailer";
import { emailHtmlTemplate } from "@/utils/template";

const messageFields = {
  subject: "Subject",
  fullName: "Full Name",
  email: "Email",
  phoneNumber: "Phone Number",
  message: "Message",
};

interface IContact {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

const generateEmailContent = (data: IContact) => {
  const stringData = Object.entries(data).reduce(
    (str, [key, val]) =>
      (str += `${messageFields[key as keyof typeof messageFields]}: \n${val} \n\n`),
    ""
  );

  const htmlData = Object.entries(data).reduce((str, [key, val]) => {
    return (str += `<h3 class="form-heading" align="left">${
      messageFields[key as keyof typeof messageFields]
    }</h3><p class="form-answer" align="left">${val}</p>`);
  }, "");

  const html = emailHtmlTemplate(htmlData);

  return {
    text: stringData,
    html,
  };
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Input validation (optional but recommended)
    if (
      !data.fullName ||
      !data.email ||
      !data.phoneNumber ||
      !data.subject ||
      !data.message
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Send the email
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(data as IContact),
      subject: (data as IContact).subject,
    });

    // Return success response
    return NextResponse.json(
      { message: "This message has been successfully sent" },
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
