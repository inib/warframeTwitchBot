var express = require('express');

ExpressServer.prototype.init = (function () {
    this.initialize();
});

ExpressServer.prototype.start = (function () {
    this.startServer();
});


function ExpressServer (pubDir) {

    var self = this;

    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };

    self.createRoutes = function() {
        self.routes = { };
        
        self.routes['/health'] = function(req, res) {
            res.send('1');
        };
        
        self.routes['/cache'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
    };    
    
    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.initializeServer();
        var oneDay = 86400000;
        self.app.use('/', express.static(__dirname + '/' + pubDir + '/', { maxAge: oneDay }));
    };

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };

    /**
     *  Start the server (starts up the sample application).
     */
    self.startServer = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Express server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };
} 

module.exports = ExpressServer;