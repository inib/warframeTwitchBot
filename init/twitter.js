var Twit = require('twit');

// twitter settings
var twitterClient = new Twit({
    consumer_key: process.env.TWITTER_CONS_KEY,
    consumer_secret: process.env.TWITTER_CONS_SECRET,
    access_token: process.env.TWITTER_ACC_TOKEN,
    access_token_secret: process.env.TWITTER_ACC_SECRET
});

var warframeAlertsID = '1344755923';
var twitterStream = twitterClient.stream('statuses/filter', { follow: warframeAlertsID });

twitterStream.on('connect', function (request) {
    console.log("Twitter Stream: Connecting...");
});

twitterStream.on('connected', function (response) {
    console.log("Twitter Stream: Connected!");
});

twitterStream.on('reconnect', function (request, response, connectInterval) {
    console.log("Twitter Stream: Reconnecting");
});

twitterStream.on('error', function (error) {
    console.log("Twitter Stream ERROR: " + error);
});

module.exports = {
    stream: twitterStream
};