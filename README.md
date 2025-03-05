# Shopamajig Backend

Backend API for Shopamajig built with Express and MongoDB.

## Live

https://odin-shopping-cart-398.pages.dev/

## Frontend

https://github.com/kyledinardi/shopping-cart

## Features

- Uses products from [Fake Store API](https://fakestoreapi.com/).
- Handles HTTP requests from the frontend.
- Authenticates users with username and password.
- Authenticates and authorizes users with JSON Web Token.


## Installation

1. Open the terminal and clone the repository to your computer: `git clone git@github.com:kyledinardi/shopping-cart-backend.git`
2. Change to the project directory: `cd shopping-cart-backend`
3. Install packages: `npm install`
4. Create a .env file in the current directory and add these lines: 
```
CLOUDINARY_URL=<cloudinary-api-url>
DATABASE_URL=<mongodb-url>
JWT_SECRET=<any-string-you-want>
```
5. Start the server: `npm start`