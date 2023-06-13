const { SlashCommandBuilder } = require('discordjs');

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('question')
		.setDescription('Question commands')
		.addSubcommand(subcommand =>
			subcommand.setName('edit')
				.setDescription('Edit a question in the application form')
				.addIntegerOption(option =>
					option.setName('id')
						.setDescription('The question id')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('list')
				.setDescription('Lists all questions in the application form')
		)
		.addSubcommand(subcommand =>
			subcommand.setName('add')
				.setDescription('Add a question to the application form')
				.addStringOption(option =>
					option.setName('type')
						.setDescription('The type of question')
						.setRequired(true)
						.addChoices(
							{ name: 'Text', value: 'text' },
							{ name: 'Number', value: 'number' },
							{ name: 'Select', value: 'select' },
							{ name: 'File Upload', value: 'fileupload' },
						)
				)
				.addBooleanOption(option =>
					option.setName('required')
						.setDescription('Is the question required')
						.setRequired(true)
				)
				.addIntegerOption(option =>
					option.setName('min')
						.setDescription('Minimum value of x for y type question')
						.setRequired(false)
				)
				.addIntegerOption(option =>
					option.setName('max')
						.setDescription('Maximum value of x for y type question')
						.setRequired(false)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('remove')
				.setDescription('Remove a question from the application form')
				.addIntegerOption(option =>
					option.setName('id')
						.setDescription('The question id')
						.setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('move')
				.setDescription('Move a question in the application form')
				.addIntegerOption(option =>
					option.setName('id')
						.setDescription('The question id')
						.setRequired(true)
				)
				.addIntegerOption(option =>
					option.setName('position')
						.setDescription('The position to move the question to')
						.setRequired(true)
				)
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
		case 'edit':
			await interaction.reply('Edit!');
			break;
		case 'list':
			await interaction.reply('List!');
			break;
		case 'add':
			await interaction.reply('Add!');
			break;
		case 'remove':
			await interaction.reply('Remove!');
			break;
		case 'move':
			await interaction.reply('Move!');
			break;
		default:
			await interaction.reply('Unknown subcommand');
			break;
		}
	}
};