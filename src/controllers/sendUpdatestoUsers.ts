import {Scenes, Telegraf} from "telegraf";
import User from "../mongo/model";
import {VkReqUser} from "../types";
import {Error} from "mongoose";
import {api, getCurrentSecondsTimestamp, getRandomElement, waitFor} from "../utils";
import IUser from "../mongo/interface";
import log from "yuve-shared/build/logger/logger";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";
import {logging, info} from "../messages/logging";
import config from "../config";

const getAllActiveUsers = (): Promise<IUser[]> =>
    User.find({paused: false, banned: false}, 'tgId subscriptions lastRequestTimestamp')
        .exec()
        .catch((error) => {
                log.error(logging.userFind, error)
                return []
            }
        )

const sendUpdateToUser =
    async ({
               tgId,
               subscriptions,
               lastRequestTimestamp
           }: VkReqUser, bot: Telegraf<Scenes.WizardContext>): Promise<void> => {
        const {data: updates} =
        await runWithErrorHandler(() => api.get(`/posts`,
            {domains: subscriptions.join(','), timestamp: lastRequestTimestamp})) || {data: []}
        if (updates[0]) {
            for (const {text, content} of updates) {
                const imageContent = content.filter(({type}: { type: string }) => type === 'photo')
                const nonImageContent = content.filter(({type}: { type: string }) => type !== 'photo')
                await runWithErrorHandler(async () => {
                    text && await bot.telegram.sendMessage(tgId, text)
                })
                await runWithErrorHandler(async () => {
                    // @ts-ignore
                    imageContent.length && await bot.telegram.sendMediaGroup(tgId, imageContent)
                })
                await nonImageContent.forEach(async ({media, type}: { media: string, type: string }) =>
                    await runWithErrorHandler(async () => {
                        await bot.telegram.sendMessage(
                            tgId,
                            `<a href='${media}'>${type.toUpperCase()}</a>`,
                            {parse_mode: 'HTML'}
                        )
                    }))
            }
            User.findOneAndUpdate({tgId}, {lastRequestTimestamp: getCurrentSecondsTimestamp()},
                (err: Error) => {
                    if (err) {
                        log.error(err.message, err)
                    } else {
                        log.info(info.getTimestampUpdate(tgId))
                    }
                })
        } else if (Math.floor(Math.random() * 100000) === 0) {
            const {message: secret} = getRandomElement(JSON.parse(config.SECRETS as string))
            await bot.telegram.sendMessage(tgId, secret)
        }
    }


export const sendUpdatesToUsers = async (bot: Telegraf<Scenes.WizardContext>): Promise<void> => {
    const users = await getAllActiveUsers()
    users.forEach(async (user: VkReqUser, index) => {
        if (!(index % 3)) {
            await waitFor(1000);
        }
        await sendUpdateToUser(user, bot);
    })
}

export const sendMessageToUsers = async (ctx: any) => {
    const users = await getAllActiveUsers()
    users.forEach(async (user) => await runWithErrorHandler(() => ctx.copyMessage(user.tgId)))
}

export default sendUpdatesToUsers