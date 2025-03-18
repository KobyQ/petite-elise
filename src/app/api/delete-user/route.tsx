/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseAdmin } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {

    const { userId } = await req.json();

    if (!userId) {
      console.error("No userId provided");
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
