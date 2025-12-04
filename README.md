Nexus Code 3.0 — Ultra Pro Edition (Firebase + Functions)
Generated: 2025

This package includes:
- Static frontend (index.html, styles, scripts, pages)
- Firebase client integration (scripts/firebase-init.js, scripts/app-firebase.js)
- Admin panel (admin/login.html, admin/dashboard.html) using Firebase Auth + Firestore
- Blog (static)
- Firebase Functions (placeholder) to send email via SendGrid and WhatsApp via Twilio

== IMPORTANT: Replace configs ==
1) Open /scripts/firebase-init.js and paste your Firebase project's config object.
2) Replace /public/logo.png with your logo (PNG).
3) Configure environment variables for Functions (SendGrid API key, Twilio credentials) as described below.

== Deploying Frontend ==
- Upload the project to Vercel as a new project (Import Folder).
- Or host on Firebase Hosting.

== Deploying Firebase Functions (SendGrid + Twilio) ==
(Requires Firebase CLI and a Google Firebase project)

1) Install Firebase CLI:
   npm install -g firebase-tools

2) Login and init functions:
   firebase login
   firebase init functions

3) In the functions folder, create these environment variables:
   firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY" twilio.sid="TWILIO_SID" twilio.token="TWILIO_TOKEN" twilio.from="whatsapp:+1415XXXXXXX" notify.to="whatsapp:+55YOURNUMBER" notify.email="you@example.com"

4) Example usage in functions/index.js (provided in this package as functions/index.js). It will read the config and send email & WhatsApp when called.

5) Deploy functions:
   firebase deploy --only functions

== How the contact flow works ==
- The contact form writes the message to Firestore (collection 'messages').
- Optionally, the frontend attempts to call an HTTP function at /functions/sendNotification to trigger emails/WhatsApp.
- For trusted server-side sending, deploy Firebase Functions and set the keys above.

== Security ==
- Set Firestore rules to restrict reads/writes as appropriate. Admin panel relies on Firebase Auth.
- Do not commit your API keys to public repos.

If you want, I can:
- Fill functions/index.js now with SendGrid + Twilio example code and include package.json for functions.
- Provide step-by-step commands to deploy functions and set env vars.
