import axios from "axios";
import config from "./config";
import User from "./mongo/model";
import log from "yuve-shared/build/logger/logger";
import {logging} from "./messages/logging";

export const api = {
    get: async (path: string, params?: object) => await axios({
        method: 'get',
        baseURL: `${config.VK_HANDLER_PROTOCOL}://${config.VK_HANDLER_HOST}:${config.VK_HANDLER_PORT}`,
        url: path,
        params
    })
}

export const getCurrentSecondsTimestamp = () => String(Date.now()).substring(0, 10)

export const getRandomElement = (array: any[]) => array[Math.floor(Math.random() * array.length)]

export const waitFor = (time: number) => new Promise(resolve => setTimeout(resolve, time))

export const getUser = async (ctx: any) => {
    if (ctx.session.user) {
        return ctx.session.user
    }
    const user = await User.findOne({tgId: ctx.from?.id}, 'tgId tgUsername subscriptions paused banned')
        .exec()
        .catch((error) => {
                log.error(logging.userFind, error)
                return []
            }
        )
    ctx.session.user = user
    return user
}

export const parsePageId = (link: string) => {
    const possibleUrlStarts = [
        'https://vk.com/',
        'https://www.vk.com/',
        'www.vk.com/',
        'https://m.vk.com/',
        'https://www.m.vk.com/',
        'www.m.vk.com/',
        'm.vk.com/',
        'vk.com/'
    ]
    for (const start of possibleUrlStarts) {
        if(link.startsWith(start)) {
            return link.slice(start.length)
        }
    }
    return link
}
