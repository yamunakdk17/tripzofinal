# React + Vite

## Flight booking API integration

The flight UI uses sample results only when no API URL is configured. Live search,
booking creation, payment, payment verification, and confirmed tickets require a
Tripzo backend. Set `VITE_API_BASE_URL` in the frontend environment (for example
in `.env.local`); do not put eSewa/Khalti secrets in frontend variables.

The frontend API adapter in `src/lib/flightBookingApi.js` expects these endpoints:

- `GET /flights/search` with `origin`, `destination`, `tripType`,
  `departureDate`, optional `returnDate`, `travelers`, and `cabin` query values.
  Return `{ "flights": [...] }` using the result-card shape (`id`, `airline`,
  `price`, `outbound`, `inbound`, and `bags`).
- `POST /bookings` with `flightId`, search details, passengers, and booking
  contact. The server must re-price the selected flight and return at least
  `{ "id": "...", "amount": 0, "currency": "NPR" }`.
- `GET /bookings/:id` returning the booking, its server-generated PNR, status,
  final amount/currency, flight details, and passenger names.
- `POST /payments/esewa/initiate` and `POST /payments/khalti/initiate` with the
  booking ID, server-calculated amount/currency, and return URL. Return a
  provider checkout `redirectUrl`; keep provider credentials and signatures on
  the server.
- `POST /payments/esewa/verify` and `POST /payments/khalti/verify` with the
  provider callback query values. Return `status: "paid"`, `"failed"`, or
  `"pending"`. A paid response must include a confirmed booking (or a booking
  ID that `GET /bookings/:id` resolves to `status: "confirmed"` with a PNR).

The confirmation page never treats a browser redirect alone as proof of
payment. It asks the backend to verify the transaction before showing or
downloading a ticket.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
