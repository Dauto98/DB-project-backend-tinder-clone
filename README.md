# chat-app-server
Server for the chat app project

# Usage:
1. Make a postgres database:
    ```
    db name: chatapp
    username: admin
    password: 123456
    ```
2. Run:
    ```
    npm install
    sequelize db:migrate
    nodemon ./server.js
    ```
