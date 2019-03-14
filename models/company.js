const buildSearchQuery = require('../helpers/buildSearchQuery');
const db = require('../db');

class Company {

    static async searchByQuery({search, min_employees, max_employees}){
        
        let {query, params} = buildSearchQuery({search, min_employees, max_employees});
        
        const companiesResult = await db.query (
            query,
            params)

        return companiesResult.rows
    }
    
    static async addCompany({handle, name, num_employees, description, logo_url}){
        try {
            const result = await db.query(
                `INSERT INTO companies (handle, name, num_employees, description, logo_url) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING handle, name, num_employees, description, logo_url`, 
                [handle, name, num_employees, description, logo_url]);
                return result.rows[0];
        } catch(err) {
            throw { message: "Company handle and name must be unique", 
                    status: 409 };
        }
    }

    static async patchCompany({query, values}){

        try {

        const update = await db.query(query, values);
            
        return update.rows[0];
        } catch (err) {
            throw { message: "Must update at least one of the following: name, num_employees, description, logo_url", 
                    status: 400 }
        }
    
    }
    


    static async getByHandle(handle){
        
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