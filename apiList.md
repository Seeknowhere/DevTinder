# DevTinder APis
authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter
-POST /request/send/like/:userId
-POST /request/send/pass/:userId
-POST /request/review/matched/:requestId
-POST /request/review/rejected/:requestId

userRouter
-GET /user/connections
-GET /user/requests/received
-GET /user/feed -gets you the profiles of other users in the platform