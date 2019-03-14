const express = require('express');
const ExpressError = require('../helpers/expressError');
const Job = require('../models/job')
const sqlForPartialUpdate = require('../helpers/partialUpdate');

const jsonschema = require('jsonschema');
const postJobSchema = require('../schemas/postJob.json');

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

module.exports = router; 