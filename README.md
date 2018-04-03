---Web script unit planner---
Created by UP795987

First time running instructions:
  -git/download the Planit route folder and place it in the directory where you wish to run the app

  -type "npm install" to download and install all necessary packages

  -type "npm run initsql" to initialize/set up the database (If prompted, password is root)

  -type "npm run dashboard" to start the app


Known bugs:
  -Currently running on port 8080, CW spec specifies 80 but this gives an error on launch.
  the port can be changed in the config file if needed

  -Drag/drop functionality doesn't work in firefox

  -Dropping unit content(Topics, lectures, resources, practicals) into weeks
   causes them to re-size to be small, I believe this to be an issue with grid item sizing
   and is resolved upon hitting the save button.


Reflective Insight:
Overall I'm quite satisfied with how this turned out, however there are a few things I
would definitely do differently; I found that focusing to heavily on the UI/HTML/css
side of things definitely made things difficult, It may have been advantageous to
start with the server/API first and then build the client side on top of that foundation.

Doing it the way round that I did caused me issues when it came to attempting week addition/deletion
as the UI wasn't created in a way which would cause the weeks to end up out of order, with week numbers missing.

It was an interesting and eye opening experience trying to implement a log in system, however this didn't make
it into the final build as I faced issues hosting it on the Virtual machine for testing as there was no
static address which could have been used for oauth, I also felt that there weren't going to be enough
login-specific features to justify having a log in system, and I didn't want to force all users to log in to use the app.
