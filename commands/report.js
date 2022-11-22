const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report a user')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to report')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Report reason')
                .setRequired(true)),
	async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');

        await interaction.reply(`User reported: ${target} by ${interaction.user.username} for reason: ${reason}`);
        console.log(target)
        console.log(interaction)
	},
};
