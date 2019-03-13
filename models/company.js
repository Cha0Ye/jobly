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

        let query = `SELECT handle, name 
                     FROM companies`; 

        if (args.length > 0){
            query += ` WHERE ${args.join(' AND ')}`
        }
        debugger
        const companiesResult = await db.query (
            query,
            params)

        return companiesResult.rows
    }
    
    static async addCompany({handle, name, num_employees, description, logo_url}){
        const result = await db.query(
            `INSERT INTO companies (handle, name, num_employees, description, logo_url) 
             VALUES ($1, $2, $3, $4, $5)
            RETURNING handle, name, num_employees, description, logo_url`, 
            [handle, name, num_employees, description, logo_url]);
            return result.rows[0];
    }

    static async patchCompany({query, values}){

        const update = await db.query(query, values);
        return update.rows[0];
    }


    static async getOneCompany(handle){
        
        let company = await db.query(
            `SELECT handle, name, num_employees, description, logo_url
             FROM companies
             WHERE handle=$1`,[handle]
        );
        return company.rows[0];
    }


    static async deleteCompany(handle){
        let deletedCompany = await db.query(
            `DELETE from companies 
            WHERE handle =$1
            RETURNING handle, name`,[handle]
        );
        return deletedCompany.rows[0];
    
    }
}

module.exports = Company;