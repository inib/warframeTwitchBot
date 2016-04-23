#!/bin/env node
var ExpressServer = require('./expressServer.js');
var mongoose = require('mongoose');
var User = require('./schemas/users');

// Loadmission data 
var missions = require('./missions_parsed');
var missionCount = missions.missions.length;

// connect mongo
var mongo = require('./init/mongo')();

// connect twitter
var twitter = require('./init/twitter');

// connect twitch
var twitch = require('./init/twitch');
twitch.init();

// setup express
var publicDirectory = "www";
var expServer = new ExpressServer(publicDirectory);
expServer.init();
expServer.start();

twitch.client.on("chat", function (channel, user, message) {
    if (message.indexOf("!ping") === 0) {
        isGlobalAdmin(user.username, function () {
            twitch.client.say(channel, "Pong!");
        });
    }
    if (message.indexOf("!quit") === 0 && user.username == "alpinespielt" && channel == "#voidmichl") {
        twitch.client.say(channel, "Ok FeelsBadMan").then(twitch.client.disconnect().then(closeBot()));
    }
    if (message.indexOf("!ratelimit") === 0 && user.username == "alpinespielt" && channel == "#alpinespielt") {
        twitch.say('#alpinespielt', 'Prepare your Kreygasm');
        for (var i = 0; i < 80; i++) {
            twitch.say('#alpinespielt', 'Kappa 123..' + i);            
        }
        twitch.say('#alpinespielt', 'Banned? Kappa');  
    }
    if (message.match(/lebt\s*denn\s*der\s*alte\s*[\w\W+]+noch/ig)) {
        twitch.client.say(channel, "4Head - http://bit.ly/1NDpJoF");
    }
    if (message.indexOf("?randomizer") === 0) {
        isModerator(user.username, channel, function () {
            var numb = Math.floor((Math.random() * missionCount) + 1) - 1;
            twitch.client.say(channel, "Wie wär's mit " + missions.missions[numb].planet + " - " +
                missions.missions[numb].name + " - " + missions.missions[numb].type +
                " (" + missions.missions[numb].enemy + ", " + "Lvl " +
                missions.missions[numb].level.replace(/\s/g, "") + ")");
        });
    }
});

twitter.stream.on('tweet', function (tweet) {
    if (!tweet.retweeted_status) {
        twitch.client.say("#voidmichl", "SwiftRage AALAAARM: " + tweet.text);
    }
});

function isModerator(username, channel, call) {
    isGlobalAdmin(username, call);
    if (channel.slice(1) == username) {
        call();
    }
}

function isGlobalAdmin(username, call) {
    var admin = mongoose.model('User', User);
    var query = admin.findOne({ 'name': username });
    query.select('name isGlobalAdmin');
    query.exec(function (err, admin) {
        if (err || !admin) {
            if (err) {
                console.log(err);
            }                
            return;
        }
        if (admin.isGlobalAdmin) {
            call();
            return;
        }
    });
}

// handle exit
function setupTerminationHandlers() {
    //  Process on exit and signals.
    process.on('exit', function () { terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function (element, index, array) {
        process.on(element, function () { terminator(element); });
    });
}

function terminator(sig) {
    if (typeof sig === "string") {
        console.log('%s: Received %s - terminating sample app ...',
            Date(Date.now()), sig);
        process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
}

setupTerminationHandlers();


function closeBot() {
    console.log("Exiting...");
    process.exit(0);
}
