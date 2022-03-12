const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roommute')
		.setDescription('Toggles users ability to speak in current vc'),
	async execute(interaction) {
        //TODO: add check that bot has permissions.

        if(!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))){ //TODO: fix
            await interaction.reply("Admin Permissions Required");
            return;
        }
        if(!(interaction.member.voice.channel)){
            await interaction.reply("You're not in a voice channel");
            return;
        }

        const every1role = interaction.guild.roles.everyone;
        const togCheck = interaction.member.voice.channel.permissionsFor(every1role);
        
        if(togCheck.has(Permissions.FLAGS.SPEAK)){
            interaction.member.voice.channel.permissionOverwrites.edit(every1role,
                {
                   SPEAK: false
                });
    
            await interaction.reply("Room mute toggled on");
        }
        else{
            interaction.member.voice.channel.permissionOverwrites.edit(every1role,
                {
                   SPEAK: true
                });
    
            await interaction.reply("Room mute toggled off");
        }
	},
};