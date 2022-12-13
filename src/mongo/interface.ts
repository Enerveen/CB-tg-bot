import { Document } from 'mongoose';

export default interface IUser extends Document {
    tgId: string,
    tgUsername?: string,
    subscriptions: string[],
    paused: boolean,
    banned: boolean,
    lastRequestTimestamp: string,
    personalApiKey?: string
}

