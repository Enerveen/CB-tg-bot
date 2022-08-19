import {Context} from "telegraf";
import {getCurrentSecondsTimestamp} from "../utils";
import User from "../mongo/model";
import mongoose from "mongoose";
import log from "yuve-shared/build/logger/logger";
import {getMessage, messages} from '../messages/messages'
import {logging} from "../messages/logging";
import generateMainKeyboard from "../keyboards/main";

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
        .then(async () => {
            await ctx.replyWithHTML(getMessage.welcome(ctx.from?.first_name as string), (await generateMainKeyboard(ctx)).reply())
        })
        .catch(async (error): Promise<void> => {
            if (error.code === 11000) {
                await ctx.reply(messages.alreadyRegistered, (await generateMainKeyboard(ctx)).reply())
            }
            log.error(logging.userCreate, error)
        });

};

export default createUser