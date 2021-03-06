require('dotenv').config()
var mysql = require('mysql2');
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
// console.log("Variable de entorno:");
// console.log("\t$MYSQL_HOST =", MYSQL_HOST);
// console.log("\t$MYSQL_DATABASE =", MYSQL_DATABASE);
// console.log("\t$MYSQL_USER =", MYSQL_USER);
// console.log("\t$MYSQL_PASSWORD =", MYSQL_PASSWORD, "\n")
const CONNECTION_OPTIONS = {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    connectTimeout: 30000
};

console.log("CONNECTION_OPTIONS",CONNECTION_OPTIONS);

module.exports =  class KeysDao {
    connection;
    constructor() {       
    }

    async select(userId, fields = ['*']) {  
        this.connection = mysql.createConnection(CONNECTION_OPTIONS);               
        var fields_str = fields.join(",")
        var query_str = `SELECT ${fields_str} FROM \`key\` WHERE user_id = ${userId}`;
        //console.log(`MySQL query: ${query_str}`);
        let promise = await new Promise((resolve, reject) => {
            this.connection.connect();
            this.connection.query(query_str, function (error, results, fields) {
                //console.log("DAO:",results)
                if (error) reject(error);
                if (!results) resolve("empty")
                else resolve(results[0])
            });
            this.connection.end();
        })
        return await promise;
    }

    async insert(userId,privateKey,publicKey) {  
        this.connection = mysql.createConnection(CONNECTION_OPTIONS);               
        var query_str = `INSERT INTO \`key\`(user_id,private, public)
        VALUES(
            ${userId},
            '${privateKey}',
            '${publicKey}'
        )`;
        //console.log(`MySQL query: ${query_str}`);
        let promise = await new Promise((resolve, reject) => {
            this.connection.connect();
            this.connection.query(query_str, function (error, results, fields) {
                if (error) reject(error);
                resolve(results)
            });
            this.connection.end();
        })
        return await promise;
    }    

    async update(userId,privateKey,publicKey) {  
        this.connection = mysql.createConnection(CONNECTION_OPTIONS);               
        var query_str = `UPDATE \`key\` SET private = '${privateKey}', public = '${publicKey}' WHERE user_id = ${userId}`;
        //console.log(`MySQL query: ${query_str}`);
        let promise = await new Promise((resolve, reject) => {
            this.connection.connect();
            this.connection.query(query_str, function (error, results, fields) {
                if (error) reject(error);
                resolve(results)
            });
            this.connection.end();
        })
        return await promise;
    }        

    async delete(userId) {  
        this.connection = mysql.createConnection(CONNECTION_OPTIONS);               
        var query_str = `DELETE FROM \`key\` WHERE user_id = ${userId}`;
        //console.log(`MySQL query: ${query_str}`);
        let promise = await new Promise((resolve, reject) => {
            this.connection.connect();
            this.connection.query(query_str, function (error, results, fields) {
                if (error) reject(error);
                resolve(results)
            });
            this.connection.end();
        })
        return await promise;
    }          

}

