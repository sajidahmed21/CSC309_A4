# Learnr

## Repository Infomation

Link: https://github.com/sajidahmed21/CSC309_A4/

Username: a4-csc309

Password: a4-csc309!

## Description
Learnr is an online platform for for sharing knowledge and having a social community of users with similar interests. The platform has three main purposes: to allow users to create their own classes, to allow users to discover new and interesting courses, and to provide methods of communication to users about the classes they are interested or enrolled in. Courses are not limited in any way, and can range from academic topics to arts and crafts.

## How It Works
All users sign up on the site and provide authentication information (either a password or a Facebook login). Then, users can interact with the community by enrolling in classes or by creating their own classes. When a user has enrolled in a class, he will receive notifications when changes are made to the course. Moreover, as a user enrols in classes, Learnr will provide recommendations for other classes that the user might be interested in, as well as other users who share similar interests/classes. Users can also interact with each other through a messaging system.

## Challenges
Often students in academic classes use a few sites to navigate the information provided (a course website, Piazza for questions, and Facebook groups to communicate with classmates). Learnr aims to bring these aspects closer together by integrating them into one web application. Further, by not being limited to academic courses, Learnr allows for smaller classes to benefit from the same resources a larger class would.

Users who wish to enrol in a course may not always know what to enrol in or which course out of a group would be the best. Learnr's recommendation and rating system helps make both decisions easier. Users who wish to teach a class will also benefit from valuable reviews, ratings, and feedback from course participants to help them improve their classes.

<br/><br/>

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

## Task Allocation
### Web Pages
Home Page (index.html): Willis 

View and Edit Profile: Willis

View and Edit Class: Erfa

Recommended Classes: Sajjad

Messaging: Sajjad

Admin Pages (analytics, user, and class management): Syed Sajid

### Web Services
Note that the sections below include test cases. Items ending with (*) are enhancements.

#### Willis
1. User Login (authentication).
2. Modifying and fetching data for Profiles.
3. Uploading user profile images. (*)

#### Erfa
1. Creation, modification, and fetching data for classes.
2. Uploading class banners. (*)
3. Instructor posts. (*)

<br/>
#### Sajjad
1. Generation of class recommendations.
2. Tag system for classes. (*)
3. Sending and receiving of messages.

#### Syed Sajid
1. Third party login (Facebook authentication).
2. Managing users and classes for Admins.
3. Analytics for Admin. (*)

## Enhancements
The following is a list of enhancements which we have planned for our project:

* Having responsive pages
* Analytic data for Admins
    * Admins will have dashboard showing statistics about Learnr and its usage
* File upload
    * Users can upload images for their profile
    * Instructors can add banners for their classes
    * Instructors can upload pdf files to classes
* Instructor posts
    * Instructors will have a blog-style post system where they can add content whenever they want
* Adding a tag system to classes
    * Users can use tags to find new classes
    * Recommended classes can take into account tags when making suggestions

## Frameworks and Libraries
We currently plan on using jQuery (including jquery.autocomplete.js for the autocompletion dropdowns) and Bootstrap.