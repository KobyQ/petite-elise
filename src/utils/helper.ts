
/* eslint-disable @typescript-eslint/no-explicit-any */
export const sendRegistrationEmail = async (data: any) => {
  try {
    const response = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to send registration email");
    }

  } catch (error: any) {
    console.error("Email sending failed:", error);
  }
};


export const initiatePayment = "https://api.paystack.co/transaction/initialize"
export const verifyPayment = "https://api.paystack.co/transaction/verify"