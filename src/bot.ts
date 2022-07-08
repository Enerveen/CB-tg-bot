import {Context, session, Scenes, Telegraf} from "telegraf";
import config from "./config";
import mongoose from "mongoose";
import setSubsWizard from "./setSubsScene";
import {AsyncTask, SimpleIntervalJob, ToadScheduler} from "toad-scheduler";
import sendUpdatesToUsers from "./controllers/sendUpdatestoUsers";
import createUser from "./controllers/createUser";
import getUserSubscriptions from "./controllers/getUserSubscriptions";
import log from "yuve-shared/build/logger/logger";

const bot = new Telegraf<Scenes.WizardContext>(config.BOT_API_TOKEN)
const scheduler = new ToadScheduler();

const sendUpdatesTask = new AsyncTask(
    'simple task',
    async ():Promise<void> => {
        log.info('Scheduled send job triggered')
        await sendUpdatesToUsers(bot)
    },
    (err: Error) => log.error(err.message)
)

const sendUpdatesJob = new SimpleIntervalJob(
    { minutes: 1, runImmediately: false },
    sendUpdatesTask,
    'id_1'
);


// @ts-ignore
const stage = new Scenes.Stage<Scenes.WizardContext>([setSubsWizard])

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => createUser(ctx));

bot.command('getSubs', async (ctx: Context) => await getUserSubscriptions(bot, ctx))

bot.command('setSubs', async (ctx) => ctx.scene.enter('setSubs'));

// @ts-ignore
bot.command('test', async (ctx: Context) => log.info('', ctx.message))

mongoose.connect(config.MONGO_URL, config.MONGO_OPTIONS)
    .then(() => log.info('Mongo connected successfully'))
    .catch((error) => {
        log.error(error.message, error)
        log.error(config.MONGO_URL)
    });

bot.launch()
    .then(() => log.info('Bot launched successfully'))
    .then(async () => await sendUpdatesToUsers(bot))
    .then(() => scheduler.addSimpleIntervalJob(sendUpdatesJob))
    .catch((error) => log.error(error.message, error))
