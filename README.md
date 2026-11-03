# ktd khata

**ktd khata** is a digital bahi khata (business ledger) and loan-tracking app for small shops, merchants, and businesses that manage customer or supplier credit. It replaces handwritten account books with contact-wise balances, dated transactions, due tracking, repayment schedules, WhatsApp sharing, and downloadable reports.

The app is built as a responsive web app that can also be installed as a Progressive Web App (PWA). An Android project powered by Capacitor is included in `android/`.

## At a glance

- Keep separate books for different business accounts or branches.
- Record money given and money received against customers and suppliers.
- Track outstanding balances, due dates, and loan installments.
- Share payment reminders and account statements through WhatsApp.
- Review daily activity and business reports; export ledger entries to CSV.
- Use the app offline with browser-local data and install it on supported devices.

## Features

### Contacts and account books

- Create customer and supplier contacts with names, phone numbers, country codes, and notes.
- Search contacts by name, phone number, or tag; filter by all, amounts you will get, amounts you will give, or settled accounts.
- Sort contacts by recent activity, balance, or name.
- Create and switch between named khata books. The app associates contacts, ledger entries, and loans with a book and shows book-level summaries.
- View each contact's account history, running balance, due entries, and active loans.

### Ledger and transactions

- Record **GAVE** (money or credit you gave) and **GOT** (money you received) transactions.
- Add an amount, transaction date, optional return/due date, notes, and an image attachment such as a bill or receipt.
- View chronological ledger entries and running balances. A positive balance means the customer owes the business; a negative balance means the business owes the customer.
- Edit entries and use the recycle bin to restore deleted entries or contacts.
- Share transaction confirmations and customer statements through WhatsApp.
- Customize the labels shown for the money-given and money-received actions.

### Dues, reminders, and sharing

- See due-today and overdue totals for ledger entries and loan installments.
- Prepare individual or bulk payment reminders for contacts with outstanding balances.
- Review the reminder text and open WhatsApp with a pre-filled message. The app does not send messages automatically; the user completes sending in WhatsApp.
- Share contact ledger summaries and transaction receipts through WhatsApp links.

### Loan management

- Create a loan for a contact with principal, annual interest rate, term, start date, and monthly, weekly, or daily installment frequency.
- Preview the estimated installment, total interest, and total payable amount.
- Generate an installment schedule and track installments as pending, partially paid, or paid.
- Record repayments in both the loan schedule and the contact ledger; settle a loan early in full.
- Convert a money-given transaction into a loan by carrying its amount and notes into the loan form.
- Review due-today and late installment totals, and prepare WhatsApp reminders.

### Reports and business tools

- **Dashboard:** see book-level receivables, payables, net cash flow, contact count, active loans, and due/overdue totals.
- **Day Book:** review a selected date's money in, money out, net total, and transactions; print the day report.
- **Business reports:** view contact balances and transaction totals for all time, this month, this week, or today; print the report.
- **CSV export:** download active-book ledger entries for use in spreadsheet or accounting software.
- **Calculators:** use a basic calculator and estimate loan EMIs with the EMI calculator.
- **Recycle Bin:** restore deleted contacts and transactions.

### Preferences and installation

- Set an optional four-digit in-app PIN lock.
- Choose a language preference (English, Hindi, Gujarati, or Urdu) and customize transaction button labels.
- Edit shop and owner details.
- Install as a PWA on supported browsers, or build the included Capacitor Android project.
- The interface is designed for mobile screens and can also expand to a wider desktop layout.

## How the app works

1. Sign in to an existing local app profile or create a shop profile.
2. Select or create a khata book, then add customers or suppliers.
3. Open a contact and record money given or received. The ledger recalculates the contact balance and book summary.
4. Add due dates or create a loan to keep upcoming repayments visible.
5. Use the reports and WhatsApp sharing tools to follow up and communicate with contacts.

## Data, privacy, and current limitations

- **Local-first storage:** shop details, contacts, books, ledger entries, loans, preferences, and the optional PIN are stored in the browser's `localStorage` on the current device/browser profile. Clearing browser data can remove this information.
- **No server-side account or synchronization is implemented in the current code.** Signing in on another device does not automatically transfer or sync the local ledger. Export a backup regularly and keep it somewhere safe.
- **Backup and restore:** the storage layer supports JSON backup import/export. Ledger entries can also be exported as CSV from Settings. Check the app UI for the available backup controls.
- **Authentication is a demo flow:** the login screen simulates an OTP in the browser; it does not send or verify a real SMS. Do not treat it as production identity verification or account security.
- **WhatsApp is user-mediated:** reminders and statements open a WhatsApp link with prepared text; they are not sent automatically.
- **Offline behavior:** the PWA is configured with a service worker for cached app assets, and business data is local. This is not a cloud backup or cross-device sync service.
- **Feature scope:** some labels or screens describe capabilities such as synchronization, team access, or advanced security. The current implementation is primarily a single-device local app; verify a feature in the app before relying on it for business-critical workflows.

> Keep exported backup files private: they may contain shop, contact, and financial information.

## Technology

- React 19 and TypeScript
- Vite 8 for development and production builds
- Tailwind CSS 4 for styling
- Capacitor 8 for the Android wrapper
- `vite-plugin-pwa` for PWA manifest and service-worker generation
- `lucide-react` for icons and `motion` for UI animation

## Project structure

```text
.
├── android/                 Capacitor Android project and Gradle build files
├── public/                  App icon and PWA assets
├── scripts/                 Asset-generation scripts
└── src/
    ├── App.tsx               App shell, navigation, and modal registry
    ├── components/
    │   ├── auth/             Login and shop registration screens
    │   ├── common/           Header, navigation, shared dialogs, preferences
    │   ├── contacts/         Contact list, contact form, customer ledger
    │   ├── loans/            Loan form and loan dashboard
    │   ├── settings/         Shop settings and data export
    │   ├── tools/            Reports, reminders, calculators, day book, recycle bin
    │   └── transactions/     Ledger transaction entry and confirmation
    ├── context/              Shared application state and business actions
    ├── db/                   Browser storage, calculations, and initial defaults
    ├── hooks/                 PWA installation helper
    ├── types/                 Shared TypeScript data models
    ├── main.tsx               Browser entry point
    └── index.css               Global styles
```

### Main data flow

`src/main.tsx` mounts `App`, which wraps the interface in `KhataProvider` from `src/context/KhataContext.tsx`. The provider loads and saves application state through `StorageEngine` in `src/db/storage.ts`; screens use the shared context to add contacts, post transactions, update loans, and calculate balances. Vite builds the web app into `dist/`, which Capacitor packages for Android.

## Requirements

- Node.js and npm, or Bun
- For Android builds: Android Studio/Android SDK and a Java version supported by the included Gradle/Android Gradle Plugin configuration

## Run locally

```bash
git clone https://github.com/zxiddd/ktd-khata.git
cd ktd-khata
npm install
npm run dev
```

Vite starts the development server on port **3000**. To create and preview a production build:

```bash
npm run build
npm run preview
```

Run the TypeScript check with:

```bash
npm run lint
```

The repository includes a `bun.lock` as well; Bun users can install dependencies with `bun install` and run the same scripts with `bun run <script>`.

## Build for Android

The web build must be generated and synced to the native project. With Android Studio/SDK configured, run:

```bash
npm run android:sync
cd android
./gradlew assembleDebug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`. For Windows, use `gradlew.bat` instead of `./gradlew`. `npm run android:build` builds the web app and copies assets into the Android project; `npm run android:sync` also synchronizes Capacitor plugins and configuration.

## License

No license file is currently included. Contact the repository owner before redistributing or reusing this project.
