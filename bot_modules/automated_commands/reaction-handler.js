const fs = require('fs')

module.exports = {
    run: async (reaction, user) => {
        const rawData = fs.readFileSync("./data/database.json");
        const db = JSON.parse(rawData)
        // FOUND MSG ID
        if (db.roleMsg) {
            if (reaction.message.id != db.roleMsg) return

            const emojis = [
                'Valorant_Iron', 'Bronze_Valorant', 'Silver_Valorant',
                '6940_Gold_Valorant', 'Platinum_Valorant', '8091_Diamond_Valorant',
                'ascend', '8262_Immortal_Valorant', '5979valorantradiant'
            ];

            if (!emojis.includes(reaction.name)) {
                await reaction.users.remove(message.author.id)
                return
            }

            const roleId = getRoleIdFromEmojiName(reaction.emoji.name);
            if (roleId) {                
                await reaction.users.remove(message.author.id);
                if (user.roles.cache.has(roleId)) {
                    // Felhasználó már rendelkezik a ranggal, távolítsuk el a reakcióját
                    await user.roles.remove(roleId);
                    message.channel.send(`Rang eltávolítva: <@&${roleId}>`);
                    console.log("rang eltávolitva");
                } else {
                    // Felhasználó még nem rendelkezik a ranggal, adjuk hozzá
                    emojis.forEach((name) => {
                        const id = getRoleIdFromEmojiName(name)
                        if (id) {
                            user.roles.remove(id)
                        }
                    })
                    await user.roles.add(roleId);
                    message.channel.send(`Rang hozzáadva: <@&${roleId}>`);
                    console.log("rang hozzáadva");
                }
            }
        }
        else return
    },
    help: {
        name: ("reaction-handler")
    }
}

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