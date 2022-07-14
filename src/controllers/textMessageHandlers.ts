import {mainKeyboardTexts} from "../messages/keyboards";
import getUserSubscriptions from "./getUserSubscriptions";
import {Context, Scenes, Telegraf} from "telegraf";
import {getMessage, messages} from "../messages/messages";

export const handleTopLevelTextMessage = async (message: string, ctx: any, bot: Telegraf<Scenes.WizardContext>) => {
    switch (message) {
        case mainKeyboardTexts.getSubs:
            await getUserSubscriptions(bot, ctx as Context)
            break;
        case mainKeyboardTexts.setSubs:
            ctx.scene.enter('setSubs')
            break;
        case mainKeyboardTexts.about:
            await ctx.replyWithHTML(messages.about, {disable_web_page_preview: true})
            break
        default:
            const {message, sticker} = getMessage.topLevelUnknownMessageReply()
            message && await ctx.reply(message)
            sticker && await ctx.replyWithSticker(sticker)
    }
}