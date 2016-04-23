var mongoose = require('mongoose');

var channelSchema = mongoose.Schema({
    name: { type: String, required: true, set: channelSanitizer, unique: true },
    isHome: { type: Boolean, required: false, default: false },
    joinOnConnect: { type: Boolean, required: false, default: false },
    commandsEnabled: { type: [String], required: false, default: [] },
    modulesEnabled: { type: [String], required: false, default: [] },
    mods: { type: [String], required: false, default: [] }
});

function channelSanitizer(params) {
    var name = params.toLowerCase();
    if(name.indexOf('#') === 0) {
        return name;
    }
    else { 
        return '#' + name;
    }
}

module.exports = mongoose.model('Channel', channelSchema);