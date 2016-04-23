var tmijs = require('tmi.js');
var RateLimiter = require('limiter').RateLimiter;
var bucket = new RateLimiter(100, 30 * 1000, true);
var softLimiter = new RateLimiter(2, 1000);
var hardLimiter = new RateLimiter(5, 10000);
var softLimited = false;
var hardLimited = false;


var defaultChannels = ["#alpinespielt", "#voidmichl"];
var options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "voidmichl",
        password: process.env.TWITCH_OAUTH
    },
    channels: defaultChannels
};

var twitchClient = new tmijs.client(options);

function tokenChat(channel, message) {
    bucket.removeTokens(1, function (err, remainingRequests) {
        if (remainingRequests < 5) {
            console.log('Remaining tokens: ' + remainingRequests);
        }
        else if (remainingRequests < 15) {
            softLimited = true;
            hardLimited = false;
            twitchClient.say(channel, message);
            console.log('Remaining tokens: ' + remainingRequests);
        }
        else if (remainingRequests < 50) {
            softLimited = false;
            hardLimited = true;
            twitchClient.say(channel, message);
            console.log('Remaining tokens: ' + remainingRequests);
        }
        else {
            twitchClient.say(channel, message);
            softLimited = false;
            hardLimited = false;
        }
    });
}

function limitChat(channel, message) {
    if (hardLimited) {
        hardLimited.        
        console.log('Hard Limited chat!');
    }
    else if (softLimited) {
                
        console.log('Soft Limited chat!');
    }
    else {
        tokenChat(channel, message);
    }
}

function initTwitch() {
    if (twitchClient.readyState() == "CLOSED") {
        twitchClient.connect();
        return;
    }
    else {
        return;
    }
}

module.exports = {
    client: twitchClient,
    say: function (chan, msg) {
        limitChat(chan, msg);
    },
    init: function () {
        initTwitch();
    }
};

