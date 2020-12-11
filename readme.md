# Learnr

## Repository
Link: `https://github.com/sajidahmed21/CSC309_A4/`

Username: `a4-csc309`

Password: `a4-csc309!`

## Execution
Installation: `npm install`

Server: `node server.js`

Testing: `npm test`

## Team Information

### Members
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

### Distribution of Work
* Syed Sajid Ahmed
	* database specification
	* admin pages
	* admin server methods
	* admin analytics
	* admin unit testing
	* analytics unit testing
	* user service methods (refactoring for use with admin)
	* class service methods (refactoring for use with admin)
* Willis Chien
    * session/authentication
	* user profile
	* user service methods
	* user unit testing
	* common pages/styling
		* home page
		* header
		* signin, signup, and reference popups
* Erfa Habib
	* class pages
		* class page
		* create a class page
	* class service methods
	* class unit testings
* Sajjad Khakoo
	* messaging page
	* messaging server methods (socket.io)
	* search engine (user, classes, and merged)
	* search engine testing
	* recommendation service methods
		* popular classes
		* recommended classes
	* notifications server methods
	* Google authentication

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