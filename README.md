## Project Name - Live test taking system.

A Multiple choice test taking system in which tests are tracked live and analytics are generated based on that.

Project Description - This project should be a ready to deploy test taking system. It must have all the features mentioned below and it must be deployed on a server before submission. It must be a single page application.

Frontend Technologies allowed - AngularJS for dynamism and SPA and any technologies/framework allowed for frontend design. Backend Technologies allowed - NodeJs, ExpressJS, MongoDB, SocketIO, WebSockets.

Features of the platform -

User management system
User Test management sys number of tests taken, average score and percentage growth etc. You are free to think and use more metrics, graphs etc. b) Dashboard should also contain the lists of tests the user has taken and every item in this list should be clickable. On clicking this item, a Test Result view should open which contains the details of test result. c) There should be a “take a test” option in menu from which user can go to test taking page. d) On test taking page, user should see a list of tests he can appear for along with a button to start that test.
User test taking system - a) Once user starts the test, he should first see an instructions screen containing. It may also contain the rules of the test. b) Once the user reads the instructions and accepts the rules (single accept button), The test timer will start and the screen should display the test questions and options associated with it. c) User should be able to choose only one option as answer for every question. d) The test should have a time limit. The test window must automatically close once the timeout occurs irrespective of how many questions have been answered. The system should submit the answers automatically. e) If the user completes the test before the time ends, he should see a submit window which will submit his all answers. In case of timeouts, this window must appear automatically. f) The system must keep a track of how much time a user is taking for answering each question. Your models should be designed accordingly. Hint - questions and their options should be stored in one model which is not user dependent, whereas the answers should be stored with both testId and user details because the answers are related to users. g) You may use socketio, ws or similar modules for live tracking the user progress. h) On submission of test, show the result to student. Tell him the number of correct answers and percentage of marks obtained.
Test listing Admin a) Admin should be able to create tests in the system b) Each test should have a set of questions, each question containing at least 4 options and overall time limit of the test. In case of queries, reach out to us at support@edwisor.com 1 c) Admin should be able to create, edit, delete and view any tests, question or option. d) While creating options for any question, admin should be able to set a correct answer. This answer (flag) will actually help in automating the test evaluation process.
User analytics in admin a) Admin should be able to view details of users registered in the system b) Admin should be able to view overall performance of the user in all his tests.
© 2018 GitHub, Inc.


# Quizhub ~ Test Your self

  Live at  http://ec2-13-127-233-56.ap-south-1.compute.amazonaws.com/

## Description
A Multiple choice test taking system in which tests are tracked live and analytics are generated based on That.

### Admin Account Requirements
    ```
        Use Email: "admin@quizhub.com"
            Password: "admin"
    ```
## Features

```
    1). Single Page Application.
    2). Login / Logout feature.
  	3). clean ui and ux.
    4). User View:
            a) User can sign up using Email, Gmail and Facebook.
            b) User can login to the system through email and password combination or using Gmail/Facebook
            c) Forgot password functionality to reset password.
            d) Once the user logs into the system, He will  see a dashboard containing the statistics of all tests he has taken. The statistics may include the number of tests taken, average score and percentage growth etc.
            e) Dashboard also contains the lists of tests.
            f) There is a “take a test” option in menu from which user can go to test taking page.
            g) On test taking page, user can see a list of tests he can appear for along with a button to start that test.

   5).  Admin View:
            a) Admin can create, delete or update test
            b) Admin can view all user details
