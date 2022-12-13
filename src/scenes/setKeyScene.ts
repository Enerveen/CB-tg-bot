import {Scenes} from "telegraf";
import {getMessage, messages} from "../messages/messages";
import {setKeyKeyboard} from "../keyboards/subsScene";
import {setKeyKeyboardTexts} from "../messages/keyboards";
import generateMainKeyboard from "../keyboards/main";
import User from "../mongo/model";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";
import {api} from "../utils";
import {constants} from "../config";

const setKeyScene = new Scenes.WizardScene(
    'setKey',
    async (ctx) => {
        await ctx.replyWithHTML(messages.setKeyRequest, {disable_web_page_preview: true, ...setKeyKeyboard.reply()})
        return ctx.wizard.next()
    },
    async (ctx) => {
        // @ts-ignore
        if (ctx.message.text === setKeyKeyboardTexts.cancel) {
            await ctx.reply(messages.setSubsSceneLeft, (await generateMainKeyboard(ctx)).reply())
            return ctx.scene.leave()
        }
        //@ts-ignore
        const messageText = ctx.message.text === setKeyKeyboardTexts.reset ? undefined : ctx.message.text
        if (messageText !== '') {
            await runWithErrorHandler(async () => {
                const user = await User.findOne({tgId: ctx.from?.id}, 'tgId')
                if (messageText === undefined && user) {
                    user.personalApiKey = undefined
                    user.save()
                    await ctx.replyWithHTML(getMessage.setKeySuccess(messageText), (await generateMainKeyboard(ctx)).reply())
                    return ctx.scene.leave()
                }
                if(messageText && user) {
                    const {data} = await runWithErrorHandler(() => api.get(`/posts`,
                        {
                            domains: constants.apiKeyTestPageId,
                            timestamp: '1',
                            limit: '1',
                            apiKey: messageText})) || {data: []}
                    if (data[0]) {
                        user.personalApiKey = messageText
                        user.save()
                        await ctx.replyWithHTML(getMessage.setKeySuccess(messageText), (await generateMainKeyboard(ctx)).reply())
                        return ctx.scene.leave()
                    } else {
                        await ctx.reply(messages.setKeyInvalidKey)
                    }
                }
            })
        }
        else {
            await ctx.reply(messages.setKeyWrongKey)
        }
    }
)

export default setKeyScene