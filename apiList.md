# Devtinder api /api/v1

## Auth api's

1. POST /auth/signup
2. POST /auth/login
3. POST /auth/logout
4. PATCH /auth/forgot-password //pending

## User Profile api's

1. GET /profile/view
2. PATCH /profile/edit
3. PATCH /profile/password // pending
4. PATCH /profile/verify-email // pending

## Feed Requests api's

1. GET /feed
2. GET /feed/request/received
3. GET /feed/request/connection

## Connection Requests api's

1. POST /request/send/:status/:userId

2. POST /request/review/accepted/:requestId
3. POST /request/review/rejected/:requestId
