const http = require('http');
const radio = require('radio-stream');
const radioClients = [];
const fs = require('fs');

const server = http.createServer((req, res) => {
	if (/index.html/.test(req.url)) {
		let indexHtml;
		fs.readFile(__dirname + '/index.html', (err, data) => {
			if (err) throw err;
			indexHtml = data;
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			res.end(indexHtml);
		});
	} else {
		const shoutCastUrl = 'http://bassdrive.radioca.st/stream?type=http&nocache=80576';
		const stream = radio.createReadStream(shoutCastUrl);
		stream.on('connect', () => {
			console.log('Radio stream connected');
			console.log('stream.headers', stream.headers);
		});
		stream.on('data', (chunk) => {
			if (radioClients.length) {
				for (const item in radioClients) {
					radioClients[item].write(chunk);
				}
			}
		});
		stream.on('metadata', (title) => {
			console.log('title', title);
		});
		res.writeHead(200, {
			'Content-Type': 'audio/mpeg',
			'Transfer-Encoding': 'chunked'
		});
		radioClients.push(res);
		console.log('Client connected, streaming');
	}
});

server.listen('8080', '127.0.0.1');
console.log('server listening on 127.0.0.1:8080');
