const express = require('express');
const ExpressError = require('../helpers/expressError');
const Job = require('../models/job')
const sqlForPartialUpdate = require('../helpers/partialUpdate');

const jsonschema = require('jsonschema');
const postJobSchema = require('../schemas/postJob.json');
const patchJobSchema = require('../schemas/patchJob.json')
const { authenticateJWT, ensureLoggedIn, ensureCorrectUser} = require('../middleware/auth');

const router = express.Router();

router.post("/", async function(req, res, next) {
    try{
        let result = jsonschema.validate(req.body, postJobSchema);

        if (!result.valid){
            let listOfErrors = result.errors.map(error => error.stack);
            throw new ExpressError(listOfErrors, 400);
        }
        const { title, salary, equity, company_handle } = req.body;
        let job = await Job.addJob({ title, salary, equity, company_handle });
        return res.status(201).json({ job });
    }
    catch(err){
        return next(err);
    }
});

router.get("/", async function(req, res, next) {
    try{
        let { search, min_salary, min_equity } = req.query;
        if (min_salary && !Number.isFinite(+min_salary) || min_equity && !Number.isFinite(+min_equity)){
            throw new ExpressError("min_salary and min_equity must be numbers", 400);
        }
    
        let jobs = await Job.searchByQuery({ search, min_salary, min_equity });
        return res.json({ jobs }); 
    }
    catch(err){
        next(err);
    }
});

router.get('/:id', async function(req, res, next){
    try{
        let id = req.params.id;
        let job = await Job.getById(id);

        if (job === undefined){
            throw new ExpressError(`No job with id: ${id}`, 404);
        }

        return res.json({ job });
    }
    catch(err){
        return next(err);
    }
});

router.patch("/:id", async function(req, res, next){
    try{
        debugger;
        let result = jsonschema.validate(req.body, patchJobSchema);

        if (!result.valid){
            let listOfErrors = result.errors.map(error => error.stack);
            throw new ExpressError(listOfErrors, 400);
        }
        
        let { title, salary, equity } = req.body

        let items = { title, salary, equity };
        let id = req.params.id;

        let partialUpdateQuery = sqlForPartialUpdate('jobs', items, 'id', id);

        let job = await Job.updateJob(partialUpdateQuery);

        if (job === undefined){
            throw new ExpressError(`No job with id: ${id}`, 404);
        }

        return res.json({ job });
        
    }
    catch(err){
        next(err);
    }

});

router.delete('/:id', async function(req, res, next){
    try{
        let id = req.params.id;
        let deletedJob = await Job.deleteJob(id);

        if(deletedJob === undefined){
            throw new ExpressError(`No such job: ${id}`,404);
        }

        return res.json({"message":"Job deleted"});
    }
    catch(err){
        next(err);
    }
});

module.exports = router;