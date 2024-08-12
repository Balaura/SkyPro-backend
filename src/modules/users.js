const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

function getUsers(callback) {
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      try {
        const users = JSON.parse(data);
        callback(null, users);
      } catch (parseError) {
        callback(parseError, null);
      }
    }
  });
}

module.exports = { getUsers };