import {Context} from "telegraf";
import User from "../mongo/model";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";
import {messages} from "../messages/messages";
import {getCurrentSecondsTimestamp} from "../utils";
import generateMainKeyboard from "../keyboards/main";

const pauseOrRestartBot = async (ctx: Context) => {
    const tgId = ctx.from?.id as unknown as string
    const user = await runWithErrorHandler(async () =>
        await User.findOneAndUpdate({tgId}, [
                {
                    $set: {
                        paused: {$not: "$paused"},
                        lastRequestTimestamp: getCurrentSecondsTimestamp()
                    }
                }
            ]
        )
    )
    //@ts-ignore
    ctx.session.user = {...(ctx.session.user || {}), paused: !user.paused}
    await ctx.reply(user?.paused ? messages.botUnpaused : messages.botPaused, (await generateMainKeyboard(ctx)).reply())
}

export default pauseOrRestartBot