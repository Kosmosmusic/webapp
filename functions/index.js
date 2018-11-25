const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

/*
*	Create and Deploy Cloud Functions
*	https://firebase.google.com/docs/functions/write-firebase-functions
*
*	basic usage example
*
* exports.helloWorld = functions.https.onRequest((request, response) => {
*		response.send('Hello from Firebase!');
*	});
*/

/**
 * Load .env variables.
 */
require('dotenv').load();

/**
 * Initialize admin SDK to access Firebase Realtime Database.
 */
admin.initializeApp(functions.config().firebase);

/**
 * Nodemailer usage notice:
 * To use Gmail you may need to configure "Allow Less Secure Apps" (https://www.google.com/settings/security/lesssecureapps)
 * in your Gmail account unless you are using 2FA
 * in which case you would have to create an Application Specific password (https://security.google.com/settings/security/apppasswords).
 * You may also need to unlock your account with "Allow access to your Google account" (https://accounts.google.com/DisplayUnlockCaptcha)
 * to use SMTP.
 */
const smtpConfig = {
	host: process.env.MAILER_HOST,
	port: process.env.MAILER_PORT,
	secure: true, // use SSL
	auth: {
		type: 'OAuth2',
		user: process.env.MAILER_EMAIL,
		clientId: process.env.MAILER_CLIENT_ID,
		clientSecret: process.env.MAILER_CLIENT_SECRET,
		refreshToken: process.env.MAILER_REFRESH_TOKEN,
		accessToken: 'empty'
	}
};

/**
 * Reusable transporter object using the default SMTP transport.
 */
const mailTransporter = nodemailer.createTransport(smtpConfig);
mailTransporter.verify((err, success) => {
	if (err) {
		console.log('Mail transporter diag error >>', err);
	} else {
		console.log('Mail transporter diag success >>', success);
	}
});

/**
 * Fallback function if mail transporter returns an error on sendEmail.
 */
function saveEmailToDB(name, email, header, message, domain, res) {
	const entry = { name, email, header, message, domain };
	admin.database().ref('/emails/messages').push(entry).then((snapshot) => {
		res.status(200).json({success: 'Your message was successfully sent'});
	}).catch((error) => {
		res.status(500).send('Error: try again later, please');
	});
}

/**
 * Send an email message using nodemailer.
 */
function sendEmail(name, email, header, message, domain, res) {
	const mailOptions = {
		from: '"KOS.MOS.MUSIC 👥" <' + process.env.MAILER_EMAIL +'>',
		to: process.env.MAILER_RECIPIENT_EMAIL_CONTACT,
		subject: `KOS.MOS.MUSIC: ${header} ✔`,
		text: `${message}\n\nMessage was sent from domain: ${domain}`,
		html: `<h3>${header}</h3><p>${message}</p><p>From: ${name} ${email}</p><p>Message was sent from domain: ${domain}</p>`
	};
	mailTransporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			// console.log('Mail transporter error:', err);
			/*
			*	do not report error to user yet
			*	try recording message to DB first
			*/
			// res.status(500).send('Mail transporter error');
			saveEmailToDB(name, email, header, message, domain, res);
		} else {
			// console.log('Message sent: ' + info.response);
			res.status(200).json({success: 'Your message was successfully sent'});
		}
	});
}

/**
 * Actual send email message cloud function.
 */
exports.sendEmail = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(403).json({error: 'Forbidden method'});
	}
	const name = req.body.name || '';
	const email = req.body.email || '';
	const header = req.body.header || '';
	const message = req.body.message || '';
	const domain = req.body.domain || '';
	if (name.length >= 2 && /\w{2,}@\w{2,}(\.)?\w{2,}/.test(email) && header.length >= 4 && message.length >= 50 && domain.length) {
		sendEmail(name, email, header, message, domain, res);
	} else {
		res.status(400).send('Missing mandatory request parameters or invalid values');
	}
});

/**
 * Fallback function if mail transporter returns an error on submitDemoOverEmail.
 */
function saveDemoToDB(email, link, domain, res) {
	const entry = { email, link, domain };
	admin.database().ref('/emails/demoSubmissions').push(entry).then((snapshot) => {
		res.status(200).json({success: 'Your message was successfully sent'});
	}).catch((error) => {
		res.status(500).send('Error: try again later, please');
	});
}

/**
 * Send a demo over email using nodemailer.
 */
function sendDemo(email, link, domain, res) {
	const mailOptions = {
		from: '"KOS.MOS.MUSIC 👥" <' + process.env.MAILER_EMAIL +'>',
		to: process.env.MAILER_RECIPIENT_EMAIL_DEMO,
		subject: `KOS.MOS.MUSIC: demo submission ✔`,
		text: `Soundcloud playlist link: ${link}\n\nFrom: ${email}\n\nMessage was sent from domain: ${domain}`,
		html: `<p>Soundcloud playlist link: ${link}</p><p>From: ${email}</p><p>Message was sent from domain: ${domain}</p>`
	};
	mailTransporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			// console.log('Mail transporter error:', err);
			/*
			*	do not report error to user yet
			*	try recording message to DB first
			*/
			// res.status(500).send('Mail transporter error');
			saveDemoToDB(email, link, domain, res);
		} else {
			// console.log('Message sent: ' + info.response);
			res.status(200).json({success: 'Your message was successfully sent'});
		}
	});
}

/**
 * Actual submit a demo over email cloud function.
 */
exports.sendDemo = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(403).json({error: 'Forbidden method'});
	}
	const email = req.body.email || '';
	const link = req.body.link || '';
	const domain = req.body.domain || '';
	if (/\w{2,}@\w{2,}(\.)?\w{2,}/.test(email) && /http(s)?:\/\/\w+/.test(link) && domain.length) {
		sendDemo(email, link, domain, res);
	} else {
		res.status(400).send('Missing mandatory request parameters or invalid values');
	}
});

/**
 * Fallback function if mail transporter returns an error on submitMasteringOrderOverEmail.
 */
function saveMasteringOrderToDB(email, link, domain, res) {
	const entry = { email, link, domain };
	admin.database().ref('/emails/masteringOrders').push(entry).then((snapshot) => {
		res.status(200).json({success: 'Your message was successfully sent'});
	}).catch((error) => {
		res.status(500).send('Error: try again later, please');
	});
}

/**
 * Send a mastering order over email using nodemailer.
 */
function sendMasteringOrder(email, link, domain, res) {
	const mailOptions = {
		from: '"KOS.MOS.MUSIC 👥" <' + process.env.MAILER_EMAIL +'>',
		to: process.env.MAILER_RECIPIENT_EMAIL_MASTERING,
		subject: `KOS.MOS.MUSIC: mastering order ✔`,
		text: `Soundcloud playlist link: ${link}\n\nFrom: ${email}\n\nMessage was sent from domain: ${domain}`,
		html: `<p>Soundcloud playlist link: ${link}</p><p>From: ${email}</p><p>Message was sent from domain: ${domain}</p>`
	};
	mailTransporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			// console.log('Mail transporter error:', err);
			/*
			*	do not report error to user yet
			*	try recording message to DB first
			*/
			// res.status(500).send('Mail transporter error');
			saveMasteringOrderToDB(email, link, domain, res);
		} else {
			// console.log('Message sent: ' + info.response);
			res.status(200).json({success: 'Your message was successfully sent'});
		}
	});
}

/**
 * Actual send a mastering order over email cloud function.
 */
exports.sendMasteringOrder = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(403).json({error: 'Forbidden method'});
	}
	const email = req.body.email || '';
	const link = req.body.link || '';
	const domain = req.body.domain || '';
	if (/\w{2,}@\w{2,}(\.)?\w{2,}/.test(email) && /http(s)?:\/\/\w+/.test(link) && domain.length) {
		sendMasteringOrder(email, link, domain, res);
	} else {
		res.status(400).send('Missing mandatory request parameters or invalid values');
	}
});

/**
 * Fallback function if mail transporter returns an error on sendBookingRequest.
 */
function saveBookingRequestToDB(date, venueName, venueCapacity, venueAddress, venueWebsite,
	eventName, eventWebsite, ticketCost, lineup, start, end, stageTime, fee, artistsBookedEarlier,
	company, contact, email, phone, website, domain, res) {
		const entry = {
			date, venueName, venueCapacity, venueAddress, venueWebsite,
			eventName, eventWebsite, ticketCost, lineup, start, end, stageTime, fee, artistsBookedEarlier,
			company, contact, email, phone, website, domain
		};
		admin.database().ref('/emails/bookingRequests').push(entry).then((snapshot) => {
			res.status(200).json({success: 'Your message was successfully sent'});
		}).catch((error) => {
			res.status(500).send('Error: try again later, please');
		});
}

/**
 * Send a booking request over email using nodemailer.
 */
function sendBookingRequest(date, venueName, venueCapacity, venueAddress, venueWebsite,
	eventName, eventWebsite, ticketCost, lineup, start, end, stageTime, fee, artistsBookedEarlier,
	company, contact, email, phone, website, domain, res) {
		const mailOptions = {
			from: '"KOS.MOS.MUSIC 👥" <' + process.env.MAILER_EMAIL +'>',
			to: process.env.MAILER_RECIPIENT_EMAIL_BOOKING,
			subject: `KOS.MOS.MUSIC: booking request ✔`,
			text: `
- Venue\n\n
Date: ${date}\n\n
Venue name: ${venueName}\n\n
Venue capacity: ${venueCapacity}\n\n
Venue address: ${venueAddress}\n\n
Venue website: ${venueWebsite}\n\n
- Event\n\n
Event name: ${eventName}\n\n
Event website: ${eventWebsite}\n\n
Ticket cost: ${ticketCost}\n\n
Lineup: ${lineup}\n\n
Start: ${start}\n\n
End: ${end}\n\n
Stage time: ${stageTime}\n\n
Fee: ${fee}\n\n
Artists booked earlier: ${artistsBookedEarlier}\n\n
- Promoter\n\n
Company: ${company}\n\n
Contact: ${contact}\n\n
Email: ${email}\n\n
Phone: ${phone}\n\n
Website: ${website}\n\n
Message was sent from domain: ${domain}`,
			html: `
<h3>Venue</h3>
<p>Venue name: ${venueName}</p>
<p>Venue capacity: ${venueCapacity}</p>
<p>Venue address: ${venueAddress}</p>
<p>Venue website: ${venueWebsite}</p>
<h3>Event</h3>
<p>Event name: ${eventName}</p>
<p>Event website: ${eventWebsite}</p>
<p>Ticket cost: ${ticketCost}</p>
<p>Lineup: ${lineup}</p>
<p>Start: ${start}</p>
<p>End: ${end}</p>
<p>Stage time: ${stageTime}</p>
<p>Fre: ${fee}</p>
<p>Artists booked earlier: ${artistsBookedEarlier}</p>
<h3>Promoter</h3>
<p>Company: ${company}</p>
<p>Contact: ${contact}</p>
<p>Email: ${email}</p>
<p>Phone: ${phone}</p>
<p>Website: ${website}</p>
<p>Message was sent from domain: ${domain}</p>`
		};
		mailTransporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				// console.log('Mail transporter error:', err);
				/*
				*	do not report error to user yet
				*	try recording message to DB first
				*/
				// res.status(500).send('Mail transporter error');
				saveBookingRequestToDB(date, venueName, venueCapacity, venueAddress, venueWebsite,
					eventName, eventWebsite, ticketCost, lineup, start, end, stageTime, fee, artistsBookedEarlier,
					company, contact, email, phone, website, domain, res);
			} else {
				// console.log('Message sent: ' + info.response);
				res.status(200).json({success: 'Your message was successfully sent'});
			}
		});
}

/**
 * Actual submit a booking request over email cloud function.
 */
exports.sendBookingRequest = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(403).json({error: 'Forbidden method'});
	}

	const date = req.body.date || '';
	const venueName = req.body.venueName || '';
	const venueCapacity = req.body.venueCapacity || '';
	const venueAddress = req.body.venueAddress || '';
	const venueWebsite = req.body.venueWebsite || '';
	const eventName = req.body.eventName || '';
	const eventWebsite = req.body.eventWebsite || '';
	const ticketCost = req.body.ticketCost || '';
	const lineup = req.body.lineup || '';
	const start = req.body.start || '';
	const end = req.body.end || '';
	const stageTime = req.body.stageTime || '';
	const fee = req.body.fee || '';
	const artistsBookedEarlier = req.body.artistsBookedEarlier || '';
	const company = req.body.company || '';
	const contact = req.body.contact || '';
	const email = req.body.email || '';
	const phone = req.body.phone || '';
	const website = req.body.website || '';
	const domain = req.body.domain || '';

	if (/\w{2,}@\w{2,}(\.)?\w{2,}/.test(email) && domain.length) {
		sendBookingRequest(date, venueName, venueCapacity, venueAddress, venueWebsite,
			eventName, eventWebsite, ticketCost, lineup, start, end, stageTime, fee, artistsBookedEarlier,
			company, contact, email, phone, website, domain, res);
	} else {
		res.status(400).send('Missing mandatory request parameters or invalid values');
	}
});

/**
 * Save subscriber's email to DB.
 */
function saveEmailSubscription(email, domain, res) {
	const entry = { email, domain };
	admin.database().ref('/emailSubscriptions').push(entry).then((snapshot) => {
		res.status(200).json({success: 'You were successfully subscribed to KOS.MOS.MUSIC mailling list'});
	}).catch((error) => {
		res.status(500).send('Error: try again later, please');
	});
}

/**
 * Actual save email subscription cloud function.
 */
exports.saveEmailSubscription = functions.https.onRequest((req, res) => {
	if (req.method !== 'POST') {
		res.status(403).json({error: 'Forbidden method'});
	}
	const email = req.body.email || '';
	const domain = req.body.domain || '';
	if (/\w{2,}@\w{2,}(\.)?\w{2,}/.test(email) && domain.length && b_3eeba7cfe8388b91c662bdf95_8cca3229c8 === '') {
		saveEmailSubscription(email, domain, res);
	} else {
		res.status(400).send('Missing mandatory request parameters or invalid values');
	}
});

const radio = require('radio-stream');
const radioClients = [];

/**
 * Bassdrive proxy.
 */
exports.bassdriveProxy = functions.https.onRequest((req, res) => {
	if (req.method !== 'GET') {
		res.status(403).json({error: 'Forbidden method'});
	}
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
});
