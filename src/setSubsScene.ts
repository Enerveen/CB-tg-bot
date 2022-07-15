import {Scenes} from 'telegraf'
import User from "./mongo/model";
import {Error} from "mongoose";
import log from "yuve-shared/build/logger/logger";
import {getMessage, messages} from "./messages/messages";
import setSubsKeyboard, {cancelOnlyKeyboard} from "./keyboards/subsScene";
import {setSubsKeyboardTexts} from "./messages/keyboards";
import mainKeyboard from "./keyboards/main";

const setSubsWizard = new Scenes.WizardScene(
    'setSubs',
    async (ctx) => {
        await ctx.replyWithHTML(messages.setSubsRequest, cancelOnlyKeyboard.reply())
        return ctx.wizard.next()
    },
    async (ctx) => {

        // @ts-ignore
        if (ctx.message.text === setSubsKeyboardTexts.cancel) {
            await ctx.reply(messages.setSubsSceneLeft, mainKeyboard.reply())
            return ctx.scene.leave()
        }

        //@ts-ignore
        const messageText = ctx.message.text
        //@ts-ignore
        ctx.scene.state.subscriptions = messageText.split(',');
        // @ts-ignore
        const { subscriptions } = ctx.scene.state
        const subsList = subscriptions.reduce(getMessage.subsList, messages.subsListFirstLine)
        await ctx.replyWithHTML(subsList + messages.subsVerifyLastLine, {disable_web_page_preview: true, ...setSubsKeyboard.reply()})
        return ctx.wizard.next()
    },
    async (ctx) => {
        // @ts-ignore
        if(ctx.message.text === setSubsKeyboardTexts.positive) {
            // @ts-ignore
            User.findOneAndUpdate({tgId: ctx.from?.id}, {subscriptions: ctx.scene.state.subscriptions, paused: false },
                async (err:Error) => {
                    if (err) {
                        log.error(err.message)
                        await ctx.reply(messages.defaultErrorReply, mainKeyboard.reply())
                    } else {
                        await ctx.reply(messages.subsSetUp, mainKeyboard.reply())
                        return await ctx.scene.leave()
                    }
                })
        }
        // @ts-ignore
        if (ctx.message.text === setSubsKeyboardTexts.negative) {
            await ctx.reply(messages.setSubsSceneBack)
            await ctx.replyWithHTML(messages.setSubsRequest, cancelOnlyKeyboard.reply())
            return ctx.wizard.back()
        }
        // @ts-ignore
        if (ctx.message.text === setSubsKeyboardTexts.cancel) {
            await ctx.reply(messages.setSubsSceneLeft, mainKeyboard.reply())
            return ctx.scene.leave()
        }
    }
)

export default setSubsWizard