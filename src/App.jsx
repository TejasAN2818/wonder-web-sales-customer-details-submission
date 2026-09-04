
import { useState } from 'react'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbw_ZeSVE0eGkbZSkQ16Caq98bVJhtsg0g9UOVA4wVxKN5pDhxvJh6kNJABbNWeFqUrH/exec'

function App() {
  const [form, setForm] = useState({
    number: '',
    name: '',
    description: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const number = form.number.trim()
    const name = form.name.trim()
    const description = form.description.trim()

    if (!number || submitting) {
      return
    }

    const submissionData = {
      number,
      name,
      description,
    }

    // Start loading
    setSubmitting(true)
    setSubmitted(false)

    // Send to Google Sheets in background
    const body = new URLSearchParams({
      number,
      name,
      description,
    })

    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
    })
      .then(() => {
        console.log('Data sent to Google Sheets.')
      })
      .catch((error) => {
        console.error('Google Sheets submission failed:', error)
      })

    // 1 second loading
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)

      // Save submitted data
      setSubmittedData(submissionData)

      // Show popup
      setShowPopup(true)

      // Clear form
      setForm({
        number: '',
        name: '',
        description: '',
      })

      // Change button back to Submit
      setTimeout(() => {
        setSubmitted(false)
      }, 1500)

      // Hide popup
      setTimeout(() => {
        setShowPopup(false)
      }, 3500)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-pink-50">

      {/* ================================= */}
      {/* WEBSITE HEADER */}
      {/* ================================= */}

      <header className="w-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-4 text-white shadow-md">

        <div className="mx-auto max-w-6xl text-center">

          <h1 className="text-xl font-bold sm:text-2xl">
            HR Number Submission
          </h1>

          <p className="mt-0.5 text-xs text-pink-100 sm:text-sm">
            Submit HR contact information
          </p>

        </div>

      </header>


      {/* ================================= */}
      {/* SUCCESS POPUP */}
      {/* ================================= */}

      {showPopup && submittedData && (
        <div className="fixed left-1/2 top-20 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 animate-slideDown">

          <div className="flex items-center gap-3 rounded-2xl border border-pink-200 bg-white px-4 py-3 shadow-xl shadow-pink-200/50">

            {/* Success Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">

              <svg
                className="h-5 w-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>

            </div>

            {/* Popup Text */}
            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-slate-800">
                {submittedData.number}
                {submittedData.name && ` ${submittedData.name}`}
              </p>

              <p className="text-xs text-slate-500">
                Number submitted successfully
              </p>

            </div>

          </div>

        </div>
      )}


      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

      <section className="flex min-h-[calc(100vh-80px)] items-start justify-center px-4 py-10">

        <div className="w-full max-w-lg">

          {/* FORM TITLE - OUTSIDE CARD */}

          <div className="mb-5 text-center">

            <h2 className="text-2xl font-bold text-slate-800">
              Please Fill Only HR's Number
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Name and description are optional.
            </p>

          </div>


          {/* ================================= */}
          {/* FORM CARD */}
          {/* ================================= */}

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-pink-200/40 ring-1 ring-pink-100">

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6 sm:p-7"
            >

              {/* HR NUMBER */}

              <div>

                <label
                  htmlFor="number"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  HR's Number{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="number"
                  name="number"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.number}
                  onChange={handleChange}
                  placeholder="Enter HR's number"
                  className="input-field border-pink-200 focus:border-pink-500 focus:ring-pink-100"
                  required
                />

              </div>


              {/* NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Name{' '}
                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="input-field border-pink-200 focus:border-pink-500 focus:ring-pink-100"
                />

              </div>


              {/* DESCRIPTION */}

              <div>

                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description{' '}
                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  className="input-field resize-none border-pink-200 focus:border-pink-500 focus:ring-pink-100"
                />

              </div>


              {/* ================================= */}
              {/* SUBMIT BUTTON */}
              {/* ================================= */}

              <button
                type="submit"
                disabled={submitting}
                className={`relative flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 ${
                  submitting
                    ? 'scale-[0.98] cursor-wait bg-amber-500 shadow-amber-200 focus:ring-amber-100'
                    : submitted
                      ? 'bg-emerald-500 shadow-emerald-200 focus:ring-emerald-100'
                      : 'bg-pink-500 shadow-pink-200 hover:bg-pink-600 hover:shadow-pink-300 focus:ring-pink-200'
                }`}
              >

                {/* LOADING */}

                {submitting && (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >

                      <circle
                        className="opacity-30"
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                      />

                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                    </svg>

                    <span>Loading...</span>
                  </>
                )}


                {/* SUBMITTED */}

                {!submitting && submitted && (
                  <>
                    <span className="flex h-5 w-5 animate-checkPop items-center justify-center rounded-full bg-white/20">

                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />

                      </svg>

                    </span>

                    <span>Submitted</span>
                  </>
                )}


                {/* NORMAL */}

                {!submitting && !submitted && (
                  <span>Submit</span>
                )}

              </button>

            </form>

          </div>


          {/* FOOTER TEXT */}

          <p className="mt-4 text-center text-xs text-slate-400">
            Only the HR number is required.
          </p>

        </div>

      </section>

    </main>
  )
}

export default App