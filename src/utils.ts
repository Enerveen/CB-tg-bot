import axios from "axios";
import config from "./config";

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