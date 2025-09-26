# DisasterLink Pro - Backend API Specifications

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All APIs return JSON in this format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null
}
```

---

## 🔐 Authentication APIs

### POST /auth/register
Register a new user
```json
// Request Body
{
  "name": "string",
  "email": "string", 
  "password": "string",
  "phone": "string (optional)",
  "role": "user" | "admin" | "responder"
}

// Response
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "phone": "string",
      "createdAt": "ISO_DATE"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/login
Login user
```json
// Request Body
{
  "email": "string",
  "password": "string"
}

// Response - Same as register
```

### POST /auth/logout
Logout user (invalidate token)

---

## 🚨 SOS Alerts APIs

### GET /sos
Get user's SOS alerts
```json
// Response
{
  "success": true,
  "message": "SOS Alerts fetched successfully",
  "data": [
    {
      "id": "string",
      "userId": "string",
      "message": "string",
      "location": {
        "lat": number,
        "lng": number,
        "address": "string (optional)"
      },
      "status": "active" | "resolved" | "cancelled",
      "priority": "low" | "medium" | "high" | "critical",
      "createdAt": "ISO_DATE",
      "resolvedAt": "ISO_DATE (optional)"
    }
  ]
}
```

### POST /sos
Create new SOS alert
```json
// Request Body
{
  "message": "string",
  "location": {
    "lat": number,
    "lng": number,
    "address": "string (optional)"
  },
  "priority": "low" | "medium" | "high" | "critical"
}

// Response
{
  "success": true,
  "message": "SOS Alert created successfully", 
  "data": { /* SOS Alert object */ }
}
```

### PATCH /sos/:id
Update SOS alert status
```json
// Request Body
{
  "status": "active" | "resolved" | "cancelled"
}
```

---

## 📱 Messages APIs

### GET /messages
Get user's offline messages

### POST /messages
Queue a new message
```json
// Request Body
{
  "recipient": "string",
  "message": "string"
}
```

### PATCH /messages/resend
Resend queued messages

---

## 👥 Emergency Contacts APIs

### GET /contacts
Get user's emergency contacts

### POST /contacts
Create emergency contact
```json
// Request Body
{
  "name": "string",
  "phone": "string", 
  "email": "string (optional)",
  "relationship": "string",
  "isPrimary": boolean
}
```

### PUT /contacts/:id
Update emergency contact

### DELETE /contacts/:id
Delete emergency contact

---

## 🏥 Medical Profile APIs

### GET /medical
Get user's medical profile

### POST /medical
Create/update medical profile
```json
// Request Body
{
  "bloodType": "string",
  "allergies": ["string"],
  "medications": ["string"], 
  "conditions": ["string"],
  "emergencyNotes": "string"
}
```

---

## 📍 Location Tracking APIs

### GET /tracking
Get user's location history

### POST /tracking
Update user location
```json
// Request Body
{
  "latitude": number,
  "longitude": number,
  "accuracy": number
}
```

---

## 🎤 Voice Commands APIs

### GET /voice
Get voice command history

### POST /voice
Process voice command
```json
// Request Body
{
  "command": "string"
}

// Response
{
  "success": true,
  "data": {
    "response": "string",
    "action": "string (optional)"
  }
}
```

---

## 📸 Photo Evidence APIs

### GET /evidence
Get user's uploaded evidence

### POST /evidence
Upload photo/video evidence
```json
// Form Data
{
  "file": File,
  "description": "string (optional)",
  "latitude": "number (optional)",
  "longitude": "number (optional)"
}
```

---

## 🔔 Notifications APIs

### GET /notifications
Get user notifications

### POST /notifications
Create notification (admin only)
```json
// Request Body
{
  "userId": "string",
  "title": "string",
  "message": "string", 
  "type": "info" | "warning" | "error" | "success"
}
```

### PATCH /notifications/:id/read
Mark notification as read

---

## 🏥 System APIs

### GET /system/status
Get network/system status

### GET /health
Backend health check

---

## Database Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (enum: user, admin, responder),
  createdAt: Date,
  updatedAt: Date
}
```

### SOS Alert Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  message: String,
  location: {
    lat: Number,
    lng: Number, 
    address: String
  },
  status: String (enum: active, resolved, cancelled),
  priority: String (enum: low, medium, high, critical),
  createdAt: Date,
  resolvedAt: Date
}
```

### Emergency Contact Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String,
  phone: String,
  email: String,
  relationship: String,
  isPrimary: Boolean,
  createdAt: Date
}
```

### Medical Profile Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  bloodType: String,
  allergies: [String],
  medications: [String],
  conditions: [String], 
  emergencyNotes: String,
  updatedAt: Date
}
```

## Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/disasterlink
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Middleware Requirements
- CORS enabled
- Body parser for JSON
- JWT authentication middleware
- Error handling middleware
- File upload middleware (multer)
- Rate limiting
- Input validation

## Security Features Needed
- Password hashing (bcrypt)
- JWT token generation/validation
- Input sanitization
- SQL injection protection
- XSS protection
- Rate limiting on auth routes
