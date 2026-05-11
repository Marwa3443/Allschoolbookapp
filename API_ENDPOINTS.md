# Qur'an Learning Platform - API Endpoints Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
Most endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication Routes (`/auth`)

### Register User
- **Method**: POST
- **Endpoint**: `/auth/register`
- **Auth**: No
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "full_name": "User Name"
  }
  ```
- **Response**: User object + tokens

### Login User
- **Method**: POST
- **Endpoint**: `/auth/login`
- **Auth**: No
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object + tokens

### Refresh Token
- **Method**: POST
- **Endpoint**: `/auth/refresh-token`
- **Auth**: No
- **Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response**: New tokens

### Get Current User
- **Method**: GET
- **Endpoint**: `/auth/me`
- **Auth**: Yes
- **Response**: Current user profile with settings

### Update Profile
- **Method**: PUT
- **Endpoint**: `/auth/profile`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "full_name": "New Name",
    "avatar_url": "https://...",
    "birth_date": "1995-01-01",
    "country": "Egypt",
    "phone": "+20123456789"
  }
  ```
- **Response**: Updated user object

### Change Password
- **Method**: POST
- **Endpoint**: `/auth/change-password`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "oldPassword": "old_password",
    "newPassword": "new_password"
  }
  ```
- **Response**: Success message

### Logout
- **Method**: POST
- **Endpoint**: `/auth/logout`
- **Auth**: Yes
- **Response**: Success message

---

## 2. User Routes (`/users`)

### Get User Profile
- **Method**: GET
- **Endpoint**: `/users/:userId`
- **Auth**: Yes
- **Response**: User profile with settings

### Update User Profile
- **Method**: PUT
- **Endpoint**: `/users/:userId`
- **Auth**: Yes
- **Body**: Same as auth profile update
- **Response**: Updated user object

### Delete User Account
- **Method**: DELETE
- **Endpoint**: `/users/:userId`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "password": "user_password"
  }
  ```
- **Response**: Success message

### Get User Settings
- **Method**: GET
- **Endpoint**: `/users/:userId/settings`
- **Auth**: Yes
- **Response**: User settings object

### Update User Settings
- **Method**: PUT
- **Endpoint**: `/users/:userId/settings`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "dark_mode": true,
    "font_size": "medium",
    "notifications_enabled": true,
    "email_notifications": false,
    "daily_reminder_time": "08:00",
    "language": "ar"
  }
  ```
- **Response**: Updated settings object

### Get User Achievements
- **Method**: GET
- **Endpoint**: `/users/:userId/achievements`
- **Auth**: Yes
- **Response**: Array of user achievements

### Get User Statistics
- **Method**: GET
- **Endpoint**: `/users/:userId/statistics`
- **Auth**: Yes
- **Response**: User statistics (memorized, learning, today's stats, last 30 days)

---

## 3. Qur'an Routes (`/quran`)

### Get All Surahs
- **Method**: GET
- **Endpoint**: `/quran/surahs`
- **Auth**: No
- **Query**: None
- **Response**: Array of all surahs

### Search Surahs
- **Method**: GET
- **Endpoint**: `/quran/surahs/search?q=<query>`
- **Auth**: No
- **Query Parameters**: `q` (search term)
- **Response**: Filtered surahs array

### Get Surah by ID
- **Method**: GET
- **Endpoint**: `/quran/surahs/:surahId`
- **Auth**: No
- **Response**: Surah object

### Get Surah Verses
- **Method**: GET
- **Endpoint**: `/quran/surahs/:surahId/verses`
- **Auth**: No
- **Query**: `page=1`, `limit=50`
- **Response**: Verses array with pagination

### Get Verse by ID
- **Method**: GET
- **Endpoint**: `/quran/verses/:verseId`
- **Auth**: No
- **Response**: Verse object with surah details

### Search Verses
- **Method**: GET
- **Endpoint**: `/quran/verses/search?q=<query>`
- **Auth**: No
- **Query Parameters**: `q` (search term), `page`, `limit`
- **Response**: Verses array with pagination

### Get Random Verse
- **Method**: GET
- **Endpoint**: `/quran/random-verse`
- **Auth**: No
- **Response**: Random verse object

---

## 4. Audio Routes (`/audio`)

### Get All Reciters
- **Method**: GET
- **Endpoint**: `/audio/reciters`
- **Auth**: No
- **Query**: `sortBy` (rating, popularity_score, created_at), `page`, `limit`
- **Response**: Reciters array with pagination

### Search Reciters
- **Method**: GET
- **Endpoint**: `/audio/reciters/search?q=<query>`
- **Auth**: No
- **Query Parameters**: `q` (search term)
- **Response**: Filtered reciters array

### Get Reciter by ID
- **Method**: GET
- **Endpoint**: `/audio/reciters/:reciterId`
- **Auth**: No
- **Response**: Reciter object with audio files

### Get Reciter Audio Files
- **Method**: GET
- **Endpoint**: `/audio/reciters/:reciterId/audio`
- **Auth**: No
- **Query**: `surahId` (optional), `page`, `limit`
- **Response**: Reciter audio files array with pagination

### Rate Reciter
- **Method**: POST
- **Endpoint**: `/audio/reciters/:reciterId/rate`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "rating": 4.5
  }
  ```
- **Response**: Updated reciter rating

### Get Audio File
- **Method**: GET
- **Endpoint**: `/audio/files/:audioId`
- **Auth**: No
- **Response**: Audio file object with reciter and surah details

### Get Surah Audio Files
- **Method**: GET
- **Endpoint**: `/audio/surahs/:surahId/audio`
- **Auth**: No
- **Response**: Array of audio files for specific surah

---

## 5. Progress Routes (`/progress`)

### Get User Progress
- **Method**: GET
- **Endpoint**: `/progress/:userId`
- **Auth**: Yes
- **Query**: `status` (learning, memorized, revised), `page`, `limit`
- **Response**: User progress array with pagination

### Get Progress Statistics
- **Method**: GET
- **Endpoint**: `/progress/:userId/stats`
- **Auth**: Yes
- **Response**: Verse counts by status and average accuracy

### Get Progress for Specific Verse
- **Method**: GET
- **Endpoint**: `/progress/:userId/verse/:verseId`
- **Auth**: Yes
- **Response**: Progress object for specific verse

### Update Progress
- **Method**: POST
- **Endpoint**: `/progress/:userId/verse/:verseId`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "status": "memorized",
    "accuracy_percentage": 95,
    "times_reviewed": 3
  }
  ```
- **Response**: Updated progress object + daily statistics

### Delete Progress
- **Method**: DELETE
- **Endpoint**: `/progress/:userId/verse/:verseId`
- **Auth**: Yes
- **Response**: Success message

---

## 6. Achievement Routes (`/achievements`)

### Get All Achievements
- **Method**: GET
- **Endpoint**: `/achievements`
- **Auth**: No
- **Response**: Array of all achievements

### Get Achievement by ID
- **Method**: GET
- **Endpoint**: `/achievements/:achievementId`
- **Auth**: No
- **Response**: Achievement object

### Get User Achievements
- **Method**: GET
- **Endpoint**: `/achievements/:userId/achievements`
- **Auth**: Yes
- **Response**: Array of user's unlocked achievements

### Unlock Achievement
- **Method**: POST
- **Endpoint**: `/achievements/:userId/unlock/:achievementId`
- **Auth**: Yes
- **Response**: Unlocked achievement object

### Check and Auto-unlock Achievements
- **Method**: POST
- **Endpoint**: `/achievements/:userId/check-and-unlock`
- **Auth**: Yes
- **Response**: Newly unlocked achievements array

### Get Achievement Progress
- **Method**: GET
- **Endpoint**: `/achievements/:userId/progress`
- **Auth**: Yes
- **Response**: Progress towards all achievements

---

## 7. Community Routes (`/community`)

### Get All Community Posts
- **Method**: GET
- **Endpoint**: `/community`
- **Auth**: No
- **Query**: `category` (general, tajweed, tips), `page`, `limit`, `sortBy` (newest, oldest, popular)
- **Response**: Posts array with pagination

### Search Community Posts
- **Method**: GET
- **Endpoint**: `/community/search?q=<query>`
- **Auth**: No
- **Query Parameters**: `q` (search term), `page`, `limit`
- **Response**: Posts array with pagination

### Get Post by ID
- **Method**: GET
- **Endpoint**: `/community/:postId`
- **Auth**: No
- **Response**: Post object with author details

### Get User's Community Posts
- **Method**: GET
- **Endpoint**: `/community/user/:userId`
- **Auth**: No
- **Query**: `page`, `limit`
- **Response**: User's posts array with pagination

### Create Community Post
- **Method**: POST
- **Endpoint**: `/community/user/:userId`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "title": "Post Title",
    "content": "Post content...",
    "category": "general"
  }
  ```
- **Response**: Created post object

### Update Community Post
- **Method**: PUT
- **Endpoint**: `/community/:postId`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content...",
    "category": "tajweed"
  }
  ```
- **Response**: Updated post object

### Delete Community Post
- **Method**: DELETE
- **Endpoint**: `/community/:postId`
- **Auth**: Yes
- **Response**: Success message

### Like Community Post
- **Method**: POST
- **Endpoint**: `/community/:postId/like`
- **Auth**: Yes
- **Response**: Post likes count

### Unlike Community Post
- **Method**: POST
- **Endpoint**: `/community/:postId/unlike`
- **Auth**: Yes
- **Response**: Post likes count

---

## 8. Recording Routes (`/recordings`)

### Get User Recordings
- **Method**: GET
- **Endpoint**: `/recordings/:userId`
- **Auth**: Yes
- **Query**: `page`, `limit`
- **Response**: User recordings array with pagination

### Get Recording Statistics
- **Method**: GET
- **Endpoint**: `/recordings/:userId/stats`
- **Auth**: Yes
- **Response**: Recording statistics (total, analyzed, average scores)

### Upload Recording
- **Method**: POST
- **Endpoint**: `/recordings/:userId/upload`
- **Auth**: Yes
- **Content-Type**: multipart/form-data
- **Form Data**:
  ```
  audio: <audio file>
  verses_range: "1:5"
  notes: "Recording notes..."
  ```
- **Response**: Created recording object

### Get Recording by ID
- **Method**: GET
- **Endpoint**: `/recordings/detail/:recordingId`
- **Auth**: Yes
- **Response**: Recording object with analysis

### Analyze Recording
- **Method**: POST
- **Endpoint**: `/recordings/:recordingId/analyze`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "tajweed_score": 85,
    "accuracy_score": 90,
    "feedback": "Good pronunciation with minor tajweed issues"
  }
  ```
- **Response**: Analysis results

### Update Recording
- **Method**: PUT
- **Endpoint**: `/recordings/:recordingId`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "notes": "Updated notes...",
    "verses_range": "2:7"
  }
  ```
- **Response**: Updated recording object

### Delete Recording
- **Method**: DELETE
- **Endpoint**: `/recordings/:recordingId`
- **Auth**: Yes
- **Response**: Success message

---

## 9. Statistics Routes (`/statistics`)

### Get User Daily Statistics
- **Method**: GET
- **Endpoint**: `/statistics/:userId/daily`
- **Auth**: Yes
- **Query**: `days` (default 30), `page`, `limit`
- **Response**: Daily statistics array with pagination

### Get Today's Statistics
- **Method**: GET
- **Endpoint**: `/statistics/:userId/today`
- **Auth**: Yes
- **Response**: Today's statistics object

### Get Overall Statistics
- **Method**: GET
- **Endpoint**: `/statistics/:userId/overall`
- **Auth**: Yes
- **Response**: Overall user statistics (total memorized, learning, accuracy, streak, etc.)

### Get Leaderboard
- **Method**: GET
- **Endpoint**: `/statistics/leaderboard`
- **Auth**: No
- **Query**: `metric` (memorized, study_minutes, posts), `limit` (default 20)
- **Response**: Ranked users array

### Update Daily Statistics
- **Method**: PUT
- **Endpoint**: `/statistics/:userId/daily`
- **Auth**: Yes
- **Body**:
  ```json
  {
    "study_minutes": 30,
    "streak_count": 15
  }
  ```
- **Response**: Updated daily statistics

---

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "statusCode": 400,
  "errors": {}
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **500**: Internal Server Error

---

## File Upload Limits
- **Audio Files**: Maximum 50MB
- **Supported Formats**: MP3, WAV, WebM, OGG

---

## Rate Limiting (Future Implementation)
Currently not implemented, but planned for production deployment.

---

## Pagination
Endpoints that support pagination use:
- `page`: Current page (default: 1)
- `limit`: Results per page (default: 20)

Response includes:
```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

---

## Total Endpoints
**40+ Endpoints** across 9 main categories:
- Authentication: 7 endpoints
- Users: 6 endpoints
- Quran: 7 endpoints
- Audio: 7 endpoints
- Progress: 5 endpoints
- Achievements: 6 endpoints
- Community: 8 endpoints
- Recordings: 7 endpoints
- Statistics: 5 endpoints

---

## Environment Variables
See `.env.development` for required configuration:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV`
- `PORT`
- `CORS_ORIGIN`
