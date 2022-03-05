const { SlashCommandBuilder } = require('@discordjs/builders');
const { eye } = require('../userEye');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('seewatchers')
		.setDescription('Get the map of all watcher watchee pairs'),
	async execute(interaction) {
        let finalout = "Current watchings:\n";
        eye.forEach( (watcher, watchee) =>
            finalout += watcher.username + ' is watching ' + watchee.username + '\n'
        );
		await interaction.reply(finalout);
	},
};