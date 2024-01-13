# [Hands-Off](https://www.hands-off.app) 

This is the repo I used to create my website located at the link above. I created this site in order to help one of my favorite content-creators prevent from getting their streams stolen by bots.
The idea of the site is to quickly and securely upload a stream as soon as the stream ends while still providing some customization for the streams.

## Supported Platforms

Currently the site supports [![OBS](https://img.shields.io/badge/OBS-Open%20Broadcaster%20Software-282c34?style=flat&logo=obs-studio)](https://obsproject.com/), ![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=plastic&logo=YouTube&logoColor=white), and ![Twitch](https://img.shields.io/badge/Twitch-9347FF?style=plastic&logo=twitch&logoColor=white).

### Technology Used

**Frontend**

+ ![React](https://img.shields.io/badge/react-%2320232a.svg?style=plastic&logo=react&logoColor=%2361DAFB): A modern JavaScript library for building user interfaces. It allows for creating dynamic and interactive web applications.
+ ![React Router DOM](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white): Enables seamless client-side routing for easy navigation between different pages within your application.
+ **React Select**: Provides a user-friendly dropdown component with filtering and autocomplete functionalities for enhanced usability.
+ ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=plastic&logo=SASS&logoColor=white): A powerful CSS preprocessor that streamlines writing maintainable and efficient styles.

**Backend**

+ ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=plastic&logo=node.js&logoColor=white): A highly efficient JavaScript runtime environment that empowers server-side operations. It enables your application to process data, communicate with databases, and handle user requests.
+ ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=plastic&logo=express&logoColor=%2361DAFB): A popular web framework for building scalable and secure APIs. It simplifies setting up server-side logic and handling different routes within your application.
+ ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=plastic&logo=mysql&logoColor=white): A robust and reliable database management system for storing your project's data securely and efficiently.
+ **Knex**: A powerful query builder for interacting with your MySQL database with ease. It reduces the need for writing complex SQL queries directly.
+ ![JWT](https://img.shields.io/badge/JWT-black?style=plastic&logo=JSON%20web%20tokens): Enables secure authentication and authorization mechanisms for users accessing your application.
+ **WebSockets**: A real-time communication protocol that allows for instant updates and interactions between your application and users. This can be valuable for features like chat or live streaming.
+ **OBS-WebSocket-JS**: A dedicated library for controlling OBS Studio through WebSockets. This facilitates seamless integration with streaming software within your project.
+ **Axios**: Simplifies making HTTP requests for fetching data and interacting with APIs from your backend code.
+ **Bcrypt**: Provides secure password hashing for protecting user credentials stored in your database.

### Looking back

This project is my capstone for the coding bootcamp Brainstation; we were originally only given like a month to complete them or at least make something presentable, but I'm only just now comfortable
showing this project. Going into this I had no idea how difficult this would be especially because I feel like as a consumer I take a lot of things I interact with for granted. Youtube for example, the UI makes things like uploading a video deceptively easy, but uploading videos via Youtube's API without their libraries providing functions to do everything proved to be pretty difficult to say the least. The technologies I was experienced with going into this were Node, Express, MySQL, Knex, Axios, React, and Sass, but I had to learn everything else from scratch; I'd say the most challenging things to learn had to be using websockets and especially anything having to do with security like ssl, JWT, tunneling, wss, state variables, and access tokens simply because most of the time when something wouldn't work the issue would turn out to be a security issue such as chrome requiring websockets to connect with wss.

### Demo

https://youtu.be/JMVAm1Lmdyc

