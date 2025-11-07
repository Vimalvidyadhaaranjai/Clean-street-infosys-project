# Statistics Feature Setup Guide

## Overview
The admin panel now includes comprehensive statistics with interactive graphs and pie charts showing:
- Complaint status distribution
- Complaint type distribution
- User role distribution
- Complaints over time (last 7 days)
- User registrations (last 30 days)
- Monthly complaint trends (6 months)
- Top 5 complaint types

## Installation

### 1. No Additional Dependencies Required!

The statistics feature uses **custom SVG-based charts** built with React, ensuring:
- ✅ Full compatibility with React 19
- ✅ No external chart library dependencies
- ✅ Lightweight and fast performance
- ✅ Fully customizable styling
- ✅ Interactive hover effects

### 2. Backend Changes

The following backend changes have been implemented:

#### New API Endpoint
- **Route**: `GET /api/admin/detailed-stats`
- **Access**: Admin only
- **Description**: Returns aggregated statistics for charts

#### Files Modified:
- `backend/controller/admin.controller.js` - Added `getDetailedStats` function
- `backend/routes/admin.routes.js` - Added route for detailed statistics

### 3. Frontend Changes

#### New Component:
- `frontend/src/Components/AdminStatistics.jsx` - Statistics dashboard with custom SVG charts

#### Modified Files:
- `frontend/src/pages/AdminDashboard.jsx` - Added Statistics tab

#### Chart Implementation:
All charts are built using native SVG and React, no external libraries required:
- **PieChart**: Interactive pie chart with hover effects
- **LineChart**: Line graph for time-series data
- **BarChart**: Vertical bar chart for monthly trends
- **HorizontalBarChart**: Horizontal bar chart for top items

## Features

### Charts Included:

1. **Pie Charts**:
   - Complaint Status Distribution (Pending, In Review, Resolved, Rejected)
   - Complaint Types Distribution
   - User Roles Distribution (User, Volunteer, Admin)

2. **Line Charts**:
   - Complaints trend over last 7 days
   - User registrations over last 30 days

3. **Bar Charts**:
   - Monthly complaint trends (last 6 months)
   - Top 5 complaint types (horizontal bar chart)

### Color Scheme:
- Status colors: Yellow (Pending), Blue (In Review), Green (Resolved), Red (Rejected)
- Role colors: Gray (User), Green (Volunteer), Red (Admin)
- Chart colors: Modern gradient palette with indigo, purple, pink, amber, and green

## Usage

1. Log in as an admin user
2. Navigate to the Admin Dashboard
3. The **Overview** tab now includes:
   - Summary statistics cards at the top
   - Complete statistics section with all charts below
4. View interactive charts and graphs
5. Hover over chart elements for detailed tooltips

**Note**: Statistics are integrated directly into the Overview tab for a unified dashboard experience.

## API Response Structure

The `/api/admin/detailed-stats` endpoint returns:

```json
{
  "success": true,
  "data": {
    "complaintsByStatus": [{"_id": "received", "count": 10}],
    "complaintsByType": [{"_id": "Garbage", "count": 5}],
    "usersByRole": [{"_id": "user", "count": 50}],
    "complaintsOverTime": [{"_id": "2024-11-07", "count": 3}],
    "monthlyComplaints": [{"_id": "2024-11", "count": 15}],
    "userRegistrations": [{"_id": "2024-11-07", "count": 2}],
    "topComplaintTypes": [{"_id": "Garbage", "count": 20}]
  }
}
```

## Troubleshooting

### Charts not displaying:
1. Check browser console for errors
2. Verify backend is running and accessible
3. Confirm you're logged in as admin
4. Clear browser cache and refresh

### No data showing:
1. Ensure there are complaints and users in the database
2. Check the date ranges (data is filtered by time periods)
3. Verify the backend API is returning data correctly

### Permission errors:
1. Confirm user role is "admin"
2. Check authentication middleware is working
3. Verify JWT token is valid

## Development Notes

- Charts are responsive and adapt to screen sizes using SVG viewBox
- All charts are custom-built with native SVG for maximum control
- Data is fetched on component mount from the backend API
- Loading states are handled gracefully with spinners
- Error handling with toast notifications
- Interactive hover effects on all chart elements
- No external dependencies means faster load times and smaller bundle size

## Future Enhancements

Potential improvements:
- Export charts as images/PDF
- Custom date range selection
- Real-time data updates
- More granular filtering options
- Comparison views (month-over-month, year-over-year)
