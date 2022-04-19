# Simple REST API application in Docker

The app is built in Node.js, Express, PostgreSQL and Sequelize. JSON Web Tokens are used to provide users an authentication token, and Bcrypt is used for password hashing. The app provides a simple REST API to register new user profiles, log in users, and log out. 


## Set up
  Docker must be installed on your host machine to run this project.


## To build the Docker image
  Make sure you have Docker installed on your machine. In the terminal, run `docker build --tag docker-api .` in the docker-api folder. 


## To build andrun the Docker image as a containerised service
  In the terminal,  run `docker-compose up -d` in the docker-api folder. The service will start in detached mode. 


## Check the health of the containers
  In the terminal,  run `docker ps` in the docker-api folder. 
    


## Tear down the running docker containers
  In the terminal,  run `docker-comopse down` in the docker-api folder. 
    


# REST API
The REST API contains three endpoints as listed below. These can be tested in an API testing client such as Postman. Routes should be tested at `http://localhost:3001/user/[plus desired endpoint]`.

## Create a new user

### Request

`POST /user/register`

The POST request to `/user/register` must contain valid request data including a user's `email`, provided as a string, and a `password`, which must be also be a string. Passwords are hashed using Bcrypt, and the hashed password is saved to the database.  A succcess message will be returned to the client indicating that the user has been saved to a local database, along with the user ID and email. If the supplied email does not fit the address@emailprovider.com pattern, users will receive an 'invalid email format' message.

Example payload: `{ "email": "example@email.com", "password": "strongpassword"}`

### Response

  `{
      "message": "User created successfully",
      "_id": 1,
      "email": "example@email.com"
  }`

## Log in a user

### Request

  `POST /user/login`

  The POST request to `/user/login` must contain a user's `email`, provided as a string, and a `password`, which must be also be a string. A hash of the provided password will be compared against the password hash saved in the database. If the user exists and the password is correct, a time-limited JSON Web Token will be generated and saved to the user's profile indivating they are logged in. The server will respond with a success message and the user's details.

  If the provided details are not correct, users will receive an 'Invalid credentials message'.

  Example payload: `{ "email": "example@email.com", "password": "strongpassword"}`

### Response

  `{
    "message": "Successfully logged in",
    user: {
        "id": 1,
        "email": "example@email.com",
        "password": "$2b$10$d48yp6MT1QYRq2pg3f8pnuJ4GtpPJG4nBttjZgUVL5aL2UTI5ZQQe",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwMzg3MDU5LCJleHAiOjE2NTAzOTA2NTl9.VYjt8fQnQSUlyEOMN2FvgGgDZiH-dgLKC8QeCom74mQ",
        "createdAt": "2022-04-19T16:50:25.242Z",
        "updatedAt": "2022-04-19T16:50:59.817Z"
    }
  }`

## Log out a user

### Request

  `POST /user/logout`

  The POST request to `/user/logout` must contain a user's `email`. If the user exists and has an authentication token, the user will be logged out and their authentication token deleted. If the user does not have an authentication token, they will receive a message saying they are not logged in. The server will respond with a logout success message and the user's details.

  If the provided details are not correct, users will receive an 'Invalid credentials' message.

  Example payload: `{ "email": "example@email.com"}`

### Response

  `{
    "message": "Logged out",
    user: {
        "id": 1,
        "email": "james@2234",
        "password": "$2b$10$d48yp6MT1QYRq2pg3f8pnuJ4GtpPJG4nBttjZgUVL5aL2UTI5ZQQe",
        "token": null,
        "createdAt": "2022-04-19T16:50:25.242Z",
        "updatedAt": "2022-04-19T16:51:35.674Z"
    }
  }`
