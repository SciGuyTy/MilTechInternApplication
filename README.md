# MilTechInternApplicaion
This is the web application that is accompanying my application for the VID MilTech internship position. Feel free to organize the list of users by clicking the deltas in the header of each respective column. You can also hover over each user and see a mock profile card. Some features I would have liked to add given more time: 
1. Normalize phone numbers to a specific format so they could be organized by country
2. Given more information about the users (like preferences), use tensorflow.js and a small ML model to recommend compatible users for 'friendship'.

# Building Docker Image
Feel free to run the project as a container in Docker. For the sake of continuity, here are the commands I used to build and run the image:
"docker build -t vid-internship ."
"docker run -dp 80:80 vid-internship"
