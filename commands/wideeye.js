const { SlashCommandBuilder } = require('@discordjs/builders');
const { createrId } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wideeye')
		.setDescription('Dev command to get all presence data'),
	async execute(interaction) {
		if(interaction.user.id == createrId){
            if(wideI){
                wideI = false;
                await interaction.reply('Wideeye toggled off');
            }
            else{
                wideI = true;
                await interaction.reply('Wideeye toggled on');
            }
        }
        else{
            await interaction.reply('Sorry, this is only for extromes debugging');
        }
	},
};