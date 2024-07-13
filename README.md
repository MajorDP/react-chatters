# ReactChatters

This project represents a chat between users where they can:
1) Register;
2) Edit profile - image and description;
3) Add other users as friend based on username;
4) Remove friends from list;
5) Chat in real time, implemented using Socket.io;




Built using React, React Query and Supabase.



#UPDATES:
- Added the option of user description and profile picture changes
- Users can now send each other images in chats
- **Added responsive design for 480, 768 and 1200 width**
- **Added notifications for new received messages inside friend list**

**Added log out option in the user settings tab:**
<br>
_-To acces, press your user's profile picture on the topmost left corner when logged in_

<h2>Create an account, add your friends and chat in real time.</h2>

!!!IMPORTANT!!!

FOR THE CHATS TO WORK IN REALTIME, the server.js file MUST BE started via:

1. cd src/server
2. nodemon server.js
