import {Scenes, Telegraf} from "telegraf";
import User from "../mongo/model";
import {VkReqUser} from "../types";
import {Error} from "mongoose";
import {api, getCurrentSecondsTimestamp} from "../utils";
import IUser from "../mongo/interface";
import log from "yuve-shared/build/logger/logger";

const getAllActiveUsers = (): Promise<IUser[]> =>
    User.find({paused: false, banned: false}, 'tgId subscriptions lastRequestTimestamp')
        .exec()
        .catch((error) => {
                log.error('Failed to get users:', error)
                return []
            }
        )

const sendUpdateToUser =
    async ({tgId, subscriptions, lastRequestTimestamp}: VkReqUser, bot: Telegraf<Scenes.WizardContext>): Promise<void> => {
        const {data: updates} =
            await api.get(`/posts`,
                {domains: subscriptions.join(','), timestamp: lastRequestTimestamp})
        if (updates) {
            for (const {text, content} of updates) {
                const mediaContent = content.filter(({type}: {type: string}) => type === 'photo')
                try {
                    text && await bot.telegram.sendMessage(tgId, text)
                    // @ts-ignore
                    mediaContent.length && await bot.telegram.sendMediaGroup(tgId, mediaContent)
                } catch (error) {
                    log.error(error as string, mediaContent)
                }
            }
        }
        User.findOneAndUpdate({tgId}, {lastRequestTimestamp: getCurrentSecondsTimestamp()},
            (err:Error) => {
                if (err) {
                    log.error(err.message)
                } else {
                    log.info(`Timestamp successfully updated for ${tgId}`)
                }
            })
    }


export const sendUpdatesToUsers = async (bot: Telegraf<Scenes.WizardContext>): Promise<void> => {
    const users = await getAllActiveUsers()
    await users.forEach(async (user: VkReqUser) => {
        await sendUpdateToUser(user, bot)
    })
}

export default sendUpdatesToUsers