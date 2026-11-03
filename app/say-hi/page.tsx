"use client"

import * as React from "react"

export default function SayHiPage() {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "sending" | "ok" | "err">("idle")
  const [error, setError] = React.useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Something went wrong.")
      setStatus("ok")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setStatus("err")
      setError(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  return (
    <main className="ssd-page" style={{ width: "100%" }}>
      <h1 data-silk-anchor>say hi</h1>
      <p className="ssd-lede" data-silk-anchor>
        Questions, custom scents, or you just want to tell us about your own spider. We read every one.
      </p>

      {status === "ok" ? (
        <p data-silk-anchor>Sent — thank you. We&apos;ll get back to you soon.</p>
      ) : (
        <form className="ssd-form" onSubmit={submit} data-silk-anchor>
          <div className="ssd-field">
            <label htmlFor="c-name">name</label>
            <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="ssd-field">
            <label htmlFor="c-email">email</label>
            <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="ssd-field">
            <label htmlFor="c-message">message</label>
            <textarea id="c-message" required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What's on your mind?" />
          </div>
          <button type="submit" className="ssd-btn" style={{ width: 160 }} disabled={status === "sending"}>
            {status === "sending" ? "sending…" : "send"}
          </button>
          {status === "err" && <p className="ssd-status err">{error}</p>}
        </form>
      )}
    </main>
  )
}
