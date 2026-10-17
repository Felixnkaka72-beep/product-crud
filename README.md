# Tech Product Showcase: Single-Table CRUD App
 Mulungushi University, School of Engineering and Technology, Computer Science Department
*Author:* Felix Nkaka

## Links

- App: https://YOUR-APP.onrender.com
- API: https://YOUR-APP.onrender.com/api/products
- Source code: https://github.com/YOUR-USERNAME/products-crud
- Postman video: ADD-LINK-HERE

> If hosted on Render's free tier, the app sleeps after 15 minutes without traffic, so the first request can take up to a minute. Free-tier storage is temporary, so the SQLite database is wiped when the service restarts or redeploys. When that happens the table is recreated and the 12 sample records are loaded again.

## What this project is

A web application for managing a catalogue of technology products. A page in the browser talks to a Node.js and Express REST API, which stores data in one SQLite table. The Express server also serves the page, so the app and the API share one address.

## Assignment requirements

| Requirement | How it is met |
|---|---|
| One SQLite table with id and at least 5 more fields | products table: id plus product_name, category, brand, price, stock_quantity, description |
| Timestamps | created_at and updated_at columns, updated_at refreshed on every update |
| At least 10 sample records | 12 records in backend/seed.sql, loaded when the table is empty |
| Five REST endpoints returning JSON | GET list, GET one, POST, PUT, DELETE under /api/products |
| Environment variables | PORT and DB_FILE read from backend/.env |
| CORS enabled | cors package |
| HTML and JavaScript page | frontend/index.html: form, table, edit, delete, page refreshes after each action |
| Postman evidence | Video link above |
| Cloud deployment | Links above |

## Extra features in the interface

- Add and edit in a pop-up form, with checks for product name, price and stock before sending
- Search across name, category, brand and description
- Filters for category and stock level (out of stock is 0 units, low is 15 units or fewer)
- Sort by clicking any column heading; the sort choice and rows per page are remembered in the browser
- Pagination with 10, 25 or 50 rows per page
- Select several rows and delete them together, with a confirmation pop-up
- Summary figures: number of products, units in stock, inventory value, count of low or out of stock products
- Bar chart of inventory value for the top six categories
- Export the current filtered view to CSV
- Import products from a CSV file; each row is sent to the API as a POST
- Print report button
- Light and dark mode, remembered in the browser (first visit follows the computer's setting)
- Keyboard shortcuts: / focuses the search box, N opens the add form

## Technology

| Part | Technology |
|---|---|
| Backend | Node.js, Express, cors |
| Database | SQLite through Node's built-in node:sqlite module |
| Frontend | HTML, CSS and JavaScript in one file, no libraries |
| Configuration | backend/.env |

## Database

Table products:

| Field | Type | Notes |
|---|---|---|
| id | INTEGER | Primary key, auto-increment |
| product_name | TEXT | Required |
| category | TEXT | |
| brand | TEXT | |
| price | REAL | Required, default 0 |
| stock_quantity | INTEGER | Default 0 |
| description | TEXT | |
| created_at | TEXT | Set automatically |
| updated_at | TEXT | Set automatically, refreshed on update |

backend/schema.sql creates the table and backend/seed.sql holds the sample records.

## API

| Method | URL | Purpose | Success status |
|---|---|---|---|
| GET | /api/products | List all products | 200 |
| GET | /api/products/:id | Get one product | 200 |
| POST | /api/products | Create a product | 201 |
| PUT | /api/products/:id | Update a product (send all fields) | 200 |
| DELETE | /api/products/:id | Delete a product | 200 |

Responses are JSON. The server checks that product_name is not empty, price is a number of 0 or more, and stock_quantity is a whole number of 0 or more. Error responses:

- 400: failed validation (with a list of messages), invalid id, or invalid JSON body
- 404: product not found, or unknown route under /api
- 500: unexpected server error

Example body for POST and PUT:

json
{
  "product_name": "Zambia Phone X",
  "category": "Phone",
  "brand": "Techno",
  "price": 299.99,
  "stock_quantity": 25,
  "description": "Example product"
}


## Run it on your own computer

Requires Node.js 22.13 or higher.


cd backend
npm install
npm start


Then open http://localhost:3000.

If PowerShell on Windows blocks npm, run this once and try again:


Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned


## Project structure


products-crud/
├─ backend/
│  ├─ .env          PORT and DB_FILE
│  ├─ package.json
│  ├─ schema.sql    creates the table
│  ├─ seed.sql      sample records
│  ├─ db.js         database connection
│  └─ server.js     Express API
├─ frontend/
│  └─ index.html    page, styles and JavaScript
├─ .gitignore
└─ README.md


## Safeguards in the code

- Database queries use ? placeholders instead of joining user input into SQL.
- The server validates create and update requests itself, in addition to the checks in the page.
- The page inserts data with textContent, not innerHTML.
- CSV export puts an apostrophe in front of cells that begin with =, +, - or @.
- CSV import is limited to 200 rows and 200 KB. These limits are checked in the browser only.

## Testing

Fill in the Result column after running each test yourself.

| Test | Expected result | Result |
|---|---|---|
| GET /api/products | 200 and a list of products | |
| GET /api/products/1 | 200 and one product | |
| POST with a valid body | 201 and the new product | |
| PUT with a valid body | 200 and the updated product | |
| DELETE an existing id | 200 and a confirmation message | |
| GET the deleted id | 404 | |
| POST with an empty product_name | 400 | |
| Add, edit and delete from the page | Table and summary figures update | |
| Search, sort, filters, pagination | Table changes as expected | |
| CSV export and import | File downloads; valid rows are added, invalid rows are reported | |

## Known limitations

- Free hosting wipes the database when the service restarts.
- There is no login, so anyone with the link can change the data.
- Search, sorting, filters and pagination run in the browser on the full list, so a very large dataset would need server-side paging.
- Text length limits on the form fields are enforced by the browser only.