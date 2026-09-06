'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  id: number
  status: string
}

export function ReservationActions({ id, status }: Props) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const [showCancelModal, setShowCancelModal] =
    useState(false)

  function showToast(
    type: 'success' | 'error',
    message: string
  ) {
    setToast({ type, message })

    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  async function updateStatus(
    newStatus: 'confirmed' | 'cancelled'
  ) {
    setShowCancelModal(false)
    setLoading(true)
    setToast(null)

    try {
      const response = await fetch(
        `/api/admin/reservations/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      )

      const text = await response.text()

      let result: {
        success?: boolean
        error?: string
        message?: string
      } = {}

      if (text) {
        try {
          result = JSON.parse(text)
        } catch {
          console.error(
            'Server returned non-JSON response:',
            text
          )
        }
      }

      if (!response.ok) {
        showToast(
          'error',
          result.error ||
            `Unable to update reservation. (${response.status})`
        )
        return
      }

      showToast(
        'success',
        newStatus === 'confirmed'
          ? 'Reservation confirmed successfully.'
          : 'Reservation cancelled successfully.'
      )

      setTimeout(() => {
        router.refresh()
      }, 700)
    } catch (error) {
      console.error('Status update failed:', error)

      showToast(
        'error',
        'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const ConfirmIcon = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  )

  const CancelIcon = () => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )

  const LoadingSpinner = () => (
    <svg
      className="h-3.5 w-3.5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 1-9 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )

  function Toast() {
    if (!toast) return null

    return (
      <div className="fixed bottom-6 right-6 z-[60]">
        <div
          className={`flex max-w-sm items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 shadow-xl backdrop-blur-md ${
            toast.type === 'success'
              ? 'border-green-200'
              : 'border-red-200'
          }`}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {toast.type === 'success' ? (
              <ConfirmIcon />
            ) : (
              <CancelIcon />
            )}
          </span>

          <p className="text-sm font-medium text-foreground">
            {toast.message}
          </p>
        </div>
      </div>
    )
  }

  function CancelModal() {
    if (!showCancelModal) return null

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6 backdrop-blur-sm"
        onClick={() => setShowCancelModal(false)}
      >
        <div
          className="w-full max-w-sm rounded-3xl bg-background p-7 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Warning icon */}
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600">
            <CancelIcon />
          </div>

          <h3 className="font-serif text-2xl text-foreground">
            Cancel reservation?
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This will mark reservation #{id} as
            cancelled. You can review the booking again
            from the dashboard.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() =>
                setShowCancelModal(false)
              }
              disabled={loading}
              className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary disabled:opacity-50"
            >
              Keep it
            </button>

            <button
              type="button"
              onClick={() =>
                updateStatus('cancelled')
              }
              disabled={loading}
              className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  Cancelling...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <CancelIcon />
                  Cancel
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  /*
   * Cancelled reservations
   */
  if (status === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
        <CancelIcon />
        Cancelled
      </span>
    )
  }

  /*
   * Confirmed reservations
   */
  if (status === 'confirmed') {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Updating...
            </>
          ) : (
            <>
              <CancelIcon />
              Cancel
            </>
          )}
        </button>

        <CancelModal />
        <Toast />
      </>
    )
  }

  /*
   * Pending reservations
   */
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => updateStatus('confirmed')}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-xs font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Updating...
            </>
          ) : (
            <>
              <ConfirmIcon />
              Confirm
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowCancelModal(true)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CancelIcon />
          Cancel
        </button>
      </div>

      <CancelModal />
      <Toast />
    </>
  )
}