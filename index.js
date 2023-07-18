require('module-alias/register');
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const configInit = require('./initializers/configInit.js');

function main() {
	const { token } = require('@config');

	const client = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
	] });

	client.commands = new Collection();
	client.cooldowns = new Collection();

	// load commands from the commands folder into the collection
	const commandPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}

	// load events from the events folder and register them
	const eventsPath = path.join(__dirname, 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}

	client.login(token);
}

// initialize the config and then start the bot
configInit(path.resolve(__dirname)).then(configSuccess => {
	if (configSuccess) {
		console.log('Config initialized');
		main();
	}
}).catch(error => {
	console.error('An error occurred while initializing the config:', error);
});