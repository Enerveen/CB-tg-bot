import {Context} from "telegraf";
import User from "../mongo/model";
import runWithErrorHandler from "yuve-shared/build/runWithErrorHandler/runWithErrorHandler";
import {messages} from "../messages/messages";
import {getCurrentSecondsTimestamp} from "../utils";

const pauseOrRestartBot = async (ctx: Context) => {
    const tgId = ctx.from?.id as unknown as string
    const updatedUser = await runWithErrorHandler(async () =>
        await User.findOneAndUpdate({tgId}, [
            { $set: {
                paused: { $not: "$paused" },
                lastRequestTimestamp: getCurrentSecondsTimestamp()
            }
            }
            ]
        )
    )
    await ctx.reply(updatedUser?.paused ? messages.botUnpaused: messages.botPaused)
}

export default pauseOrRestartBot