# HR Number Form

A ready-to-run React + Tailwind CSS frontend that submits:

- HR Number — required
- Name — optional
- Description — optional

Data is stored in Google Sheets through a Google Apps Script Web App. No traditional backend is required.

## 1. Install Node.js

Install a current LTS version of Node.js.

## 2. Install dependencies

From this project folder:

```bash
npm install
```

## 3. Create the Google Sheet

Create a Google Sheet and open:

Extensions → Apps Script

Copy the contents of `google-apps-script/Code.gs` into the Apps Script editor.

Save the project.

Run the `setupSheet` function once and authorize it. This creates a sheet named `Responses` with:

Timestamp | HR Number | Name | Description

## 4. Deploy Google Apps Script

In Apps Script:

Deploy → New deployment

Choose:

- Type: Web app
- Execute as: Me
- Who has access: Anyone

Deploy and copy the Web app URL ending in `/exec`.

## 5. Connect React to Google Sheets

Copy `.env.example` to `.env`.

Set:

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Replace the example URL with your real Apps Script Web App URL.

## 6. Run locally

```bash
npm run dev
```

Open the local URL shown by Vite.

## 7. Build for deployment

```bash
npm run build
```

The production files will be in the `dist` folder.

You can deploy the `dist` folder to Vercel, Netlify, GitHub Pages, Cloudflare Pages, or another static hosting service.

## Important

The Google Apps Script URL is intended to be public because the form is public. Do not put Google account passwords, service-account private keys, or other secret credentials in the React project.

The current frontend uses `no-cors` because Google Apps Script Web Apps do not provide the normal browser CORS flow needed for a simple frontend POST. The app treats a completed request as submitted and clears the form.
