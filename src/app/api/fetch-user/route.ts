/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabaseClient";

export async function GET() {
  try {
    // Ensure supabaseAdmin is initialized
    if (!supabaseAdmin) {
      throw new Error("Supabase Admin client is not initialized.");
    }

    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    return NextResponse.json({ users: data.users }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
