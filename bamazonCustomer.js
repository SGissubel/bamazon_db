var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');

var order = [];

var connection = mysql.createConnection({
	host	: 'localhost',
	user	: 'root',
	password: 'root',
	database: 'bamazon_db'
});

connection.connect();




var startOrder = function() {

    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function (error, results) 
    {
        // output results into terminal cleanly.
        for (var i = 0; i < results.length; i++) {
            var productID = results[i].id;
            var productName = results[i].product_name;
            var price = results[i].price;
            var productObj = {id: productID, product_name: productName, price: price};

            console.log("Product ID: " + productID + " Product Name: " + productName + " Price: " + price);
        };

        // begin prompt to take order
        inquirer.prompt([{
        type: "input",
        name: "product_id",
        message: "Please enter the product ID you would like to purchase: ",
        validate: function(value) {
                  if (isNaN(value) === false && value > 0 && value < results.length + 1) {
                    return true;
                  } else {
                      return false;
                  }    
              }    
        }, {
        type: "input",
        name: "purchase_quant",
        message: "Quantity you want to purchase: ",
        validate: function(value) {
                  if (value > 0) {
                    return true;
                  } else {
                      return false;
                }
            }
        }]).then(function(data) {
            var id = data.product_id;
            var quant = data.purchase_quant;
            var item_name = results[id - 1].product_name;
            var item_price = results[id - 1].price;
            var item = {};

            if (results[id - 1].stock_quantity - quant < 0 ) {
                console.log("\nYour order could not be placed. We do not have enough in stock.\n");
                startOrder();
            } else {
            	console.log(quant, id);
                connection.query("UPDATE products SET stock_quantity = (stock_quantity - " + quant + ") WHERE id = " + id, function (error, results) 
                {
                    if (error) {
                        return console.log("There was an error updating the products table.");
                    };
                });

                connection.query("INSERT INTO sales (product_id, quantity_purchased) VALUES (" + id + ", " + quant + ")", function (error, results) 
                {
                    if (error) {
                        return console.log("Error inserting into sales table.");
                    };
                });

                item["item"] = item_name;
                item["price"] = item_price;
                item["quantity"] = quant;

                order.push(item);

                shopMore();

            };
        });
    });
}   

function shopMore() {
	inquirer.prompt([{
		type: "confirm",
	  	name: "shopMore",
	  	message: "Do you want to shop more?".bold,
	  	}]).then(function(data) {
	  		if(!data.shopMore){
	  			checkOut();
	  		} else {
	  			startOrder();
	  		};
	  	});
};




function checkOut(){
	var total = 0;
	console.log("Your Purchase:".bold);
	for (var i = 0; i < order.length; i++){
		console.log("Product: ".bold + order[i].item + " Quantity: ".bold + order[i].quantity + " Price: ".bold + order[i].price);
		total += order[i].price * order[i].quantity;
	};
	console.log("Total: ".bold + total);
	connection.end();
}


startOrder();














// ***********************************