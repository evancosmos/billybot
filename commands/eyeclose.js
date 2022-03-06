const { SlashCommandBuilder } = require('@discordjs/builders');
const { eye } = require('../userEye');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eyeclose')
		.setDescription('Stop getting alerted when a user presence changes')
		.addUserOption(option =>
			option.setName('userwatch')
			.setDescription('The user to stop watching')
			.setRequired(true)),
	async execute(interaction) {
		let watcher = interaction.user;
		let watchee = interaction.options.getUser('userwatch');

        if(eye.has(watchee)){
            eye.delete(watchee);
            await interaction.reply('Stopped watching ' + watchee.username);   
        }
        else{
            await interaction.reply('Already not watching user');
        }
	},
};