# FOODEL - Food Delivery Website

This repository hosts the source code for Foodel, a dynamic food ordering website built with the MERN Stack. It offers a user-friendly platform for seamless online food ordering.

## Demo

- User Panel :  [https://food-delivery-frontend-p1z8.onrender.com/](https://food-delivery-frontend-h8j6.onrender.com/)
- Admin Panel : https://food-delivery-admin-kzki.onrender.com/add

## Features

- User Panel
- Admin Panel
- JWT Authentication
- Password Hashing with Bcrypt
- Login/Signup
- Logout
- Add to Cart
- Place Order
- Order Management
- Products Management
- Filter Food Products
- Login/Signup
- Authenticated APIs
- REST APIs
- Role-Based Identification
- Beautiful Alerts

## Screenshots

- Hero Section

![Hero](https://i.ibb.co/5W6H7Ly3/HomePage.png)


- Products Section

![Products](https://i.ibb.co/vxY55bdb/FoodItems.png)

- Cart Page

![CartPage](https://i.ibb.co/gMJ4WXJ3/CartPage.png)


- Check Out Page

![Login](https://i.ibb.co/FqcLFzY6/Checkout.png)


- User Order Page

![UserOrders](https://i.ibb.co/pjKGmFLb/User-Orders.png)


- Admin Login Page

![AdminLogin](https://i.ibb.co/xK2fnk7H/Admin-Login-Page.png)


- Admin Products Page

![AdminProducts](https://i.ibb.co/cK2JFMzz/Admin-Products-Page.png)


## Run Locally 

Clone the project

```bash
    git clone https://github.com/BollaRevanth/Food-Delivery-Project.git
```

Go to the Project Directory

```bash
    cd Food-Delivery-Project
```

Install dependencies (frontend)

```bash
    cd frontend
    npm install
```

Install dependencies (admin)
```bash
    cd admin
    npm install
```
Install dependencies (backend)
```bash
    cd backend
    npm install
```

Setup Environment Vaiables

```Make .env file in "backend" folder and store environment Variables
  JWT_SECRET=YOUR_SECRET_TEXT
  SALT=YOUR_SALT_VALUE
  MONGO_URL=YOUR_DATABASE_URL
 ```

Setup the Frontend and Backend URL
   - App.jsx in Admin folder
      const url = YOUR_BACKEND_URL
     
  - StoreContext.js in Frontend folder
      const url = YOUR_BACKEND_URL

  - orderController in Backend folder
      const frontend_url = YOUR_FRONTEND_URL 

Start the Backend server

```bash
    nodemon server.js
```

Start the Frontend server

```bash
    npm start
```

Start the Backend server

```bash
    npm start
```

## Tech Stack
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en)
* [Express.js](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com/)
* [JWT-Authentication](https://jwt.io/introduction)
* [Multer](https://www.npmjs.com/package/multer)

## Deployment

The application is deployed on Render.

## Contributing

Contributions are always welcome!
Just raise an issue, and we will discuss it.

## Feedback

If you have any feedback, please reach out to me [here](https://www.linkedin.com/in/revanthbolla/)
