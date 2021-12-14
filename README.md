# Restaurant API

This is an api that implements oren backend developer tests. It is an express app with mongodb as the backend. The schemas can be found in models while business logic in controllers. Routes manages the exposed endpoints. It uses jsonwebtoken for login tokens, and express-validator to validate the request body. It is written in a model-controller architecture.

## Models
The models available are:
- Cart: This is a mongoose model for the cart contents
- User: This is the mongoose model for the user data (email, password, etc.)
- DB: This gives the connect(), and close() method to manage connection with the Mongo database
- Dishes: This model responds with the hardcoded values of two items, Dishes & Beverages
- Mailer: Sends the order email

## Controllers
The controllers are:
- cartController: it has methods to get items(/cart/items), add a new item (/cart/add), increment item (/cart/increment), decrement an item (/cart/delete) or delete an item regardless of quantity (/cart/delete/all). It also has (/cart/order) which sends an email of the complete order to the customer
- userController: it has methods to get profile (/user/profile), login (/user/login), register(/user/register), edit profile (/user/edit)

## Routes
The routes are:
- cart
- menu: this has one get method (/dishes) which returns all the menu items
- users

All constants are stored in config.js file in the root folder.

## Run
- Install dependencies `npm install`
- Run the app by `npm start` or `node ./bin/www`