// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents, DiscordAPIError } = require('discord.js');
const { token, createrId } = require('./config.json');
const { eye } = require('./userEye');

//global vars
var wideI = false;
var reaptedGuildUsers = new Collection();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

//Attach to client to keep organized
client.commands = new Collection();

//Getting the js commands files from the directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
	client.commands.set("dev" + command.data.name, command); //commands that only appear on dev guild
}

const commandFiles2 = fs.readdirSync('./non-global').filter(file => file.endsWith('.js'));

for (const file of commandFiles2) {
	const command = require(`./non-global/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);

function removeReaptedUser(userDelInput){
	reaptedGuildUsers.delete(userDelInput);
};

client.on('presenceUpdate', (oldPresence, newPresence) => {
	if(reaptedGuildUsers.has(newPresence.user)){ //Prevents multi-pinging and presence change spamming
		return;
	}
	else{
		reaptedGuildUsers.set(newPresence.user);
		setTimeout(removeReaptedUser, 1000, (newPresence.user));
	}

	if(eye.has(newPresence.user)){ //see if anyone is watching for the user
		//dm user who was watching
		let alertThisUser = eye.get(newPresence.user);
		let newDM = alertThisUser.createDM();

		if((newPresence)&&(newPresence.activities[0] != null)&&(newPresence.activities[0].name != 'NaN')){
			newDM.then( dmvalue =>
			dmvalue.send(newPresence.user.toString() + ' is now doing ' + + newPresence.activities[0].name)
			);
		}
		else if(newPresence){
			newDM.then( dmvalue =>
			dmvalue.send(newPresence.user.toString() + ' is now ' + newPresence.status)
			);
		}
		console.log('Alerted: ' + alertThisUser.username);
		
	}
	if(wideI){
		let alertThisUser = client.users.resolve(createrId);
		let newDM = alertThisUser.createDM();

		if((newPresence)&&(newPresence.activities[0] != null)&&(newPresence.activities[0].name != 'NaN')){
			newDM.then( dmvalue =>
			dmvalue.send(newPresence.user.toString() + ' is now doing ' + + newPresence.activities[0].name)
			);
		}
		else if(newPresence){
			newDM.then( dmvalue =>
			dmvalue.send(newPresence.user.toString() + ' is now ' + newPresence.status)
			);
		}
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}

	/* if(command.data.name = 'exeye'){
		wideI = command.wideBool();
	} */
});
