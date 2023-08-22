/**
 * FORMAT by druloloy | git@github.com/druloloy
 */

const dotenv = require('dotenv');
dotenv.config();

const rateLimit = require('express-rate-limit');
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 5000;

// init express
const app = express();
app.use(express.json()); // to handle api calls responses in json format
app.use(cors()); 

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
});

//  apply to all requests
app.use(limiter);

// serve views
app.use(express.static('views'));

// routes
app.use('/api/v1/chat', require('./routes/chat.route'));

app.use(errorHandler); // should always be the last middleware
// no more middleware after this one

// init server and listen
const serverHandler = () => {
    console.log('Server is running on port: ', PORT);
}
const server = app.listen(PORT, serverHandler);


/**
 * For handling unhandled rejections, 
 * for additional security and debugging efficiency
 */
const rejectionHandler = (err) => {
    console.warn('Server timed out.');
	console.log(`ERROR LOG: ${err}`);

	/**Close the server if an error is unhandled. */
	server.close(_=>process.exit(0));		
}
process.on('unhandledRejection', rejectionHandler);

