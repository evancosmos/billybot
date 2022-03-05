const { SlashCommandBuilder } = require('@discordjs/builders');
const { eye } = require('../userEye');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('watchstatus')
		.setDescription('Get alerted when a user rich presence status changes')
		.addUserOption(option =>
			option.setName('userwatch')
			.setDescription('The user to watch')
			.setRequired(true)),
	async execute(interaction) {
		let watcher = interaction.user;
		let watchee = interaction.options.getUser('userwatch');
		eye.set(watchee, watcher); //make sure watchee is key, since that's what the presence updater is looking at
		await interaction.reply(watcher.username + ' is now watching ' + watchee.username);
	},
};
