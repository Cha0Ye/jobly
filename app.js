/** Express app for jobly. */

const express = require("express");

const ExpressError = require("./helpers/expressError");
const companyRoutes =require('./routes/companies');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users')
const morgan = require("morgan");
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./config');
const OPTIONS = {expiresIn: 60*60};

const app = express();

app.use(express.json());



app.use('/companies',companyRoutes);
app.use('/jobs', jobRoutes);
app.use('/users', userRoutes);

// add logging system
app.use(morgan("tiny"));

app.post('/login', async function(req, res, next) {
  try{
    debugger;
    const { username, password } = req.body;
    const currUser = await User.authenticate(username, password);
    if(currUser){
      let token = jwt.sign({username}, SECRET_KEY, OPTIONS);
      return res.json({token});
    }
    throw new ExpressError("Can't authenticate!", 400);
  }
  catch(err){
      next(err);
  }

});

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});


module.exports = app;
