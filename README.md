# Task Management API

A RESTful API for managing tasks built with Node.js, Express, and MongoDB.

## Features

- Complete CRUD operations for tasks
- Robust input validation using Joi
- Pagination, sorting, and filtering capabilities
- MongoDB integration with proper schema design
- Error handling and security best practices

## Prerequisites

- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-management-api.git
cd task-management-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`
```bash
cp .env.example .env
```

4. Configure your environment variables in the `.env` file
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-management-api
```

5. Start the development server
```bash
npm run dev
```

## API Documentation

### Task Endpoints

#### Create a new task
- **URL**: `/api/tasks`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "Complete project",
    "description": "Finish the API development challenge",
    "status": "pending" // Optional (default: "pending")
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a9b9f0d1c31e8c4d3b6a",
      "title": "Complete project",
      "description": "Finish the API development challenge",
      "status": "pending",
      "createdAt": "2023-07-21T10:30:33.123Z"
    }
  }
  ```

#### Get all tasks
- **URL**: `/api/tasks`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of tasks per page (default: 10)
  - `sortBy`: Field to sort by (default: "createdAt")
  - `sortOrder`: Sort order ("asc" or "desc", default: "desc")
  - `status`: Filter by status ("pending", "in-progress", "completed")
  - `search`: Search in title and description
  - `fromDate`: Filter tasks created after this date (format: YYYY-MM-DD)
  - `toDate`: Filter tasks created before this date (format: YYYY-MM-DD)
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 2,
    "pagination": {
      "total": 10,
      "page": 1,
      "pages": 5,
      "limit": 2
    },
    "data": [
      {
        "_id": "60f7a9b9f0d1c31e8c4d3b6a",
        "title": "Complete project",
        "description": "Finish the API development challenge",
        "status": "pending",
        "createdAt": "2023-07-21T10:30:33.123Z"
      },
      {
        "_id": "60f7a9b9f0d1c31e8c4d3b6b",
        "title": "Research MongoDB",
        "description": "Learn about MongoDB aggregation",
        "status": "in-progress",
        "createdAt": "2023-07-20T15:20:10.456Z"
      }
    ]
  }
  ```

#### Get a specific task
- **URL**: `/api/tasks/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[MongoDB ObjectId]`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a9b9f0d1c31e8c4d3b6a",
      "title": "Complete project",
      "description": "Finish the API development challenge",
      "status": "pending",
      "createdAt": "2023-07-21T10:30:33.123Z"
    }
  }
  ```

#### Update a task
- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **URL Parameters**: `id=[MongoDB ObjectId]`
- **Body**: (all fields optional)
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "in-progress"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a9b9f0d1c31e8c4d3b6a",
      "title": "Updated title",
      "description": "Updated description",
      "status": "in-progress",
      "createdAt": "2023-07-21T10:30:33.123Z"
    }
  }
  ```

#### Update task status
- **URL**: `/api/tasks/:id/status`
- **Method**: `PATCH`
- **URL Parameters**: `id=[MongoDB ObjectId]`
- **Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "_id": "60f7a9b9f0d1c31e8c4d3b6a",
      "title": "Updated title",
      "description": "Updated description",
      "status": "completed",
      "createdAt": "2023-07-21T10:30:33.123Z"
    }
  }
  ```

#### Delete a task
- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[MongoDB ObjectId]`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

## Error Responses

- **400 Bad Request**: Invalid request data
  ```json
  {
    "success": false,
    "error": "Title is required"
  }
  ```

- **404 Not Found**: Resource not found
  ```json
  {
    "success": false,
    "error": "Task not found"
  }
  ```

- **500 Server Error**: Server-side error
  ```json
  {
    "success": false,
    "error": "Server Error"
  }
  ```

## Development

Start development server with nodemon:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- joi: Data validation
- dotenv: Environment variables
- helmet: Security headers
- cors: Cross-origin resource sharing
- express-rate-limit: API rate limiting

