'use client'

import { useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Field, Input, Textarea, Select } from '@/components/forms/field'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  // Backend hook: replace this with a server action / API call later.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-card p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-6 font-serif text-3xl text-foreground">Message sent</h3>
        <p className="mt-3 max-w-sm text-pretty leading-relaxed text-muted-foreground">
          Thanks for reaching out. We read every note and usually reply within a
          day — often over a fresh cup.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-card p-6 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="c-name">
          <Input id="c-name" name="name" required placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="c-email">
          <Input
            id="c-email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Topic" htmlFor="c-topic" className="sm:col-span-2">
          <Select id="c-topic" name="topic" defaultValue="general">
            <option value="general">General question</option>
            <option value="events">Private events &amp; hire</option>
            <option value="wholesale">Wholesale &amp; beans</option>
            <option value="careers">Careers</option>
          </Select>
        </Field>
        <Field label="Message" htmlFor="c-message" className="sm:col-span-2">
          <Textarea id="c-message" name="message" required placeholder="How can we help?" />
        </Field>
      </div>

      <button
        type="submit"
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.01] sm:w-auto"
      >
        Send message
        <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
      </button>
    </form>
  )
}
