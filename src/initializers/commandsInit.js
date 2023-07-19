import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';

// load commands from subfolders into an array
async function loadCommands(rootDir) {
	const commands = [];
	const commandPath = path.join(rootDir, 'commands');
	const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandPath, file);
		const command = await import(filePath);
		if (command.data && command.execute) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	return commands;
}

// reload the commands on Discord
export default (rootDir, clientId, token) => {
	return new Promise((resolve, reject) => {
		try {
			loadCommands(rootDir)
				.then((commands) => {
					const rest = new REST().setToken(token);

					console.log(`Started refreshing ${commands.length} application (/) commands.`);

					return rest.put(Routes.applicationCommands(clientId), { body: commands });
				})
				.then(data => {
					console.log(`Successfully reloaded ${data.length} application (/) commands.`);
					resolve(data);
				});

		} catch (error) {
			console.error('An error occurred while initializing the commands:', error);
			reject(error);
		}
	});
};
