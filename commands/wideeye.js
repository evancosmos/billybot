const { SlashCommandBuilder } = require('@discordjs/builders');
var { wideI } = require('../userEye');
const { createrId } = require('../config.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('wideeye')
		.setDescription('Admin command to get all presence data'),
	async execute(interaction) {
		if(interaction.user.id == createrId){
            if(wideI == true){
                wideI = false;
            }
            else{
                wideI = true;
            }
		    await interaction.reply('Wideeye toggled');
        }
        else{
            await interaction.reply('Sorry, this is only for extromes debugging');
        }
	},
};