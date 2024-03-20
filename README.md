# Productbox-Test 🚀

## Problem Statement 📋
Create a Node server that responds to `GET /I/want/title` route, expecting a list of website addresses as query strings. Upon receiving the addresses, it fetches each website's title enclosed in `<title></title>` tags, compiles them into an HTML list, and sends the response. For any other routes, it returns HTTP code 404. Error handling includes displaying "NO RESPONSE" for invalid addresses.

## Tasks ✅
- Implement using plain Node.js callbacks.
- Implement using a flow library like async.js or step.js.
- Implement using Promises (RSVP, Q).
- **BONUS:** Implement using Streams (bacon.js, RxJs).
- **BONUS:** Unit tests Implemented.
- **BONUS:** All Error handling and edge cases.

## Technical Specification: Website Title Retrieval Service 🛠️

**Objective:**
- Develop a Node.js server to extract and present website titles in HTML format upon receiving requests to a specific route (`GET /I/want/title`).

**Routes:**
- The server will handle only one route: `GET /I/want/title`, expecting website addresses in the query string format.

**Request Handling:**
- Upon receiving a request, the server will extract website addresses from the query string, make HTTP requests to each, and parse the HTML content for titles.

**Response Format:**
- The server will respond with an HTML document listing website titles, each displayed as a list item.
- Error messages for unresponsive or title-less websites will be incorporated into the response.

**Error Handling:**
- Invalid routes will return a 404 Not Found status.
- Error messages will be appropriately formatted within the HTML response.

**Implementation:**
- The server will be implemented using plain Node.js callbacks, with additional versions utilizing flow control libraries, Promises, and Streams as bonuses.

**Testing:**
- Mocha and Chai will be used for unit tests, covering various request scenarios and edge cases.

**Documentation:**
- README.md will provide installation, usage, and testing instructions, along with examples and additional details.

**Version Control:**
- The project will be version-controlled on GitHub, ensuring transparent collaboration and tracking of changes.

## Install 📥
To install the dependencies:


## Start Server ▶️
To start the server:

```bash
npm start
```

OR 

## Start Nodemon Server ▶️
To start the server:


## Start Server ▶️
To start the server:

```bash
npm run dev
```

## Example ▶️
Run following example commands for each of the questions:

- http://localhost:3000/I/want/title/usingNode/?address=google.com
- http://localhost:3000/I/want/title/usingAsync/?address=google.com&address=google.com
- http://localhost:3000/I/want/title/usingRsvp/?address=google.com&address=www.dawn.com/events/
- http://localhost:3000/I/want/title/usingRxjs/?address=yahoo.com

[Problem Statement]: https://gist.github.com/waleedwaseem/d514296b304c9d42ab42a8626aa808f8
