const utils = require('../utils');
const fs = require('fs')

module.exports = {
    run: async () => {
        const original = {
            roleMsg: "",
            channelId: "",
        }


        try {
            const rawData = fs.readFileSync("./data/database.json");
            const test = JSON.parse(rawData)
            Object.keys(test).forEach((item) => {
                if (!Object.hasOwn(original, item)) {
                    throw new Error("db read fail")
                }
            })
        }
        catch {
            utils.write('./data/database.json', original)
        }
    },
    help: {
        name: ("check-db")
    }
}