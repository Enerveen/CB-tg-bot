import mongoose, { Schema } from 'mongoose';
import IUser from "./interface";
import log from "yuve-shared/build/logger/logger";
import {logging} from "../messages/logging";

const UserSchema: Schema = new Schema(
    {
        tgId: { type: String, required: true, unique: true },
        tgUsername: { type: String, required: false },
        subscriptions: { type: Array, required: true, default: [] },
        paused: { type: Boolean, required: true, default: true },
        banned: { type: Boolean, required: true, default: false },
        lastRequestTimestamp: { type: String, required: true },
        personalApiKey: { type: String, required: false }
    },
    {
        timestamps: true
    }
);

UserSchema.post<IUser>('save', function () {
    log.info( logging.userRegistered, this);
});

export default mongoose.model<IUser>('User', UserSchema);