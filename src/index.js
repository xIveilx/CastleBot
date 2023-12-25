require('dotenv').config();
const registercommands = require('./commands/Other/register-commands.js');
const reactionrole = require('./commands/Moderation/reactionrole.js');
//nodemon
const {Client,GatewayIntentBits,Partials,EmbedBuilder, Guild, User, Message, BaseInteraction, Role} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

//Bot elindulás üzenet

client.on('ready', (c) => {
    console.log(` ${c.user.tag} Elindult! :3`);
})

//commands

client.on("messageCreate", async (message) => {
    if (message.author.bot) {
        return;
    }

    const prefix = "=";

    if (message.content.startsWith(prefix + "")) {
        
    }
});

function getRoleIdFromEmojiName(emojiName) {
    const emojiRoleMap = {
        'Valorant_Iron': '1137112102469906583', // Valorant_Iron
        'Bronze_Valorant': '1137112095968735333', // Bronze_Valorant
        'Silver_Valorant': '1137112096891490375', // Silver_Valorant
        '6940_Gold_Valorant': '1137112097499656214', // 6940_Gold_Valorant
        'Platinum_Valorant': '1137112098837635153', // Platinum_Valorant
        '8091_Diamond_Valorant': '1137112100284669995', // 8091_Diamond_Valorant
        'ascend': '1145404359627264110', // ascend
        '8262_Immortal_Valorant': '1137112101467455609', // 8262_Immortal_Valorant
        '5979valorantradiant': '1137143014989516810'  // 5979valorantradiant
    };

    return emojiRoleMap[emojiName] || null;
}

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
    if(interaction.commandName == 'valorant' && interaction.channelId === '1137112266123255889'){
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
        const beágyazásrank = new EmbedBuilder()
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

        interaction.reply({
            embeds: [beágyazásrank]
        });
    }
    //beágyazás
    if(interaction.commandName == 'beágyazás'){
        if (!interaction.member.roles.cache.has('1186234636163092500')) {
            interaction.reply(`nincs jogod ehez! :D ${interaction.user.username}`);
            return;
        }
        const beágyazás = new EmbedBuilder()
        .setTitle("beágyazás cím")
        .setDescription("Ez egy beágyazás leírás.")
        .setColor("Purple")
        .setFields({
            name: 'Játékmód:',
            value: 'valami.',
            inline: true,
        },
        {
            name: 'Rank:',
            value: 'valami.',
            inline: true,
        },
        {
            name: 'lobby:',
            value: 'valami.',
            inline: true,
        },
        );
        

        interaction.reply({
            embeds: [beágyazás]
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    //szín választó
    try{
    if(!interaction.isButton()) return;
    await interaction.deferReply({
        ephemeral: true,
    });

    const role = interaction.guild.roles.cache.get(interaction.customId);
    if(!role){
        interaction.editReply({
            content: "Nem találtam meg ez a rangot.",
        })
        return;
    }

    const hasrole = interaction.member.roles.cache.has(role.id);

    if(hasrole){
        await interaction.member.roles.remove(role);
        await interaction.editReply(`A ${role} szín törölve lett a rangjaid közül.`);
        return;
    }

    await interaction.member.roles.add(role);
    await interaction.editReply(`A ${role} szín hozzá lett adva a rangodhoz.`);
    } catch (error) {
        console.log(error);
    }
});

//Token
client.login(process.env.TOKEN);