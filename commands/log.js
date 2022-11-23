const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Get the logs'),
    async execute (interaction) {
        await interaction.reply('See the auto-logged list of reports: https://docs.google.com/spreadsheets/d/1uXH8o6QycUfiihnxAxDl9W5D88iwryj3HoxKGs5tWUM/edit#gid=0')
    }
}