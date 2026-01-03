# GlobeTrotter Backend API Documentation

## Overview

GlobeTrotter backend provides REST API endpoints for managing multi-city travel itineraries, user authentication, and trip collaboration.

## Base URL

```
Development: http://localhost:5000
```

## Authentication

Most endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "1990-01-01"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "preferences": {
    "currency": "EUR",
    "travelStyle": "luxury"
  }
}
```

### Trip Routes (`/api/trips`)

#### Get User's Trips

```http
GET /api/trips?status=planning&limit=10&offset=0&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

#### Get Specific Trip

```http
GET /api/trips/:tripId
Authorization: Bearer <token>
```

#### Create New Trip

```http
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "European Adventure 2024",
  "description": "3-week multi-city trip",
  "startDate": "2024-06-15",
  "endDate": "2024-07-06",
  "numberOfTravelers": 2,
  "theme": "cultural",
  "travelStyle": "comfort",
  "interests": ["museums", "food", "architecture"],
  "budgetTracking": {
    "totalBudget": 5000
  },
  "initialDestination": "Paris"
}
```

#### Update Trip

```http
PUT /api/trips/:tripId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Trip Name",
  "status": "active"
}
```

#### Delete Trip

```http
DELETE /api/trips/:tripId
Authorization: Bearer <token>
```

### Itinerary Routes (`/api/trips/:tripId/itinerary`)

#### Get Trip Itinerary

```http
GET /api/trips/:tripId/itinerary
Authorization: Bearer <token>
```

#### Update Entire Itinerary

```http
PUT /api/trips/:tripId/itinerary
Authorization: Bearer <token>
Content-Type: application/json

{
  "stops": [
    {
      "name": "Paris",
      "country": "France",
      "arrivalDate": "2024-06-15",
      "departureDate": "2024-06-18",
      "dailyBudget": 100,
      "accommodation": {
        "name": "Hotel Le Marais",
        "type": "hotel",
        "pricePerNight": 120,
        "nights": 3,
        "totalCost": 360
      }
    }
  ]
}
```

#### Add New Stop

```http
POST /api/trips/:tripId/itinerary/stops
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Amsterdam",
  "country": "Netherlands",
  "arrivalDate": "2024-06-18",
  "departureDate": "2024-06-21",
  "dailyBudget": 90
}
```

#### Update Stop

```http
PUT /api/trips/:tripId/itinerary/stops/:stopId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Amsterdam Updated",
  "dailyBudget": 100,
  "accommodation": {
    "name": "Lloyd Hotel",
    "pricePerNight": 85,
    "totalCost": 255
  }
}
```

#### Delete Stop

```http
DELETE /api/trips/:tripId/itinerary/stops/:stopId
Authorization: Bearer <token>
```

#### Reorder Stops

```http
PUT /api/trips/:tripId/itinerary/stops/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "stopIds": ["stopId1", "stopId3", "stopId2"]
}
```

### Activity Routes (`/api/trips/:tripId/itinerary/stops/:stopId/activities`)

#### Add Activity to Stop

```http
POST /api/trips/:tripId/itinerary/stops/:stopId/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Eiffel Tower Visit",
  "day": 1,
  "startTime": "14:00",
  "endTime": "16:00",
  "category": "sightseeing",
  "cost": 25,
  "location": "Champ de Mars",
  "bookingRequired": true,
  "description": "Visit the iconic Eiffel Tower"
}
```

#### Get Activities for Stop

```http
GET /api/trips/:tripId/itinerary/stops/:stopId/activities?day=1
Authorization: Bearer <token>
```

#### Update Activity

```http
PUT /api/trips/:tripId/itinerary/stops/:stopId/activities/:activityId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Eiffel Tower & Seine Cruise",
  "cost": 45,
  "endTime": "18:00"
}
```

#### Delete Activity

```http
DELETE /api/trips/:tripId/itinerary/stops/:stopId/activities/:activityId
Authorization: Bearer <token>
```

#### Mark Activity as Complete

```http
PUT /api/trips/:tripId/itinerary/stops/:stopId/activities/:activityId/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "isCompleted": true,
  "rating": 5,
  "notes": "Amazing experience!"
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors if applicable
  ]
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "trips": [...],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Data Models

### Trip Model

```typescript
interface Trip {
  _id: string;
  name: string;
  description: string;
  owner: ObjectId;
  startDate: Date;
  endDate: Date;
  duration: number;
  numberOfTravelers: number;
  theme:
    | "adventure"
    | "cultural"
    | "relaxation"
    | "business"
    | "romantic"
    | "family"
    | "solo"
    | "foodie";
  travelStyle: "budget" | "comfort" | "luxury" | "backpacker" | "business";
  interests: string[];
  status: "planning" | "active" | "completed" | "cancelled";
  itinerary: {
    stops: Stop[];
  };
  budgetTracking: {
    totalBudget: number;
    spent: number;
    categories: {
      accommodation: number;
      transportation: number;
      food: number;
      activities: number;
      shopping: number;
      other: number;
    };
  };
  collaborators: Collaborator[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Stop Model

```typescript
interface Stop {
  _id: string;
  name: string;
  country: string;
  arrivalDate: Date;
  departureDate: Date;
  duration: number;
  accommodation: {
    name: string;
    type: "hotel" | "hostel" | "airbnb" | "guesthouse" | "resort" | "other";
    pricePerNight: number;
    nights: number;
    totalCost: number;
    checkIn: Date;
    checkOut: Date;
  };
  dailyBudget: number;
  totalBudget: number;
  spentBudget: number;
  activities: Activity[];
  notes: string;
  order: number;
}
```

### Activity Model

```typescript
interface Activity {
  _id: string;
  day: number;
  name: string;
  category:
    | "sightseeing"
    | "food"
    | "adventure"
    | "culture"
    | "shopping"
    | "relaxation"
    | "transport"
    | "other";
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  cost: number;
  description: string;
  location: string;
  bookingRequired: boolean;
  notes: string;
  isCompleted: boolean;
  rating?: number; // 1-5 stars
}
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB locally or use MongoDB Atlas

4. Run the development server:

```bash
npm run dev
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration
