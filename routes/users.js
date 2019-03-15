const express = require('express');
const ExpressError = require('../helpers/expressError');
const User = require('../models/user')
const sqlForPartialUpdate = require('../helpers/partialUpdate');

const jsonschema = require('jsonschema');
const postUserSchema = require('../schemas/postUser.json');
const patchUserSchema = require('../schemas/patchUser.json');
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser, ensureIsAdmin } = require('../middleware/auth');

const router = express.Router();

router.post("/", async function(req, res, next) {
    try{
        let result = jsonschema.validate(req.body, postUserSchema);

        if (!result.valid){
            let listOfErrors = result.errors.map(error => error.stack);
            throw new ExpressError(listOfErrors, 400);
        }
        const { username, password, first_name, last_name, email, photo_url, is_admin } = req.body;

        let user = await User.addUser({ username, password, first_name, last_name, email, photo_url, is_admin });
        return res.status(201).json({ user });
    }
    catch(err){
        return next(err);
    }
});

router.get("/", async function(req, res, next) {
    try{
        let users = await User.getAllUsers();
        return res.json({ users }); 
    }
    catch(err){
        next(err);
    }
});

router.get('/:username', async function(req, res, next){
    try{
        let username = req.params.username;
        let user = await User.getByUsername(username);

        if (user === undefined){
            throw new ExpressError(`No user with username: ${username}`, 404);
        }

        return res.json({ user });
    }
    catch(err){
        return next(err);
    }
});

router.patch("/:username", 
             ensureLoggedIn, 
             ensureCorrectUser,
             async function(req, res, next){
    try{
        debugger;
        let result = jsonschema.validate(req.body, patchUserSchema);

        if (!result.valid){
            let listOfErrors = result.errors.map(error => error.stack);
            throw new ExpressError(listOfErrors, 400);
        }
        
        let { first_name, last_name, email, photo_url } = req.body

        let items = { first_name, last_name, email, photo_url };
        let id = req.params.username;

        let partialUpdateQuery = sqlForPartialUpdate('users', items, 'username', id);

        let user = await User.updateUser(partialUpdateQuery);

        if (user === undefined){
            throw new ExpressError(`No user with id: ${id}`, 404);
        }

        return res.json({ user });
        
    }
    catch(err){
        next(err);
    }

});

router.delete('/:username', 
               ensureLoggedIn, 
               ensureCorrectUser,
               async function(req, res, next){
    try{
        let username = req.params.username;
        let deletedUser = await User.deleteUser(username);

        if(deletedUser === undefined){
            throw new ExpressError(`No such user: ${username}`,404);
        }

        return res.json({"message":"User deleted"});
    }
    catch(err){
        next(err);
    }
});


module.exports = router;