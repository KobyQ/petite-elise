/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseProjectUrl, supabaseServiceRoleKey } from "@/sanity/env"; // Ensure this is server-side only

const supabaseAdmin = createClient(supabaseProjectUrl, supabaseServiceRoleKey);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Create user with metadata (name)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name }, 
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
