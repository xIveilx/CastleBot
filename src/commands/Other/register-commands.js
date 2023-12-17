require('dotenv').config();
const {REST,Routes,ApplicationCommandOptionType, ApplicationCommandType} = require('discord.js');

const commands = [
    {
        name: 'valorant',
        description: 'Valoranthoz ember keresése.',
        options: [
            {
                name: 'rank',
                description: 'Rank amiben keresel embereket.',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'iron',
                        value: "Iron",
                    },
                    {
                        name: 'bronze',
                        value: "Bronze",
                    },
                    {
                        name: 'silver',
                        value: "Silver",
                    },
                    {
                        name: 'gold',
                        value: "Gold",
                    },
                    {
                        name: 'platinum',
                        value: "Platinum",
                    },
                    {
                        name: 'diamond',
                        value: "Diamond",
                    },
                    {
                        name: 'ascendant',
                        value: "Ascendant",
                    },
                    {
                        name: 'immortal',
                        value: "Immortal",
                    },
                    {
                        name: 'radiant',
                        value: "Radiant",
                    },
                ],
                required: true,
            },
            {
                name: 'játék_módja',
                description: 'Adja meg a  játék módját.',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'ranked',
                        value: "Ranked",
                    },
                    {
                        name: 'normal',
                        value: "Normál",
                    },
                ],
                required: true,
            },
            {
                name: 'személyek_száma',
                description: 'Adja meg a csapatban lévő személyek számát.',
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: '1',
                        value: 1,
                    },
                    {
                        name: '2',
                        value: 2,
                    },
                    {
                        name: '3',
                        value: 3,
                    },
                    {
                        name: '4',
                        value: 4,
                    },
                ],
                required: true,
            },
            {
                name: 'leírás',
                description: 'Üzenet az emberség felé.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
];

const rest = new REST({version:'10'}).setToken(process.env.TOKEN);

(async  () => {
    try {
        console.log("perjeles parancsok regisztrálása...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: commands
            }
        );

    console.log("perjeles parancsok sikeresek regisztrálva!");
    } catch (error) {
        console.log(`Van egy hiba: ${error}`);
    }
})();