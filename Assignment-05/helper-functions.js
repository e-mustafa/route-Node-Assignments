import mysql from 'mysql2/promise';

// helper functions
export async function runStep(connection, query, message, params = []) {
	try {
		const result = await connection.query(query, params);
		if (message) console.log(`✔ ${message}`);
		return result;
	} catch (error) {
		console.error(`❌ Error in: ${message}\n`, error.message);
		throw error;
	}
}
export async function connectDB(config = {}) {
	try {
		const connection = await mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			// multipleStatements: true, // Enable to execute multiple queries in one go
			...config,
		});
		console.log('✔ 📞 Database connected successfully');
		return connection;
	} catch (error) {
		console.error('❌ Error creating database connection:', error);
		throw error;
	}
}

export async function createDB(connection, dbName = 'retail_store') {
	await runStep(connection, `CREATE DATABASE IF NOT EXISTS ${dbName}`, 'Database created successfully');
	await runStep(connection, `USE ${dbName}`, 'Using database');
}
