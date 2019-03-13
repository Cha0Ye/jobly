const express = require('express');
const ExpressError = require('../helpers/expressError');
const Company = require('../models/company')


const jsonschema = require('jsonschema');
//add schemas

const router = express.Router();


router.get("/", async function(req, res, next) {
    try{
        debugger
        let {search, min_employees, max_employees} = req.query;
        let companies = await Company.searchByQuery({search, min_employees, max_employees});
        return res.json({companies}); 
    }
    catch(err){
        next(err);
    }
});

module.exports = router;