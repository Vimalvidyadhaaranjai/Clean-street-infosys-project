# Testing Guide - Volunteer Feature

## Prerequisites
1. Backend server running on `http://localhost:3002`
2. Frontend running on `http://localhost:5173`
3. MongoDB connected

## Test Scenario 1: Volunteer Registration and Assignment

### Step 1: Create Test Complaints
First, create some complaints in Bengaluru area:

1. Register as a regular user
2. Go to "Report Issue"
3. Create 2-3 complaints with Bengaluru addresses:
   - Example: "MG Road, Bengaluru"
   - Example: "Koramangala, Bengaluru"
   - Example: "Indiranagar, Bengaluru"

### Step 2: Register as Volunteer
1. Logout (if logged in)
2. Go to `/register`
3. Fill in:
   - Name: "Test Volunteer"
   - Location: "Bengaluru"
   - Role: "Volunteer"
   - Email: "volunteer@test.com"
   - Password: "test123"
4. Click "Sign Up"
5. You should be redirected to `/VolunteerDashboard`

### Step 3: View Nearby Complaints
1. On the Volunteer Dashboard, you should see:
   - Stats showing 0 assignments initially
   - "Nearby Complaints" tab (active by default)
2. You should see the complaints you created earlier
3. Each complaint card shows:
   - Title, description, type
   - Status badge (Pending)
   - Priority badge
   - Distance in km
   - "Assign to Me" button

### Step 4: Assign Complaint
1. Click "Assign to Me" on any complaint
2. Alert: "Complaint assigned to you successfully!"
3. The page refreshes
4. Stats update: Total Assignments = 1, In Progress = 1

### Step 5: Update Status
1. Click "My Assignments" tab
2. You should see the complaint you just assigned
3. Try updating status:
   - Click "In Progress" (if not already)
   - Click "Resolved" to mark as completed
4. Alert: "Status updated to resolved!"
5. Stats update: Resolved = 1, In Progress = 0

### Step 6: Test Unassign
1. Assign another complaint
2. In "My Assignments", click "Unassign"
3. Confirm the action
4. Complaint moves back to "Nearby Complaints"

## Test Scenario 2: Location-Based Filtering

### Test Different Locations
1. Create complaints in different cities:
   - Mumbai complaints
   - Delhi complaints
   - Bengaluru complaints

2. Register volunteers in different cities:
   - Volunteer 1: Location = "Mumbai"
   - Volunteer 2: Location = "Delhi"
   - Volunteer 3: Location = "Bengaluru"

3. Each volunteer should only see complaints near their city

## Test Scenario 3: Status Workflow

### Test Complete Status Flow
1. Assign a complaint (Status: received → in_review)
2. Update to "In Progress" (Status: in_review)
3. Update to "Resolved" (Status: resolved)
4. Verify stats update correctly

### Test Rejection
1. Assign a complaint
2. Update status to "Reject"
3. Verify it's marked as rejected

## Test Scenario 4: Edge Cases

### Test Already Assigned
1. Login as Volunteer 1
2. Assign a complaint
3. Logout and login as Volunteer 2
4. Try to assign the same complaint
5. Should show "Already Assigned" (button disabled)

### Test No Location
1. Register volunteer without location
2. Dashboard should show error: "Volunteer location not set"

### Test Invalid Location
1. Register volunteer with location: "XYZ123Invalid"
2. Should show error about geocoding failure

## Expected API Responses

### Successful Nearby Complaints
```bash
curl -X GET http://localhost:3002/api/volunteer/nearby-complaints \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Expected: 200 OK with list of complaints

### Successful Assignment
```bash
curl -X POST http://localhost:3002/api/volunteer/assign/COMPLAINT_ID \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Expected: 200 OK with success message

### Successful Status Update
```bash
curl -X PATCH http://localhost:3002/api/volunteer/update-status/COMPLAINT_ID \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

Expected: 200 OK with updated complaint

## Troubleshooting

### Issue: No complaints showing
- **Check**: Are there complaints in the database?
- **Check**: Is the volunteer location valid?
- **Check**: Try increasing maxDistance: `/api/volunteer/nearby-complaints?maxDistance=100`

### Issue: Geocoding fails
- **Cause**: Invalid location string or Nominatim API rate limit
- **Solution**: Use standard city names like "Bengaluru", "Mumbai", "Delhi"
- **Solution**: Wait a few seconds between requests

### Issue: Can't assign complaint
- **Check**: Is complaint already assigned?
- **Check**: Is user logged in as volunteer?
- **Check**: Browser console for errors

### Issue: Status not updating
- **Check**: Is complaint assigned to current volunteer?
- **Check**: Network tab for API errors
- **Check**: Backend logs for validation errors

## Verification Checklist

- [ ] Volunteer can register with location
- [ ] Volunteer sees nearby complaints with distances
- [ ] Volunteer can assign complaints to themselves
- [ ] Volunteer can update status (pending → in progress → resolved)
- [ ] Volunteer can unassign complaints
- [ ] Stats update correctly
- [ ] Only volunteers can access volunteer endpoints
- [ ] Complaints already assigned show as disabled
- [ ] Distance calculation is accurate
- [ ] Login/Register redirects volunteers to correct dashboard

## Performance Testing

### Test with Multiple Complaints
1. Create 50+ complaints in various locations
2. Register volunteer
3. Check dashboard load time
4. Verify pagination/performance

### Test Concurrent Volunteers
1. Login as 2 volunteers simultaneously
2. Try assigning same complaint
3. Verify only one succeeds

## Database Verification

Check MongoDB directly:
```javascript
// Find volunteer
db.users.findOne({email: "volunteer@test.com"})

// Find assigned complaints
db.complaints.find({assigned_to: ObjectId("VOLUNTEER_ID")})

// Check complaint status
db.complaints.find({status: "resolved"})
```

## Success Criteria

✅ All test scenarios pass
✅ No console errors
✅ API responses are correct
✅ UI updates reflect backend changes
✅ Role-based access works
✅ Location filtering is accurate
