// IMPORTS
require('dotenv').config();
const fs = require("fs");
const discord = require("discord.js");
const {
    glob,
} = require("glob");
const utils = require('./bot_modules/utils');
const { send } = require('process');

// GLOBAL VARIABLES
let guildID;

// LOAD CONFIG FILE
const config = JSON.parse(fs.readFileSync("./data/config.json"));
guildID = config.guild;
// SETUP
const client = new discord.Client({
    partials: [
        discord.IntentsBitField.Message,
        discord.IntentsBitField.Channel, 
        discord.IntentsBitField.Reaction,
    ],
    intents: [
        discord.GatewayIntentBits.Guilds,
		discord.GatewayIntentBits.GuildMessages,
		discord.GatewayIntentBits.MessageContent,
		discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.GuildMessageReactions 
    ],
});

client.commands = new discord.Collection();
client.automatedFunctions = new discord.Collection();


async function getFunctions(path, collection, description) {
    return new Promise(async function(resolve) {
      const getDirectories = async (src, callback) => {
        const gl = await glob(src + '/**/*');
        callback(gl);
      };
  
      await getDirectories(path, async (res) => {
        //Only get files with the extension .js
        let jsFiles = res.filter(f => f.split('.').pop() == ('js'));
        //If no .js files
        if (jsFiles.length <= 0) {
            console.log(`\n\nNo ${description} to load!`);
            resolve();
            return;
        }

        console.log(`\n\n── Loading ${jsFiles.length} ${description}! ──`);
        await jsFiles.forEach((item, i) => {
            //Load
            let props = require(`./${item}`);
            console.log(`[${i+1}] ${item} loaded. Name: ${props.help.name}`);
            collection.set(props.help.name, props);
        });

        resolve();
      });
    });
}

// BOT READY
client.on('ready', async (c) => {
    await getFunctions('bot_modules/commands', client.commands, 'commands');
    await getFunctions('bot_modules/automated_commands', client.automatedFunctions, 'automated functions');
    // Register slash commands AFTER bot has signaled ready
    client.automatedFunctions.get('register-slash-commands').run();
    // Check for DB
    client.automatedFunctions.get('check-db').run();

    console.log(`${c.user.tag} Elindult! :3`);
});

// REACTION
client.on('messageReactionAdd', async (reaction, user) => {
    if (!reaction) return;
    client.automatedFunctions.get("reaction-handler").run(reaction,user);
});


client.on("messageCreate", async (message) => {
    if (message.author.bot) {
        return;
    }

    if ((message.content.includes("valorant") || message.content.includes("ranked") || message.content.includes("comp"))
        && message.channelId == ("1137112266123255889")) {
        message.reply({
            content: "A /valorant paranccsal tudsz egy látványosabb csapatkeresést megjeleníteni, így biztos könnyebben észrevesznek az új csapattársak!",
            ephemeral: true
        });
        return;
    }

    const prefix = "=";

    if (message.content.startsWith(prefix + "rangválasztó1")) {
        if (!message.member.roles.cache.has('1103270687839354920')) {
            message.reply(`nincs jogod ehhez! :D ${message.author.username}`);
            return;
        }

        const rangválasztó1 = {
            title: "1. Add meg a jelenlegi valorant rankodat:",
            description: `
                <:Valorant_Iron:1075493415061553234> - <@&1137112102469906583> \n
                <:Bronze_Valorant:1075490145312198666> - <@&1137112095968735333> \n
                <:Silver_Valorant:1075490140165779577> - <@&1137112096891490375> \n
                <:6940_Gold_Valorant:1075490143777075251> - <@&1137112097499656214> \n
                <:Platinum_Valorant:1075494339951743049> - <@&1137112098837635153> \n
                <:8091_Diamond_Valorant:1075490131580039240> - <@&1137112100284669995> \n
                <:ascend:1145405267782156389> - <@&1145404359627264110> \n
                <:8262_Immortal_Valorant:1075490133496844288> - <@&1137112101467455609> \n
                <:5979valorantradiant:1139905910081327144> - <@&1137143014989516810>
            `,
            image: {
                url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/50ca5b2f-036a-4021-95b5-7c0f86d7b9a1/de0tyff-9efba6d3-d8c0-44c9-b25f-9445d45b34ab.png/v1/fit/w_784,h_231,q_70,strp/pick_roles_banner_by_akibanax_de0tyff-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjMxIiwicGF0aCI6IlwvZlwvNTBjYTViMmYtMDM2YS00MDIxLTk1YjUtN2MwZjg2ZDdiOWExXC9kZTB0eWZmLTllZmJhNmQzLWQ4YzAtNDRjOS1iMjVmLTk0NDVkNDViMzRhYi5wbmciLCJ3aWR0aCI6Ijw9Nzg0In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Vo_m2QbrWPnct4eY6d7ajd0vm-FhOkx1S6MHhVoafrw"
            }
        };

        const embedMessage = await message.channel.send({ embeds: [rangválasztó1] });
        const data = {
            roleMsg: embedMessage.id,
        };
        utils.write('./data/database.json', data);

        // Emoji hozzáadása az üzenethez
        const emojis = [
            'Valorant_Iron', 'Bronze_Valorant', 'Silver_Valorant',
            '6940_Gold_Valorant', 'Platinum_Valorant', '8091_Diamond_Valorant',
            'ascend', '8262_Immortal_Valorant', '5979valorantradiant'
        ];

        emojis.forEach(async (item) => {
            const emoji = client.emojis.cache.find(emoji => emoji.name === item);
            if (emoji) {
                await embedMessage.react(emoji);
            } else {
                console.error(`Emoji not found: ${item}`);
            }
        });
    }
});

//interakciok
client.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    //hey
    if(interaction.commandName == 'hey'){
        if (!interaction.member.roles.cache.has('1186234636163092500')) {
            interaction.reply(`nincs jogod ehez! :D ${interaction.user.username}`);
            return;
        }
        interaction.reply('<a:DBE_accepted:1160635848740573326>');
    }
    //ping
    if(interaction.commandName == 'ping'){
        if (!interaction.member.roles.cache.has('1186234636163092500')) {
            interaction.reply(`nincs jogod ehez! :D ${interaction.user.username}`);
            return;
        }
        interaction.reply('pong!');
    }
    //2 szám összeadása
    if((interaction.commandName == 'valorant') && interaction.channelId === '1137112266123255889' || interaction.channelId === '1185072726453530664'){
        //if (!interaction.member.roles.cache.has('1186234636163092500')) {
        //    interaction.reply(`nincs jogod ehez! :D ${interaction.user.username}`);
        //    return;
        //}
        const rank_amibe_keresel = interaction.options.get('rank').value;
        const játék_módja = interaction.options.get('játék_módja').value;
        const személyek_száma = interaction.options.get('személyek_száma').value;
        const leírás = interaction.options.get('leírás').value;
        //interaction.reply(`${rank_amibe_keresel} és ${játék_módja} és ${személyek_száma} és ${leírás}`);
        var kép = "";
        var color = "";
        switch (rank_amibe_keresel) {
            case "Iron":
                kép = "https://cdn3.emoji.gg/emojis/1854-valorant-iron-3.png";
                color = "DarkerGrey";
            break;
            case "Bronze":
                kép = "https://cdn3.emoji.gg/emojis/4590-valorant-bronze-3.png";
                color = "LuminousVividPink";
            break;
            case "Silver":
                kép = "https://cdn3.emoji.gg/emojis/3293-valorant-silver-3.png";
                color = "LightGrey";
            break;
            case "Gold":
                kép = "https://cdn3.emoji.gg/emojis/3293-valorant-gold-3.png";
                color = "Gold";
            break;
            case "Platinum":
                kép = "https://cdn3.emoji.gg/emojis/5816-valorant-platinum-3.png";
                color = "DarkBlue";
            break;
            case "Diamond":
                kép = "https://cdn3.emoji.gg/emojis/6354-valorant-diamond-3.png";
                color = "Purple";
            break;
            case "Ascendant":
                kép = "https://cdn3.emoji.gg/emojis/2309-valorant-ascendant-3.png";
                color = "Green";
            break;
            case "Immortal":
                kép = "https://cdn3.emoji.gg/emojis/5979-valorant-immortal-3.png";
                color = "Red";
            break;
            case "Radiant":
                kép = "https://cdn3.emoji.gg/emojis/5979-valorant-radiant.png";
                color = "White";
            break;
        }
        const beágyazásrank = new discord.EmbedBuilder()
        .setAuthor({
            name: `${interaction.user.tag}`,
            iconURL: `${interaction.user.avatarURL()}`,
        })
        .setTitle("Leírás:")
        .setThumbnail(`${kép}`)
        .setDescription(`${leírás}`)
        .addFields({ name: '\u200B', value: '\u200B' })
        .setColor(`${color}`)
        .setFields({
            name: 'Játékmód:   ',
            value: `${játék_módja}`,
            inline: true,
        },
        {
            name: 'Rank:   ',
            value: `${rank_amibe_keresel}`,
            inline: true,
        },
        {
            name: 'Lobby:   ',
            value: `${személyek_száma}/5`,
            inline: true,
        },
        )
        .setTimestamp()
        .setFooter({
            text: "/valorant parancsal tudsz csapatot keresni",
        });
        const sendMessage = new discord.ButtonBuilder()
        .setStyle(discord.ButtonStyle.Primary)
        .setLabel("Üzenet küldése")
        .setCustomId(`sendmsg_${interaction.user.id}`);
        const row = new discord.ActionRowBuilder()
        .addComponents(sendMessage);
        interaction.reply({
            embeds: [beágyazásrank],
            components: [row]
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    //Üzenet küldő
    try{
    if(!interaction.isButton()) return;
    if(interaction.customId.startsWith("sendmsg")){
        if(interaction.customId.split("_")[1] === interaction.user.id){
            return interaction.reply({content: "Magadnak nem küldhetsz üzenetet!", ephemeral: true});
        }
        const modal = new discord.ModalBuilder()
			.setCustomId('msgmodal')
			.setTitle('Küldj üzenetet másnak!');
        const msgBuilder = new discord.TextInputBuilder()
			.setCustomId('custommsg')
			.setLabel("Milyen üzenetet szeretnél küldeni?")
			.setStyle(discord.TextInputStyle.Paragraph)
            .setPlaceholder('Ide írd az üzenetet amit szeretnél küldeni :3');
            const modalRow = new discord.ActionRowBuilder().addComponents(msgBuilder);
            modal.addComponents(modalRow);

		await interaction.showModal(modal);
	
    }else {
    await interaction.deferReply({
        ephemeral: true,
    });
    }
    } catch (error) {
        console.log(error);
    }
});
client.on('interactionCreate', async (interaction) => {

    if(!interaction.isModalSubmit()) return;
    const textmsg = interaction.fields.getTextInputValue('custommsg');
    const userId = interaction.message.components[0].components[0].data.custom_id.split("_")[1];
    const user = await interaction.guild.members.fetch(userId);
    user.send(`**Üzenet érkezett ${interaction.user}-től**\n\n${textmsg}`);
    interaction.reply({content: "Sikeresen elküldted az üzenetet!", ephemeral: true});
   
});
//partial reactions handler
client.on('raw', packet => {
    //Don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    //Grab channel
    const channel = client.channels.cache.get(packet.d.channel_id);
    //If reaction is already cached, return
    if (channel.messages.cache.has(packet.d.message_id)) return;
    //Fetch message
    channel.messages.fetch(packet.d.message_id).then(message => {
      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      const reaction = message.reactions.cache.get(emoji);
      if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
  
      if (packet.t === 'MESSAGE_REACTION_ADD') {
        client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
      }
      if (packet.t === 'MESSAGE_REACTION_REMOVE') {
        client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
      }
    });
});

//Token
client.login(process.env.TOKEN);