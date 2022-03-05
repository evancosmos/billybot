// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents, DiscordAPIError } = require('discord.js');
const { token } = require('./config.json');
const { eye } = require('./userEye');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.DIRECT_MESSAGES] });

client.commands = new Collection();

//Getting the js commands files from the directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
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

client.on('presenceUpdate', (oldPresence, newPresence) => {
	if(eye.has(newPresence.user)){ //see if anyone is watching for the user
		//dm user who was watching
		let alertThisUser = eye.get(newPresence.user);
		let newDM = alertThisUser.createDM();

		if((newPresence.activities[0])&&(oldPresence.activities[0])){
			newDM.then( dmvalue =>
			dmvalue.send(newPresence.user.toString() + ' is done with ' + oldPresence.activities[0].name + ' and is now doing ' + + newPresence.activities[0].name)
			);
		}
		else if(newPresence.activities[0]){
			newDM.then( dmvalue =>
			dmvalue.send(newPresence.user.toString() + ' is now doing ' + newPresence.activities[0].name)
			);
		}
		else if(oldPresence.activities[0]){
			newDM.then( dmvalue => 
			dmvalue.send(newPresence.user.toString() + ' is done with ' + oldPresence.activities[0].name)
			);
		}
		else{
			newDM.then( dmvalue => 
				dmvalue.send(newPresence.user.toString() + ' has changed their presence')
			);
		}
		console.log('Alerted: ' + alertThisUser.username);
		
		eye.delete(newPresence.user)
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
