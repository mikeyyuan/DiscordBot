const { SlashCommandBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('reporttest')
		.setDescription('Report a user!')
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
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('primary')
                    .setLabel('Reportable')
                    .setStyle(ButtonStyle.Primary),
            );
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('New Report')
			//.setURL('https://discord.js.org/')
			.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`, url: 'https://discord.js.org' })
			.setDescription('Some description here')
			.setThumbnail(`${target.displayAvatarURL()}`)
			.addFields(
				{ name: 'Regular field title', value: 'Some value here' },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
			.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
			.setImage(`${target.displayAvatarURL()}`)
			.setTimestamp()
			.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		//console.log(interaction)
		//await interaction.reply({ embeds: [exampleEmbed] , ephmereal: true});
		interaction.guild.channels.cache.get('1044078712649429083').send({ embeds: [exampleEmbed] , ephmereal: true, components: [row]})
        await interaction.reply({
            embeds: [{
               title: `Report sent to #reports`,
            }],
            //this is the important part
            ephemeral: true
         });
	},
};
