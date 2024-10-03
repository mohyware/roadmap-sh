# Weather API
## Overview
This project is a Weather API that fetches and returns weather data from a third-party API. It demonstrates key concepts such as interacting with external APIs, implementing caching using Redis, and managing environment variables.

## Key Features:
- Integration with a third-party weather API (e.g., Visual Crossing’s API, free and easy to use).
- Caching implementation using Redis for improved performance and reduced API calls.
- storing API responses with a configurable expiration time (e.g., 12-hour expiration).
- Use of environment variables to securely store the API key and Redis connection string.
- Optional rate limiting to prevent abuse of the API (e.g., using express-rate-limit for Node.js).
- Error handling: Provide informative error messages and handle exceptions gracefully.
- Security: Implement measures to protect the API and user data.
# How to run this project
1. Clone this repository
2. Run `npm install`
3. Create a `.env` file and add the following:
```
PORT=4000
API_KEY=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
```
4. Run `node app`
5. Test the API using Postman or any API testing tool

## API Endpoints

### Base URL:
`http://localhost:4000/api/v1/weatherAPI/:city/:startDate?/:endDate?/:time?`

### Example:
```plaintext
http://localhost:4000/api/v1/weatherAPI/london,uk/2024-09-23/2024-09-24/15:00:00
```

## Project Url
https://roadmap.sh/projects/ecommerce-api
