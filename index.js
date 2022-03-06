// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents, DiscordAPIError } = require('discord.js');
const { token, createrId } = require('./config.json');
const { eye } = require('./userEye');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGES] });

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

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

// Login to Discord with your client's token
client.login(token);

client.on('presenceUpdate', (oldPresence, newPresence) => {
	if(eye.has(newPresence.user)){ //see if anyone is watching for the user
		//dm user who was watching
		let alertThisUser = eye.get(newPresence.user);
		let newDM = alertThisUser.createDM();

		if((newPresence)&&(newPresence.activities[0] != null)){
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
	if(false){
		console.log('inside wideeye');
		let alertThisUser = client.users.resolve(createrId);
		let newDM = alertThisUser.createDM();

		if((newPresence)&&(newPresence.activities[0] != null)&&(newPresence.activities[0] != NaN)){
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
});
