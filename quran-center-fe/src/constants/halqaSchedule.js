// Halqa schedules are stored as a single string on the backend (e.g. "Sat, Mon, Wed - 8:00 AM").
// These helpers keep every value the form produces in that exact shape.

export const DAY_OPTIONS = [
    { value: 'Sat', label: 'Saturday' },
    { value: 'Sun', label: 'Sunday' },
    { value: 'Mon', label: 'Monday' },
    { value: 'Tue', label: 'Tuesday' },
    { value: 'Wed', label: 'Wednesday' },
    { value: 'Thu', label: 'Thursday' },
    { value: 'Fri', label: 'Friday' },
]

const DAY_ORDER = DAY_OPTIONS.map(d => d.value)

const SEPARATOR = ' - '

// 6:00 AM -> 9:00 PM in 30 minute steps
export const TIME_OPTIONS = (() => {
    const options = []
    for (let minutes = 6 * 60; minutes <= 21 * 60; minutes += 30) {
        const hour24 = Math.floor(minutes / 60)
        const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
        const minute = String(minutes % 60).padStart(2, '0')
        const period = hour24 < 12 ? 'AM' : 'PM'
        const label = `${hour12}:${minute} ${period}`
        options.push({ value: label, label })
    }
    return options
})()

// ['Mon', 'Sat'] + '8:00 AM' -> 'Sat, Mon - 8:00 AM'
export const buildSchedule = (days, time) => {
    const sortedDays = [...(days || [])].sort(
        (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
    )
    if (!sortedDays.length) return time || null
    if (!time) return sortedDays.join(', ')
    return `${sortedDays.join(', ')}${SEPARATOR}${time}`
}

// 'Sat, Mon - 8:00 AM' -> { days: ['Sat', 'Mon'], time: '8:00 AM' }
// Values that predate the dropdown may not match, so anything unrecognised is dropped
// rather than shown as a broken selection.
export const parseSchedule = (schedule) => {
    if (!schedule) return { days: [], time: undefined }

    const [daysPart, timePart] = schedule.split(SEPARATOR)

    const days = daysPart
        .split(',')
        .map(day => day.trim())
        .filter(day => DAY_ORDER.includes(day))

    const time = TIME_OPTIONS.some(option => option.value === timePart?.trim())
        ? timePart.trim()
        : undefined

    return { days, time }
}
