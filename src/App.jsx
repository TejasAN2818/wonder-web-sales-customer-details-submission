
import { useEffect, useState } from 'react'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzC6f3sB7qCmwEo9wKKuYgsJ71nqd5gsI8qzWAKn21432-5ZexnuiSdLCKPJJFDxal12Q/exec'

const USER_NAME_KEY = 'wonderweb_user_name'
const SUBMISSION_COUNT_KEY = 'wonderweb_submission_count'

const initialForm = {
  googleMapLink: '',
  businessName: '',
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

  // FORM INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // SAVE COLLECTOR NAME
  const saveUserName = () => {
    const name = nameInput.trim()

    localStorage.setItem(USER_NAME_KEY, name)
    setUserName(name)
    setNameInput('')
    setShowNamePopup(false)
  }

  // SUBMIT CUSTOMER DETAILS
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (submitting) return

    if (!GOOGLE_SCRIPT_URL) {
      setMessageType('error')
      setMessage('Google Apps Script URL is missing.')
      return
    }

    setSubmitting(true)
    setMessage('')

    const body = new URLSearchParams({
      googleMapLink: form.googleMapLink.trim(),
      businessName: form.businessName.trim(),
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

      const newCount = submissionCount + 1

      setSubmissionCount(newCount)

      localStorage.setItem(
        SUBMISSION_COUNT_KEY,
        String(newCount)
      )

      setMessageType('success')
      setMessage(
        'Submission sent! Please verify the entry in Google Sheets.'
      )

      setForm({ ...initialForm })

    } catch (error) {
      setMessageType('error')
      setMessage(
        'Unable to submit. Please check your internet connection.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full min-w-0 rounded-xl border border-purple-200 bg-white px-4 py-3.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-100'

  const labelClass =
    'mb-2 block text-sm font-bold text-slate-700'

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-white text-slate-800">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-purple-100 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">

          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-900 text-xl font-black text-white shadow-lg shadow-purple-200 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
              W
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black tracking-tight text-slate-900 sm:text-xl">
                Wonder Web
                <span className="text-purple-700">
                  {' '}Technology
                </span>
              </h1>

              <p className="truncate text-[10px] text-slate-500 sm:text-xs">
                Digital Solutions & Business Growth
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setNameInput(userName)
              setShowProfile(true)
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-lg transition hover:bg-purple-100 sm:h-11 sm:w-11"
            aria-label="Open profile"
          >
            👤
          </button>

        </div>
      </header>

      {/* WELCOME POPUP */}
      {showNamePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
              👋
            </div>

            <h2 className="text-center text-2xl font-black">
              Welcome!
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Enter your name to identify who is collecting the business details.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveUserName()
              }}
              className="mt-6 space-y-4"
            >

              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name (optional)"
                className={inputClass}
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-700 py-3.5 font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800"
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
                className="w-full py-2 text-sm font-semibold text-slate-500"
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
                <h2 className="text-xl font-black">
                  Your Profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your collector name
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="rounded-full bg-slate-100 px-3 py-2 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <label className={labelClass}>
              Your Name
            </label>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className={inputClass}
              placeholder="Enter your name"
            />

            <button
              type="button"
              onClick={() => {
                localStorage.setItem(
                  USER_NAME_KEY,
                  nameInput.trim()
                )
                setUserName(nameInput.trim())
                setShowProfile(false)
              }}
              className="mt-4 w-full rounded-xl bg-purple-700 py-3 font-bold text-white hover:bg-purple-800"
            >
              Save Profile
            </button>

            <div className="mt-6 rounded-2xl bg-purple-50 p-5 text-center">
              <p className="text-sm text-slate-500">
                Submissions on this device
              </p>

              <p className="mt-1 text-3xl font-black text-purple-700">
                {submissionCount}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <section className="px-3 py-7 sm:px-6 sm:py-12">

        <div className="mx-auto max-w-2xl">

          {/* PAGE TITLE */}
          <div className="mb-7 text-center sm:mb-9">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-purple-700 shadow-sm sm:px-4 sm:text-xs">

              <span className="h-2 w-2 rounded-full bg-purple-600" />

              Wonder Web Technology

            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Customer Details

              <span className="block text-purple-700">
                Submission Form
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-md px-2 text-sm leading-6 text-slate-500 sm:text-base">
              Collect business information and discover new opportunities to build their online presence.
            </p>

          </div>

          {/* SUMMARY CARD */}
          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-purple-100 bg-white p-3.5 shadow-sm sm:p-4">

            <div className="flex min-w-0 items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                👤
              </div>

              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 sm:text-xs">
                  Collected By
                </p>

                <p className="truncate text-sm font-bold text-slate-800 sm:text-base">
                  {userName || 'Anonymous'}
                </p>
              </div>

            </div>

            <div className="shrink-0 text-right">
              <p className="text-[11px] text-slate-400 sm:text-xs">
                Total Submissions
              </p>

              <p className="text-xl font-black text-purple-700 sm:text-2xl">
                {submissionCount}
              </p>
            </div>

          </div>

          {/* FORM CARD */}
          <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-100/70 sm:rounded-3xl">

            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-700 sm:h-2" />

            <div className="p-4 sm:p-8">

              {/* FORM HEADER */}
              <div className="mb-7 flex items-center gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-xl sm:h-12 sm:w-12 sm:rounded-2xl">
                  ✨
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                    Business Information
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Add any available customer details.
                  </p>
                </div>

              </div>

              {/* CUSTOMER FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* GOOGLE MAPS LINK */}
                <div>

                  <label
                    htmlFor="googleMapLink"
                    className={labelClass}
                  >
                    <span className="mr-2 text-purple-700">
                      📍
                    </span>
                    Google Maps Business Link
                    <span className="ml-2 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="googleMapLink"
                    type="text"
                    name="googleMapLink"
                    value={form.googleMapLink}
                    onChange={handleChange}
                    placeholder="Paste Google Maps business link"
                    autoComplete="off"
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
                    Copy and paste the business location link from Google Maps.
                  </p>

                </div>

                {/* BUSINESS NAME */}
                <div>

                  <label
                    htmlFor="businessName"
                    className={labelClass}
                  >
                    <span className="mr-2 text-purple-700">
                      🏢
                    </span>
                    Business Name / Owner Name
                    <span className="ml-2 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="businessName"
                    type="text"
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Enter business or owner's name"
                    autoComplete="off"
                    className={inputClass}
                  />

                </div>

                {/* PHONE NUMBER */}
                <div>

                  <label
                    htmlFor="phone"
                    className={labelClass}
                  >
                    <span className="mr-2 text-purple-700">
                      📞
                    </span>
                    Phone Number
                    <span className="ml-2 font-normal text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    id="phone"
                    type="text"
                    name="phone"
                    inputMode="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    autoComplete="off"
                    className={inputClass}
                  />

                </div>

                {/* DESCRIPTION */}
                <div>

                  <label
                    htmlFor="description"
                    className={labelClass}
                  >
                    <span className="mr-2 text-purple-700">
                      📝
                    </span>
                    Business Description
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
                    placeholder="Describe the business, products, services or website requirements..."
                    className={`${inputClass} min-h-28 resize-y`}
                  />

                </div>

                {/* STATUS MESSAGE */}
                {message && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`rounded-xl border p-3.5 text-sm leading-6 ${
                      messageType === 'success'
                        ? 'border-purple-200 bg-purple-50 text-purple-800'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-800 px-5 py-4 text-sm font-extrabold text-white shadow-lg shadow-purple-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:cursor-wait disabled:opacity-60 sm:text-base"
                >

                  {submitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Customer Details
                      <span>→</span>
                    </>
                  )}

                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  All fields are optional. Submit any available information.
                </p>

              </form>

            </div>
          </div>

          {/* FOOTER */}
          <footer className="pb-5 pt-7 text-center">

            <div className="mb-2 flex items-center justify-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-700 text-xs font-black text-white">
                W
              </div>

              <p className="text-sm font-black text-purple-800">
                Wonder Web Technology
              </p>
            </div>

            <p className="text-xs leading-5 text-slate-400">
              Building Digital Experiences for Growing Businesses
            </p>

            <p className="mt-3 text-[10px] text-slate-400">
              © {new Date().getFullYear()} Wonder Web Technology. All rights reserved.
            </p>

          </footer>

        </div>
      </section>
    </main>
  )
}

export default App
