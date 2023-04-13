const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const {environment} = require('./config');
const isProduction = environment === 'production';
const routes = require('./routes');
const { ValidationError } = require('sequelize');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(routes);

//catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("Thre requseted resource couldn't be found.");
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

//security middleware
if (!isProduction) {
    //enable cors only in development
    app.use(cors());
}
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

//set the _csurf token and create req.csurfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

module.exports = app;