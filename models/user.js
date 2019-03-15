const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_ROUNDS } = require("../config");
//FIXME

class User {
  static async addUser( {username, password, first_name, last_name, email, photo_url, is_admin = false }) {
    try {
      let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_ROUNDS);
      let result = await db.query(
        ` INSERT INTO users (username, password, first_name, last_name, email, photo_url, is_admin)
                      VALUES ($1, $2, $3, $4, $5, $6, $7)
                      RETURNING username, first_name, last_name, email, photo_url, is_admin
                    `,
        [
          username,
          hashedPassword,
          first_name,
          last_name,
          email,
          photo_url,
          is_admin
        ]
      );
      return result.rows[0];
    } catch (err) {
      throw { message: "username and email must be unique", status: 409 };
    }
  }

  static async getAllUsers(){
    let allUsers = await db.query(
        ` SELECT username, first_name, last_name, email
          FROM users
          ORDER BY username`
    );
    return allUsers.rows;
  }

  static async getByUsername(username){
      let user = await db.query(
          `SELECT username, first_name, last_name, email, photo_url
           FROM users
           WHERE username = $1`, [username]
      );
      return user.rows[0];
  }

  static async updateUser({ query, values }){
    try{
        const update = await db.query(query, values);
        return update.rows[0];
    } catch(err){
      if (err.message.includes("duplicate")){
        throw { message: "email must be unique",
                status: 409 }
        
      } else {
        throw { message: "Must update one of the following: first_name, last_name, email, photo_url",
                status: 400};
      }
    }
  }

  static async deleteUser(username){
      let deletedUser = await db.query(
          `DELETE from users
           WHERE username=$1
           RETURNING username`, [username]
      ); 
      return deletedUser.rows[0];
  }

  static async authenticate(username, password){
    const result = await db.query(
      `SELECT password, is_admin 
       FROM users
       WHERE username = $1`, [username]
    );
    const user = result.rows[0];
    if(user){
      
      if (await bcrypt.compare(password, user.password)){
        let is_admin =user.is_admin;
        return  { is_admin };
      } 
    }
    return false;
  }
}

module.exports = User;
