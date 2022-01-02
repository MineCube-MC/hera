import { Configuration } from "../../Dashboard/Modules/Configuration";
import { Command } from "../../Interfaces";

export const command: Command = {
    name: 'ranking',
    description: 'Enable / Disable the ranking system',
    options: [
        {
            name: 'enabled',
            description: 'Set this to either true or false',
            type: 'BOOLEAN',
            required: true
        }
    ],
    async execute(interaction, client) {
        if(!interaction.memberPermissions.has('ADMINISTRATOR')) return interaction.reply({ content: `The \`ADMINISTRATOR\` permission is needed to execute this command!`, ephemeral: true});
        Configuration.setRanking(interaction.guild, interaction.options.getBoolean('enabled'));
        if(interaction.options.getBoolean('enabled')) {
            return interaction.reply({
                content: `You have successfully **enabled** the ranking system`,
                ephemeral: true
            });
        } else {
            return interaction.reply({
                content: `You have successfully **disabled** the ranking system`,
                ephemeral: true
            });
        }
    }
}