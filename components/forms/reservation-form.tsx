'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Field, Input, Select } from '@/components/forms/field'

const times = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

export function ReservationForm() {
  const [submitted, setSubmitted] = useState(false)
  const [availability, setAvailability] = useState<number | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState(2)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Keep party size within the currently available seats
  useEffect(() => {
    if (availability !== null) {
      if (availability === 0) {
        setSelectedGuests(1)
      } else if (selectedGuests > availability) {
        setSelectedGuests(Math.min(availability, 8))
      }
    }
  }, [availability, selectedGuests])

  async function checkAvailability(date: string, time: string) {
    setSelectedDate(date)
    setSelectedTime(time)

    if (!date || !time) {
      setAvailability(null)
      return
    }

    setCheckingAvailability(true)

    try {
      const response = await fetch(
        `/api/availability?date=${encodeURIComponent(
          date
        )}&time=${encodeURIComponent(time)}`
      )

      const result = await response.json()

      if (!response.ok) {
        setAvailability(null)
        return
      }

      setAvailability(result.availableSeats)
    } catch (error) {
      console.error('Availability check failed:', error)
      setAvailability(null)
    } finally {
      setCheckingAvailability(false)
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)

    if (availability === 0) {
      alert('Sorry, this time is fully booked.')
      return
    }

    if (
      availability !== null &&
      selectedGuests > availability
    ) {
      alert(
        `Only ${availability} ${
          availability === 1 ? 'seat is' : 'seats are'
        } available for this time.`
      )
      return
    }

    setSubmitting(true)

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: formData.get('guests'),
      phone: formData.get('phone'),
      special_request: formData.get('notes'),
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Something went wrong.')
        return
      }

      setSubmitted(true)
      setAvailability(null)
      setSelectedGuests(2)
      setSelectedDate('')
      setSelectedTime('')
      form.reset()
    } catch (error) {
      console.error('Reservation request failed:', error)
      alert('Unable to submit reservation. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-card p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-7 w-7" />
        </span>

        <h3 className="mt-6 font-serif text-3xl text-foreground">
          Request received
        </h3>

        <p className="mt-3 max-w-sm text-pretty leading-relaxed text-muted-foreground">
          Thank you. We&apos;ll confirm your table by email shortly.
          If your plans change, just reply and we&apos;ll sort it out.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Book another table
        </button>
      </div>
    )
  }

  const noSeatsAvailable = availability === 0

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card p-6 md:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">

        {/* Name */}
        <Field label="Full name" htmlFor="name">
          <Input
            id="name"
            name="name"
            required
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </Field>

        {/* Email */}
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@email.com"
            autoComplete="email"
          />
        </Field>

        {/* Date */}
        <Field label="Date" htmlFor="date">
          <Input
            id="date"
            name="date"
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => {
              const date = e.target.value
              checkAvailability(date, selectedTime)
            }}
          />
        </Field>

        {/* Time */}
        <Field label="Time" htmlFor="time">
          <Select
            id="time"
            name="time"
            required
            value={selectedTime}
            onChange={(e) => {
              const time = e.target.value
              checkAvailability(selectedDate, time)
            }}
          >
            <option value="" disabled>
              Select a time
            </option>

            {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          {checkingAvailability && (
            <p className="mt-2 text-sm text-muted-foreground">
              Checking availability...
            </p>
          )}

          {!checkingAvailability && availability !== null && (
            <p
              className={`mt-2 text-sm ${
                availability > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {availability > 0
                ? `${availability} ${
                    availability === 1 ? 'seat' : 'seats'
                  } available`
                : 'This time is fully booked'}
            </p>
          )}
        </Field>

        {/* Party size */}
        <Field label="Party size" htmlFor="guests">
          <Select
            id="guests"
            name="guests"
            required
            value={selectedGuests}
            disabled={noSeatsAvailable}
            onChange={(e) =>
              setSelectedGuests(Number(e.target.value))
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8]
              .filter(
                (n) =>
                  availability === null ||
                  n <= availability
              )
              .map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'guest' : 'guests'}
                </option>
              ))}
          </Select>
        </Field>

        {/* Phone */}
        <Field label="Phone (optional)" htmlFor="phone">
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(415) 555-0000"
            autoComplete="tel"
          />
        </Field>

        {/* Special requests */}
        <Field
          label="Special requests"
          htmlFor="notes"
          className="sm:col-span-2"
        >
          <Input
            id="notes"
            name="notes"
            placeholder="High chair, window seat, celebration…"
          />
        </Field>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={
          submitting ||
          checkingAvailability ||
          noSeatsAvailable
        }
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {submitting
          ? 'Sending...'
          : noSeatsAvailable
            ? 'Fully booked'
            : 'Request reservation'}

        {!submitting && !noSeatsAvailable && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        )}
      </button>

      <p className="mt-4 text-xs text-muted-foreground">
        We hold tables for 15 minutes past your reservation time.
      </p>
    </form>
  )
}