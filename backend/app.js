const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const { environment } = require('./config');
const { ValidationError } = require('sequelize');

const app = express();

const isProduction = environment === 'production';

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  
  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );
  
  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );

app.use(routes);


//


//catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requseted resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found."};
    err.status = 404;
    next(err);
});

//process sequelize errors
app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        let errors = [];
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation Error';
        err.errors = errors;
    }
    next(err);
});

//error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});



module.exports = app;