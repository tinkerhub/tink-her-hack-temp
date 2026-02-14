# 🌸 SHE_WANTS - API Documentation

## Base URL
```
http://localhost:3000/api
```

For production, replace with your deployed backend URL.

---

## 📑 Table of Contents
1. [Authentication](#authentication)
2. [Period Tracking](#period-tracking)
3. [Pad Requests](#pad-requests)
4. [Community Helpers](#community-helpers)
5. [Sisterhood Posts](#sisterhood-posts)

---

## 🔐 Authentication

### Register User
**POST** `/auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "secretCode": "1234="
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered successfully!",
  "userId": 1
}
```

**Response (Error - 400):**
```json
{
  "error": "Username already exists"
}
```

---

### Login User
**POST** `/auth/login`

**Description:** Authenticate user and get user details

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "message": "Login successful!",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "secret_code": "1234="
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## 🌸 Period Tracking

### Get User Cycles
**GET** `/cycles/:userId`

**Description:** Retrieve all menstrual cycles for a user with statistics

**Parameters:**
- `userId` (path parameter) - User ID

**Response (Success - 200):**
```json
{
  "cycles": [
    {
      "id": 1,
      "user_id": 1,
      "start_date": "2024-01-15",
      "created_at": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "user_id": 1,
      "start_date": "2024-02-12",
      "created_at": "2024-02-12 09:15:00"
    }
  ],
  "statistics": {
    "totalCycles": 2,
    "averageCycleLength": 28,
    "shortestCycle": 26,
    "longestCycle": 30
  }
}
```

---

### Add Cycle
**POST** `/cycles`

**Description:** Log a new menstrual cycle start date

**Request Body:**
```json
{
  "userId": 1,
  "startDate": "2024-03-10"
}
```

**Response (Success - 201):**
```json
{
  "id": 3,
  "message": "Cycle added successfully!"
}
```

**Response (Error - 400):**
```json
{
  "error": "Cycle already exists for this date"
}
```

---

### Delete Cycle
**DELETE** `/cycles/:cycleId`

**Description:** Delete a specific cycle entry

**Parameters:**
- `cycleId` (path parameter) - Cycle ID to delete

**Response (Success - 200):**
```json
{
  "message": "Cycle deleted successfully!"
}
```

---

## 🩸 Pad Requests

### Create Pad Request
**POST** `/pad-request`

**Description:** Create a new emergency pad request with location

**Request Body:**
```json
{
  "userId": 1,
  "username": "johndoe",
  "latitude": 10.8242,
  "longitude": 76.6424
}
```

**Response (Success - 201):**
```json
{
  "id": 15,
  "message": "Pad request created successfully!"
}
```

**Response (Error - 400):**
```json
{
  "error": "User ID, username, and location are required"
}
```

---

### Get Nearby Requests
**GET** `/pad-requests/nearby/:userId`

**Description:** Get all active pad requests except from the current user

**Parameters:**
- `userId` (path parameter) - Current user's ID (to exclude their own requests)

**Response (Success - 200):**
```json
{
  "requests": [
    {
      "id": 16,
      "user_id": 7,
      "username": "riyarose05@gmail.com",
      "latitude": 10.824396479440194,
      "longitude": 76.64222566641749,
      "created_at": "2026-02-14 01:07:46"
    },
    {
      "id": 15,
      "user_id": 7,
      "username": "riyarose05@gmail.com",
      "latitude": 10.824396479440194,
      "longitude": 76.64222566641749,
      "created_at": "2026-02-14 01:07:03"
    }
  ]
}
```

---

### Get My Requests
**GET** `/pad-requests/my/:userId`

**Description:** Get all pad requests created by the current user

**Parameters:**
- `userId` (path parameter) - User ID

**Response (Success - 200):**
```json
{
  "requests": [
    {
      "id": 20,
      "user_id": 1,
      "username": "johndoe",
      "latitude": 10.8242,
      "longitude": 76.6424,
      "status": "active",
      "created_at": "2026-02-14 08:00:00"
    }
  ]
}
```

---

### Fulfill Pad Request
**POST** `/pad-request/fulfill`

**Description:** Mark a pad request as fulfilled

**Request Body:**
```json
{
  "requestId": 16,
  "fulfilledBy": 1
}
```

**Response (Success - 200):**
```json
{
  "message": "Request marked as fulfilled!"
}
```

**Response (Error - 500):**
```json
{
  "error": "Database error message"
}
```

---

## 💝 Community Helpers

### Register as Helper
**POST** `/helpers/register`

**Description:** Register as a community helper

**Request Body:**
```json
{
  "userId": 1,
  "username": "johndoe",
  "bio": "Happy to help women in need. Available weekdays 9-5.",
  "location": "Downtown, City Center"
}
```

**Response (Success - 201):**
```json
{
  "message": "Registered as helper successfully!"
}
```

**Response (Error - 400):**
```json
{
  "error": "User ID, username, and bio are required"
}
```

---

### Get All Helpers
**GET** `/helpers`

**Description:** Get all registered community helpers

**Response (Success - 200):**
```json
{
  "helpers": [
    {
      "id": 1,
      "user_id": 5,
      "username": "helper1",
      "bio": "Happy to help!",
      "location": "Downtown",
      "created_at": "2026-02-10 10:00:00"
    },
    {
      "id": 2,
      "user_id": 8,
      "username": "helper2",
      "bio": "Available 24/7",
      "location": "North Side",
      "created_at": "2026-02-11 14:30:00"
    }
  ]
}
```

---

### Check Helper Status
**GET** `/helpers/status/:userId`

**Description:** Check if a user is registered as a helper

**Parameters:**
- `userId` (path parameter) - User ID to check

**Response (Success - 200):**
```json
{
  "isHelper": true,
  "helper": {
    "id": 1,
    "user_id": 5,
    "username": "helper1",
    "bio": "Happy to help!",
    "location": "Downtown"
  }
}
```

**Response (Not a helper - 200):**
```json
{
  "isHelper": false
}
```

---

### Remove Helper Status
**DELETE** `/helpers/:userId`

**Description:** Remove helper status from a user

**Parameters:**
- `userId` (path parameter) - User ID

**Response (Success - 200):**
```json
{
  "message": "Helper status removed successfully"
}
```

---

## 💬 Sisterhood Posts

### Get All Posts
**GET** `/posts`

**Description:** Get all posts or filter by category

**Query Parameters:**
- `category` (optional) - Filter by category (breakup, selfcare, health, relationships, advice, general)

**Examples:**
- `/posts` - Get all posts
- `/posts?category=breakup` - Get only breakup support posts

**Response (Success - 200):**
```json
{
  "posts": [
    {
      "id": 1,
      "user_id": 3,
      "username": "Anonymous",
      "category": "breakup",
      "content": "Going through a tough breakup. Any advice?",
      "is_anonymous": 1,
      "likes_count": 5,
      "comments_count": 3,
      "created_at": "2026-02-14 07:30:00"
    },
    {
      "id": 2,
      "user_id": 5,
      "username": "jane_doe",
      "category": "selfcare",
      "content": "Self-care Sunday! What are your favorite routines?",
      "is_anonymous": 0,
      "likes_count": 12,
      "comments_count": 8,
      "created_at": "2026-02-14 06:15:00"
    }
  ]
}
```

---

### Create Post
**POST** `/posts`

**Description:** Create a new sisterhood post

**Request Body:**
```json
{
  "userId": 1,
  "username": "johndoe",
  "category": "advice",
  "content": "Looking for career advice. How do you balance work and personal life?",
  "isAnonymous": false
}
```

**Response (Success - 201):**
```json
{
  "id": 25,
  "message": "Post created successfully"
}
```

**Response (Error - 400):**
```json
{
  "error": "Content and category are required"
}
```

---

### Get Single Post with Comments
**GET** `/posts/:postId`

**Description:** Get a specific post with all its comments

**Parameters:**
- `postId` (path parameter) - Post ID

**Response (Success - 200):**
```json
{
  "post": {
    "id": 1,
    "user_id": 3,
    "username": "Anonymous",
    "category": "breakup",
    "content": "Going through a tough breakup. Any advice?",
    "is_anonymous": 1,
    "likes_count": 5,
    "comments_count": 3,
    "created_at": "2026-02-14 07:30:00"
  },
  "comments": [
    {
      "id": 1,
      "post_id": 1,
      "user_id": 5,
      "username": "supportive_friend",
      "comment": "Stay strong! Time heals everything.",
      "is_anonymous": 0,
      "created_at": "2026-02-14 08:00:00"
    },
    {
      "id": 2,
      "post_id": 1,
      "user_id": 7,
      "username": "Anonymous",
      "comment": "I went through the same thing. It gets better!",
      "is_anonymous": 1,
      "created_at": "2026-02-14 08:15:00"
    }
  ]
}
```

**Response (Error - 404):**
```json
{
  "error": "Post not found"
}
```

---

### Like/Unlike Post
**POST** `/posts/:postId/like`

**Description:** Toggle like on a post (like if not liked, unlike if already liked)

**Parameters:**
- `postId` (path parameter) - Post ID

**Request Body:**
```json
{
  "userId": 1
}
```

**Response (Liked - 200):**
```json
{
  "liked": true,
  "message": "Post liked"
}
```

**Response (Unliked - 200):**
```json
{
  "liked": false,
  "message": "Post unliked"
}
```

---

### Check Like Status
**GET** `/posts/:postId/liked/:userId`

**Description:** Check if a user has liked a specific post

**Parameters:**
- `postId` (path parameter) - Post ID
- `userId` (path parameter) - User ID

**Response (Success - 200):**
```json
{
  "liked": true
}
```

---

### Add Comment
**POST** `/posts/:postId/comment`

**Description:** Add a comment to a post

**Parameters:**
- `postId` (path parameter) - Post ID

**Request Body:**
```json
{
  "userId": 1,
  "username": "johndoe",
  "comment": "Great advice! Thank you for sharing.",
  "isAnonymous": false
}
```

**Response (Success - 201):**
```json
{
  "id": 15,
  "message": "Comment added successfully"
}
```

**Response (Error - 400):**
```json
{
  "error": "Comment is required"
}
```

---

## 📊 Response Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE requests |
| 201 | Created | Successful POST requests that create resources |
| 400 | Bad Request | Invalid request body or parameters |
| 401 | Unauthorized | Invalid credentials |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Database or server errors |

---

## 🔒 Error Response Format

All errors follow this format:

```json
{
  "error": "Descriptive error message"
}
```

---

## 📝 Notes

### Categories for Posts
Valid categories for sisterhood posts:
- `breakup` - Breakup Support
- `selfcare` - Self-Care
- `health` - Health
- `relationships` - Relationships
- `advice` - Advice
- `general` - General

### Anonymous Posting
- When `isAnonymous` is `true`, the username is replaced with "Anonymous" in the database
- The actual `user_id` is still stored for moderation purposes

### Location Data
- Latitude and longitude should be decimal degrees
- Example: `10.8242, 76.6424`
- Obtained from browser's Geolocation API

### Timestamps
- All timestamps are in format: `YYYY-MM-DD HH:MM:SS`
- Timezone: Server local time (adjust for production)

---

## 🧪 Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser2",
    "email": "test2@example.com",
    "password": "password123",
    "secretCode": "1234="
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Get nearby requests:**
```bash
curl http://localhost:3000/api/pad-requests/nearby/1
```

**Create a post:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "username": "testuser",
    "category": "advice",
    "content": "Test post content",
    "isAnonymous": false
  }'
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Login
const login = async () => {
  const response = await api.post('/auth/login', {
    username: 'testuser',
    password: 'password123'
  });
  return response.data;
};

// Get cycles
const getCycles = async (userId) => {
  const response = await api.get(`/cycles/${userId}`);
  return response.data;
};

// Create pad request
const createPadRequest = async (userId, username, lat, lng) => {
  const response = await api.post('/pad-request', {
    userId,
    username,
    latitude: lat,
    longitude: lng
  });
  return response.data;
};
```

---

## 🔐 Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **SQL Injection Prevention**: All queries use parameterized statements
3. **Input Validation**: All endpoints validate required fields
4. **CORS**: Enabled for frontend communication

### Recommended for Production:
- Add JWT authentication
- Implement rate limiting
- Add request validation middleware
- Use HTTPS only
- Add API key authentication
- Implement proper session management

---

## 📈 Rate Limiting (Recommended)

For production, implement rate limiting:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🎯 Quick Reference

| Feature | Endpoint | Method |
|---------|----------|--------|
| Register | `/auth/register` | POST |
| Login | `/auth/login` | POST |
| Get Cycles | `/cycles/:userId` | GET |
| Add Cycle | `/cycles` | POST |
| Create Pad Request | `/pad-request` | POST |
| Get Nearby Requests | `/pad-requests/nearby/:userId` | GET |
| Fulfill Request | `/pad-request/fulfill` | POST |
| Register Helper | `/helpers/register` | POST |
| Get Helpers | `/helpers` | GET |
| Get Posts | `/posts` | GET |
| Create Post | `/posts` | POST |
| Like Post | `/posts/:postId/like` | POST |
| Add Comment | `/posts/:postId/comment` | POST |

---

**API Version:** 1.0  
**Last Updated:** February 14, 2026  
**Base URL:** `http://localhost:3000/api`
