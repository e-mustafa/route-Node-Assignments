import express from 'express';
import fs from 'fs/promises';
// Assignment4 // express

// Part1:Simple CRUD Operations Using Express.js:
// ı.For all the following tasks, you must use the fs module to read and write data from a JSON file (e.g.,
// users.json). Do not store or manage data using arrays. (2 Grades)

const PORT = 3000;
const app = express();

app.use(express.json());

const getData = async (filepath = './users.json') => {
	try {
		const data = await fs.readFile(filepath, 'utf8');
		const parsedData = JSON.parse(data) || [];
		return parsedData;
	} catch (error) {
		console.error('error ReadFile: ', error.message);
		return [];
	}
};

const setData = async (data, filepath = './users.json') => {
	try {
		const strData = JSON.stringify(data);
		console.log('data', data);
		console.log('strData', strData);
		await fs.writeFile(filepath, strData, {
			encoding: 'utf8',
		});
	} catch (error) {
		console.error('error ReadFile: ', error.message);
	}
};
// 1. Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before)(1
// Grades)
// o URL: POST /user

app.post('/user', async (req, res) => {
	try {
		const { name, age, email } = req.body;

		if (!email || !name || !age) {
			return res.status(200).res.json({ message: 'please! json full data' });
		}

		const data = await getData();

		const isExist = data?.some((e) => e.email == email);

		if (isExist) {
			return res.status(409).res.json({ message: 'This email already exist' });
		}

		data.push({ id: Date.now(), email, name, age });

		await setData(data);

		return res.status(201).json({ message: 'User added successfully.' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// 2. Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the params. (1 Grade)
// Note: Remember to update the corresponding values in the JSON file
// o URL: PATCH /user/:id

app.patch('/user/:id', async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).res.json({ message: 'Please Provide user id' });
		}

		const { name, age, email } = req.body;

		const data = await getData();

		if (!name && !email && !age) {
			return res.status(400).res.json({ message: 'Please provide some data' });
		}

		const index = data.findIndex((e) => e.id == id);

		if (index == -1) {
			return res.status(404).res.json({ message: 'User ID not found.' });
		}

		if (email) {
			const existEmail = data?.some((e) => e.email == email && e.id != id);

			if (existEmail) {
				return res.status(409).res.json({ message: 'This email already exist' });
			}
		}

		email && (data[index].email = email);
		name && (data[index].name = name);
		age && (data[index].age = age);

		await setData(data);

		return res.status(200).res.json({ message: 'User updated successfully.' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// 3. Create an API that deletes a User by ID. The user id should be retrieved from either the request body or optional params. (1 Grade)
// Note: Remember to delete the user from the file
// o URL: DELETE /user{/:id}

app.delete('/user/:id', async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).res.json({ message: 'Please Provide user id' });
		}

		const data = await getData();

		const index = data.findIndex((e) => e.id == id);

		if (index == -1) {
			return res.status(404).res.json({ message: 'User ID not found.' });
		}

		data.splice(index, 1);
		await setData(data);

		return res.status(200).res.json({ message: 'User deleted successfully.' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// 4. Create an API that gets a user by their name. The name will be provided as a query parameter. (1 Grade)
// o URL: GET /user/getByName

app.get('/user/getByName', async (req, res) => {
	try {
		const { name } = req.query;
		if (!name) {
			return res.status(400).res.json({ message: 'Please provide a user name.' });
		}

		const data = await getData();

		const user = data.find((e) => e.name.toLowerCase().includes(name.toLowerCase()));

		if (!user) {
			return res.status(404).res.json({ message: 'User name not found.' });
		}

		return res.status(200).res.json(user);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// 5. Create an API that gets all users from the JSON file. (1 Grade)
// o URL: GET /user

app.get('/user', async (req, res) => {
	try {
		const data = await getData();

		return res.status(200).res.json(data);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// 6. Create an API that filters users by minimum age. (1 Grade)
// o URL: GET /user/filter

app.get('/user/filter', async (req, res) => {
	try {
		const { minAge } = req.query;

		if (!minAge) {
			return res.status(400).res.json({ message: 'Please enter min age.' });
		}

		const data = await getData();

		const result = data.filter((e) => e.age >= minAge);

		if (!result.length) {
			return res.status(404).res.json({ message: 'No user found.' });
		}

		return res.status(200).res.json(result);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

// 7. Create an API that gets User by ID. (1 Grade)
// o URL: GET /user/:id

app.get('/user/:id', async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).res.json({ message: 'Please provide user ID.' });
		}

		const data = await getData();

		const user = data.find((e) => e.id == id);

		if (!user) {
			return res.status(404).res.json({ message: 'User not found.' });
		}

		return res.status(200).res.json(user);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`server running on port: ${PORT}`);
});

// Part 2: ERD Diagram (1 Grade)
// Musicana records have decided to store information on musicians who perform on their albums in
// a database. The company has wisely chosen to hire you as a database designer.
// o Each musician that is recorded at Musicana has an ID number,a name, an address (street, city) and a phone number.
// o Each instrument that is used in songs recorded at Musicana has a unique name and a musical key (e.g., C, B-flat, E-flat).
// o Each album that is recorded at the Musicana label has a unique title, a copyright date, and an album identifier.
// o Each song recorded at Musicana has a unique title and an author.
// o Each musician may play several instruments, and a given instrument may be played by several musicians.
// o Each album has a number of songs on it, but no song may appear on more than one album.
// o Each song is performed by one or more musicians, and a musician may perform a number of songs.
// o Each album has exactly one musician who acts as its producer.
// o A producer may produce several albums.

// <-- ERD diagram image attached in the assignment folder

// Important Notes about postman
// 1. Name the endpoint with a meaningful name like 'Add User', not dummy names.
// 2. Save your changes on each request( ctrl+s ).
// 3. Include the Postman collection link (export your Postman collection ) in the email with your assignment link

// Postman Collection Link
// https://documenter.getpostman.com/view/49016393/2sBXqCNNpe

// Bonus (2 Grades)
// How to deliver the bonus?
// 1- Solve the problem Longest Common Prefix on LeetCode
// 2- Inside your assignment folder, create a SEPARATE FILE and name it“bonus.js”
// 3- Copy the code that you have submitted on the website inside ”bonus.js” file
