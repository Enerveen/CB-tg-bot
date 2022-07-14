import {Scenes} from 'telegraf'
import User from "./mongo/model";
import {Error} from "mongoose";
import log from "yuve-shared/build/logger/logger";
import {getMessage, messages} from "./messages/messages";


const setSubsWizard = new Scenes.WizardScene(
    'setSubs',
    async (ctx) => {
        await ctx.replyWithMarkdown(messages.setSubsRequest)
        return ctx.wizard.next()
    },
    async (ctx) => {
        //@ts-ignore
        const messageText = ctx.message.text
        //@ts-ignore
        ctx.scene.state.subscriptions = messageText.split(',');
        // @ts-ignore
        const { subscriptions } = ctx.scene.state
        const subsList = subscriptions.reduce(getMessage.subsList, messages.subsListFirstLine)
        await ctx.replyWithMarkdown(subsList + messages.subsVerifyLastLine, {disable_web_page_preview: true})
        return ctx.wizard.next()
    },
    async (ctx) => {
        // @ts-ignore
        if(ctx.message.text === messages.positive) {
            // @ts-ignore
            User.findOneAndUpdate({tgId: ctx.from?.id}, {subscriptions: ctx.scene.state.subscriptions, paused: false },
                async (err:Error) => {
                    if (err) {
                        log.error(err.message)
                        await ctx.reply(messages.defaultErrorReply)
                    } else {
                        await ctx.reply(messages.subsSetUp)
                        return await ctx.scene.leave()
                    }
                })
        }
        // @ts-ignore
        if (ctx.message.text === messages.negative) {
            return ctx.wizard.back()
        }
        // @ts-ignore
        if (ctx.message.text === messages.cancel) {
            return ctx.scene.leave()
        }
    }
)

export default setSubsWizard