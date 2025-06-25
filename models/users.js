const pool = require("../Database/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require('jsonwebtoken')

class User {
  constructor(id, username, email, password, role, is_verified, 
    verification_token, token_expires_at, password_reset_token, 
    password_reset_expires_at, created_at) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.is_verified = is_verified;
    this.verification_token = verification_token;
    this.token_expires_at = token_expires_at;
    this.password_reset_token = password_reset_token;
    this.password_reset_expires_at = password_reset_expires_at;
    this.created_at = created_at;
  }

  // Create a new user
  static async Create(userdata) {
    const { email, username, password } = userdata;

    const saltVal = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltVal);

    const verification_token = crypto.randomBytes(40).toString('hex');
    const token_expires_at = new Date(Date.now() + 1000 * 60 * 60);

    const password_reset_token = crypto.randomBytes(10).toString('hex');
    const password_reset_expires_at = new Date(Date.now() + 1000 * 60 * 60);
    
    // Define created_at
    const created_at = new Date();

    const query = `
      INSERT INTO users (
        username,
        email,
        password,
        role,
        is_verified,
        verification_token,
        token_expires_at,
        password_reset_token,
        password_reset_expires_at,
        created_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING id, username, email, password, role, is_verified, 
                verification_token, token_expires_at, password_reset_token,
                password_reset_expires_at, created_at;
    `;

    const values = [
      username,
      email,
      hashedPassword,
      "user", // role
      false, // is_verified
      verification_token,
      token_expires_at,
      password_reset_token,
      password_reset_expires_at,
      created_at
    ];

    try {
      const result = await pool.query(query, values);
      console.log(result);
      const user = result.rows[0];
       
      return new User(
        user.id, 
        user.username, 
        user.email,          
        user.password, 
        user.role, 
        user.is_verified, 
        user.verification_token, 
        user.token_expires_at,
        user.password_reset_token, 
        user.password_reset_expires_at,
        user.created_at
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async findByUser(username){
    const query = `SELECT * FROM users WHERE username=$1 RETURNING id, username, password, role`;

    try {
         const result = await pool.query(query, [username]);
         const user = result.rows[0];
         return new User(
          user.id, 
          user.username, 
          user.email,          
          user.password, 
          user.role, 
          user.is_verified, 
          user.verification_token, 
          user.token_expires_at,
          user.password_reset_token, 
          user.password_reset_expires_at,
          user.created_at
         )
    } 
    catch(error){
        throw new Error(error)
    };
  }

  static async findByEmail(email){
    const query = 'SELECT * FROM users WHERE email = $1'

    try{
      const result = pool.query(query, [email])
      const user = result.rows[0]
      return new User(
        user.id, 
        user.username, 
        user.email,          
        user.password, 
        user.role, 
        user.is_verified, 
        user.verification_token, 
        user.token_expires_at,
        user.password_reset_token, 
        user.password_reset_expires_at,
        user.created_at
      )
    } catch(error){
      throw new Error(error)
    }
  }

  static async findAll(){
    const query = 'SELECT id, username, email, role FROM users';

    try {
      const result = await pool.query(query);
      return result.rows;
    }
    catch(error){
      throw error;
    }
   
  }

  async update(updates){
    const fields = [];
    const values = [];
    let paramcount = 1;

    for(const [key,value] of Object.entries(updates)){

      if(key=== 'password') {
        const hashedPassword = await bcrypt.hash(value, 10)
        fields.push(`key=$${paramcount}`)
        values.push(hashedPassword)
      } else {
        fields.push(`key= $${paramcount}`)
        values.push(value)
      }
       paramcount ++;
    }
    values.push(this.id)

    const query = `UPDATE TABLE SET ${fields.join(', ')} WHERE id=${paramcount}`

    try{

      const result = pool.query(query, values)
      const user = result.rows[0]
      return new User(
         user.id, 
        user.username, 
        user.email,          
        user.password, 
        user.role, 
        user.is_verified, 
        user.verification_token, 
        user.token_expires_at,
        user.password_reset_token, 
        user.password_reset_expires_at,
        user.created_at
      );
    }
    catch(error){
      console.log(error)
    }  
  }

  async comparePassword(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
  }

  createJWT(){
    return jwt.sign({userId: this.id
      , email: this.email}, process.env.JWT_SECRET, {
      expiresIn:'30d'
    })
  
  }
 
}

module.exports = { User };