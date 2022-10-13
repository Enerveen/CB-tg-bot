import {Context, session, Scenes, Telegraf} from "telegraf";
import config from "./config";
import mongoose from "mongoose";
import addSubsWizard from "./scenes/addSubsScene";
import {AsyncTask, SimpleIntervalJob, ToadScheduler} from "toad-scheduler";
import sendUpdatesToUsers from "./controllers/sendUpdatestoUsers";
import createUser from "./controllers/createUser";
import log from "yuve-shared/build/logger/logger";
import {info} from "./messages/logging";
import {handleTopLevelTextMessage, sendReplyToUnknownMessage} from "./controllers/textMessageHandlers";
import {getRandomElement} from "./utils";
import stickers from "./messages/stickers";
import deleteSubsWizard from "./scenes/deleteSubsScene";

const bot = new Telegraf<Scenes.WizardContext>(config.BOT_API_TOKEN)
const scheduler = new ToadScheduler();

const sendUpdatesTask = new AsyncTask(
    'sendUpdatesTask',
    async ():Promise<void> => {
        log.info('Scheduled send job triggered')
        await sendUpdatesToUsers(bot)
    },
    (err: Error) => log.error(err.message)
)

const sendUpdatesJob = new SimpleIntervalJob(
    { minutes: 5, runImmediately: false },
    sendUpdatesTask,
    'id_1'
);


// @ts-ignore
const stage = new Scenes.Stage<Scenes.WizardContext>([addSubsWizard, deleteSubsWizard])

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => createUser(ctx));
// @ts-ignore
bot.on('text', async (ctx: Context) => await handleTopLevelTextMessage(ctx.message.text, ctx, bot))
bot.on('sticker', async (ctx: Context) =>
    await ctx.replyWithSticker(getRandomElement(Object.values(stickers))))
bot.on('voice', async (ctx: Context) =>
    await sendReplyToUnknownMessage(ctx, 'voice'))
bot.on('audio', async (ctx: Context) =>
    await sendReplyToUnknownMessage(ctx, 'music'))
bot.on('photo', async (ctx: Context) =>
    await sendReplyToUnknownMessage(ctx, 'photo'))
bot.on('video', async (ctx: Context) =>
    await sendReplyToUnknownMessage(ctx, 'video'))
bot.on('message', async (ctx: Context) =>
    await sendReplyToUnknownMessage(ctx, 'other'))

mongoose.connect(config.MONGO_URL, config.MONGO_OPTIONS)
    .then(() => log.info(info.mongoConnected))
    .catch((error) => log.error(error.message, error));

bot.launch()
    .then(() => log.info(info.botStarted))
    .then(async () => await sendUpdatesToUsers(bot))
    .then(() => scheduler.addSimpleIntervalJob(sendUpdatesJob))
    .catch((error) => log.error(error.message, error))
