import { Module } from "../../Interfaces";
import { moderationLogsSchema as Schema } from '../../Models/moderationLogs';
import { moderationLogsCollection as Collection } from '../../Collections';

export const logModule: Module = {
    getState(guild, client) {
        if(Collection.get(guild.id) === 'disabled') {
            return false;
        } else {
            return true;
        }
    }
}