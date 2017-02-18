var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');

// var connection
// connection.query('SELECT id, product_name, price, stock_quantity FROM products', function (error, results, fields)




// )

var connection = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : 'root',
 database : 'bamazon_db',
 PORT     : '8889'
});

connection.connect();

connection.query('SELECT id, product_name, price, stock_quantity FROM products', function (error, results, fields)
{	console.log(results);
 
 });

connection.end();



