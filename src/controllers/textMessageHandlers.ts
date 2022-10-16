import {mainKeyboardTexts, manageSubsKeyboardTexts} from "../messages/keyboards";
import getUserSubscriptions from "./getUserSubscriptions";
import {Context, Scenes, Telegraf} from "telegraf";
import {getMessage, messages} from "../messages/messages";
import pauseOrRestartBot from "./pauseOrRestartBot";
import {messageType} from "../types";
import generateMainKeyboard from "../keyboards/main";
import {manageSubsKeyboard} from "../keyboards/subsScene";
import {constants} from "../config";

export const handleTopLevelTextMessage = async (message: string, ctx: any, bot: Telegraf<Scenes.WizardContext>) => {
    switch (message) {
        case mainKeyboardTexts.getSubs:
            await getUserSubscriptions(bot, ctx as Context)
            break;
        case mainKeyboardTexts.manageSubs:
            await ctx.replyWithHTML(messages.manageSubs, manageSubsKeyboard.reply())
            break;
        case manageSubsKeyboardTexts.addSubs:
            ctx.scene.enter('addSubs')
            break;
        case manageSubsKeyboardTexts.deleteSubs:
            ctx.scene.enter('deleteSubs')
            break;
        case manageSubsKeyboardTexts.cancel:
            await ctx.replyWithHTML(messages.backToMain, (await generateMainKeyboard(ctx)).reply())
            break;
        case mainKeyboardTexts.pause:
            await pauseOrRestartBot(ctx)
            break;
        case mainKeyboardTexts.restart:
            await pauseOrRestartBot(ctx)
            break;
        case mainKeyboardTexts.pauseRestart: //Button, removed before from keyboard
            await pauseOrRestartBot(ctx)
            break;
        case mainKeyboardTexts.about:
            await ctx.replyWithHTML(messages.about, {
                disable_web_page_preview: true,
                ...(await generateMainKeyboard(ctx)).reply()
            })
            break;
        case mainKeyboardTexts.hide:
            await ctx.replyWithHTML(messages.keyboardHidden, {reply_markup: { remove_keyboard: true }})
            break;
        case mainKeyboardTexts.notify:
            if(ctx.message.from.id === constants.masterId) {
                ctx.scene.enter('notifyUsers')
                break;
            }
            await sendReplyToUnknownMessage(ctx, 'text')
            break
        default:
            await sendReplyToUnknownMessage(ctx, 'text')
    }
}

export const sendReplyToUnknownMessage = async (ctx: Context, messageType: messageType) => {
    const {message, sticker} = getMessage.replyToUnknownMessage(messageType)
    message && await ctx.replyWithHTML(message, (await generateMainKeyboard(ctx)).reply())
    sticker && await ctx.replyWithSticker(sticker, (await generateMainKeyboard(ctx)).reply())
}