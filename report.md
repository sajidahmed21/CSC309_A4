# Learnr

## Overview

### Description
Learnr is not only an online platform for sharing knowledge but also a gathered social community of users with similar interests. The platform has three main purposes: to allow users to create their own classes, to allow users to discover new and interesting courses, and to provide methods of communication to users about the classes they are interested or enrolled in. Courses are not limited in any way, and can range from academic topics to arts and crafts.

### Repository
Link: `https://github.com/sajidahmed21/CSC309_A4/`

Username: `a4-csc309`

Password: `a4-csc309!`

### Execution
Installation: `npm install`

Server: `node server.js`

Testing: `npm test`

### Live Hosting
Link: https://csc309-learnr.herokuapp.com/

## Team Members
* Syed Sajid Ahmed
    * g4ssa
    * sajid.ahmed@mail.utoronto.ca
* Willis Chien
    * c5chienw
    * willis.chien@mail.utoronto.ca
* Erfa Habib
    * g4habibe
    * erfa.habib@mail.utoronto.ca
* Sajjad Khakoo
    * ***REMOVED***
    * ***REMOVED***

## Application Design

### Three-Tier Architecture
For our web app, we chose to use a three tier architectural design: the data layer is in the form of a sqlite database, the logic layer is controlled through nodejs code which has functions to access and transform data from the data layer, and the presentation layer is the HTML (generated through a template engine), CSS, and JavaScript code which presents data from the logic layer.

Changes are triggered by the user in the presentation layer, which makes calls to the logic layer which in turn calls the data layer to manipulate the actual data. As such, the presentation layer and the data layer do not directly communicate.

### Web App Parts
In designing the individual parts of the web app, we tried to make things modular and separate functions into separate files. The server.js file holds the core basic functionality, including routing of requests. Common functions and the database are stored in common.js, which all other modules include. Request handlers are in their respective files (user.js, course.js, et cetera), along with any helper methods required. The exception is home.js, which has a basic function for rendering the home page with error text when required.

server.js interacts directly with methods from the modules, which in turn rely on common.js. The administrator functions add one more level of indirection: server.js interacts directly with admin.js, which in turn calls library functions in the modules.

## Security Vulnerabilities
We have implemented security in a few ways on our web app: input validation (both on the server and client side), prepared statements, cross-site scripting protection, DOS protection from too many requests.

### Form Validation
The input data is both validated within the presentation layer and the logic layer. The input is first checked on the presentation layer so that when passing into logic layer, the data is well-formatted. Then, Methods in the logic layer validate the inputs given to them (to ensure that they are provided and valid). If there is any problem, no change is triggered on the data layer. For example, when enrolling in a class, we check to make sure that a class id is provided, that it is not negative, that it corresponds to a known course, and that the user is eligible to enrol (he is not the instructor nor currently enrolled in the class).

Testing can be done on the front end by overriding the client side validation in the JavaScript/HTML5 and supplying invalid fields.

### Prepared Statements
To help prevent SQL injection, we took the approach of using prepared statements by default. Only in the event that a query caused performance issues (to be discussed below) would we consider alternatives.

Testing can be done on the front end by attempting to inject data in any of the forms.

### Cross-Site Scripting
In order to provide protection against XSS, we used a node module called Helmet. Helmet ensures that HTTP headers the server sends contain the necessary information for the browser to prevent scripts from other sites being executed (namely 'X-XSS-Protection').

Testing can be done by trying to type <script>...</script> into the input area.
For example input: <script>alert('hello')</script>, the alert popup does not appear

### DOS Protection
We included a node module called ddos which prevents DOS attacks from single points. It is configured with a maximum number of requests allowed within a time frame (for example, one hundred requests per minute) along with a burst limit. Should a user reach the burst limit within a short period of time, the expiry time is doubled for him (for example, one hundred requests per two minutes). If a request is made when the limit is reached, the server does not process the request and instead returns an error message.

Testing can be done by repeatedly making requests until a rejection occurs.

### Miscellaneous Security Features
* User passwords are hashed with a randomly generated salt.
* Access to user profiles/information is blocked when a user is not logged in.
	* Searching for users is disabled if not logged in.
* File uploads for the course page must be validated.
	* The file must be an image and meet the size restrictions.
* Injection onto pages (for example through a review or instructor post) is prevented.


## Performance
In designing the web app to take a security-first approach, we had to test to ensure that performance was acceptable. We did this in two ways: manual testing to ensure that the pages performed as expected without delays in processing and making use of our mocha test cases (which notes when performance is slow).

The only functionality which we found to be slow was changing a user's password, which takes 80ms. This cost is primarily because of the cost of hashing the user's password, which needs to be done twice (once to verify the current password, and then again on the new password before it is stored in the database). We felt that this was acceptable since the time it takes is still quite small and the page loads without delay.

With regards to the prepared SQL queries, none caused performance issues and so were left as prepared statements.

?? actual results? in numbers?

## Enhancements

### Admin Analytics
Along with the ability to manage users and classes, we added some analytics to the admin functionality. Results are displayed on a dashboard on the admin page.

We felt that this would help provide useful information to administrators about the popularity of the site and how users are using it. For example, the average number of unique users shows whether the site is being used consistently by users.

### Instant Messaging
Although the baseline specification only requires that users be able to message each other, it leaves open how complicated the system itself can be. We felt that messaging was an integral part of maintaining the social community aspect of our website, and therefore dedicated more time to it.

To this end, we made use of socket.io to provide instant messaging capabilities. Because of this, we had to also add in some additional features to support this. For example, the search bar on the messaging page only shows users who are online on the messaging system and, when users are not on the messaging system, any open conversions become locked and the chat partner can see that the user is no longer available.

### Advanced Searching
LearnR allows users to find new courses both through the recommendation system and by seeing what courses other users are taking. As such, it is important that users be able to search for both classes and users at the same time, which we added support for.

However this leads to a different problem: with all of the classes and all of the users, which are the most relevant to what the user is searching for? To solve this problem, we added a scoring system to search results. Scores are based on how well the user's search query matches with the string in question. So, for example, searching for 'dent' would rank 'dent repair' above 'trident wielding'. As such, although we have limits on the number of search results, the results are more accurate and more likely to be what the user was searching for.

### File Upload
We have considered that different instructors may like to have different themes for their courses. We have implemented the upload file feature for the course background image. Thus, the instructors can choose theme that suit their contents accordingly.

Since the express 4.0+ does not support multipart anymore, we have to make use of external module - multer. By using this module, we are able to retrieve the file name and the image file. We first rename the image file, so that it is unique for each course. Then, we store the image file user under the /public/img and store it's path in the database. So,  when a user visited a specific course page, the path will be loaded from database and display as background on the front-end.

### Instructor Posts
Within a class, there are two types of roles: instructor and student. Since instructor's post should be a collection of view for the student to understand immediately, we have separated the instructor posts from students' comments/posts.

This feature is to improve the user experience for both instructors and students such that instructor's post will not be over-flooded by students' reviews / comments and that students are able to view and understand instructor's posts immediately.

### Notifications
Notification feature is primarily for the follower to have an instant update for their followee. The follower is being signalled when the followee has enrolled in a course.

We thought that it would be meaningless if the follower has followed a person but are not alerted when the followee has enrolled in a class. Notification feature acts like a news feed to the user to automatically update their followee's current activity. This notification may even trigger the follower to enroll in the same course as the followee.

### Popular Courses Suggestion
Popular Courses Suggestion feature allows all user and non-user to view what is currently the most popular courses. The user may gain a bigger understanding of what the learnR community is mainly interested, and the user may even be attracted and enrol in it. Also, this feature is also available for non-user. Due to this feature, the non-user may be attracted to these top courses and become one of LearnR Community.

## Using the Web App

### Administrator

Administrators can login by navigating to `/admin`. Below are the login credentials supplied in our database.

Admin username: `admin1`

Admin password: `admin1-password`

Administrators can use the tabbed interface to switch between seeing the analytics dashboard, modifying and deleting user accounts, and managing and deleting courses.


### Users

#### Searching
Users can make use of the omni-search bar at the top. This search is always run on classes, however if logged in, it is also run on users.

#### Logging In
Users can either signup using our internal login system (username and password) and then login or use the Google authentication system to login directly.

#### Home Page
Users can go to the home page to see a list of popular and recommended classes. A class is recommended based on the users who are followed and which classes they are taking. Users will not be recommended to take classes they are already enrolled in or are the instructor for.

#### Profile Management
From their profile page, users can change their names, passwords (if using the internal login system), drop classes, and stop teaching classes. Each of these is controlled through buttons on the page with popups if necessary.

#### Classes
From the navigation bar, users can go to the create a class page to fill in details for a new class.

Once created, they can modify the class and make posts through the tabbed interface on the class page. They can also see some analytic information and reviews on the page.

For users who are not the instructor, the options to modify the page are unavailable, but they can instead leave a review and rating for the course.

#### Messaging
Clicking on the Messaging button on the navigation bar enters the user into the IM system. Using the search bar on the page, the user can find online users and send them messages in real time. If they receive messages, they will appear on the page. Unseen messages are marked in bold and, should a chat partner leave the messaging page, the styling will change to let the user see that.

## Missing Features

### Tag Feature
The tag feature was our original enhancement feature. This feature should have contained the many different varieties of tags that the courses could be tagged with, so that the user can search by tags easily. Tags would be added by the admin and selected by class instructors for their classes.

To implement this feature, we will need to first create all the possible categories (can be added by admin later) in a separated table in the database. So, when the instructor(user) create course, the server will retrieve a bunch tag and display for instructor to test with. Then, we can integrate the search function with these tags, so that the user can search the course by tag, thus will better the user experience.