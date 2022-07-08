import {Context} from "telegraf";
import {getCurrentSecondsTimestamp} from "../utils";
import User from "../mongo/model";
import mongoose from "mongoose";
import log from "yuve-shared/build/logger/logger";

const createUser = (ctx: Context) => {

    const tgId = ctx.from?.id || ''
    const tgUsername = ctx.from?.username || ''
    const currentMomentTimestamp = getCurrentSecondsTimestamp()

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        tgId,
        tgUsername,
        lastRequestTimestamp: currentMomentTimestamp
    });

    return user
        .save()
        .then(() => ctx.reply(`Hey there, ${ctx.from?.first_name}`))
        .catch(async (error): Promise<void> => {
            if (error.code === 11000) {
                await ctx.reply('You have been already registered')
            }
            log.error('Failed to create user:', error)
        });
};

export default createUser