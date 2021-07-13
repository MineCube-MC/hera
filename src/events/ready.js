const chalk = require('chalk');

module.exports = client => {
    console.log('[ApexieClient] Logged in as ' + chalk.italic(client.user.tag));
    console.log('[ApexieClient] Status => ' + chalk.greenBright('Ready!'));
}