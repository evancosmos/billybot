const {Collection} = require('discord.js');

//Global collection to keep track of current trackings
const userEye = new Collection();
exports.eye = userEye;
