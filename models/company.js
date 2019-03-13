const partialUpdateSQL = require('../helpers/partialUpdate');
const db = require('../db');

class Company {

    async static searchByQuery({search_term, min_employees, max_employees}){
        
        let args = [];
        let params = [];
        
        if (search_term){
            args.push(`name ILIKE %$${args.length + 1}%`);
            params.push(search_term)
        }
        if (min_employees){
            args.push(`num_employees > $${args.length + 1}`);
            params.push(min_employees)
        }
        if (max_employees){
            args.push(`num_employees < $${args.length + 1}`)
            params.push(max_employees)
        }

        let query = `SELECT handle, name
        FROM companies`; 

        if (args.length > 0){
            query += ` WHERE ${args.join(' AND ')}`
        }
        
        const companiesResult = await db.query (
            query,
            params)

        return companiesResult.rows

    } 
}

module.exports = Company;