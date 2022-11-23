const { SlashCommandBuilder, message } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
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
    async execute(message, args) {
       let member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.member;
       let avatar = member.user.displayAvatarURL({ size: 1024, dynamic: true });

       const embed = new Discord.MessageEmbed()
        .setTitle(`${member.user.username}'s Avatar`)
        .setImage(avatar)
        .setColor("BLACK")
        .setAuthor(member.user.username);
        message.channel.send({embeds: [embed]});
        console.log(message)
    },
};