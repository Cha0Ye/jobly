const express = require('express');
const ExpressError = require('../helpers/expressError');
const Company = require('../models/company')
const sqlForPartialUpdate = require('../helpers/partialUpdate');

const jsonschema = require('jsonschema');
const postCompanySchema = require('../schemas/postCompany.json');
const patchCompanySchema = require('../schemas/patchCompany.json');

const router = express.Router();


router.get("/", async function(req, res, next) {
    try{
        let {search, min_employees, max_employees} = req.query;
        if (min_employees > max_employees){
            throw new ExpressError("min_employees cannot be greater than max_employees", 400);
        }
        let companies = await Company.searchByQuery({search, min_employees, max_employees});
        return res.json({companies}); 
    }
    catch(err){
        next(err);
    }
});


router.get('/:handle', async function(req, res, next){
    try{
        let handle = req.params.handle;
        let company = await Company.getOneCompany(handle);

        if (company === undefined){
            throw new ExpressError(`No company with name: ${handle}`, 404);
        }

        return res.json({company});
    }
    catch(err){
        next(err);
    }
});



router.post("/", async function(req, res, next) {
    try{
        let result = jsonschema.validate(req.body, postCompanySchema);

        if (!result.valid){
            let listOfErrors = result.errors.map(error => error.stack);
            throw new ExpressError(listOfErrors, 400);
        }
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

        let result = jsonschema.validate(req.body, patchCompanySchema);

        if (!result.valid){
            let listOfErrors = result.errors.map(error => error.stack);
            throw new ExpressError(listOfErrors, 400);
        }
        
        let { name, num_employees, description, logo_url } = req.body

        let table = 'companies';
        let items = { name, num_employees, description, logo_url };
        let key = 'handle';
        let id = req.params.handle;

        let partialUpdateQuery = sqlForPartialUpdate(table, items, key, id);

        let company = await Company.patchCompany(partialUpdateQuery);

        if (company === undefined){
            throw new ExpressError(`No company with handle: ${id}`, 404);
        }

        return res.json({company});
        
    }
    catch(err){
        next(err);
    }

});

router.delete('/:handle', async function(req, res, next){
    try{
        let handle = req.params.handle;
        let deletedCompany = await Company.deleteCompany(handle);

        if(deletedCompany === undefined){
            throw new ExpressError(`No such company: ${handle}`,404);
        }

        return res.json({"message":"Company deleted"});
    }
    catch(err){
        next(err);
    }
});

module.exports = router;