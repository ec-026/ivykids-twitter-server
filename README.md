# Mini Twitter Clone - Server

Welcome to the server part of the Mini Twitter Clone project! This is the backend component responsible for handling data and serving it to the frontend.

## Technologies Used
- **Node.js**: The server is built using Node.js, a JavaScript runtime.
- **MongoDB**: MongoDB is the database of choice, where user data, tweets, and follower information are stored.
- **Mongoose**: Mongoose is used to interact with MongoDB, providing a convenient way to define schemas and models.
- **GraphQL**: GraphQL is utilized as the API gateway for efficient data retrieval and management.
- **Apollo Server**: Apollo Server is used to create a GraphQL server for handling queries and mutations.
- **JSON Web Tokens (JWT)**: JWTs are used for secure user authentication.

## Setup and Installation
1. **Clone the Repository**: 
`git clone https://github.com/ec-026/ivykids-twitter-server`

2. **Install Dependencies**:
Navigate to the project folder and install the necessary dependencies using npm or yarn.
`cd ivykids-twitter-server`
`npm install`

3. **Configuration**:
- Create a `.env` file and set up the following environment variables:
  - `MONGODB_URI`: The connection string for your MongoDB database.
  - `SECRET_KEY`: A secret key for JWT token generation.
  - `PORT`: The port on which the server will run (default is 5000).

4. **Start the Server**:
`npm start`

5. **GraphQL Playground**:
Access the [GraphQL Playground at](https://ivykids-twitter-server-production.up.railway.app) for testing queries and mutations.

## Client Codebase
To explore the client-side codebase and the user interface, please visit the [Mini Twitter Clone - Client repository](https://github.com/ec-026/ivykids-twitter-client).

## Live Site
You can experience the live Mini Twitter Clone at [Live Mini Twitter Clone](https://ivykids-twitter-client.vercel.app).

Feel free to explore, contribute, or customize the server codebase according to your needs.


