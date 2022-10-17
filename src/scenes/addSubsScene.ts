import {Scenes} from 'telegraf'
import User from "../mongo/model";
import {Error} from "mongoose";
import log from "yuve-shared/build/logger/logger";
import {getMessage, messages} from "../messages/messages";
import setSubsKeyboard, {cancelOnlyKeyboard} from "../keyboards/subsScene";
import {setSubsKeyboardTexts} from "../messages/keyboards";
import generateMainKeyboard from "../keyboards/main";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";
import {parsePageId} from "../utils";

const addSubsWizard = new Scenes.WizardScene(
    'addSubs',
    async (ctx) => {
        await ctx.replyWithHTML(messages.setSubsRequest, {disable_web_page_preview: true, ...cancelOnlyKeyboard.reply()})
        return ctx.wizard.next()
    },
    async (ctx) => {

        // @ts-ignore
        if (ctx.message.text === setSubsKeyboardTexts.cancel) {
            await ctx.reply(messages.setSubsSceneLeft, (await generateMainKeyboard(ctx)).reply())
            return ctx.scene.leave()
        }

        //@ts-ignore
        const messageText = ctx.message.text
        if (messageText) {
            //@ts-ignore
            ctx.scene.state.subscriptions = [...new Set(messageText.split(',').map(value => parsePageId(value.trim())))];
            // @ts-ignore
            const { subscriptions } = ctx.scene.state
            const subsList = subscriptions.reduce(getMessage.subsList, messages.addSubsListFirstLine)
            await ctx.replyWithHTML(subsList + messages.subsVerifyLastLine, {disable_web_page_preview: true, ...setSubsKeyboard.reply()})
            return ctx.wizard.next()
        }
        else {
            await ctx.reply(messages.setSubsUnexpectedSubList)
        }
    },
    async (ctx) => {
        // @ts-ignore
        switch (ctx.message.text) {
            case setSubsKeyboardTexts.positive:
                const user = await User.findOne({tgId: ctx.from?.id}, 'subscriptions',
                    async (err:Error) => {
                        if (err) {
                            log.error(err.message)
                            await ctx.reply(messages.defaultErrorReply, (await generateMainKeyboard(ctx)).reply())
                            return await ctx.scene.leave()
                        }
                    }).clone()
                // @ts-ignore
                const subsToAdd = ctx.scene.state.subscriptions
                if (user) {
                    const filteredSubsToAdd:string[] = []
                    const alreadyIncludedSubs:string[] = []
                    subsToAdd.forEach((sub: string) =>
                        user.subscriptions.includes(sub) ? alreadyIncludedSubs.push(sub) : filteredSubsToAdd.push(sub))
                    user.subscriptions = user.subscriptions.concat(filteredSubsToAdd)

                    await runWithErrorHandler(user.save() as unknown as () => Promise<any>)
                    await ctx.replyWithHTML(
                        getMessage.subsManagementVerification(filteredSubsToAdd, alreadyIncludedSubs, 'add'),
                        {disable_web_page_preview: true,...(await generateMainKeyboard(ctx)).reply()}
                    )
                    return await ctx.scene.leave()
                }
            break;
            case setSubsKeyboardTexts.negative:
                await ctx.reply(messages.setSubsSceneBack)
                await ctx.replyWithHTML(messages.setSubsRequest, {
                    disable_web_page_preview: true,
                    ...cancelOnlyKeyboard.reply()
                })
                return ctx.wizard.back()
            case setSubsKeyboardTexts.cancel:
                await ctx.reply(messages.setSubsSceneLeft, (await generateMainKeyboard(ctx)).reply())
                return ctx.scene.leave()
            default:
                await ctx.reply(messages.setSubsUnexpectedMessage)
        }

    }
)

export default addSubsWizard