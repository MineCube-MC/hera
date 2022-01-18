import { Schema, model } from 'mongoose';

export default model("guild", new Schema({
    id: {
        type: String,
        required: true
    },
    preferences: {
        welcomeChannel: {
            type: String,
            required: false
        },
        logChannel: {
            type: String,
            required: false
        }
    }
}));