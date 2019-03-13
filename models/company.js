const partialUpdateSQL = require('../helpers/partialUpdate');
const db = require('../db');

class Company {

    static async searchByQuery({search, min_employees, max_employees}){
        
        let args = [];
        let params = [];
        
        if (search){
            args.push(`name ILIKE $${args.length + 1}`);
            params.push(`%${search}%`)
        }
        if (min_employees){
            args.push(`num_employees > $${args.length + 1}`);
            params.push(min_employees)
        }
        if (max_employees){
            args.push(`num_employees < $${args.length + 1}`)
            params.push(max_employees)
        }

        let query = `SELECT handle, name FROM companies`; 

        if (args.length > 0){
            query += ` WHERE ${args.join(' AND ')}`
        }
        debugger
        const companiesResult = await db.query (
            query,
            params)

        return companiesResult.rows

    } 
}

module.exports = Company;