import {Keyboard} from "telegram-keyboard";
import {mainKeyboardTexts} from "../messages/keyboards";
import {getUser} from "../utils";

const generateMainKeyboard = async (ctx:any) => {
    const user = await getUser(ctx)
    return Keyboard.make([
        [
            mainKeyboardTexts.setSubs,
            mainKeyboardTexts.getSubs
        ],
        [
            user.paused ? mainKeyboardTexts.restart : mainKeyboardTexts.pause,
            mainKeyboardTexts.hide,
            mainKeyboardTexts.about,
        ]
    ])
}

export default generateMainKeyboard;
