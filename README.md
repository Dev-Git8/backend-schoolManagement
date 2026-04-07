# School Management API

A RESTful API for managing schools with location-based features. Built with Node.js, Express, and Prisma ORM, this API allows you to add schools and retrieve them sorted by distance from a given location.

## Features

- **Add Schools**: Create new school entries with name, address, latitude, and longitude
- **Location-Based Search**: Retrieve all schools sorted by proximity to your current location
- **Distance Calculation**: Uses Haversine formula for accurate distance computation
- **Database Integration**: Powered by Prisma ORM with PostgreSQL
- **Error Handling**: Comprehensive validation and error responses
- **Environment Configuration**: Secure environment variable management

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Database Adapter**: PrismaPg (for serverless compatibility)
- **Environment**: dotenv for configuration

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Git

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dev-Git8/backend-schoolManagement.git
   cd backend-schoolManagement
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/school_management_db"
   JWT_SECRET=your_jwt_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   ```

   > **Note**: Replace the `DATABASE_URL` with your actual PostgreSQL connection string.

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init

   # (Optional) Push schema to database
   npx prisma db push
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Add a School
**Endpoint**: `POST /school/add`

**Description**: Creates a new school entry in the database.

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Central High School",
  "address": "123 Main Street, City, State",
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response (Success - 201)**:
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Central High School",
    "address": "123 Main Street, City, State",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "createdAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "All fields (name, address, latitude, longitude) are required"
}
```

**Validation**:
- All fields are required
- Latitude and longitude must be valid numbers

### 2. Get All Schools (Sorted by Distance)
**Endpoint**: `GET /school/getall`

**Description**: Retrieves all schools sorted by distance from the provided coordinates (nearest first).

**Query Parameters**:
- `latitude` (required): Your current latitude (e.g., 40.7128)
- `longitude` (required): Your current longitude (e.g., -74.0060)

**Example Request**:
```
GET /school/getall?latitude=40.7128&longitude=-74.0060
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Central High School",
      "address": "123 Main Street",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "createdAt": "2026-04-07T10:00:00.000Z",
      "distance": 0
    },
    {
      "id": 2,
      "name": "West Elementary",
      "address": "456 Oak Avenue",
      "latitude": 40.7589,
      "longitude": -73.9851,
      "createdAt": "2026-04-07T10:05:00.000Z",
      "distance": 8.5
    }
  ]
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Latitude and Longitude are required"
}
```

**Notes**:
- Distance is calculated in kilometers using the Haversine formula
- Schools are sorted from nearest to farthest
- Latitude and longitude must be valid numbers

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `500`: Internal Server Error

## Testing the API

You can test the endpoints using tools like:

- **Postman**: Import the collection or manually create requests
- **curl**: Command-line testing
- **Thunder Client**: VS Code extension

### Example curl commands:

**Add a school**:
```bash
curl -X POST http://localhost:3000/school/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "address": "123 Test St",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

**Get all schools**:
```bash
curl "http://localhost:3000/school/getall?latitude=40.7128&longitude=-74.0060"
```

## Project Structure

```
backend-schoolManagement/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── config.ts              # Prisma configuration
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   └── school.controller.js # Business logic
│   ├── routes/
│   │   └── school.routes.js   # API routes
│   └── utils/                 # Utility functions
├── .env                       # Environment variables (not committed)
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## Database Schema

The application uses a single `School` model:

```prisma
model School {
  id        Int     @id @default(autoincrement())
  name      String
  address   String
  latitude  Float
  longitude Float
  createdAt DateTime @default(now())

  @@index([latitude, longitude])
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ using Node.js and Prisma**