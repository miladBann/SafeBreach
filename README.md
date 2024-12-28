# SafeBreach
home assignment for SafeBreah
-------------------------------------
Done by: Milad Bannourah senior full stack developer.  
Tech-stack:  
frontend:  
React / Leaflet / WebSocket client.  
backend:  
Node.js with Nest.js & TS / ws/Socket.io
-------------------------------------  

Hi! thank you for this opportunity and for the fun challenge.  
this is my solution for it (requirements + bonus) and this is the guide to run the app.  

**Setup**  
1- download or clone this github repo and navigate to the folder where you downloaded or cloned this repo.  
2- this folder has the client and server folders so navigate to the server folder first.  
3- in the server folder open the terminal and type "npm install" to get all the dependencies.  
4- in the client folder open the terminal and type "npm install --force" to get all the dependencies.  
5- navigate to the server folder and open the terminal and type "npm run start:dev" to run the backend server.  
6- navigate to the client folder and open the terminal and type "npm start" to run the frontend server".  
7- that's it, the app is ready to be used.  

---------------------------------------  

**How to use the app**  

1- the app opens with a big full-screen map and displays the airtag data in real-time on the map as markers via websocket connection with the backend.  
2- in order to see the info of each tag just click on its marker and you will see all the info including the event age.  
3- you can zoom in/out and move around the map with your mouse.  
4- there's a menu icon on the top left corner, click it to open the side bar.  
5- the side bar allows you to filter according to device id, and to time.  
6- in order to see the animation of the events path for each device you must select a device from the side bar (only one at a time to ensure proper display of events).  
7- at the bottom of the app you can control the animation of the path of events for the selected device via the playBack control panel (play/pause/forward/backward/speed).  
8- the app is responsive and works on any device.  
9- if you want to add more devices or events you can add it to the tracking_events.json file that's in the root of the server folder and you will see the new device and/or event appear in the frontend in real-time.  
10- the assigmnet didn't require to add a feature to add events from the frontend and send it to the backend, but both sides are designed to handle that task in case it gets added in the future.

---------------------------------------  
-Hope you like it :)

