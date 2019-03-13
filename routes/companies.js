const express = require('express');
const ExpressError = require('../helpers/expressError');
const Company = require('../models/company')
const sqlForPartialUpdate = require('../helpers/partialUpdate');

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


router.get('/:handle', async function(req, res, next){
    try{
        debugger
        let handle = req.params.handle;
        let company = await Company.getOneCompany(handle);
        return res.json({company});
    }
    catch(err){
        next(err);
    }
});



router.post("/", async function(req, res, next) {
    try{
        const {handle, name, num_employees, description, logo_url} = req.body;
        let company = await Company.addCompany({handle, name, num_employees, description, logo_url});
        return res.status(201).json({company});
    }
    catch(err){
        return next(err);
    }
});


router.patch("/:handle", async function(req, res, next){
    try{
        
        let table = 'companies';
        let items = req.body;
        let key = 'handle';
        let id = req.params.handle;
        let partialUpdateQuery = sqlForPartialUpdate(table, items, key, id);
        let company = await Company.patchCompany(partialUpdateQuery);
        return res.json({company});
        
    }
    catch(err){
        next(err);
    }

});

router.delete('/:handle', async function(req, res, next){
    try{
        debugger
        let handle = req.params.handle;
        let deletedCompany = await Company.deleteCompany(handle);
        if(deletedCompany === undefined){
            throw new ExpressError('No Such Company!',404);
        }
        return res.json({"message":"Company deleted"});
    }
    catch(err){
        next(err);
    }
});

module.exports = router;