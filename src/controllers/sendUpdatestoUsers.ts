import {Scenes, Telegraf} from "telegraf";
import User from "../mongo/model";
import {vkRequestParams, VkReqUser} from "../types";
import {Error} from "mongoose";
import {api, getCurrentSecondsTimestamp, pauseUserSubscription, waitFor} from "../utils";
import IUser from "../mongo/interface";
import log from "yuve-shared/build/logger/logger";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";
import {logging, info} from "../messages/logging";

const BLOCKED_ERROR_MESSAGE = '403: Forbidden: failed to send message #1 with the error message "Bot was blocked by the user"'
const pauseUserThatBlockedBot = (error: Error, id: string) => {
    if (error.message === BLOCKED_ERROR_MESSAGE) {
        pauseUserSubscription(id)
    }
}

const getAllActiveUsers = (): Promise<IUser[]> =>
    User.find({paused: false, banned: false}, 'tgId subscriptions lastRequestTimestamp personalApiKey')
        .exec()
        .catch((error) => {
                log.error(logging.userFind, error)
                return []
            }
        )

export const sendUpdateToUser =
    async ({
               tgId,
               subscriptions,
               lastRequestTimestamp,
               personalApiKey
           }: VkReqUser, bot: Telegraf<Scenes.WizardContext>): Promise<void> => {
        const params:vkRequestParams = {domains: subscriptions.join(','), timestamp: lastRequestTimestamp}
        if (personalApiKey) {
            params.apiKey = personalApiKey
        }
        const {data: updates} =
        await runWithErrorHandler(() => api.get(`/posts`, params)) || {data: []}
        if (updates[0]) {
            for (const {text, content} of updates) {
                const imageContent = content.filter(({type}: { type: string }) => type === 'photo')
                const nonImageContent = content.filter(({type}: { type: string }) => type !== 'photo')
                await runWithErrorHandler(async () => {
                    text && await bot.telegram.sendMessage(tgId, text)
                }, (error) => pauseUserThatBlockedBot(error, tgId))
                await runWithErrorHandler(async () => {
                    // @ts-ignore
                    imageContent.length && await bot.telegram.sendMediaGroup(tgId, imageContent)
                }, (error) => pauseUserThatBlockedBot(error, tgId))
                await nonImageContent.forEach(async ({media, type}: { media: string, type: string }) =>
                    await runWithErrorHandler(async () => {
                        await bot.telegram.sendMessage(
                            tgId,
                            `<a href='${media}'>${type.toUpperCase()}</a>`,
                            {parse_mode: 'HTML'}
                        )
                    },(error) => pauseUserThatBlockedBot(error, tgId)))
            }
            User.findOneAndUpdate({tgId}, {lastRequestTimestamp: getCurrentSecondsTimestamp()},
                (err: Error) => {
                    if (err) {
                        log.error(err.message, err)
                    } else {
                        log.info(info.getTimestampUpdate(tgId))
                    }
                })
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