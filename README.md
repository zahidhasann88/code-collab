# Project Overview

The collaborative-coding project is designed to facilitate teamwork and collaboration among developers working on backend development.

To effectively use the collaborative-coding project, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/zahidhasann88/collaborative-coding.git
    ```

2. Install the required dependencies:
    ```
    cd collaborative-coding-backend
    npm install
    cd collaborative-coding-frontend
    npm install
    ```

3. Create the database and Update the database configuration:
    - Open your preferred database management tool (pgAdmin).
    - Create a new database with a suitable name for your collaborative-coding project.
    - Run the sql query
    ```bash
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
    );
    ```
    - Open the `src/auth/auth.ts` file in your collaborative-coding project.
    - Locate the database configuration section.
    - Update the `host`, `port`, `username`, `password`, and `database` fields with the appropriate values for your database.,

4. Start the backend and frontend:
    ```
    cd collaborative-coding-backend
    npm run dev
    cd collaborative-coding-frontend
    npm run start
    ```

5. Access the project in your browser:
    Open your preferred web browser and navigate to `http://localhost:3000`.

6. Register or log in:
    - If you are a new user, click on the "Register" button and provide the required information to create an account.
    - If you already have an account, click on the "Log In" button and enter your credentials.

7. Explore the project features:
    - Once logged in, you can create new coding projects, join existing projects, collaborate with other developers, and share code snippets.

8. Follow the project guidelines:
    - Make sure to follow the project guidelines and best practices for effective collaboration and code sharing.

9. Contribute to the project:
    - If you find any issues or have suggestions for improvements, feel free to contribute by submitting pull requests or raising issues on the project's GitHub repository.

10. Enjoy collaborative coding:
     - Start collaborating with other developers, share knowledge, and build amazing projects together!
