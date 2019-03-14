/**  */


function buildSearchJobQuery({ search, min_salary, min_equity }){        
        
    let args = [];
    let params = [];
    
    if (search){
        args.push(`name ILIKE $${args.length + 1}`);
        params.push(`%${search}%`)
    }
    if (min_salary){
        args.push(`salary > $${args.length + 1}`);
        params.push(min_salary)
    }
    if (min_equity){
        args.push(`equity < $${args.length + 1}`)
        params.push(min_equity)
    }

    let query = `SELECT id, title 
                    FROM jobs`; 

    if (args.length > 0){
        query += ` WHERE ${args.join(' AND ')}`
    }

    return { query, params }
}

module.exports = buildSearchJobQuery;