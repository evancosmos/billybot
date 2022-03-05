const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('watchstatus')
		.setDescription('Get alerted when a user rich presence status changes')
		.addUserOption(option =>
			option.setName('userwatch')
			.setDescription('The user to watch')
			.setRequired(true)),
	async execute(interaction) {
		await interaction.reply('I scream for I am a bot');
	},
};
