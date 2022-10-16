import {Scenes} from "telegraf";
import {messages} from "../messages/messages";
import {cancelOnlyKeyboard} from "../keyboards/subsScene";
import {setSubsKeyboardTexts} from "../messages/keyboards";
import generateMainKeyboard from "../keyboards/main";
import {sendMessageToUsers} from "../controllers/sendUpdatestoUsers";

const notifyUsersWizard = new Scenes.WizardScene(
    'notifyUsers',
    async (ctx) => {
        await ctx.replyWithHTML(messages.sendNotification, {disable_web_page_preview: true, ...cancelOnlyKeyboard.reply()})
        return ctx.wizard.next()
    },
    async (ctx) => {

        // @ts-ignore
        if (ctx.message.text === setSubsKeyboardTexts.cancel) {
            await ctx.reply(messages.backToMain, (await generateMainKeyboard(ctx)).reply())
            return ctx.scene.leave()
        }

        await sendMessageToUsers(ctx)
        await ctx.reply(messages.backToMain, (await generateMainKeyboard(ctx)).reply())
        return ctx.scene.leave()
    }
)

export default notifyUsersWizard
