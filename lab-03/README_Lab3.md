# Lab 3: REST API, Query Parameters, Validation and Debugging

**Student:** Sai Preneeth (252U1R8019)  
**Project:** Books REST API  
**Stack:** Node.js, Express.js, SQLite (`sqlite` + `sqlite3`)

## Deployment link:
https://express-labs-3.onrender.com/


## Run locally

1. Open a terminal in the `lab-03` directory:
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000/` or test using Postman.

The project uses ES modules (`"type": "module"` in `package.json`).

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Health/info response |
| GET | `/books` | List/search/filter/sort/page books |
| GET | `/books/:bookId` | Read one book |
| POST | `/books` | Create a book |
| PUT | `/books/:bookId` | Update a book |
| DELETE | `/books/:bookId` | Delete a book |

### GET /books query parameters

- `search_q`: partial match on title, e.g. `?search_q=atomic`
- `order_by`: `id`, `title`, `author`, `price`, or `pages`; default `id`
- `order`: `ASC` or `DESC`; default `ASC`
- `limit`: page size from 1 to 100; default `10`
- `offset`: number of rows to skip; default `0`
- `min_price`: optional minimum price
- `max_price`: optional maximum price

Examples:
```text
GET /books?search_q=atomic
GET /books?order_by=price&order=DESC
GET /books?limit=5&offset=0
GET /books?min_price=200&max_price=400
GET /books?search_q=the&order_by=title&order=ASC&limit=5&offset=0
```

## Status Codes Summary

- `200 OK`: successful read, update, or delete
- `201 Created`: book created
- `400 Bad Request`: invalid ID, invalid query parameter, invalid JSON, or invalid request body
- `404 Not Found`: requested book does not exist
- `500 Internal Server Error`: unexpected server/database error

Error responses use a consistent shape:
```json
{
  "message": "Error description here"
}
```

