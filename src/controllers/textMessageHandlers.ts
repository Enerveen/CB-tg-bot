import {mainKeyboardTexts} from "../messages/keyboards";
import getUserSubscriptions from "./getUserSubscriptions";
import {Context, Scenes, Telegraf} from "telegraf";
import {getMessage, messages} from "../messages/messages";
import mainKeyboard from "../keyboards/main";
import pauseOrRestartBot from "./pauseOrRestartBot";
import {getRandomElement} from "../utils";
import config from "../config";
import {messageType} from "../types";

export const handleTopLevelTextMessage = async (message: string, ctx: any, bot: Telegraf<Scenes.WizardContext>) => {
    switch (message) {
        case mainKeyboardTexts.getSubs:
            await getUserSubscriptions(bot, ctx as Context)
            break;
        case mainKeyboardTexts.setSubs:
            ctx.scene.enter('setSubs')
            break;
        case mainKeyboardTexts.pauseRestart:
            await pauseOrRestartBot(ctx)
            break;
        case mainKeyboardTexts.about:
            await ctx.replyWithHTML(messages.about, {disable_web_page_preview: true})
            break;
        case 'secret':
            const {message: secret} = getRandomElement(JSON.parse(config.SECRETS as string))
            await bot.telegram.sendMessage(ctx.from.id, secret)
            break;
        default:
            await sendReplyToUnknownMessage(ctx, 'text')
    }
}

export const sendReplyToUnknownMessage = async (ctx: Context, messageType: messageType) => {
    const {message, sticker} = getMessage.replyToUnknownMessage(messageType)
    message && await ctx.replyWithHTML(message, mainKeyboard.reply())
    sticker && await ctx.replyWithSticker(sticker, mainKeyboard.reply())
}