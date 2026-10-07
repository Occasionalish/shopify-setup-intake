# Shopify Setup Intake

Client intake form for the Done-for-You Shopify Shop Setup. It runs as a Google Apps Script web app: each submission is saved as a row in a Google Sheet and emailed to the shop owner.

## Files

- `Code.gs` serves the form, appends each submission to the responses sheet, and sends the notification email.
- `Index.html` is the form itself.

## Setup

1. Open the responses Google Sheet and go to **Extensions → Apps Script**.
2. Replace the contents of `Code.gs` with this repo's `Code.gs`.
3. Add an HTML file named `Index` and paste in this repo's `Index.html`.
4. In `Code.gs`, set `SHEET_ID` to the responses sheet's ID and `NOTIFY_EMAIL` to the address that should get submissions.
5. **Deploy → New deployment → Web app**, with **Execute as: Me** and **Who has access: Anyone**.
6. Approve the access prompt, then share the **Web app URL** with clients.

To publish changes later, use **Deploy → Manage deployments → Edit → New version** so the client link stays the same.
