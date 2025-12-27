# DevTinder APis
authRouter
-POST /signup
-POST /login
-POST /logout

## profileRouter
GET    /profile/me                # view my own profile
PATCH  /profile/me                # update profile fields
PATCH  /profile/me/password       # change password
PATCH  /profile/me/avatar         # upload/change avatar

## User Browsing APIs
GET    /users/feed                # recommended profiles(swiping feed)
GET    /users/:userId             # view someone else’s profile



## connectionRequestRouter
POST   /connections/like/:userId
POST   /connections/pass/:userId
POST   /connections/superlike/:userId     (optional feature)


## match APIs (Mutual likes)
GET    user/matches                   # list all my matches
GET    user/matches/:matchId          # details of a specific match
PATCH  user/matches/unmatch/:matchId          # unmatch a person
   


