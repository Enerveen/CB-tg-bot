import stickers from "./stickers";
import {messageType, TopLevelUnknownMessageReply} from "../types";
import {getRandomElement} from "../utils";
import config from "../config";

export const messages = {
    alreadyRegistered: 'Wait, we already know each other, mate. Use the menu below to set up your subscriptions or just wait for the updates',
    defaultErrorReply: 'Oops... Something went wrong. Try again, it helps sometimes...',
    setSubsSceneLeft: 'Subscriptions setup canceled, hope you are satisfied with what you\'ve done',
    setSubsSceneBack: 'One small step back for man, one giant leap back for mankind...',
    botUnpaused: 'Already missed your funny memes? Ok, now I will deliver them again',
    botPaused: 'Ah, wanna take a time to chill? Ok, no updates for you anymore',
    subsListFirstLine: `You are subscribed to the following pages:
`,
    setSubsRequest: `Provide the list of the pages ids that you want to subscribe using <b>exactly</b> the following format:
<i>subscription1, subscription2, subscription3</i>`,
    subsVerifyLastLine: `

<b>Is everything right?</b>`,
    subsSetUp: 'Congrats! Your have just set up your subscriptions, it\'s a great step on your way to happiness!',
    about: `Ah, you want to know me a bit closer?

Well, my name is <b><i>Pontissey</i></b> and I was born on a sunny day in March 2022. Shortly afterwards, in June, I moved to Frankfurt and have been working around the clock ever since.

My primary function is to provide you with the content from VK personal and community pages. Thanks to me, you can get news, your favourite memes or whatever else you want without logging on to this dumpy social network. Sounds extremely cool, right? I'm not really sure, that's why I'm asking.
 
As anyone else I may feel depressed and apathetic. And while I'm in this awful condition I ignore your messages (just as your friends usually do, huh). In such cases contact <a href="https://t.me/worstlosing">this guy</a> and he will take care of me so I could continue to deliver content for you asap.

In cases you stopped receiving updates from one or more of your subscriptions follow these steps:
     1. Check if you have paused or blocked me and if you really did it restart me, <b>seriously</b>.
     2. Check if your subscribed pages are currently available in VK and public. <i>In the near future I will be able to work with private pages, but that's a completely different story</i>
     3. Check your mom xDD
     
If none of this helps, just message <a href="https://t.me/worstlosing">my chef</a> and let him resolve it for you.

Also, my current version is <b>1.0.1</b>, but keep in mind that I'm constantly improving becoming faster and smarter. Probably, one day I will even become smarter than you<span class="tg-spoiler">, which is definitely not a great achievement to be honest</span>
     `
}

const topLevelUnknownMessageReplies:TopLevelUnknownMessageReply[]  = [
    {
        message:'Wish I were as smart as you to understand what does it mean',
        sticker: stickers.cursedRegret
    },
    {
        message:'Is it Ukrainian or smth?',
        sticker: stickers.cursedConfused
    },
    {
        message: 'I don\'t understand you. As anyone else, though',
        sticker: stickers.cursedBigEyes
    },
    {
        message: 'Trying to talk to robot again, are you?',
        sticker: stickers.cursedPokerFace
    },
    {
        message: 'Hmm, that\'s really interesting. Go on, tell your mother about it'
    },
    {
        sticker: stickers.cursedStare
    },
    {
        sticker: stickers.cursedBible
    },
    {
        message:'What do you mean by that?',
        sticker: stickers.cursedConfused
    },
    {
        message: 'Hmm...',
        sticker: stickers.cursedConfusedThinking
    },
    {
        message: 'I could reply your on this but why would I'
    },
    {
        message: 'My son, my son, what have ye expressed...'
    }
]

const topLevelMediaReplies: TopLevelUnknownMessageReply[] = [
    {
        sticker: stickers.cursedEyePain1
    },
    {
        sticker: stickers.cursedEyePain2
    },
    {
        message:'Probably one of the most disturbing things I\'ve ever seen...',
        sticker: stickers.cursedStare
    },
    {
        message: 'Do androids dream of electric sheep? Idk, now I just dream about being blind'
    }
]

const topLevelPhotoReplies: TopLevelUnknownMessageReply[] = [
    {
        message: 'At least it is not a dick pic'
    }
]

const topLevelVideoReplies: TopLevelUnknownMessageReply[] = [
    {
        message: 'At least it is your parents home video. Don\'t feel like I could watch it once again'
    }
]

const topLevelSoundReplies: TopLevelUnknownMessageReply[] = [
    {
        message: 'I didn\'t heard anything worthy for a while! Still hope to hear something soon.'
    },
]

const topLevelVoiceReplies: TopLevelUnknownMessageReply[] = [
    {
        sticker: stickers.listening3
    },
    {
        message: 'Helen Keller once said: <i>"Blindness cuts us off from things, but deafness cuts us off from people"</i>. Now I\'m eager to become deaf'
    },
    {
        message: `We hear only those questions for which we are in a position to find answers.
                      <i> - Friedrich Nietzsche</i>`
    },
    {
        message: 'Every day we should hear at least one little song, read one good poem, see one exquisite picture, and, if possible, not a single voice message.'
    }
]

const topLevelMusicReplies: TopLevelUnknownMessageReply[] = [
    {
        sticker: stickers.listening1
    },
    {
        sticker: stickers.listening2
    },
    {
        message: 'Sounds even worse than AlbertJohnson\'s latest release'
    },
    {
        message: 'Dude, that sounds just awful. Better go listen to <a href="https://open.spotify.com/album/5NRdV1gsrRKxk2kaR7RnDg?si=8CuIHKvJQvCiIs5J8uuH7g">Fice</a> to feel the art of music'
    }
]

const replyToUnknownMessage = (messageType: messageType) => {
    if (Math.floor(Math.random() * 1000) === 0) {
        return getRandomElement(JSON.parse(config.SECRETS as string))
    }

    switch (messageType) {
        case "music":
            return getRandomElement([...topLevelSoundReplies, ...topLevelMusicReplies])
        case "voice":
            return getRandomElement([...topLevelSoundReplies, ...topLevelVoiceReplies])
        case "photo":
            return getRandomElement([...topLevelMediaReplies, ...topLevelPhotoReplies])
        case "video":
            return getRandomElement([...topLevelMediaReplies, ...topLevelVideoReplies])
        case "text":
            return getRandomElement(topLevelUnknownMessageReplies)
        default:
            return getRandomElement(topLevelUnknownMessageReplies)
    }
}

export const getMessage = {
    welcome: (name: string) => `Ah, greetings ${name}! Great name for a dog, by the way! My name is <b><i>Pontissey</i></b>, I'm eager to know more about the meme pages you subscribed (not really), so go on and setup your subscriptions`,
    subsList: (acc: string, value: string) => acc + `<a href='https://vk.com/${value.trim()}'>${value.trim()}</a>
`,
    replyToUnknownMessage
}