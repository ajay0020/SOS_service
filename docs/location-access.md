# Location Access & Permissions

## Purpose
To capture the user's live location during an SOS emergency.

## Permission Strategy
- Request location permission only when SOS is triggered
- Explain clearly why location is needed

## Location Flow
1. SOS trigger initiated
2. Check location permission status
3. If granted → fetch live GPS coordinates
4. If denied → show user-friendly prompt
5. If permanently denied → guide user to app settings

## Edge Cases
- Location services disabled
- Slow GPS response
- Permission denied by user
