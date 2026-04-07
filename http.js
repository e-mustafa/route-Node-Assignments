import http from 'http';

const server = http.createServer((req, res) => {
	// res.write('<h1 style="text-align: center; color: blue;">Welcome to the HTTP Server</h1>');

	const { url, method } = req;

	console.log({ url, method });

	if (url == '/user' && user == 'GET') {
		res.write('Get user');
	} else if (url == '/user' && user == 'POST') {
		res.write('Create user');
	} else if (url == '/user' && user == 'PUT') {
		res.write('Fully update user');
	}

	res.end();
});

server.listen(3000, () => {
	console.log('Server is running');
});

import path from 'node:path';

// console.log('OS Type:', os.type());
// console.log('Platform:', os.platform());
// console.log('Architecture:', os.arch());
// console.log('CPU Info:', os.cpus().length, 'cores');
// console.log('Total Memory:', (os.totalmem() / 1024 / 1024).toFixed(2), 'MB');
// console.log('Free Memory:', (os.freemem() / 1024 / 1024).toFixed(2), 'MB');
// console.log('Uptime:', os.uptime(), 'seconds');
// console.log('User Info:', os.userInfo());
// console.log('Home Dir:', os.homedir());
// console.log('Hostname:', os.hostname());
// console.log('Network Interfaces:', os.networkInterfaces());

const pathFile = '/folder1/folder2/folder3/folder4/file.js';
const pathFile3 = 'folder1\folder2\folder3\folder4\file.js';
const pathFile2 = 'folder1/folder2/folder3/folder4';

console.log(path.basename(pathFile, '.jsx'));
console.log(path.parse(pathFile));
console.log(path.matchesGlob(pathFile, pathFile3));
console.log(path.normalize(pathFile));
console.log('=========', path.resolve(pathFile2, '/../file.js'));
console.log('=========', path.join(pathFile2, '/../file.js'));

console.log(path.join(pathFile2, 'file.js'));
console.log(path.resolve(pathFile2, 'file.js'));

// const {dirname as __dirname, filename as __filename, url} = import.meta
const { filename: __filename, dirname: __dirname } = import.meta;

console.log('__filename', __filename);
console.log('__dirname', __dirname);

// console.log('--dirname:', __dirname);
// console.log('--filename:', __filename)
// console.log('--url:', url);

// console.log(fileURLToPath(url));
// console.log(path.normalize(dirname));
console.log(path.sep);

console.log();

// console.log('url: ', url.);

import EventEmitter from 'events';
import { createReadStream } from 'node:fs';

const emitter = new EventEmitter();

emitter.on('payment', () => {
	console.log('Send receipt email');
});

emitter.on('payment', () => {
	console.log('Send receipt email');
});
emitter.on('payment', () => {
	console.log('Send receipt email');
});
emitter.on('payment', () => {
	console.log('Send receipt email');
});
emitter.on('payment2', () => {
	console.log('Update sales report');
});

emitter.on('payment3', () => {
	console.log('Update sales report');
});

console.log('emitter: ', emitter.eventNames( ));
console.log('emitter: ', emitter.listeners('payment'));
console.log('emitter: ', emitter.listenerCount('payment'));

emitter.off('payment');

emitter.emit('payment');

const readStream = createReadStream('./read.txt', {
	start: 0,
	highWaterMark: 5,
	autoClose: true,
});

readStream.on('open', () => {
	console.log('open');
});

readStream.on('data', (data) => {
	console.log('before data ---');
	console.log({ data });
	console.log('after data ---');
});

console.log('-----:', createReadStream('./read.txt') instanceof EventEmitter);
