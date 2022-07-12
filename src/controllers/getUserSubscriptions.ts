import {Context, Scenes, Telegraf} from "telegraf";
import User from "../mongo/model";
import log from "yuve-shared/build/logger/logger";
import {getMessage, messages} from "../messages/messages";
import {logging} from "../messages/logging";

const getUserSubscriptions = async (bot: Telegraf<Scenes.WizardContext>, ctx: Context) => {
    const user = await User.findOne({tgId: String(ctx.from?.id)}, 'subscriptions')
        .catch(async (error): Promise<void> => {
            log.error(logging.userFind, error)
            await ctx.reply(messages.defaultErrorReply)
        });
    if (user) {
        const {subscriptions} = user || {subscriptions: []}
        const subsList = subscriptions.reduce(getMessage.subsList, messages.subsListFirstLine)
        await ctx.replyWithMarkdown(subsList, {disable_web_page_preview: true})
    }
}

export default getUserSubscriptions