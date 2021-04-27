# Getting Started with this project
- Run npm install in the root directory
- Install mongoDB on your local and create following folder => c:/data/db
- Open cmd terminal and run mongod --dbpath=c:/data/db
- Open another cmd terminal and run mongo
- Go back to root directory and run **npm start**
- Application will be deployed on http://localhost:3010

# Initial dummy data loaded to mongoDB
- I have added initial data to load for the application using some dummy data. So a total of 6 articles will be pushed to mongoDB.
- I have also created 2 user profiles. The dummy data is loaded to faciliate the real time behaviour. You can go ahead and create new User by signing up.
- Credentials of predefined userd to login:
	1. Admin/ Admin@123
	2. Aditya/Aditya@123

# Application in gist:
1. **Home** will list all the articles created by all the users. All the articles listed here will be in Read Only mode. As you can see on Home page all articles are template where body is limited to 200 characters.
2. Once the user clicks on any of the article, the user is navigated to new page wherein the complete article will be rendered.
3. If the Author of the article is logged in and is viewing his article in detail, he would be able to see Edit Article button at the bottom right corner. For rest of the people (non-author) there would not be any Edit link availble.
4. User if logged-in would be able to see **New Article** tab. A user can go ahead and write new article.
5. User can logout from the application by clicking on **Log Out** tab.and would yet be able to scroll through various articles on **Home** tab.

# Other features:
1. Localization support for various static labels and server response. Current supported languages include English, Hindi and Marathi.
2. Using SCSS, implemented Theming functionality to toggle between day and night themes.
3. Articles are grouped by tags and archives which can help in finding article quickly.
4. There is pagination support while viewing list of multiple articles. Max 4 articles are limited on each page.

# Technology stack:
1. react: Complete application is designed on React framework. I have relied more on hooks which really accelerates the development and helps in writing clean code.
2. react-router: Implemented routing for the application using react-router. 
3. react-redux: For state management I have relied on redux. Once you get hold of core principles of redux it really helps you to manage global state of your application with minimal props traversal between components.
4. react-i18next: This internationalization library is really easy to work with. The documentation and api references on its home page are enough to get you going. I have relies on useTranslation hook as all my react components are functional components.
5. node-sass: I wanted to implement dark and light theme for my application. And its very easy to use SCSS format to design your css. node-sass package helps you compile .scss files to .css
6. bootstrap: I have relied heavily on bootstrap for the responsive behaviour of the application.
7. express: Used Express as an back end server to receive the request from React application, apply business logic on it and store in database. So I have used various get and post routing methods to integrate by both end to end applications.
8. mongoDB: Since the data was not constrained to any schema, I went simply with mongo. Mongo is used wisely and the documentation gets you going within no time.

I wish this gets you going with MERN stack application.
