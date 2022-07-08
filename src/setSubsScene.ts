import {Scenes} from 'telegraf'
import User from "./mongo/model";
import {Error} from "mongoose";
import log from "yuve-shared/build/logger/logger";


const setSubsWizard = new Scenes.WizardScene(
    'setSubs',
    async (ctx) => {
        await ctx.replyWithMarkdown(
            `Provide the list of the pages ids that you want to subscribe using the following format:
    \`subscription1, subscription2, subscription3\`
    `)
        return ctx.wizard.next()
    },
    async (ctx) => {
        //@ts-ignore
        const messageText = ctx.message.text
        //@ts-ignore
        ctx.scene.state.subscriptions = messageText.split(',');
        // @ts-ignore
        const { subscriptions } = ctx.scene.state
        const subsList = subscriptions.reduce(
            (acc: string, value: string) => acc + `[${value.trim()}](https://vk.com/${value.trim()})\n`,
            '*Your new subscriptions are:* \n\n'
        )
        await ctx.replyWithMarkdown(subsList + '\n*Is everything right?*', {disable_web_page_preview: true})
        return ctx.wizard.next()
    },
    async (ctx) => {
        // @ts-ignore
        if(ctx.message.text === 'Yes') {
            // @ts-ignore
            User.findOneAndUpdate({tgId: ctx.from?.id}, {subscriptions: ctx.scene.state.subscriptions, paused: false },
                async (err:Error) => {
                    if (err) {
                        log.error(err.message)
                        await ctx.reply('Something went wrong, try again later please')
                    } else {
                        await ctx.reply('Your subscriptions are set up')
                        return await ctx.scene.leave()
                    }
                })
        }
        // @ts-ignore
        if (ctx.message.text === 'No') {
            return ctx.wizard.back()
        }
        // @ts-ignore
        if (ctx.message.text === 'Exit') {
            return ctx.wizard.back()
        }
    }
)

export default setSubsWizard