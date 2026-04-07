// Assignment 3

import { createReadStream, createWriteStream, promises as fs } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import zlib from 'zlib';

// let q = 0;

// Part1: Core Modules ( 1.5 Grades)
// 1. Use a readable stream to read a file in chunks and log each chunk. (0.5 Grade)
// • Input Example: "./big.txt"
// • Output Example: log each chunk

const readStream = (filePath) => {
	const fileName = path.basename(filePath);
	const readStream_1 = createReadStream(filePath, { encoding: 'utf8', highWaterMark: 5, start: 0 });

	readStream_1.on('open', () => {
		console.log(`\n Question ${1}: --------------------------------------`);
		console.log(`The file: ${fileName} opened`);
	});

	readStream_1.on('ready', () => {
		console.log(`The file: ${fileName} ready to Read`);
	});

	readStream_1.on('data', (chunk) => {
		console.log('chunk data: ', chunk);
	});

	readStream_1.on('end', () => {
		console.log(`The file: ${fileName} read ended`);
	});

	readStream_1.on('error', (error) => {
		console.log(`\n Question ${1}: --------------------------------------`);

		console.log('error while reading file q1', error.message);
	});
};

readStream('./Assignment-03/big.txt');

// 2. Use readable and writable streams to copy content from one file to another. (0.5 Grade)
// • Input Example: "./source.txt", "./dest.txt"
// • Output Example: File copied using streams

const readWriteStream = (filePath, distFile) => {
	const readStream_2 = createReadStream(filePath, { encoding: 'utf8', highWaterMark: 5 });
	const writeStream_2 = createWriteStream(distFile, 'utf8');
	readStream_2.on('data', (chunk) => {
		writeStream_2.write(chunk);
	});

	readStream_2.on('error', (error) => {
		console.log(`\n Question ${2}: --------------------------------------`);
		console.log('something went wrong while coping File', error.message);
	});

	readStream_2.on('end', () => {
		console.log(`\n Question ${2}: --------------------------------------`);
		console.log('File copied using streams');
	});
};

readWriteStream('./Assignment-03/source.txt', './Assignment-03/dest.txt');

// 3. Create a pipeline that reads a file, compresses it, and writes it to another file. (0.5 Grade)
// • Input Example: "./data.txt", "./data.txt.gz"

async function createPipeline(filePath, distFile) {
	try {
		await pipeline(createReadStream(filePath), zlib.createGzip(), createWriteStream(distFile));
		console.log(`\n Question ${3}: --------------------------------------`);
		console.log(`File "${path.basename(filePath)}" compressed Successfully`);
	} catch (error) {
		console.log(`\n Question ${3}: --------------------------------------`);
		console.log('error while comprising a file');
	}
}

createPipeline('./Assignment-03/data.txt', './Assignment-03/data.txt.gz');

// Part2: Simple CRUD Operations Using HTTP ( 5.5 Grades):
// For all the following APIs, you must use the fs module to read and write data from a JSON file (e.g., users.json).
// Do not store or manage data using arrays (0.5 Grades).

const readDataFromFile = async (filePath = './Assignment-03/users.json') => {
	try {
		const data = await fs.readFile(filePath, 'utf8');

		return JSON.parse(data);
	} catch (error) {
		console.log('Error occurred while reading file:', error.message || error);
	}
};

const writeDataToFile = async (data, filePath = './Assignment-03/users.json') => {
	try {
		await fs.writeFile(filePath, JSON.stringify(data), 'utf8');
	} catch (error) {
		console.log('Error occurred while write file:', error.message || error);
	}
};

const getUser = async (req, res) => {
	const id = path.basename(req.url);
	const data = await readDataFromFile();

	const user = data.find((e) => e.id == id);

	if (!user) {
		res.write(JSON.stringify({ message: 'user not found!' }));
		return res.end();
	}

	res.write(JSON.stringify(user));
	return res.end();
};

const addUser = (req, res) => {
	let user = '';
	req.on('data', (chunk) => {
		user += chunk;
	});

	req.on('end', async () => {
		const data = await readDataFromFile();
		const { email, name, age } = JSON.parse(user);

		const exist = data.some((e) => e.email == email);

		if (exist) {
			res.write(JSON.stringify({ message: 'This email already exist!' }));

			return res.end();
		}

		data.push({ id: data[data.length - 1].id + 1, email, name, age });

		await writeDataToFile(data);

		// res.write();
		return res.end(JSON.stringify({ message: 'User added successfully' }));
	});
};

const editUser = async (req, res) => {
	let userData = '';

	req.on('data', (chunk) => (userData += chunk));

	req.on('end', async () => {
		const id = path.basename(req.url);
		console.log('id', id);

		const data = await readDataFromFile();
		const index = data.findIndex((e) => e.id == id);

		if (index === -1) {
			res.write('wrong id');
			return res.end();
		}

		const { email, name, age } = JSON.parse(userData);

		const exist = data.findIndex((e) => e.email === email && e.id != id);

		if (exist !== -1) {
			res.write(JSON.stringify({ message: 'This email already exist!' }));
			return res.end();
		}

		data[index] = { ...data[index], email, name, age };

		await writeDataToFile(data);

		res.write(JSON.stringify({ message: 'User updated successfully' }));
		return res.end();
	});
};

const deleteUser = async (req, res) => {
	const id = path.basename(req.url);
	const data = await readDataFromFile();

	const index = data.findIndex((e) => e.id == id);
	if (index === -1) {
		return res.end(JSON.stringify({ message: 'user not found' }));
	}

	data.splice(index, 1);

	return res.end(JSON.stringify({ message: 'user deleted successfully' }));
};

// 1. Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before) (1 Grade)
// o URL: POST /user

// 2. Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the URL (1 Grade)
// Note: Remember to update the corresponding values in the JSON file
// o URL: PATCH /user/id

// 3. Create an API that deletes a User by ID. The user id should be retrieved from the URL (1 Grade)
// Note: Remember to delete the user from the file
// o URL: DELETE /user/id

// 4. Create an API that gets all users from the JSON file. (1 Grade)
// o URL: GET /user

// 5. Create an API that gets User by ID. (1 Grade)
// o URL: GET /user/:id

const server = http.createServer(async (req, res) => {
	const url = req.url;
	const method = req.method;

	if (url === '/user' && method === 'GET') {
		const data = await readDataFromFile();
		res.end(JSON.stringify(data));
		return res.end();
	} else if (url.startsWith('/user')) {
		if (method == 'POST') {
			addUser(req, res);
		} else if (method == 'GET') {
			getUser(req, res);
		} else if (method == 'PATCH') {
			editUser(req, res);
		} else if (method == 'DELETE') {
			deleteUser(req, res);
		}
	}
});

server.listen(3000, () => console.log('Server start on port 3000'));

// Part3: Node Internals (3 Grades):
// 1. What is the Node.js Event Loop? (0.5 Grade)
console.log(`\n Question ${1}: --------------------------------------`);

const eventLoop = `
- allows nodejs to perform non-blocking I/O operations without blocking the main thread.
- watch the call stack and th callback queue
	- if the call stack is not empty it will push the callback to the callback queue and wait until the call stack is empty
	- when the call stack is empty it will push the first callback in the callback queue to the call stack to be executed

`;

console.log(eventLoop);

// 2. What is Libuv and What Role Does It Play in Node.js? (0.5 Grade)
console.log(`\n Question ${2}: --------------------------------------`);

const libuv = `
Libuv is a C library
- manage Event loop
- handel asynchronous operations
- mange thread pool
is a C library that provides Node.js with an event-driven architecture and a thread pool for handling asynchronous operations.

`;

console.log(libuv);

// 3. How Does Node.js Handle Asynchronous Operations Under the Hood? (0.5 Grade)
console.log(`\n Question ${4}: --------------------------------------`);
const asyncOps = `
- Node.js send asynchronous operations to libuv to be handled
- Libuv offLoad the operation to the underlying system or thread pool
- node continue executing the rest of code without waiting
- once the operation is complete libuv will push the callback to the event queue
- the event loop will check if the call stack is empty if it is empty it will push the first callback in the event queue to the call stack to be executed.

`;
console.log(asyncOps);

// 4. What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js? (0.5 Grade)
console.log(`\n Question ${4}: --------------------------------------`);
const difference = `
- Call Stack: execute the code line by line, using the main thread, with LIFO (Last In, First Out) order.

- Event Queue: holds the callbacks that are waiting to be executed, with FIFO (First In, First Out) order.

- Event Loop: continuously checks for pending events and executes their associated callbacks when they are ready, allowing Node.js to perform non-blocking

`;

console.log(difference);

// 5. What is the Node.js Thread Pool and How to Set the Thread Pool Size? (0.5 Grade)
console.log(`\n Question ${5}: --------------------------------------`);
const threadPool = `
Libuv has a thread pool that is used to handel cpu-bound tasks and some asynchronous operations that cannot be performed in a non-blocking manner, such as file system operations.

- the default thread pool size is 4 threads
- we can change the thread pool size by change the value of "UV_THREADPOOL_SIZE", FE: UV_THREADPOOL_SIZE=8

`;
console.log(threadPool);

// 6. How Does Node.js Handle Blocking and Non-Blocking Code Execution? (0.5 Grade)
console.log(`\n Question ${6}: --------------------------------------`);
const b_nb = `
- Blocking code: prevents the event loop from processing other events until the blocking operation is complete,  such as synchronous file system operations.
- Non-Blocking code: allows the event loop to continue processing other events while waiting for the non-blocking operation to complete, such as asynchronous file system operations

`;
console.log(b_nb);

// important Notes about postman
// 1. Name the endpoint with a meaningful name like 'Add User', not dummy names.
// 2. Save your changes on each request( ctrl+s ).
// 3. Include the Postman collection link (export your Postman collection ) in the email with your assignment link
