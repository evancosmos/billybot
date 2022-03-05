// Require the necessary discord.js classes
const fs = require('node:fs');
const { Client, Collection, Intents, DiscordAPIError } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES] });

client.commands = new Collection();
client.curWatch = new Collection();

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
	if((client.curWatch.find(newPresence.userId) != undefined)){ //see if anyone is watching for the user
		console.log(newPresence.user.toString() + ' is now doing ' + newPresence.activities[0].toString());
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
