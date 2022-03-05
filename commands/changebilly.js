const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changebilly')
		.setDescription('asd'),
	async execute(interaction) {
		console.log(interaction.client.options.presence)
	},
};