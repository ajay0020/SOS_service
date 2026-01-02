# SOS Trigger Design

## Trigger Mechanism
The SOS alert is triggered by a long press (3 seconds) on the SOS button.

## Reasoning
- Reduces accidental triggers
- Simple and intuitive for users
- Easy to implement

## User Flow
1. User opens the app
2. User long-presses the SOS button
3. App shows confirmation feedback
4. Live location is captured
5. SOS alert is sent to emergency contacts

## Edge Cases
- User releases button early → no trigger
- Location permission denied → prompt user
