
import { useEffect, useState } from 'react'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwkHR7GBmBripT5RUGAl4_he1AiKxM9qpCi23zfco1esnIEKqkMU1feWXQOAr8E79Vllg/exec'

const USER_NAME_KEY = 'creator_details_user_name'
const SUBMISSION_COUNT_KEY = 'creator_details_submission_count'

const initialForm = {
  instagramLink: '',
  creatorUsername: '',
  phone: '',
  description: '',
}

function App() {
  const [userName, setUserName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [showNamePopup, setShowNamePopup] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [submissionCount, setSubmissionCount] = useState(0)

  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')

  useEffect(() => {
    const savedName = localStorage.getItem(USER_NAME_KEY)
    const savedCount = localStorage.getItem(SUBMISSION_COUNT_KEY)

    if (savedName !== null) {
      setUserName(savedName)
    } else {
      setShowNamePopup(true)
    }

    if (savedCount !== null) {
      setSubmissionCount(Number(savedCount) || 0)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // Name is optional. Continue even when the name is blank.
  const saveUserName = () => {
    const name = nameInput.trim()

    localStorage.setItem(USER_NAME_KEY, name)
    setUserName(name)
    setNameInput('')
    setShowNamePopup(false)
  }

  const changeUserName = () => {
    const name = nameInput.trim()

    localStorage.setItem(USER_NAME_KEY, name)
    setUserName(name)
    setNameInput('')
    setShowProfile(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    if (
      !GOOGLE_SCRIPT_URL ||
      GOOGLE_SCRIPT_URL.includes('PASTE_YOUR_NEW')
    ) {
      setMessageType('error')
      setMessage('Please add your Google Apps Script URL in App.jsx.')
      return
    }

    setSubmitting(true)
    setSubmitted(false)
    setMessage('')
    setMessageType('info')

    const body = new URLSearchParams({
      instagramLink: form.instagramLink.trim(),
      creatorUsername: form.creatorUsername.trim(),
      phone: form.phone.trim(),
      description: form.description.trim(),
      filledBy: userName,
    })

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: body.toString(),
      })

      // no-cors does not allow the browser to inspect the server response.
      // This indicates the request was sent, not confirmed sheet storage.
      const newCount = submissionCount + 1

      setSubmissionCount(newCount)
      localStorage.setItem(
        SUBMISSION_COUNT_KEY,
        String(newCount)
      )

      setSubmitted(true)
      setMessageType('success')
      setMessage(
        'Request sent. Please verify the new entry in Google Sheets.'
      )

      setForm({ ...initialForm })

      window.setTimeout(() => {
        setSubmitted(false)
      }, 2500)
    } catch (error) {
      setMessageType('error')
      setMessage(
        'Unable to send the request. Please check your internet connection and Apps Script deployment.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100'

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-amber-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xl shadow-md shadow-yellow-200">
              ✦
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
                Job Search
                <span className="text-amber-600">
                  {' '}Creator Details
                </span>
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Creator information management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNameInput(userName)
              setShowProfile(true)
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-lg transition hover:bg-yellow-100 focus:outline-none focus:ring-4 focus:ring-amber-100"
            title="Open profile"
            aria-label="Open profile"
          >
            👤
          </button>
        </div>
      </header>

      {/* OPTIONAL NAME POPUP */}
      {showNamePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-300 text-3xl">
              👋
            </div>

            <h2 className="text-center text-2xl font-extrabold">
              Welcome!
            </h2>

            <p className="mt-2 text-center text-sm text-slate-500">
              Enter your name if you want to identify who submitted the details.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveUserName()
              }}
              className="mt-6 space-y-4"
            >
              <label
                htmlFor="welcomeName"
                className="block text-sm font-semibold"
              >
                Your Name (Optional)
              </label>

              <input
                id="welcomeName"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                autoFocus
                className={inputClass}
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-yellow-400 px-5 py-3.5 font-bold text-slate-900 shadow-lg shadow-yellow-200 transition hover:bg-yellow-300"
              >
                Continue →
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(USER_NAME_KEY, '')
                  setUserName('')
                  setShowNamePopup(false)
                }}
                className="w-full rounded-xl px-5 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50"
              >
                Skip for now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROFILE POPUP */}
      {showProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          onClick={() => setShowProfile(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold">Your Profile</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your display name
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded-full bg-slate-100 px-3 py-2 hover:bg-slate-200"
                aria-label="Close profile"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 rounded-2xl bg-amber-50 p-4">
              <p className="text-xs text-slate-500">Current name</p>
              <p className="mt-1 font-bold text-amber-700">
                {userName || 'Not provided'}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                changeUserName()
              }}
            >
              <label
                htmlFor="changeName"
                className="mb-2 block text-sm font-semibold"
              >
                Change Name (Optional)
              </label>

              <input
                id="changeName"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                className={inputClass}
              />

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-yellow-400 px-5 py-3 font-bold text-slate-900 transition hover:bg-yellow-300"
              >
                Save Name
              </button>
            </form>

            <div className="mt-5 rounded-2xl border border-amber-100 bg-slate-50 p-4 text-center">
              <p className="text-sm text-slate-500">
                Submissions on this device
              </p>
              <p className="mt-1 text-3xl font-black text-amber-600">
                {submissionCount}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                This count is stored locally, not retrieved from Google Sheets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl">
          {/* PAGE TITLE */}
          <div className="mb-7 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Creator Management
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Creator Details
              <span className="block text-amber-600">
                Update Form
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Add Instagram creator information to your job search database.
            </p>
          </div>

          {/* USER SUMMARY */}
          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                👤
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Submitting as</p>
                <p className="truncate font-bold text-slate-800">
                  {userName || 'Anonymous'}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs text-slate-400">Submitted on device</p>
              <p className="text-xl font-black text-amber-600">
                {submissionCount}
              </p>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-xl shadow-amber-100/70">
            <div className="h-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500" />

            <div className="p-5 sm:p-8">
              <div className="mb-7 flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-xl shadow-sm">
                  ✨
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">
                    Creator Information
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    All fields are optional. Fill in any details you have.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* INSTAGRAM LINK */}
                <div>
                  <label
                    htmlFor="instagramLink"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Creator Instagram Link
                    <span className="ml-2 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="instagramLink"
                    name="instagramLink"
                    type="text"
                    value={form.instagramLink}
                    onChange={handleChange}
                    placeholder="https://www.instagram.com/username/"
                    autoComplete="off"
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Enter the creator's Instagram profile link if available.
                  </p>
                </div>

                {/* USERNAME */}
                <div>
                  <label
                    htmlFor="creatorUsername"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Creator Username
                    <span className="ml-2 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-amber-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-100">
                    <span className="flex items-center bg-amber-50 px-4 font-bold text-amber-700">
                      @
                    </span>

                    <input
                      id="creatorUsername"
                      name="creatorUsername"
                      type="text"
                      value={form.creatorUsername}
                      onChange={handleChange}
                      placeholder="creator_username"
                      autoComplete="off"
                      className="min-w-0 flex-1 bg-white px-4 py-3 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                    <span className="ml-2 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    inputMode="tel"
                    autoComplete="off"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    className={inputClass}
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Description
                    <span className="ml-2 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Add creator details, niche, audience, or notes..."
                    className={`${inputClass} resize-y`}
                  />
                </div>

                {/* STATUS */}
                {message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-xl border p-3 text-sm ${
                      messageType === 'success'
                        ? 'border-amber-200 bg-amber-50 text-amber-900'
                        : messageType === 'error'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-extrabold shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-amber-100 ${
                    submitting
                      ? 'cursor-wait bg-amber-300 text-slate-700'
                      : 'bg-yellow-400 text-slate-900 shadow-yellow-200 hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-xl active:translate-y-0'
                  }`}
                >
                  {submitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                      Sending Request...
                    </>
                  ) : submitted ? (
                    <>✓ Request Sent</>
                  ) : (
                    <>
                      Save Creator Details <span>→</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Submit any available information. All four fields can be left empty.
                </p>
              </form>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Job Search Creator Details · Creator information management
            </p>
          </footer>
        </div>
      </section>
    </main>
  )
}

export default App
