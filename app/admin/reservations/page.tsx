import Link from 'next/link'
import { redirect } from 'next/navigation'
import db from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { ReservationActions } from '@/components/admin/reservation-actions'
import { LogoutButton } from '@/components/admin/logout-button'
import { ReservationFilters } from '@/components/admin/reservations-filters'
import { ReservationsSearch } from '@/components/admin/reservations-search'
import { ReservationDetails } from '@/components/admin/reservation-details'
import { ReservationsPagination } from '@/components/admin/reservations-pagination'
import { MobileReservationCard } from '@/components/admin/mobile-reservation-card'

export const runtime = 'nodejs'

type Reservation = {
  id: number
  name: string
  email: string
  phone: string | null
  date: string
  time: string
  guests: number
  special_request: string | null
  status: string
  created_at: string
}

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    date?: string
    search?: string
    period?: string
    page?: string
    pageSize?: string
    sort?: string
    order?: string
  }>
}) {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    redirect('/admin/login')
  }

  const {
    status,
    date,
    search,
    period,
    page,
    pageSize,
    sort,
    order,
  } = await searchParams

  // --------------------------------
  // Current date
  // --------------------------------

  const today = new Date()

  const todayString = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // --------------------------------
  // Pagination
  // --------------------------------

  const parsedPage = Number(page)
  const parsedPageSize = Number(pageSize)

  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1

  const allowedPageSizes = [10, 25, 50]

  const itemsPerPage = allowedPageSizes.includes(parsedPageSize)
    ? parsedPageSize
    : 10

  // --------------------------------
  // Validate filters
  // --------------------------------

  const validStatuses = [
    'pending',
    'confirmed',
    'cancelled',
  ]

  const selectedStatus = validStatuses.includes(status || '')
    ? status
    : undefined

  const validPeriods = [
    'today',
    'upcoming',
    'past',
  ]

  const selectedPeriod = validPeriods.includes(period || '')
    ? period
    : undefined

  // --------------------------------
  // Sorting
  // --------------------------------

  const validSorts = [
    'date',
    'time',
    'guests',
    'created_at',
  ]

  const selectedSort = validSorts.includes(sort || '')
    ? sort
    : 'date'

  const selectedOrder =
    order === 'desc'
      ? 'DESC'
      : 'ASC'

  const sortColumnMap: Record<string, string> = {
    date: 'date',
    time: 'time',
    guests: 'guests',
    created_at: 'created_at',
  }

  const sortColumn =
    sortColumnMap[selectedSort || 'date']

  // --------------------------------
  // Build filtered query
  // --------------------------------

  let whereQuery = `
    FROM reservations
    WHERE 1 = 1
  `

  const queryParams: string[] = []

  // Status

  if (selectedStatus) {
    whereQuery += ` AND status = ?`
    queryParams.push(selectedStatus)
  }

  // Date

  if (date) {
    whereQuery += ` AND date = ?`
    queryParams.push(date)
  } else if (selectedPeriod === 'today') {
    whereQuery += ` AND date = ?`
    queryParams.push(todayString)
  } else if (selectedPeriod === 'upcoming') {
    whereQuery += ` AND date >= ?`
    queryParams.push(todayString)
  } else if (selectedPeriod === 'past') {
    whereQuery += ` AND date < ?`
    queryParams.push(todayString)
  }

  // Search

  if (search) {
    whereQuery += `
      AND (
        name LIKE ?
        OR email LIKE ?
        OR phone LIKE ?
      )
    `

    const searchValue = `%${search}%`

    queryParams.push(
      searchValue,
      searchValue,
      searchValue
    )
  }

  // --------------------------------
  // Total filtered reservations
  // --------------------------------

  const totalResult = db
    .prepare(`
      SELECT COUNT(*) as count
      ${whereQuery}
    `)
    .get(...queryParams) as {
      count: number
    }

  const totalReservations = totalResult.count

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalReservations / itemsPerPage
    )
  )

  const safePage = Math.min(
    currentPage,
    totalPages
  )

  const offset =
    (safePage - 1) *
    itemsPerPage

  // --------------------------------
  // Get paginated reservations
  // --------------------------------

  const reservations = db
    .prepare(`
      SELECT
        id,
        name,
        email,
        phone,
        date,
        time,
        guests,
        special_request,
        status,
        created_at
      ${whereQuery}
      ORDER BY
        ${sortColumn}
        ${selectedOrder}
      LIMIT ? OFFSET ?
    `)
    .all(
      ...queryParams,
      itemsPerPage,
      offset
    ) as Reservation[]

  // --------------------------------
  // Dashboard stats
  // --------------------------------

  const allReservations = db
    .prepare(`
      SELECT
        id,
        date,
        time,
        guests,
        status
      FROM reservations
    `)
    .all() as {
      id: number
      date: string
      time: string
      guests: number
      status: string
    }[]

  const totalCount =
    allReservations.length

  const todayCount =
    allReservations.filter(
      (reservation) =>
        reservation.date === todayString
    ).length

  const todayGuests =
    allReservations
      .filter(
        (reservation) =>
          reservation.date === todayString &&
          reservation.status !== 'cancelled'
      )
      .reduce(
        (total, reservation) =>
          total + reservation.guests,
        0
      )

  const upcomingCount =
    allReservations.filter(
      (reservation) =>
        reservation.date > todayString &&
        reservation.status !== 'cancelled'
    ).length

  const pendingCount =
    allReservations.filter(
      (reservation) =>
        reservation.status === 'pending'
    ).length

  const confirmedCount =
    allReservations.filter(
      (reservation) =>
        reservation.status === 'confirmed'
    ).length

  const cancelledCount =
    allReservations.filter(
      (reservation) =>
        reservation.status === 'cancelled'
    ).length

  // --------------------------------
  // 7-day guest trend
  // --------------------------------

  const trendDays = Array.from(
    { length: 7 },
    (_, index) => {
      const trendDate = new Date()

      trendDate.setDate(
        trendDate.getDate() - (6 - index)
      )

      const year =
        trendDate.getFullYear()

      const month = String(
        trendDate.getMonth() + 1
      ).padStart(2, '0')

      const day = String(
        trendDate.getDate()
      ).padStart(2, '0')

      const dateString =
        `${year}-${month}-${day}`

      const guests =
        allReservations
          .filter(
            (reservation) =>
              reservation.date === dateString &&
              reservation.status !== 'cancelled'
          )
          .reduce(
            (total, reservation) =>
              total + reservation.guests,
            0
          )

      return {
        date: dateString,
        guests,
        label: trendDate.toLocaleDateString(
          'en-US',
          {
            weekday: 'short',
          }
        ),
      }
    }
  )

  const maxTrendGuests = Math.max(
    ...trendDays.map(
      (day) => day.guests
    ),
    1
  )

  // --------------------------------
  // Busiest time slots & dates
  // --------------------------------

  const activeReservations =
    allReservations.filter(
      (reservation) =>
        reservation.status !== 'cancelled'
    )

  // Busiest time slots

  const timeSlotMap =
    new Map<string, number>()

  activeReservations.forEach(
    (reservation) => {
      const current =
        timeSlotMap.get(
          reservation.time
        ) || 0

      timeSlotMap.set(
        reservation.time,
        current + reservation.guests
      )
    }
  )

  const busiestTimeSlots =
    Array.from(
      timeSlotMap.entries()
    )
      .map(
        ([time, guests]) => ({
          time,
          guests,
        })
      )
      .sort(
        (a, b) =>
          b.guests - a.guests
      )
      .slice(0, 5)

  // Busiest dates

  const dateMap =
    new Map<string, number>()

  activeReservations.forEach(
    (reservation) => {
      const current =
        dateMap.get(
          reservation.date
        ) || 0

      dateMap.set(
        reservation.date,
        current + reservation.guests
      )
    }
  )

  const busiestDates =
    Array.from(
      dateMap.entries()
    )
      .map(
        ([date, guests]) => ({
          date,
          guests,
        })
      )
      .sort(
        (a, b) =>
          b.guests - a.guests
      )
      .slice(0, 5)

  const maxTimeGuests =
    Math.max(
      ...busiestTimeSlots.map(
        (slot) => slot.guests
      ),
      1
    )

  const maxDateGuests =
    Math.max(
      ...busiestDates.map(
        (day) => day.guests
      ),
      1
    )

  // --------------------------------
  // Helper for sorting links
  // --------------------------------

  function getSortUrl(column: string) {
    const params =
      new URLSearchParams()

    if (selectedStatus) {
      params.set(
        'status',
        selectedStatus
      )
    }

    if (date) {
      params.set(
        'date',
        date
      )
    }

    if (selectedPeriod) {
      params.set(
        'period',
        selectedPeriod
      )
    }

    if (search) {
      params.set(
        'search',
        search
      )
    }

    params.set(
      'pageSize',
      String(itemsPerPage)
    )

    params.set(
      'page',
      '1'
    )

    params.set(
      'sort',
      column
    )

    const nextOrder =
      selectedSort === column &&
      selectedOrder === 'ASC'
        ? 'desc'
        : 'asc'

    params.set(
      'order',
      nextOrder
    )

    return `/admin/reservations?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Anything Else
            </p>

            <h1 className="mt-2 font-serif text-4xl text-foreground">
              Reservations
            </h1>

            <p className="mt-2 text-muted-foreground">
              Manage your café bookings from here.
            </p>

          </div>

                    <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/menu"
              className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-muted"
            >
              Manage Menu
            </Link>

            <LogoutButton />
          </div>

        </div>

        {/* Stats */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">

          {/* Total */}

          <div className="rounded-2xl bg-card p-6">

            <p className="text-sm text-muted-foreground">
              Total
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {totalCount}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              All reservations
            </p>

          </div>

          {/* Today */}

          <div className="rounded-2xl bg-card p-6">

            <p className="text-sm text-muted-foreground">
              Today
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {todayCount}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Reservations today
            </p>

          </div>

          {/* Today's Guests */}

          <div className="rounded-2xl bg-card p-6">

            <p className="text-sm text-muted-foreground">
              Today's Guests
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {todayGuests}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Expected guests
            </p>

          </div>

          {/* Upcoming */}

          <div className="rounded-2xl bg-card p-6">

            <p className="text-sm text-muted-foreground">
              Upcoming
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {upcomingCount}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Future reservations
            </p>

          </div>

          {/* Pending */}

          <div className="rounded-2xl bg-card p-6">

            <p className="text-sm text-muted-foreground">
              Pending
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {pendingCount}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Awaiting confirmation
            </p>

          </div>

          {/* Confirmed */}

          <div className="rounded-2xl bg-card p-6">

            <p className="text-sm text-muted-foreground">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {confirmedCount}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Confirmed bookings
            </p>

          </div>

          {/* Cancelled */}

          <div className="rounded-2xl bg-card p-6">

            <p className="text-sm text-muted-foreground">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-semibold text-foreground">
              {cancelledCount}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Cancelled bookings
            </p>

          </div>

        </div>

        {/* 7-Day Guest Trend */}

        <div className="mb-8 rounded-3xl bg-card p-6">

          <div className="mb-6">

            <h2 className="font-serif text-2xl text-foreground">
              Guest Trend
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Guest bookings across the last 7 days
            </p>

          </div>

          <div className="flex h-64 items-end gap-3 sm:gap-5">

            {trendDays.map((day) => {

              const height =
                day.guests === 0
                  ? 4
                  : Math.max(
                      (day.guests /
                        maxTrendGuests) *
                        100,
                      8
                    )

              return (
                <div
                  key={day.date}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >

                  <span className="mb-2 text-xs font-medium text-foreground">
                    {day.guests}
                  </span>

                  <div className="flex h-full w-full max-w-12 items-end">

                    <div
                      className="w-full rounded-t-xl bg-foreground/80 transition-all duration-300 hover:bg-foreground"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${day.date}: ${day.guests} guests`}
                    />

                  </div>

                  <span className="mt-3 text-xs font-medium text-muted-foreground">
                    {day.label}
                  </span>

                  <span className="mt-1 text-[10px] text-muted-foreground">
                    {day.date.slice(5)}
                  </span>

                </div>
              )
            })}

          </div>

        </div>

        {/* Analytics */}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">

          {/* Busiest Time Slots */}

          <div className="rounded-3xl bg-card p-6">

            <div className="mb-6">

              <h2 className="font-serif text-2xl text-foreground">
                Busiest Time Slots
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Times with the highest number of guests
              </p>

            </div>

            <div className="space-y-5">

              {busiestTimeSlots.length === 0 ? (

                <p className="text-sm text-muted-foreground">
                  No reservation data yet.
                </p>

              ) : (

                busiestTimeSlots.map(
                  (slot) => {

                    const width =
                      Math.max(
                        (slot.guests /
                          maxTimeGuests) *
                          100,
                        8
                      )

                    return (
                      <div key={slot.time}>

                        <div className="mb-2 flex items-center justify-between text-sm">

                          <span className="font-medium text-foreground">
                            {slot.time}
                          </span>

                          <span className="text-muted-foreground">
                            {slot.guests} guests
                          </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-secondary">

                          <div
                            className="h-full rounded-full bg-foreground transition-all"
                            style={{
                              width: `${width}%`,
                            }}
                          />

                        </div>

                      </div>
                    )
                  }
                )

              )}

            </div>

          </div>

          {/* Busiest Dates */}

          <div className="rounded-3xl bg-card p-6">

            <div className="mb-6">

              <h2 className="font-serif text-2xl text-foreground">
                Busiest Dates
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Dates with the highest number of guests
              </p>

            </div>

            <div className="space-y-5">

              {busiestDates.length === 0 ? (

                <p className="text-sm text-muted-foreground">
                  No reservation data yet.
                </p>

              ) : (

                busiestDates.map(
                  (day) => {

                    const width =
                      Math.max(
                        (day.guests /
                          maxDateGuests) *
                          100,
                        8
                      )

                    const formattedDate =
                      new Date(
                        `${day.date}T00:00:00`
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )

                    return (
                      <div key={day.date}>

                        <div className="mb-2 flex items-center justify-between text-sm">

                          <span className="font-medium text-foreground">
                            {formattedDate}
                          </span>

                          <span className="text-muted-foreground">
                            {day.guests} guests
                          </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-secondary">

                          <div
                            className="h-full rounded-full bg-foreground transition-all"
                            style={{
                              width: `${width}%`,
                            }}
                          />

                        </div>

                      </div>
                    )
                  }
                )

              )}

            </div>

          </div>

        </div>

        {/* Filters */}

        <ReservationFilters />

        {/* Search */}

        <ReservationsSearch />

        {/* Reservations */}

        <div className="overflow-hidden rounded-3xl bg-card">

          {reservations.length === 0 ? (

            <div className="p-10 text-center">

              <h2 className="font-serif text-2xl text-foreground">
                No reservations found
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing or clearing your filters.
              </p>

            </div>

          ) : (

            <>

              {/* Desktop Table */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[1100px] text-left">

                  <thead className="border-b border-border">

                    <tr>

                      <th className="px-6 py-4 text-sm font-medium">
                        Guest
                      </th>

                      <th className="px-6 py-4 text-sm font-medium">

                        <a
                          href={getSortUrl('date')}
                          className="inline-flex items-center gap-1 hover:opacity-70"
                        >
                          Date

                          {selectedSort === 'date' &&
                            (
                              selectedOrder === 'ASC'
                                ? ' ↑'
                                : ' ↓'
                            )}

                        </a>

                      </th>

                      <th className="px-6 py-4 text-sm font-medium">

                        <a
                          href={getSortUrl('time')}
                          className="inline-flex items-center gap-1 hover:opacity-70"
                        >
                          Time

                          {selectedSort === 'time' &&
                            (
                              selectedOrder === 'ASC'
                                ? ' ↑'
                                : ' ↓'
                            )}

                        </a>

                      </th>

                      <th className="px-6 py-4 text-sm font-medium">

                        <a
                          href={getSortUrl('guests')}
                          className="inline-flex items-center gap-1 hover:opacity-70"
                        >
                          Guests

                          {selectedSort === 'guests' &&
                            (
                              selectedOrder === 'ASC'
                                ? ' ↑'
                                : ' ↓'
                            )}

                        </a>

                      </th>

                      <th className="px-6 py-4 text-sm font-medium">
                        Contact
                      </th>

                      <th className="px-6 py-4 text-sm font-medium">
                        Request
                      </th>

                      <th className="px-6 py-4 text-sm font-medium">
                        Status
                      </th>

                      <th className="px-6 py-4 text-sm font-medium">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {reservations.map(
                      (reservation) => (

                        <tr
                          key={reservation.id}
                          className="border-b border-border transition-colors last:border-0 hover:bg-secondary/40"
                        >

                          {/* Guest */}

                          <td className="px-6 py-5">

                            <p className="font-medium text-foreground">
                              {reservation.name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Booking #{reservation.id}
                            </p>

                          </td>

                          {/* Date */}

                          <td className="px-6 py-5 text-sm">
                            {reservation.date}
                          </td>

                          {/* Time */}

                          <td className="px-6 py-5 text-sm">
                            {reservation.time}
                          </td>

                          {/* Guests */}

                          <td className="px-6 py-5 text-sm">
                            {reservation.guests}{' '}
                            {reservation.guests === 1
                              ? 'guest'
                              : 'guests'}
                          </td>

                          {/* Contact */}

                          <td className="px-6 py-5 text-sm">

                            <p>
                              {reservation.email}
                            </p>

                            {reservation.phone && (
                              <p className="mt-1 text-muted-foreground">
                                {reservation.phone}
                              </p>
                            )}

                          </td>

                          {/* Request */}

                          <td className="max-w-[220px] px-6 py-5 text-sm text-muted-foreground">

                            <span
                              className="block max-w-[220px] truncate"
                              title={
                                reservation.special_request || ''
                              }
                            >
                              {reservation.special_request ||
                                'No special request'}
                            </span>

                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                reservation.status === 'confirmed'
                                  ? 'bg-green-100 text-green-700'
                                  : reservation.status === 'cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {reservation.status
                                .charAt(0)
                                .toUpperCase() +
                                reservation.status.slice(1)}
                            </span>

                          </td>

                          {/* Actions */}

                          <td className="px-6 py-5">

                            <div className="flex flex-wrap gap-2">

                              <ReservationDetails
                                reservation={reservation}
                              />

                              <ReservationActions
                                id={reservation.id}
                                status={reservation.status}
                              />

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* Mobile Cards */}

              <div className="space-y-4 p-4 md:hidden">

                {reservations.map(
                  (reservation) => (

                    <MobileReservationCard
                      key={reservation.id}
                      reservation={reservation}
                    />

                  )
                )}

              </div>

            </>

          )}

        </div>

        {/* Pagination */}

        <ReservationsPagination
          currentPage={safePage}
          totalPages={totalPages}
          totalReservations={totalReservations}
          pageSize={itemsPerPage}
        />

      </div>

    </main>
  )
}