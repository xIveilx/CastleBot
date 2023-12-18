require('dotenv').config();
const otherFile = require('./commands/Other/register-commands.js');
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

    if (message.content.startsWith(prefix + "rangválasztó1")) {
        if (!message.member.roles.cache.has('1103270687839354920')) {
            message.reply(`nincs jogod ehhez! :D ${message.author.username}`);
            return;
        }

        const rangválasztó1 = {
            title: "1. Add meg a jelenlegi valorant rankodat:",
            description: `
                <:Valorant_Iron:1075493415061553234> - <@&1137112102469906583>
                <:Bronze_Valorant:1075490145312198666> - <@&1137112095968735333>
                <:Silver_Valorant:1075490140165779577> - <@&1137112096891490375>
                <:6940_Gold_Valorant:1075490143777075251> - <@&1137112097499656214>
                <:Platinum_Valorant:1075494339951743049> - <@&1137112098837635153>
                <:8091_Diamond_Valorant:1075490131580039240> - <@&1137112100284669995>
                <:ascend:1145405267782156389> - <@&1145404359627264110>
                <:8262_Immortal_Valorant:1075490133496844288> - <@&1137112101467455609>
                <:5979valorantradiant:1139905910081327144> - <@&1137143014989516810>
            `,
            image: {
                url: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/50ca5b2f-036a-4021-95b5-7c0f86d7b9a1/de0tyff-9efba6d3-d8c0-44c9-b25f-9445d45b34ab.png/v1/fit/w_784,h_231,q_70,strp/pick_roles_banner_by_akibanax_de0tyff-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjMxIiwicGF0aCI6IlwvZlwvNTBjYTViMmYtMDM2YS00MDIxLTk1YjUtN2MwZjg2ZDdiOWExXC9kZTB0eWZmLTllZmJhNmQzLWQ4YzAtNDRjOS1iMjVmLTk0NDVkNDViMzRhYi5wbmciLCJ3aWR0aCI6Ijw9Nzg0In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.Vo_m2QbrWPnct4eY6d7ajd0vm-FhOkx1S6MHhVoafrw"
            }
        };

        const embedMessage = await message.channel.send({ embeds: [rangválasztó1] });

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
        })

        // Várakozás a reakciókra és azonnali rang hozzáadása vagy eltávolítása
        const collectorFilter = (reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id;
        const collector = embedMessage.createReactionCollector({ filter: collectorFilter })

        collector.on('collect', async (reaction, user) => {
            const roleId = getRoleIdFromEmojiName(reaction.emoji.name);

            if (roleId) {
                const member = message.guild.members.cache.get(message.author.id);
                
                await reaction.users.remove(message.author.id);

                if (member.roles.cache.has(roleId)) {
                    // Felhasználó már rendelkezik a ranggal, távolítsuk el a reakcióját
                    await member.roles.remove(roleId);
                    message.channel.send(`Rang eltávolítva: <@&${roleId}>`);
                    console.log("rang eltávolitva");
                } else {
                    // Felhasználó még nem rendelkezik a ranggal, adjuk hozzá
                    emojis.forEach((name) => {
                        const id = getRoleIdFromEmojiName(name)
                        if (id) {
                            member.roles.remove(id)
                        }
                    })
                    await member.roles.add(roleId);
                    message.channel.send(`Rang hozzáadva: <@&${roleId}>`);
                    console.log("rang hozzáadva");
                }
            }
        })

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