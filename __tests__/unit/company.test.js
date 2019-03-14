process.env.NODE_ENV = 'test';
const Company = require('../../models/company');
const db = require('../../db');

beforeEach(async function () {
    await db.query(`INSERT INTO companies (handle, name, num_employees, description, logo_url)
                    VALUES ('TEST1', 'Test Co1', 1000, 'test description1', 'test_url1'),
                           ('TEST2', 'Test Co2', 2000, 'test description2', 'test_url2'),
                           ('TEST3', 'Test Co3', 3000, 'test description3', 'test_url3')`)
});

afterEach(async function(){
    await db.query(`DELETE FROM companies`);
});

afterAll(async function(){
    await db.end();
});

describe("Company.searchByQuery()", async function() {
    test("gets all companies", async function(){
        let search = undefined;
        let min_employees = undefined;
        let max_employees = undefined;

        const response = await Company.searchByQuery({ search, min_employees, max_employees });

        expect(response).toHaveLength(3);
        expect(response[0]).toHaveProperty('handle');
        expect(response[0]).toHaveProperty('name');
    });

    test("gets 1 company by search term", async function(){
        let search = "1";
        let min_employees = undefined;
        let max_employees = undefined;

        const response = await Company.searchByQuery({ search, min_employees, max_employees });

        expect(response).toHaveLength(1);
        expect(response[0]).toEqual({handle: "TEST1", name: "Test Co1"})
    });

    test("gets 2 companies by search term and max_employees", async function(){
        let search = "Test";
        let min_employees = undefined;
        let max_employees = 2500;

        const response = await Company.searchByQuery({ search, min_employees, max_employees });
        const expected = [{handle:'TEST3', name:'Test Co3'}]

        expect(response).toHaveLength(2);
        expect(response).toEqual(expect.not.arrayContaining(expected))
    });

    test("gets 1 company by search term, min_employees, and max_employees", async function(){
        let search = "Test";
        let min_employees = 1500;
        let max_employees = 2500;

        const response = await Company.searchByQuery({ search, min_employees, max_employees });
        const expected = [{handle:'TEST1', name:'Test Co1'}, {handle:'TEST3', name:'Test Co3'}]

        expect(response).toHaveLength(1);
        expect(response).toEqual(expect.not.arrayContaining(expected))
    });
})

