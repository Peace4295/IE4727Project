# Nanyang Film House — Web Development Terms & Viva Glossary

**IE4727 | Personal revision reference | 31 October 2026**

**Client-side** means code running in the user's browser (JavaScript, CSS, HTML). 
**Server-side** means code running on the server (PHP, MySQL). 

## 1. HTML

- `id` , one specific element (css use #)
- `class` , reusable label for elements (css use .)
- `name` , identify the submitted data for PHP
- `<dialog>`, Built-in dialog/modal interface. 
- `data-*`, Store custom information about an element
- `alt`, desc an img
- `GET`, Typically requests a page; query values appear in URL.  (`$_GET['movieId']` )
- `POST`, Typically submits form changes/data in the body.  (`$_POST['filmTitle']` )
- `<article>`, HTML element used to group a piece of content that can stand on its own.

## 2. CSS 

- `Flexbox`, One-dimensional layout: arrange items along a row **or** column. Good for alignment and spacing.
- `display: flex` , turns container into a flex container (horizontal buttons)  
- `flex-direction`, Sets main axis (`row` or `column`)
- `justify-content`, Aligns items along the flex main axis. (`center`, `space-between`) 
- `align-items`, Aligns items across the cross axis. (Vertically centre button contents) 
- `gap`, Space between flex/grid children.(Seat row spacing) 
- `display: grid`, Turns a container into a grid.
- `grid-template-columns`, grid column widths/counts. (`repeat(2, 1fr)`) 
- `fr`, fraction of available grid space. (`1fr 1fr` gives equal columns) 
- `position: sticky`, Element remains near a position while scrolling. (nav top bar)
- `position: absolute`, position an element at a specific location relative to its nearest positioned parent element. (Floating mobile menu)
- `position: fixed`, keeps an element in the same position on the screen, even when the user scrolls.
- `z-index`, Controls overlapping order for positioned/stacked items. 
- `overflow-x: auto`, Adds horizontal scrolling if content is too wide. 
- `padding`, Space **inside** element border.
- `margin`, Space **outside** element border. 
- `border-radius`, Rounds corners
- `:focus-visible`, Style when keyboard focus should be visually indicated.
- `:disabled`, Style for disabled form controls. (Grey unavailable seats ) 

**Flexbox** best for a row of buttons or a vertical stack. 
**Grid** best for a catalogue with multiple columns or an organised two-dimensional layout. 

## 3. JavaScript 

- `let`, Creates a variable whose value can change later. (let selectedSubmissionStatus = "all";)
- `Event listener`, Waits for something to happen, then runs a function. (button.addEventListener("click", function() {...});)
- `Event`, Something that happens on a webpage, such as clicking, typing or submitting a form. (click, input, change, submit)
- `Callback`, A function that is passed to another function to be executed when needed. (The function() {...} inside addEventListener())
- `DOMContentLoaded`, Waits until the HTML has finished loading and been read by the browser before running JavaScript. (document.addEventListener("DOMContentLoaded", function() {...});)
- `document.getElementById()`, Finds one HTML element using its ID. (document.getElementById("seat-map"))
- `querySelector()`, Finds the first HTML element that matches a CSS selector. (document.querySelector(".booking-tab"))
- `querySelectorAll()`, Finds all HTML elements that match a CSS selector. (document.querySelectorAll(".booking-tab"))
- `forEach()`, Repeats an action for every item in an array or list. (bookingTabs.forEach(function(tab) {...});)
- `map()`, Goes through an array, changes each item and creates a new array. (movies.map(createMovieCard))
- `filter()`, Creates a new array containing only items that meet a condition. (movies.filter(movie => movie.status === "showing"))
- `find()`, Searches an array and returns the first item that matches a condition. (movies.find(movie => movie.id === 1))
- `includes()`, Checks whether an array or string contains a particular value. (unavailableSeats.includes("A1"))
- `push()`, Adds a new item to the end of an array. (selectedSeats.push("A1"))
- `splice()`, Adds, removes or replaces items at a specific position in an array. (selectedSeats.splice(0, 1) removes one item at index 0.)
- `classList.add()`, Adds a CSS class to an HTML element. (seatButton.classList.add("selected"))
- `classList.remove()`, Removes a CSS class from an HTML element. (seatButton.classList.remove("selected"))
- `classList.toggle()`, Adds a class if it is missing, or removes it if it already exists. (button.classList.toggle("active"))
- `textContent`, Gets or changes the text displayed inside an HTML element without treating it as HTML code. (ticketCount.textContent = 2;)
- `innerHTML`, Gets or changes the HTML content inside an element, including tags and other elements. (container.innerHTML = "<h2>Now Showing</h2>";)
- `dataset`, Allows JavaScript to read or change custom HTML data-* attributes. (card.dataset.submissionStatus reads data-submission-status.)
- `hidden`, Hides or shows an HTML element. (card.hidden = true; hides it, while card.hidden = false; shows it.)
- `event.preventDefault()`, Stops the browser from performing its usual action. (event.preventDefault() prevents an invalid form from submitting.)
- `showModal()`, Opens a <dialog> as a popup over the webpage. (seatLimitModal.showModal();)
- `close()`, Closes an open <dialog>. (seatLimitModal.close();)
- `URLSearchParams`, Reads or creates information stored in a URL after the ? symbol. (new URLSearchParams(window.location.search))
- `regex`, A pattern used to check whether text follows a specific format. (/^[0-9]{16}$/ checks for exactly 16 digits.)
- `null`, Means there is no value or that something wasn't found. (document.getElementById("missing-button") returns null if the element doesn't exist.)


### What is an event listener? Show this

```js
const closeButton = document.getElementById("close-seat-limit");
closeButton.addEventListener("click", function () {
    document.getElementById("seat-limit-modal").close();
});
```

Explanation: **Find the button → wait for a click → run the callback → close the modal.** There is no full page reload.

### How does validation stop a form?

```js
if (firstInvalidField) {
    event.preventDefault();
    firstInvalidField.focus();
}
```

Normally submitting a form sends a request to PHP. `preventDefault()` stops that default submission when invalid input is detected. PHP **still** validates on requests that reach the server.

## 4. PHP 
Here's the simplified PHP glossary in the same format as your JavaScript glossary, with beginner-friendly explanations and examples from your Nanyang Film House project.

## PHP Terms and Explanations

- `$_GET`, Retrieves information passed through the URL after the `?` symbol. (`$_GET["movieId"]` gets the selected movie ID.)
- `$_POST`, Retrieves information submitted to PHP through a POST request, usually from a form. (`$_POST["filmTitle"]` gets the submitted film title.)
- `$_FILES`, Retrieves information about files uploaded through an HTML form. (`$_FILES["filmPoster"]["size"]` gets the uploaded poster's size.)
- `$_SESSION`, Stores information about the logged-in user across different PHP pages. (`$_SESSION["email"]` stores the user's email after login.)
- `session_start()`, Starts a new session or continues an existing session so PHP can access stored session information. (`session_start();` at the beginning of `account.php`.)
- `session_regenerate_id(true)`, Gives the user a new session ID after login to improve security. (`session_regenerate_id(true);`, after verifying the password.)
- `isset()`, Checks whether a variable exists and is not `null`. (`isset($_SESSION["user_id"])` checks if the user ID is available.)
- `??`, Provides a default value if something doesn't exist or is `null`. (`$_POST["genre"] ?? ""` uses an empty string if no genre was submitted.)
- `trim()`, Removes unnecessary spaces from the beginning and end of a string. (`trim($_POST["filmTitle"])` removes extra spaces around a film title.)
- `filter_var()`, Checks whether a value follows a particular format using PHP's built-in filters. (`filter_var($email, FILTER_VALIDATE_EMAIL)` checks an email address.)
- `preg_match()`, Checks whether text matches a specific pattern using a regular expression. (`preg_match("/^[A-F][1-8]$/", $seatNumber)` checks whether a seat is between A1 and F8.)
- `ctype_digit()`, Checks whether a string contains only numerical digits from 0 to 9. (`ctype_digit($runtime)` checks whether the film running time contains only digits.)
- `htmlspecialchars()`, Converts special HTML characters into safe text so they aren't interpreted as HTML code. (`htmlspecialchars($filmTitle)` safely displays a film title.)
- `header("Location: ...")`, Redirects the browser to another page. (`header("Location: account.php");` sends the user to My Account.)
- `exit`, Immediately stops the PHP script from running any further. (`exit;` after redirecting a user to the login page.)
- `require_once`, Loads another PHP file and ensures it is included only once. (`require_once __DIR__ . "/includes/database.php";` loads the database connection.)
- `__DIR__`, Gives the folder location of the current PHP file on the server. (`__DIR__ . "/uploads/posters/"` locates the poster upload folder.)
- `date_default_timezone_set()`, Sets the timezone PHP uses when working with dates and times. (`date_default_timezone_set("Asia/Singapore");`)
- `DateTime::createFromFormat()`, Creates a date and time from text that follows a specified format. (`DateTime::createFromFormat("!Y-m-d H:i", "2026-10-31 21:00")`)
- `password_hash()`, Converts a password into a one-way hash so the original password isn't stored directly. (`password_hash("examplePassword", PASSWORD_DEFAULT)`)
- `password_verify()`, Checks whether the password entered by the user matches the stored password hash. (`password_verify($password, $user["password_hash"])`)
- `try/catch`, Runs code inside `try` and handles errors or exceptions inside `catch` instead of leaving them unhandled. (`try { $db->commit(); } catch (Throwable $error) { $db->rollback(); }`)
- `Throwable`, A PHP type that represents errors and exceptions, allowing them to be caught. (`catch (Throwable $error)` catches errors thrown during booking processing.)
- `error_log()`, Records error information in the server's error log to help with debugging. (`error_log("Booking database error: " . $error->getMessage());`)
- `ob_start()`, Temporarily holds PHP output instead of immediately sending it to the browser. (`ob_start();` before calling your mail patch.)
- `ob_end_clean()`, Discards the output that was temporarily held. (`ob_end_clean();` prevents mail-patch error messages from appearing before the booking redirect.)
- `mail()` (patched namespace), A custom PHP function from your professor's mail patch that sends email data to your local FakeSMTP server. (`\mail_patch\mail($bookerEmail, $subject, $message, $headers, $sender);`)

## Additional PHP terms
- `echo`, Displays text or other output on the webpage. (`echo "Booking successful!";`)
- `$variable`, Stores a value in PHP, such as text, numbers or arrays. (`$ticketCount = 2;`)
- `explode()`, Splits a string into an array using a separator. (`explode(",", "A1,A2,A3")` creates an array of three seats.)
- `implode()`, Joins array items into one string using a separator. (`implode(", ", $selectedSeats)` produces `"A1, A2"`.)
- `mysqli`, PHP's tool for connecting to and working with MySQL databases. (`new mysqli("localhost", "root", "", "ntu_films")`)
- `prepare()`, Prepares an SQL query containing placeholders for values that will be supplied later. (`$db->prepare("SELECT * FROM users WHERE email = ?")`)
- `bind_param()`, Supplies PHP values to the placeholders in a prepared SQL query. (`$statement->bind_param("s", $email);`)
- `execute()`, Runs a prepared SQL statement. (`$statement->execute();`)
- `fetch_assoc()`, Retrieves one database result row as an array using column names. (`$result->fetch_assoc()`)
- `begin_transaction()`, Starts a database transaction so related changes can be handled together. (`$db->begin_transaction();`)
- `commit()`, Permanently saves the changes made during a database transaction. (`$db->commit();`)
- `rollback()`, Undoes changes made during the current transaction if an error occurs. (`$db->rollback();`)

## 6. MySQL and database terms

- `SELECT`, Retrieves data from a table. (View bookings)
- `INSERT`, Adds new data to a table. (Save a new booking)
- `UPDATE`, Changes existing data. (Change booking status to Cancelled)
- `DELETE`, Removes data from a table. (Delete a booking)
- `WHERE`, Specifies which records to use. (`WHERE booking_id = 5`)
- `INNER JOIN`, Combines only matching records from two tables. (Match bookings with their seats)
- `LEFT JOIN`, Combines records while keeping all rows from the first table. (Show bookings even without seat records)
- `GROUP BY`, Groups records with the same value. (Group seats by booking ID)
- `GROUP_CONCAT`, Combines multiple values into one text. (A1, A2, A3)
- `ORDER BY ASC`, Sorts from smallest to largest or earliest to latest. (Earliest screening first)
- `ORDER BY DESC`, Sorts from largest to smallest or latest to earliest. (Newest submission first)
- `Prepared statement`, Prepares SQL before adding user inputs. (Check login email safely)
- `?`, Placeholder for a value supplied later. (`WHERE email = ?`)
- `bind_param()`, Connects PHP values to SQL placeholders. (`"is"` means integer, string)
- `SQL injection`, An attack that uses input fields to manipulate SQL. (Prepared statements help prevent it)
- `Transaction`, Groups database changes together. (Save booking and seats together)
- `commit()`, Saves all changes in a transaction. (Confirm booking records)
- `rollback()`, Undoes uncommitted transaction changes. (Undo failed booking)
- `InnoDB`, A MySQL table engine that supports transactions. (Your booking tables)
- `UNIQUE`, Prevents duplicate values. (Booking reference number)
- `Constraint`, A rule controlling what data can be stored. (No duplicate references)
- `Normalisation`, Splits data into related tables to reduce repetition. (`bookings` and `booking_seats`)
- `phpMyAdmin`, A website for managing MySQL databases. (View and edit your tables)
- `NOW()`, Gets the current MySQL date and time. (Check whether a screening has started)



## 8. Troubleshooting questions professors may ask

**Q: Why do you still need PHP checks if the browser form validates?**  
A: Browser validation is for usability; requests can be altered or sent directly. Server validation is the final check before DB changes.

**Q: Why does a booked seat stay unavailable after another person refreshes?**  
A: The PHP booking page reads occupied seats from MySQL for the exact movie/screening; the result is used to disable those buttons on page load.

**Q: What happens if someone cancels?**  
A: The booking status is updated to `Cancelled`. The seat availability query excludes cancelled bookings, so their seats become selectable again.

**Q: Is your mail going to the NTU mailbox?**  
A: No. We use FakeSMTP locally per coursework restrictions. It intercepts mail so we can inspect the acknowledgement without delivering externally.

**Q: What happens when a file is larger than 5 MB?**  
A: The browser shows an inline message and stops submission. PHP independently rejects the oversized upload if it reaches the server.

