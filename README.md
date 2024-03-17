# StudyNotion
StudyNotion is a fully functional ed-tech learning platform that enables users to create, consume, and rate educational content. The platform is built using the MERN stack , which includes ReactJS, NodeJS, MongoDB, and ExpressJS.
## StudyNotion aims to provide:
•	A seamless and interactive learning experience for students, making education more accessible and engaging.
•	A platform for instructors to showcase their expertise and connect with learners across the globe.
# Front-end
The front end of StudyNotion has all the necessary pages that an ed-tech platform should have. Some of these pages are:
## For Students:
•	Homepage : This page will have a brief introduction to the platform, as well as links to the course list and user details.
•	Course List : This page will have a list of all the courses available on the platform, along with their descriptions and ratings.
•	Wishlist : This page will display all the courses that a student has added to their wishlist.
•	Cart Checkout : This page will allow the user to complete the course purchase.
•	Course Content : This page will have the course content for a particular course, including videos, and other related material.
•	User Details : This page will have details about the student's account, including their name, email, and other relevant information.
•	User Edit Details : This page will allow the student to edit their account details.
## For Instructors:
•	Dashboard : This page will have an overview of the instructor's courses, as well as the ratings and feedback for each course.
•	Insights : This page will have detailed insights into the instructor's courses, including the number of views, clicks, and other relevant metrics.
•	Course Management Pages : These pages will allow the instructor to create, update, and delete courses, as well as manage the course content and pricing.
•	View and Edit Profile Details : These pages will allow the instructor to view and edit their account details.
## For Admin
•	Dashboard : This page will have an overview of the platform's courses, instructors, and students.
•	Insights : This page will have detailed insights into the platform's metrics, including the number of registered users, courses, and revenue.
•	Instructor Management : This page will allow the admin to manage the platform's instructors, including their account details, courses, and ratings.
•	Other Relevant Pages : The admin will also have access to other relevant pages, such as user management and course management pages.
# Back-end
The back end of StudyNotion provides a range of features and functionalities, including:
1.	User authentication and authorization : Students and instructors can sign up and log in to the platform using their email addresses and password. The platform also supports OTP (One-Time Password) verification and forgot password functionality for added security.
2.	Course management : Instructors can create, read, update, and delete courses, as well as manage course content and media. Students can view and rate courses.
3.	Cloud-based media management : StudyNotion uses Cloudinary, a cloud-based media management service, to store and manage all media content, including images, videos, and documents.
4.	Markdown formatting : Course content in document format is stored in Markdown format, which allows for easier display and rendering on the front end.
# Libraries & Frameworks Used
The back end of StudyNotion uses a range of frameworks, libraries, and tools to ensure its functionality and performance, including:
1.	Node.js: Node.js is used as the primary framework for the back end.
2.	MongoDB: MongoDB is used as the primary database, providing a flexible and scalable data storage solution.
3.	Express.js: Express.js is used as a web application framework, providing a range of features and tools for building web applications.
4.	JWT: JWT (JSON Web Tokens) are used for authentication and authorization, providing a secure and reliable way to manage user credentials.
5.	Mongoose: Mongoose is used as an Object Data Modeling (ODM) library, providing a way to interact with MongoDB using JavaScript
# Packages Used
1.	@ramonak/react-progress-bar: A React component library for creating progress bars.
2.	@reduxjs/toolkit: A package that simplifies Redux setup and usage by providing utilities like creating slices, which are pieces of Redux state and logic.
3.	axios: A promise-based HTTP client for making requests to external servers.
4.	concurrently: A utility for running multiple commands concurrently.
5.	copy-to-clipboard: A package for copying text to the clipboard.
6.	react: The core React library.
7.	react-chartjs-2: A React wrapper for Chart.js, a popular charting library.
8.	react-dom: The ReactDOM library, used for rendering React components in the DOM.
9.	react-dropzone: A React component for file uploads via drag and drop.
10.	react-hook-form: A library for managing form state and validation in React using hooks.
11.	react-hot-toast: A React library for displaying toasts (notification messages).
12.	react-icons: A library providing popular icon packs as React components.
13.	react-markdown: A React component for rendering Markdown content.
14.	react-otp-input: A React component for entering one-time passwords (OTPs).
15.	react-rating-stars-component: A React component for displaying rating stars.
16.	react-redux: The React bindings for Redux, a predictable state container for JavaScript apps.
17.	react-router-dom: A routing library for React applications.
18.	react-scripts: Scripts and configuration used by Create React App, a tool for quickly setting up React projects.
19.	react-super-responsive-table: A React component for creating responsive HTML tables.
20.	react-type-animation: A React component for animating text typing.
21.	redux-toolkit: A package providing utilities and abstractions for working with Redux.
22.	swiper: A mobile touch slider library.
23.	video-react: A React component library for building video players.
24.	web-vitals: A library for measuring key performance metrics of web pages.

# Architecture Design
Here is a high-level diagram that illustrates the architecture of the StudyNotion ed-tech platform:
![image](https://github.com/Vanshika2807/Mern-Project/assets/139116977/102e3f0d-658f-40a9-89e2-64584eb09258)

 
# Data Models & Database Schema
The back end of StudyNotion uses a range of data models and database schemas to manage data, including:
1.	Student schema: Includes fields such as name, email, password, and course details for each student.
2.	Instructor schema: Includes fields such as name, email, password, and course details for each instructor.
3.	Course schema: Includes fields such as course name, description, instructor details, and media content.
Overall, the back-end of StudyNotion is designed to provide a robust and scalable solution for an ed-tech platform, with a focus on security, reliability, and ease of use. By using the right frameworks, libraries, and tools, we can ensure that the platform functions smoothly and provides an optimal user experience for all its users.

# Installation and Setup
This starter pack includes a basic setup for using Tailwind CSS with React. To start building your own components and styles, follow these steps:
1.	Clone the repository to your local machine.
git clone https://github.com/Vanshika2807/Mern-Project
2.	Install the required packages.
npm install
3.	Start the development server.
npm run dev
4.	Open the project in your browser at http://localhost:3000 to view your project.
# Contributing
Contributions are welcome! If you have any suggestions or find any issues, please feel free to open an issue or a pull request.

