const fs = require("fs");


function write(fileName, data) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), function writeJSON(err) {
      if (err) return console.log(err)
    });
}

function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
}

module.exports = {isEmpty, write}