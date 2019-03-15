process.env.NODE_ENV = "test";

const app = require("../../app");
const db = require("../../db");
const request = require("supertest");



beforeEach(async function () {
    await db.query(`INSERT INTO companies (handle, name, num_employees, description, logo_url)
                    VALUES ('TEST1', 'Test Co1', 1000, 'test description1', 'test_url1'),
                           ('TEST2', 'Test Co2', 2000, 'test description2', 'test_url2'),
                           ('TEST3', 'Test Co3', 3000, 'test description3', 'test_url3')`)


    await db.query(`INSERT INTO jobs (title, salary, equity, company_handle)
                    VALUES ('TESTER1', 1000, 0.1, 'TEST1'),
                           ('TESTER2', 2000, 0.2, 'TEST2'), 
                           ('TESTER3', 3000, 0.3, 'TEST3')`)
                           
});

afterEach(async function(){
    await db.query(`DELETE FROM companies`);
    await db.query(`DELETE FROM jobs`);
});

afterAll(async function(){
    await db.end();
});

describe("POST/jobs", function() {
    test("Create new job", async function(){
        const response = await request(app)
            .post('/jobs/')
            .send( { title: "TESTER4", salary: 4000, equity: 0.4, company_handle: "TEST3" })

        expect(response.statusCode).toBe(201);
        expect(response.body.job).toMatchObject({
            title: expect.any(String),
            salary: expect.any(Number),
            equity: expect.any(Number),
            company_handle: expect.any(String)
        });
    });

    test("throw error if company handle doesn't exist", async function(){
        const response = await request(app)
            .post('/jobs/')
            .send( { title: "TESTER5", salary: 5000, equity: 0.4, company_handle: "TEST0" })

        expect(response.statusCode).toBe(404);
        
        expect(response.body).toMatchObject({
            message: 'No company with handle TEST0',
            status: 404
        });
    });
    
    test("throw error when require fields are not provided", async function(){
        const response = await request(app)
            .post('/jobs/')
            .send( { title: "TESTER5" })

        expect(response.statusCode).toBe(400);
        
        expect(response.body).toMatchObject({
            message: expect.any(Array),
            status: 400
        });
    });
    
});
