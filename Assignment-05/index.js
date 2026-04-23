// Assignment5
import express from 'express';
import { connectDB, createDB } from './helper-functions.js';

const PORT = 3000;

const app = express();

app.use(express.json());

// Part 1: ERD Diagram (1 Grade)

// <-- ERD diagram image attached with assignment - 4

// Part2: Design a schema (Mapping) for the following ERD. (Use any design tool you want)
// (1 Grade)

// 👈🏻👈🏻👈🏻👈🏻 <-- Assignment-5-mapping.png
// or 🔗🔗🔗🔗 https://drive.google.com/file/d/1ZwdarqWoDuD3fof44zaZW1O7L4xO_aan/view?usp=sharing

const dbName = 'assignment_5_retail_store_mustafa_ahmed';

// Part 3: (Using Node.js and MySQL) Answer the Questions below based on the given Scenario
// The small retail store needs a database to manage information about its products, suppliers, and sales.
// Database Requirements

// 1. Products Table:
// o ProductID: Unique identifier for each product (integer, primary key, auto-increment).
// o ProductName: Name of the product (text).
// o Price: Price of the product (decimal).
// o StockQuantity: Quantity of the product in stock (integer).
// o SupplierID: ID of the supplier providing the product (integer, foreign key referencing Suppliers).

// 2. Suppliers Table:
// o SupplierID: Unique identifier for each product (integer, primary key, auto-increment).
// o SupplierName: Name of the supplier (text).
// o ContactNumber: Supplier’s contact number (text).

// 3. Sales Table:
// o SaleID: Unique identifier for each product (integer, primary key, auto-increment).
// o ProductID: Reference to the product sold (integer, foreign key referencing Products).
// o QuantitySold: Quantity of the product sold (integer).
// o SaleDate: Date of sale (date).

async function createDBTables(connection) {
	// create Suppliers tables
	await connection.query(
		`CREATE TABLE IF NOT EXISTS Suppliers (
				id INT PRIMARY KEY AUTO_INCREMENT,
				name VARCHAR(100) NOT NULL,
				contact_no INT
			);`,
	);
	console.log('✔ Suppliers table created successfully');

	// create products table
	await connection.query(
		`CREATE TABLE IF NOT EXISTS Products (
				id INT PRIMARY KEY AUTO_INCREMENT,
				name varchar(200) NOT NULL,
				price decimal(10, 2) NOT NULL,
				quantity INT,
				supplier_id INT,
				FOREIGN KEY(supplier_id) REFERENCES Suppliers(id)
			);`,
	);
	console.log('✔ products table created successfully');

	// create sales table
	await connection.query(
		`CREATE TABLE IF NOT EXISTS Sales (
				id INT PRIMARY KEY AUTO_INCREMENT,
				quantity INT,
				sale_date DATE,
				
				product_id INT,
				FOREIGN KEY(product_id) REFERENCES Products(id)
			)`,
	);
	console.log('✔ sales table created successfully');
}

async function setupDatabase() {
	const connection = await connectDB();

	try {
		// create database if not exists
		await createDB(connection, dbName);

		// create tables
		await createDBTables(connection);
	} catch (error) {
		console.error('❌ Error setting up database:', error);
	} finally {
		connection.end();
	}
}

// (Using Node.js and MySQL) generate queries that perform the following tasks (8 Grades):
// 1- Create the required tables for the retail store database based on the tables structure and relationships. (0.5 Grade)
async function executeQueries() {
	const connection = await connectDB();
	try {
		// create database if not exists
		await createDB(connection, dbName);

		// 2- Add a column “Category” to the Products table. (0.5 Grade)
		await connection.query(
			`ALTER TABLE products 
			ADD COLUMN category VARCHAR(100)`,
		);
		console.log('✔ Category column added successfully');

		// 3- Remove the “Category” column from Products. (0.5 Grade)
		await connection.query(
			`ALTER TABLE products 
			DROP COLUMN category`,
		);
		console.log('✔ Category column removed successfully');

		// 4- Change “ContactNumber” column in Suppliers to VARCHAR (15). (0.5 Grade)
		await connection.query(
			`ALTER TABLE suppliers
			MODIFY contact_no VARCHAR(15)`,
		);
		console.log('✔ ContactNumber column modified successfully');

		// 5- Add a NOT NULL constraint to ProductName. (0.5 Grade)
		await connection.query(
			`ALTER TABLE products
			MODIFY name VARCHAR(255) NOT NULL`,
		);

		// 6- Perform Basic Inserts: (0.5 Grade)
		// a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
		const addSupplier = await connection.query(
			`INSERT INTO suppliers (name, contact_no) 
				VALUES
					('FreshFoods', '01001234567')
			`,
		);
		console.log(`✔ Supplier added successfully with ID: ${addSupplier[0].insertId}`);

		// b. Insert the following three products, all provided by 'FreshFoods':
		// i. 'Milk' with a price of 15.00 and stock quantity of 50.
		// ii. 'Bread' with a price of 10.00 and stock quantity of 30.
		// iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
		const addProducts = await connection.query(
			`INSERT INTO products (name, price, quantity, supplier_id)
			VALUES
				('Milk', 15, 50, (SELECT id FROM suppliers WHERE suppliers.name = 'FreshFoods')),
				('Bread', 10, 30, (SELECT id FROM suppliers WHERE suppliers.name = 'FreshFoods')),
				('Eggs', 20, 40, (SELECT id FROM suppliers WHERE suppliers.name = 'FreshFoods'))
			`,
		);
		console.log(`✔ Products added successfully with ID: ${addProducts[0].insertId}`);

		// c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.
		const addSale = await connection.query(
			`INSERT INTO sales (quantity, product_id, sale_date)
			VALUES
				(
					2, 
					(SELECT id FROM products WHERE products.name ='Milk') , 
					'2025-05-20'
				)
			`,
		);
		console.log(`✔ Sale added successfully with ID: ${addSale[0].insertId}`);

		// 7- Update the price of 'Bread' to 25.00. (0.5 Grade)
		await connection.query(
			`UPDATE products 
				SET price = 25
				WHERE name = 'Bread'
			`,
		);
		console.log('✔ Price of Bread updated successfully');

		// 8- Delete the product 'Eggs'. (0.5 Grade)
		await connection.query(
			`DELETE from products
			WHERE name = 'Eggs'`,
		);
		console.log('✔ Product "Eggs" deleted successfully');

		// 9- Retrieve the total quantity sold for each product. (0.5 Grade)
		const retrieve = await connection.query(
			`SELECT 
				p.name AS productName, SUM(s.quantity) AS total_quantity_sold
				FROM products p
			LEFT JOIN sales s ON p.id = s.product_id
			GROUP BY p.name
			`,
		);
		console.log('✔ Task 9 executed successfully!');
		console.log('retrieve', retrieve[0]);

		// 10-Get the product with the highest stock. (0.5 Grade)
		const highestStock = await connection.query(
			`SELECT * FROM products
			WHERE quantity = (SELECT MAX(quantity) FROM Products)`,
		);
		console.log('highest product Stock', highestStock[0]);

		// 11-Find suppliers with names starting with 'F'. (0.5 Grade)
		const suppliersWithF = await connection.query(
			`SELECT * from suppliers
				WHERE name LIKE 'F%'`,
		);

		console.log('✔ Task 11 executed successfully!');
		console.log('Suppliers with names starting with F:', suppliersWithF[0]);

		// 12-Show all products that have never been sold. (0.5 Grade)
		const productsNotSold = await connection.query(
			`SELECT * FROM products
				WHERE id NOT IN (SELECT DISTINCT product_id FROM sales)`,
		);

		console.log('✔ Task 12 executed successfully!');
		console.log('Products that have never been sold:', productsNotSold[0]);

		// 13-Get all sales along with product name and sale date. (0.5 Grade)
		const productsWithSales = await connection.query(
			`select * FROM sales
				LEFT JOIN Products on sales.product_id = products.id
				GROUP BY products.name`,
		);

		console.log('✔ Task 13 executed successfully!');
		console.log('All sales with product names and sale dates:', productsWithSales[0]);

		// 14-Create a user “store_manager” and give them SELECT, INSERT, and UPDATE permissions on all tables. (0.5 Grade)
		await connection.query(
			`CREATE USER IF NOT EXISTS 'store_manager'@'localhost'
			IDENTIFIED BY 'password123'`,
		);
		console.log('✔ User "store_manager" created successfully!');

		await connection.query(
			`GRANT
				SELECT, INSERT, UPDATE
			ON ${dbName}.* 
			TO 'store_manager'@'localhost'`,
		);
		console.log('✔ Permissions (SELECT, INSERT, UPDATE) granted to "store_manager" successfully!');

		// 15-Revoke UPDATE permission from “store_manager”. (0.5 Grade)
		await connection.query(
			`REVOKE
				UPDATE
			ON ${dbName}.* 
			FROM 'store_manager'@'localhost'`,
		);
		console.log('✔ UPDATE permission revoked from "store_manager" successfully!');

		// 16-Grant DELETE permission to “store_manager” only on the Sales table. (0.5 Grade)
		await connection.query(
			`GRANT
				DELETE
			ON ${dbName}.Sales
			TO 'store_manager'@'localhost'`,
		);
		console.log('✔ DELETE permission granted to "store_manager" on the Sales table successfully!');

		console.log('🚀 All tasks executed successfully!');
	} catch (error) {
		console.error('❌ Error setting up database:', error);
	} finally {
		connection.end();
	}
}

await setupDatabase();
executeQueries();

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Bonus (2 Grades)
// How to deliver the bonus?
// 1- Solve the problem Customer Who Visited but Did Not Make Any Transactions on LeetCode
// 2- Inside your assignment folder, create a SEPARATE FILE and name it “bonus.txt”
// 3- Copy the code that you have submitted on the website inside ”bonus.txt” file
