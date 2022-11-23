const { SlashCommandBuilder, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');





// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: '1uXH8o6QycUfiihnxAxDl9W5D88iwryj3HoxKGs5tWUM',
    range: 'Reports!A2:F',
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: '1uXH8o6QycUfiihnxAxDl9W5D88iwryj3HoxKGs5tWUM',
    range: "Reports!A3:F",
    valueInputOption: "USER_ENTERED",
    resource: {
        values: [[new Date().toISOString(), userid, username, reporterid, reporter, reportreason]]
    }
  })

}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
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

        //janky global variables

        userid = target.id
        reporterid = interaction.user.id
        reporter = interaction.user.username
        reportreason = reason

		const exampleEmbed = new EmbedBuilder()
			.setColor(0xED4245)
			.setTitle('New Report')
			.setURL('https://docs.google.com/spreadsheets/d/1uXH8o6QycUfiihnxAxDl9W5D88iwryj3HoxKGs5tWUM/edit?usp=sharing')
			.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
			.setDescription(`${interaction.user} filed a report against ${target}`)
			// .setThumbnail(`${target.displayAvatarURL()}`)
			.addFields(
				{ name: 'Report reason', value: reason },
				{ name: '\u200B', value: '\u200B' },
				// { name: 'Inline field title', value: 'Some value here', inline: true },
				// { name: 'Inline field title', value: 'Some value here', inline: true },
			)
			// .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
			.setImage(`${target.displayAvatarURL()}`)
			.setTimestamp()
			.setFooter({ text: '⚖️ React with or 👍 - 👎 was this a good report?'});
		//console.log(interaction)
		//await interaction.reply({ embeds: [exampleEmbed] , ephmereal: true});
		interaction.guild.channels.cache.get('1044078712649429083').send({ embeds: [exampleEmbed] , ephmereal: true}).then(async exampleEmbed => {
            await exampleEmbed.react('👍');
            await exampleEmbed.react('👎');
        })
        await interaction.reply({
            embeds: [{
               title: `Report sent to #reports`,
            }],
            //this is the important part
            ephemeral: true
         }).then(authorize().then(listMajors).catch(console.error))

         
	},
};
