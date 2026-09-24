import { useEffect, useState } from 'react'

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzkSNnG_N7AdySk1U22EvYRCO2fjTBLwEuJF8XNbJPfu3LxpstfL3LmLevGPW9k8Yhy/exec'

// =====================================================
// LOCAL STORAGE KEYS
// =====================================================

const USER_NAME_KEY = 'hr_submission_user_name'
const SUBMISSION_COUNT_KEY = 'hr_submission_count'

function App() {
  // =====================================================
  // USER / PROFILE
  // =====================================================

  const [userName, setUserName] = useState('')
  const [nameInput, setNameInput] = useState('')

  const [showNamePopup, setShowNamePopup] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // =====================================================
  // COUNT
  // =====================================================

  const [submissionCount, setSubmissionCount] = useState(0)

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] = useState({
    number: '',
    hrName: '',
    description: '',
  })

  // =====================================================
  // SUBMISSION STATES
  // =====================================================

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // =====================================================
  // LOAD SAVED DATA
  // =====================================================

  useEffect(() => {
    const savedName = localStorage.getItem(USER_NAME_KEY)
    const savedCount = localStorage.getItem(SUBMISSION_COUNT_KEY)

    if (savedName) {
      setUserName(savedName)
    } else {
      setShowNamePopup(true)
    }

    if (savedCount) {
      setSubmissionCount(Number(savedCount))
    }
  }, [])

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // =====================================================
  // SAVE NAME - FIRST TIME
  // =====================================================

  const saveUserName = () => {
    const trimmedName = nameInput.trim()

    if (!trimmedName) {
      return
    }

    localStorage.setItem(USER_NAME_KEY, trimmedName)

    setUserName(trimmedName)
    setNameInput('')
    setShowNamePopup(false)
  }

  // =====================================================
  // CHANGE NAME FROM PROFILE
  // =====================================================

  const changeUserName = () => {
    const trimmedName = nameInput.trim()

    if (!trimmedName) {
      return
    }

    // Only change the user name.
    // COUNT IS NOT TOUCHED.
    localStorage.setItem(USER_NAME_KEY, trimmedName)

    setUserName(trimmedName)
    setNameInput('')
    setShowProfile(false)
  }

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  const handleSubmit = (e) => {
  e.preventDefault()

  const number = form.number.trim()
  const hrName = form.hrName.trim()
  const description = form.description.trim()

  if (!userName) return
  if (!number) return
  if (submitting) return

  // ===================================================
  // COUNT
  // ===================================================

  const newCount = submissionCount + 1

  localStorage.setItem(
    SUBMISSION_COUNT_KEY,
    String(newCount)
  )

  setSubmissionCount(newCount)

  // ===================================================
  // DATA TO GOOGLE SHEETS
  // ===================================================

  const body = new URLSearchParams({
    number: number,
    hrName: hrName,
    description: description,
    filledBy: userName,
  })

  setSubmitting(true)
  setSubmitted(false)

  // ===================================================
  // SEND REQUEST
  // ===================================================

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type':
        'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body: body.toString(),
  }).catch(() => {
    // Request failed
  })

  // ===================================================
  // SUCCESS UI
  // ===================================================

  setTimeout(() => {
    setSubmitting(false)
    setSubmitted(true)
    setShowPopup(true)

    setForm({
      number: '',
      hrName: '',
      description: '',
    })

    setTimeout(() => {
      setSubmitted(false)
    }, 1500)

    setTimeout(() => {
      setShowPopup(false)
    }, 4500)
  }, 1000)
}

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

 const getSuccessMessage = () => {
  return submissionCount === 1
    ? `You have filled 1 number`
    : `You have filled ${submissionCount} numbers`
}

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-pink-50">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="relative w-full bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-4 text-white shadow-md">

        <div className="mx-auto max-w-6xl text-center">

          <h1 className="text-xl font-bold sm:text-2xl">
            HR Number Submission
          </h1>

          <p className="mt-0.5 text-xs text-pink-100 sm:text-sm">
            Submit HR contact information
          </p>

        </div>

        {/* ================================================= */}
        {/* PROFILE BUTTON */}
        {/* ================================================= */}

        {userName && (
          <button
            type="button"
            onClick={() => {
              setNameInput(userName)
              setShowProfile(true)
            }}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/80 backdrop-blur-sm transition hover:bg-white/30"
            title="Profile"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 20.25a8.25 8.25 0 0115 0"
              />
            </svg>
          </button>
        )}

      </header>


      {/* ================================================= */}
      {/* FIRST TIME NAME POPUP */}
      {/* ================================================= */}

      {showNamePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="mb-5 text-center">

              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">

                <svg
                  className="h-7 w-7 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 20.25a8.25 8.25 0 0115 0"
                  />
                </svg>

              </div>

              <h2 className="text-xl font-bold text-slate-800">
                Welcome!
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Please enter your name to continue.
              </p>

            </div>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveUserName()
                }
              }}
              placeholder="Enter your name"
              autoFocus
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
            />

            <button
              type="button"
              onClick={saveUserName}
              disabled={!nameInput.trim()}
              className="mt-4 w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue
            </button>

          </div>

        </div>
      )}


      {/* ================================================= */}
      {/* PROFILE POPUP */}
      {/* ================================================= */}

      {showProfile && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          onClick={() => setShowProfile(false)}
        >

          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Profile
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Change your name
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowProfile(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>

            </div>


            {/* CURRENT NAME */}

            <div className="mb-4 rounded-xl bg-pink-50 p-4">

              <p className="text-xs text-slate-500">
                Current name
              </p>

              <p className="mt-1 text-lg font-bold text-pink-600">
                {userName}
              </p>

            </div>


            {/* CHANGE NAME */}

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Change Name
            </label>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  changeUserName()
                }
              }}
              placeholder="Enter your name"
              autoFocus
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-100"
            />

            <button
              type="button"
              onClick={changeUserName}
              disabled={!nameInput.trim()}
              className="mt-4 w-full rounded-xl bg-pink-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Name
            </button>


            {/* COUNT - DISPLAY ONLY */}

            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">

              <p className="text-xs text-slate-500">
                Numbers you have filled
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-800">
                {submissionCount}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                This count is saved on this device.
              </p>

            </div>

          </div>

        </div>
      )}



     {/* ================================================= */}
{/* SUCCESS POPUP */}
{/* ================================================= */}

{/* ================================================= */}
{/* SUCCESS NOTIFICATIONS */}
{/* ================================================= */}

{showPopup && (
  <>
    {/* LEFT NOTIFICATION */}
    <div className="fixed left-4 top-5 z-[200] w-[calc(100%-32px)] max-w-sm animate-slide-in-left sm:left-6">

      <div className="overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-2xl shadow-pink-200/60">

        <div className="flex items-center gap-3 p-4">

          {/* HAPPY EMOJI */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pink-100">
            <span className="text-4xl leading-none">
              😍
            </span>
          </div>

          {/* TEXT */}
          <div className="min-w-0 flex-1">

            <p className="text-base font-extrabold text-slate-800 sm:text-lg">
              Thanks, {userName}! 🎉
            </p>

            <p className="mt-0.5 text-[20px] font-medium text-slate-500">
              You filled
            </p>

          </div>

          {/* ATTRACTIVE COUNT */}
          <div className="flex shrink-0 flex-col items-center justify-center">

            <span className="text-4xl font-black leading-none text-pink-600 drop-shadow-sm sm:text-5xl">
              {submissionCount}
            </span>

            <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-pink-400">
              Numbers
            </span>

          </div>

         

        </div>

        {/* PROGRESS */}
        <div className="h-1 bg-pink-100">
          <div className="h-full w-full animate-shrink bg-gradient-to-r from-pink-400 to-rose-500" />
        </div>

      </div>

    </div>


    {/* RIGHT NOTIFICATION */}
    <div className="fixed right-4 top-[105px] z-[200] w-[calc(100%-32px)] max-w-sm animate-slide-in-right sm:right-6 sm:top-5">

      <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-2xl shadow-amber-200/60">

        <div className="flex items-center gap-3 p-4">

          {/* ANGRY EMOJI */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <span className="text-4xl leading-none">
              😠
            </span>
          </div>

          {/* TEXT */}
          <div className="min-w-0 flex-1">

            <p className="text-base font-extrabold text-slate-800 sm:text-lg">
              But it's not enough!
            </p>

            <p className="mt-1 text-sm font-semibold text-amber-600">
              Fill more numbers
            </p>

          </div>

         

          

        </div>

        {/* PROGRESS */}
        <div className="h-1 bg-amber-100">
          <div className="h-full w-full animate-shrink bg-gradient-to-r from-amber-400 to-orange-500" />
        </div>

      </div>

    </div>
  </>
)}

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <section className="flex min-h-[calc(100vh-80px)] items-start justify-center px-4 py-10">

        <div className="w-full max-w-lg">

          {/* TITLE */}

          <div className="mb-5 text-center">

            <h2 className="text-2xl font-bold text-slate-800">
              Please Fill HR Number
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the HR contact information below.
            </p>

          </div>


          {/* USER INFO */}

          <div className="mb-4 flex items-center justify-between rounded-2xl border border-pink-100 bg-white px-4 py-3 shadow-sm">

            <div>

              <p className="text-xs text-slate-400">
                Filling as
              </p>

              <p className="font-semibold text-pink-600">
                {userName}
              </p>

            </div>

            <div className="text-right">

              <p className="text-xs text-slate-400">
                Numbers filled
              </p>

              <p className="font-bold text-slate-700">
                {submissionCount}
              </p>

            </div>

          </div>


          {/* FORM CARD */}

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
                  HR Number{' '}
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
                  placeholder="Enter HR number"
                  className="input-field border-pink-200 focus:border-pink-500 focus:ring-pink-100"
                  required
                />

              </div>


              {/* HR NAME */}

              <div>

                <label
                  htmlFor="hrName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  HR Name{' '}
                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <input
                  id="hrName"
                  name="hrName"
                  type="text"
                  autoComplete="name"
                  value={form.hrName}
                  onChange={handleChange}
                  placeholder="Enter HR name"
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


              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={submitting}
                className={`relative flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 ${submitting
                    ? 'scale-[0.98] cursor-wait bg-amber-500 shadow-amber-200 focus:ring-amber-100'
                    : submitted
                      ? 'bg-emerald-500 shadow-emerald-200 focus:ring-emerald-100'
                      : 'bg-pink-500 shadow-pink-200 hover:bg-pink-600 hover:shadow-pink-300 focus:ring-pink-200'
                  }`}
              >

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
                        d="M21 12a9 9 0 00-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>

                    <span>Loading...</span>
                  </>
                )}

                {!submitting && submitted && (
                  <>
                    <span>✓</span>
                    <span>Submitted</span>
                  </>
                )}

                {!submitting && !submitted && (
                  <span>Submit</span>
                )}

              </button>

            </form>

          </div>


          {/* FOOTER */}

          <p className="mt-4 text-center text-xs text-slate-400">
            Your name is saved on this device.
          </p>

        </div>

      </section>

    </main>
  )
}

export default App