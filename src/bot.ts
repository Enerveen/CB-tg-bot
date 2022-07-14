import {Context, session, Scenes, Telegraf} from "telegraf";
import config from "./config";
import mongoose from "mongoose";
import setSubsWizard from "./setSubsScene";
import {AsyncTask, SimpleIntervalJob, ToadScheduler} from "toad-scheduler";
import sendUpdatesToUsers from "./controllers/sendUpdatestoUsers";
import createUser from "./controllers/createUser";
import log from "yuve-shared/build/logger/logger";
import {info} from "./messages/logging";
import {handleTopLevelTextMessage} from "./controllers/textMessageHandlers";

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
// @ts-ignore
bot.on('message', async (ctx: Context) => handleTopLevelTextMessage(ctx.message.text, ctx, bot))

mongoose.connect(config.MONGO_URL, config.MONGO_OPTIONS)
    .then(() => log.info(info.mongoConnected))
    .catch((error) => log.error(error.message, error));

bot.launch()
    .then(() => log.info(info.botStarted))
    .then(async () => await sendUpdatesToUsers(bot))
    .then(() => scheduler.addSimpleIntervalJob(sendUpdatesJob))
    .catch((error) => log.error(error.message, error))
