import {Context, Scenes, Telegraf} from "telegraf";
import User from "../mongo/model";
import log from "yuve-shared/build/logger/logger";

const getUserSubscriptions = async (bot: Telegraf<Scenes.WizardContext>, ctx: Context) => {
    const user = await User.findOne({tgId: String(ctx.from?.id)}, 'subscriptions')
        .catch(async (error): Promise<void> => {
            log.error('Failed to find user:', error)
            await ctx.reply('Something went wrong, try again later')
        });
    if (user) {
        const {subscriptions} = user || {subscriptions: []}
        const subsList = subscriptions.reduce(
            (acc, value) => acc + `[${value}](https://vk.com/${value})\n`,
            '*Your subscriptions are:* \n\n'
        )
        await ctx.replyWithMarkdown(subsList, {disable_web_page_preview: true})
    }
}

export default getUserSubscriptions