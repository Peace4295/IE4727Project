# Nanyang Film House - Project Walkthrough

**IE4727 Web Application Design | 31 October 2026**

## 1. Summary

Nanyang Film House is a campus cinema booking and student film submission web app built with **HTML, CSS, vanilla JavaScript, PHP and MySQL**, running locally on **XAMPP**. JavaScript creates interactive screens and checks input in the browser. PHP verifies requests, uses sessions to identify users, and reads/writes MySQL data. The site lets students browse films, choose a screening and up to six seats, complete a **mock** payment, view/cancel bookings, submit film details and a poster, and track submission status. An admin account reviews submissions. Booking emails are captured by **FakeSMTP**, not sent to the actual Internet.


## 2. File navigation — where to look first

Paths below are **repository paths**

| Features | Start with | Then inspect |
| Login and password checks | `login.php` | `js/login.js`, `process-login.php`, `includes/database.php` |
| Logout | `logout.php` | Session removal and redirect |
| Movie catalogue | `moviecatalog.html` | `js/movie-data.js`, `js/moviecatalog.js` |
| Movie synopsis and showtimes | `moviedetails.html` | `js/moviedetails.js` |
| Seat map and price | `bookingandpayment.php` | `js/bookingandpayment.js` |
| Existing booked seats | `bookingandpayment.php` | PHP `SELECT` joining `booking_seats` to `bookings` |
| Saving a booking | `process-booking.php` | SQL `INSERT`, transaction, seat `INSERT`s |
| Booking acknowledgement | `process-booking.php` | `mail_patch.php`, FakeSMTP |
| My Account & booking statuses | `account.php` | `js/account.js` |
| Cancelling a booking | `process-cancellation.php` | `UPDATE bookings SET status='Cancelled'` |
| Film submission form | `submit.php` | `js/submit.js` |
| Checking poster size/type | `process-submission.php` | `$_FILES`, `getimagesize`, `move_uploaded_file` |
| Admin submissions table | `admin-submission.php` | `process-submission-status.php` |
| Database connection | `includes/database.php` | `mysqli` connection to `ntu_films` |
| Main navigation, homepage carousel | `index.html` | `js/script.js` and `css/style.css` |

**Important file distinction:** A page such as `submit.php` **displays the form**; `process-submission.php` **receives and saves the submitted form**. Likewise `login.php` displays the form, while `process-login.php` verifies credentials. When asked “Where is it processed?”, find the HTML `<form action="...">` attribute.

## 3. Database — four tables

1. `users` : One row per account; pw hashed, not encrypted
2. `bookings` : One row per booking transaction |
3. `booking_seats` : One booking can contain multiple seat numbers; avoids `seat1`, `seat2`, etc. columns 
4. `film_submissions`: Separates film review workflow from ticket bookings 

### Relationships and queries

- `booking_seats.booking_id` corresponds to `bookings.booking_id` (**one-to-many logical relationship**).
- The site links bookings to the signed-in user by `booker_email = $_SESSION['email']`, and film submissions by `submitter_email = $_SESSION['email']`. These are application-level associations; do **not** claim a database foreign key to `users` unless phpMyAdmin verifies it.
- A `JOIN` combines bookings with their seats for availability checks and My Account. My Account uses `LEFT JOIN` and `GROUP_CONCAT` to show a single booking card containing multiple seats.
- A cancelled booking's row and seat records are **retained**; availability checks only consider a joined booking when `status = 'Confirmed'`.
- `booking_id` is the database's numeric auto-increment ID. `reference_number` is a human-readable customer-facing reference. They are **not** the same.

### Why four tables instead of one?

A booking could have A1, A2 and A3. Instead of storing variable numbers of seats in a single booking row, `bookings` stores the transaction and `booking_seats` stores one row per selected seat. Film submissions and user account data have different purposes and are kept in their own tables.

## 4. Walkthrough A — login and sessions

1. User opens `login.php`. Its form sends a **POST** request to `process-login.php`.
2. `process-login.php` checks the request method, gets email/password from `$_POST`, and uses a **prepared SELECT query** to find the account by email.
3. PHP uses `password_verify($enteredPassword, $user['password_hash'])`; the database does **not** need to know the original password.
4. On success, `session_regenerate_id(true)` replaces the session ID and `$_SESSION` stores user ID, name, email and role.
5. Admin accounts are redirected to `admin-submission.php`, regular accounts to `index.html`.
6. Protected PHP pages call `session_start()` and verify session variables. Admin processing additionally checks `$_SESSION['role'] === 'admin'`.
7. `logout.php` clears session variables, expires its session cookie, destroys the session and redirects to the login page.

**Say this in the demo:** “The login interface only collects credentials. The server actually authenticates users with a prepared query and `password_verify`, then remembers their identity through PHP sessions.”

**Scope clarification:** Accounts are **manually preconfigured in the MySQL `users` table**. There is no public registration system or live NTU Outlook sign-in. Describe it as **login using preconfigured NTU-format accounts**, not university single sign-on.

## 5. Walkthrough B — movie selection and booking

### B1. Movie selection (`movie-data.js`, `moviecatalog.js`, `moviedetails.js`)

- `movie-data.js` stores JavaScript arrays for mainstream titles, student originals and coming-soon listings.
- `moviecatalog.js` creates and inserts movie card markup into the catalogue.
- `moviedetails.js` reads `id` from the URL with `URLSearchParams`, looks up the matching movie, and displays details.
- The user reveals screening options, selects **location/date/time**, and continues to `bookingandpayment.php` with those values in its URL.
- The three date groups represent today and the following two days; passed showtime buttons are disabled in browser code. PHP also checks the screening datetime for validity and whether it has started.

### B2. Displaying occupied seats (`bookingandpayment.php`)

1. PHP reads `movieId`, `location`, `date`, `time` from `$_GET`.
2. A prepared `SELECT` joins `booking_seats` and `bookings`, filtering by **movie, location, date, time and `Confirmed` status**.
3. PHP passes the unavailable seat names into a browser-side JavaScript array, `unavailableSeats`.
4. `bookingandpayment.js` generates six rows (A–F), eight seats per row. Buttons corresponding to `unavailableSeats` are **disabled**.

### B3. Selecting and validating seats (`bookingandpayment.js`)

- `createSeatMap()` constructs seat buttons using `document.createElement`.
- `toggleSeat()` selects/deselects a seat by updating `selectedSeats` and CSS classes.
- If the user attempts a seventh seat, the custom seat-limit `<dialog>` appears; dismissing it **does not navigate or reload** the page.
- `updateSeatSummary()` calculates `selectedSeats.length * 5` and refreshes quantity, names and total. Continue to Payment is disabled if no seats are selected.

### B4. Mock payment and saving (`process-booking.php`)

1. The payment screen has cardholder name, 16-digit card number, MM/YY expiry and three-digit CVV validation in JavaScript. **These are test fields, not a real payment gateway.** Card details are not stored in MySQL.
2. Valid booking data travels by **POST** to `process-booking.php`.
3. PHP checks that the user is signed in, verifies seat codes (A1–F8) and quantity (1–6), validates screening date/time, and **recalculates** the price rather than trusting a total sent by the browser.
4. PHP checks availability again against the database because JavaScript can be bypassed and another booking may have occurred since page load.
5. PHP begins an **InnoDB transaction**, inserts one `bookings` row, retrieves the new `booking_id`, inserts each corresponding `booking_seats` row, then **commits**. On a database failure it **rolls back**. The earlier duplicate-INSERT bug was fixed by deleting the old insert block outside the transaction.
6. The booking reference uses a date plus a random hexadecimal suffix. The `reference_number` database column was extended to `VARCHAR(50)` to hold it.
7. After successful storage, PHP prepares the email and redirects to the booking page with `success=1&reference=...`. JavaScript opens the confirmation modal.

**Say this in the demo:** “JavaScript is for interaction and quick validation; PHP performs authoritative validation and writes the booking and its seats together inside one database transaction.”

**Don't overclaim:** The current seat availability check blocks **sequential** double bookings but is not designed to guarantee race-free simultaneous checkouts. That was intentionally left out of project scope.

### B5. Local email acknowledgement

- `process-booking.php` builds the subject and message using booking information after successful DB saving.
- `mail_patch.php` implements the coursework's local SMTP workaround; it connects to `localhost` on port **2525**.
- **FakeSMTP** captures the message locally. Test emails were opened using **Apple Mail**. No public delivery or actual NTU mailbox receipt is claimed.
- If demonstrating this, launch XAMPP Apache/MySQL and the FakeSMTP server before booking; without FakeSMTP, local email capture is unavailable.

## 6. Walkthrough C — account, bookings and cancellation

### `account.php` — server-side data

- `$_SESSION['email']` identifies whose records to load.
- `SELECT ... LEFT JOIN ... GROUP_CONCAT` retrieves booking details and groups seat numbers per booking card.
- Display classification: database `Cancelled` status → **Cancelled** tab; otherwise a screening timestamp before current time → **Past**, else → **Upcoming**.
- The timestamp must join date and time **with a space**: `strtotime($date . ' ' . $time)`.
- The booking query was changed to order by **earliest screening date/time first** (`ORDER BY screening_date ASC, screening_time ASC`). This is **not** purchase order.
- A second query retrieves the user's film submissions and counts `pending review` records.

### `js/account.js` — browser-side tabs and modals

- Tabs use `data-booking-status` and `data-submission-status` attributes on PHP-rendered cards.
- Changing a tab hides nonmatching cards; it **does not** run a new SQL query.
- Film submission tabs are **All / Pending / Approved / Rejected** with Show More / Show Less, initially showing three matching entries.
- Clicking Cancel Booking opens a `<dialog>` and fills in a hidden `bookingId` field.
- **Past bug:** an event listener for a removed `Edit Profile` button tried `.addEventListener` on `null`, stopping the rest of the script and breaking submission tabs. The unused listener was removed.

### `process-cancellation.php` — backend

- Only allows POST requests from a logged-in account.
- Runs a prepared `UPDATE bookings SET status = 'Cancelled'` conditional on **booking ID**, **matching logged-in email**, current **Confirmed** status and **screening time still in the future**.
- It does **not** delete `booking_seats` rows. Since occupied-seat queries filter to confirmed bookings, seats from cancelled bookings become available again.
- Redirects back to `account.php` with result information.

**Say this in the demo:** “Cancellation is a status update rather than a deletion. It preserves the transaction history while releasing the seat logically through the confirmed-booking filter.”

## 7. Walkthrough D — film submission and review

### `submit.php` + `js/submit.js`

- The form is organised into **Film Details, Credits, Film & Media, Your Details**, plus declarations.
- Browser validation checks required fields, runtime 1–300, completion year 1900–current year, name/cast/school patterns, matriculation number and HTTP(S) links.
- Poster control was customised: initially show **Choose File**; after selection show filename and **×** on the same row. × clears the file selection.
- JavaScript rejects an image exceeding **5 MB** immediately, showing a red message under the poster field.
- Always keep the **server-side** size validation too: someone can bypass JavaScript.

### `process-submission.php`

1. Checks login and POST method.
2. Receives submitted fields from `$_POST` and identity from PHP session.
3. Validates required fields, ranges, approved language/subtitle lists, basic URL syntax and declaration checkboxes.
4. Receives upload via `$_FILES['filmPoster']`; checks upload status, size **at most 5 MB**, and actual image type via `getimagesize()` (JPG, PNG or WebP).
5. Saves poster under `uploads/posters/` with a generated filename; stores the **relative path**, not image binary, in the DB.
6. Uses a prepared `INSERT` into `film_submissions`; initial submission status is `pending review` in the application's workflow.
7. Redirects to `submit.php?success=1&reference=...` and JavaScript displays the reference in a confirmation modal.

**Known limitation:** Some database execution exceptions can skip the original `else`-based poster cleanup. This was identified as optional hardening and intentionally not fully reworked. Do not claim all failure modes are handled.

### `admin-submission.php` + `process-submission-status.php`

- Admin pages check PHP session role (`admin`) before displaying or changing data.
- `admin-submission.php` queries submissions and shows them in a scrollable HTML **table**.
- Pending submissions have **Approve / Reject** buttons in POST forms; reviewed submissions display **Reviewed**.
- `process-submission-status.php` validates the submitted ID and accepts only `approved` / `rejected`.
- Its SQL `UPDATE ... WHERE submission_id = ? AND status = 'pending review'` prevents repeated review of a completed submission. The My Account page reflects updated status on reload.

## 8. Four frequently asked “why?” questions

| Likely question | Concise answer |
|---|---|
| Why both JS and PHP validation? | JS gives immediate feedback; PHP validates again because browser-side code can be bypassed. |
| Why prepared statements? | User-supplied values are bound separately from SQL commands, reducing SQL injection risk. |
| Why PHP sessions? | To retain logged-in user ID/email/role across requests without putting credentials in every URL. |
| Why a transaction for booking? | Main booking and seat records should either all be saved or all be rolled back. |
| Why does a cancelled seat become free without deleting a row? | Seat availability queries include only bookings whose status is `Confirmed`. |
| Why use FakeSMTP? | To demonstrate email acknowledgements under the module's local-only mail restriction. |
| Is the payment real? | No: it is a simulated checkout; no external payment provider or real card charging. |
| Is movie/showtime data administered in the database? | The catalogue currently uses the JavaScript movie-data arrays; there is no admin movie-scheduling CRUD interface. |

## 9. Suggested professor demo route

1. Sign in as regular user → explain `process-login.php`, password hash and session.
2. Browse catalogue → movie details → screening selection.
3. Open seat page → show already occupied seats, select two seats, show total, attempt seventh seat if available.
4. Enter **dummy** payment information → confirm booking → verify My Account and locally captured email.
5. Cancel a future booking → show Cancelled tab → explain status update and released seat.
6. Submit a valid film with poster → show confirmation reference → My Account Pending.
7. Sign out; log in as administrator → show admin submission table → approve/reject a pending submission.
8. Log in as student again → show updated submission status.

**Before the demo:** Make sure Apache, MySQL and FakeSMTP are running; the screening selected is in the **future**; and test accounts, poster files and at least one pending film submission exist. Use only mock payment data and test-only video passwords.

## 10. Common bugs encountered during development — useful revision stories

| Symptom | Actual issue / lesson |
|---|---|
| Booking failed with duplicate reference | Old `INSERT` executed **before** the new transaction; the same booking was inserted again inside transaction. Fixed by keeping one INSERT inside transaction. |
| Confirmed booking with zero seat rows | A symptom of the earlier duplicate-INSERT logic: the first insert persisted before the transaction failed. Not automatic expiry cleanup. |
| My Account shows films in a surprising order | SQL originally sorted screening dates `DESC`; changing to `ASC` displays the soonest screening first. |
| Submission status tabs would not click | Removed Edit Profile HTML but left a JS listener on a missing element; a `null.addEventListener(...)` error stopped the script. |
| PHP email doesn't reach real mailbox | By design, FakeSMTP **captures** local test messages. |
| Large poster selected without warning | Native `<input type=file>` selection is not approval; explicit JS and PHP size checks are required. |
| Poster upload showed two Choose File controls | Native input wasn't hidden after adding custom label/button. |
| Poster filename stacked vertically | Broad `.submission-section span` styling intended for numbered legends also affected filename; fixed with more specific CSS. |

### Annotation targets by file

- `process-login.php`: `$_POST`, prepared `SELECT`, `password_verify`, `session_regenerate_id`, setting `$_SESSION`, role redirect.
- `bookingandpayment.php`: `$_GET`, seat availability `JOIN`, PHP-generated `unavailableSeats`.
- `bookingandpayment.js`: seat-map creation, selection array, max-six check, mock card validation, hidden fields.
- `process-booking.php`: validation, repeated availability check, transaction, booking and seat INSERTs, email and redirect.
- `account.php`: logged-in user's queries, `LEFT JOIN`/`GROUP_CONCAT`, Upcoming/Past/Cancelled classification.
- `account.js`: tab filters, `data-*` attributes, modal controls.
- `process-cancellation.php`: user ownership and future-screening checks in `UPDATE`.
- `submit.js`: `validateField`, poster size and remove button, success-modal query parameters.
- `process-submission.php`: URL patterns, `$_FILES`, image checks, file move, SQL insert.
- `admin-submission.php` / `process-submission-status.php`: admin-only checks, HTML table, allowed actions, conditional UPDATE.
- `includes/database.php`: one shared MySQL connection.
- `css/style.css`: variables in `:root`, layout containers, media queries and `:focus` / `:hover`.


## 12. Boundaries 

- No public user registration: demo accounts were inserted manually into MySQL.
- No live NTU single sign-on and no real payment gateway.
- No administrator CRUD for movie/showtime schedules and no ticket-sales analytics dashboard.
- Availability is queried from MySQL per booking page/request; simultaneous checkout collision protection was not implemented as an advanced locking system.
- No verified scalability benchmark, accessibility certification or real-world email delivery guarantee.
- Modern frameworks were intentionally not used in the traditional Base Version; do not call a CSS carousel a separate modern-technology enhancement automatically.
