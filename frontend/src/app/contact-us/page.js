"use client";

import { useState } from "react";

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    window.location.href = `mailto:hello@diyanailsart.com?subject=Contact%20Form&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    )}`;
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-[#FCF9F5] p-8 sm:p-12 border border-[#E8DCCB]/60">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B39178]">Contact Us</p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-[#222]">
            Let&apos;s talk about your next set
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#6B5A4C]">
            Send a message if you want help choosing a style, placing a custom order, or checking availability.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-8 border border-gray-100 shadow-sm">
          <div className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#B39178]"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email address"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#B39178]"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="How can we help?"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#B39178]"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#111] px-4 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Send Message
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
