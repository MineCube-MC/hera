import { Command } from '../../Interfaces';
import Nuggies from 'nuggies';

export const command: Command = {
    name: 'apexieroles',
    category: 'Private',
    aliases: [],
    description: `Adds all the "Apexie's World" reaction roles to the specified chat`,
    run: async(client, message, args) => {
        const deviceOptions = new Nuggies.dropdownRoles().addRole({
            label: 'PC (Windows 10, Linux or MacOS)',
            role: '',
            emoji: '💻'
        });
    }
}