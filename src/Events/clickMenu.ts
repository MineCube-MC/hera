import { Event } from '../Interfaces';
import Nuggies from 'nuggies';

export const event: Event = {
    name: 'clickMenu',
    run: (client, menu) => {
        Nuggies.dropClick(client, menu);
    }
}