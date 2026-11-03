import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const message = typeof body?.message === "string" ? body.message.trim() : ""

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Fill in your name, email, and a message." }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "The contact form isn't wired up to an inbox yet — set RESEND_API_KEY and CONTACT_TO_EMAIL to turn it on." },
      { status: 500 },
    )
  }

  const from = process.env.CONTACT_FROM_EMAIL || "wick & web <onboarding@resend.dev>"

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `New message from ${name} via wick & web`,
      text: `${message}\n\n— ${name} (${email})`,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    return NextResponse.json({ error: "Couldn't send that — try again in a bit.", detail }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
