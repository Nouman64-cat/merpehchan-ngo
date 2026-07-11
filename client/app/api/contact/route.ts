import { NextResponse } from "next/server";
import { headOffice } from "@/lib/data/site";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const subject = payload.subject?.trim();
  const message = payload.message?.trim();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.CONTACT_TO_EMAIL ?? headOffice.emails[0];

  if (resendApiKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
        to: notifyEmail,
        reply_to: email,
        subject: `[Website Contact] ${subject}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error(
        "Failed to send contact email via Resend:",
        await response.text()
      );
      return NextResponse.json(
        {
          error:
            "We couldn't send your message right now. Please try again later.",
        },
        { status: 502 }
      );
    }
  } else {
    // Email delivery isn't configured yet, so the submission is logged
    // instead of silently dropped. Set RESEND_API_KEY and CONTACT_TO_EMAIL
    // in .env.local to enable real delivery via https://resend.com.
    console.info("Contact form submission (email delivery not configured):", {
      name,
      email,
      subject,
      message,
    });
  }

  return NextResponse.json({ success: true });
}
