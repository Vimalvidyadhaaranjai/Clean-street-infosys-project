# Volunteer Location-Based Assignment Feature

## Overview
This feature enables volunteers to be automatically assigned to nearby complaints based on their registered location. Volunteers can view complaints in their area, assign themselves to work on them, and update the status from pending to completed.

## How It Works

### 1. Location-Based Matching
- When a volunteer registers with a location (e.g., "Bengaluru"), the system uses geocoding to convert the location string to coordinates
- The system finds all complaints within a 50km radius (configurable) of the volunteer's location
- Distance is calculated using the Haversine formula for accuracy

### 2. Volunteer Workflow
1. **Registration**: Volunteer registers with their city/location name
2. **View Nearby Complaints**: Access dashboard to see complaints in their area
3. **Self-Assignment**: Click "Assign to Me" to take ownership of a complaint
4. **Status Management**: Update complaint status through multiple stages:
   - `received` (Pending) - Initial state
   - `in_review` (In Progress) - Volunteer is working on it
   - `resolved` (Completed) - Issue fixed
   - `rejected` - Cannot be resolved

## Backend Implementation

### New Files Created

#### 1. `backend/controller/volunteer.controller.js`
Contains all volunteer-related logic:
- **getNearbyComplaints**: Fetches complaints near volunteer's location using geocoding
- **getMyAssignments**: Returns all complaints assigned to the volunteer
- **assignComplaintToSelf**: Allows volunteer to assign a complaint to themselves
- **updateComplaintStatus**: Updates complaint status (pending → in progress → resolved)
- **unassignComplaint**: Removes assignment if volunteer can't complete it

**Key Features:**
- Uses OpenStreetMap's Nominatim API for free geocoding (no API key needed)
- Calculates distance between volunteer and complaints
- Filters complaints within configurable radius (default 50km)

#### 2. `backend/routes/volunteer.routes.js`
Defines API endpoints:
- `GET /api/volunteer/nearby-complaints` - Get complaints near volunteer
- `GET /api/volunteer/my-assignments` - Get assigned complaints
- `POST /api/volunteer/assign/:complaintId` - Assign complaint to self
- `PATCH /api/volunteer/update-status/:complaintId` - Update status
- `POST /api/volunteer/unassign/:complaintId` - Unassign complaint

### Modified Files

#### `backend/server.js`
- Added volunteer routes: `app.use("/api/volunteer", volunteerRoutes);`

## Frontend Implementation

### New Files Created

#### `frontend/src/pages/VolunteerDashboard.jsx`
Complete volunteer dashboard with:
- **Stats Section**: Shows total assignments, pending, in progress, and resolved counts
- **Two Tabs**:
  1. **Nearby Complaints**: Shows all complaints in volunteer's area with distance
  2. **My Assignments**: Shows complaints assigned to the volunteer
- **Action Buttons**:
  - Assign to Me (for nearby complaints)
  - Status update buttons (Pending, In Progress, Resolved, Reject)
  - Unassign button

### Modified Files

#### `frontend/src/App.jsx`
- Added route: `/VolunteerDashboard`

#### `frontend/src/pages/Register.jsx`
- Updated to redirect volunteers to `/VolunteerDashboard` after registration
- Regular users still go to `/UserDashboard`

#### `frontend/src/pages/Login.jsx`
- Updated to redirect volunteers to `/VolunteerDashboard` after login
- Regular users still go to `/UserDashboard`

## API Endpoints

### Volunteer Endpoints

#### Get Nearby Complaints
```
GET /api/volunteer/nearby-complaints?maxDistance=50
Authorization: Required (Volunteer role)
```
**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Garbage pile",
      "description": "...",
      "location_coords": {...},
      "address": "...",
      "status": "received",
      "priority": "High",
      "distance": "2.5"
    }
  ],
  "volunteerLocation": "Bengaluru",
  "volunteerCoordinates": {
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

#### Get My Assignments
```
GET /api/volunteer/my-assignments
Authorization: Required (Volunteer role)
```
**Response:**
```json
{
  "success": true,
  "data": {
    "assignments": [...],
    "stats": {
      "totalAssignments": 10,
      "pendingAssignments": 2,
      "inProgressAssignments": 5,
      "resolvedAssignments": 3
    }
  }
}
```

#### Assign Complaint to Self
```
POST /api/volunteer/assign/:complaintId
Authorization: Required (Volunteer role)
```
**Response:**
```json
{
  "success": true,
  "message": "Complaint assigned successfully!",
  "data": {...}
}
```

#### Update Complaint Status
```
PATCH /api/volunteer/update-status/:complaintId
Authorization: Required (Volunteer role)
Content-Type: application/json

{
  "status": "resolved"
}
```
**Valid statuses:** `received`, `in_review`, `resolved`, `rejected`

#### Unassign Complaint
```
POST /api/volunteer/unassign/:complaintId
Authorization: Required (Volunteer role)
```

## Status Flow

```
received (Pending)
    ↓
in_review (In Progress) ← Volunteer working on it
    ↓
resolved (Completed) ← Issue fixed
```

Or alternatively:
```
received → rejected (Cannot be resolved)
```

## Configuration

### Adjust Search Radius
In `volunteer.controller.js`, modify the default radius:
```javascript
const maxDistance = parseInt(req.query.maxDistance) || 50; // Change 50 to desired km
```

Or pass as query parameter:
```
GET /api/volunteer/nearby-complaints?maxDistance=100
```

## Testing the Feature

### 1. Register as Volunteer
- Go to `/register`
- Fill in details with role = "volunteer"
- Enter location as "Bengaluru" (or any city)
- Submit

### 2. View Nearby Complaints
- You'll be redirected to `/VolunteerDashboard`
- Click "Nearby Complaints" tab
- See all complaints within 50km of Bengaluru

### 3. Assign and Update
- Click "Assign to Me" on any complaint
- Go to "My Assignments" tab
- Use status buttons to update:
  - Click "In Progress" to start working
  - Click "Resolved" when completed

## Notes

- **Geocoding Service**: Uses OpenStreetMap's Nominatim (free, no API key)
- **Rate Limiting**: Nominatim has usage limits; for production, consider caching coordinates or using paid services
- **Location Format**: Works best with city names (e.g., "Bengaluru", "Mumbai", "Delhi")
- **Distance Calculation**: Uses Haversine formula for accurate distance on Earth's surface
- **Security**: All volunteer endpoints require authentication and role verification

## Future Enhancements

1. **Auto-Assignment**: Automatically assign complaints to nearest available volunteer
2. **Notification System**: Alert volunteers when new complaints appear in their area
3. **Performance Metrics**: Track volunteer response times and completion rates
4. **Location Updates**: Allow volunteers to update their service area
5. **Multiple Locations**: Support volunteers covering multiple cities
6. **Priority Routing**: Assign high-priority complaints first
