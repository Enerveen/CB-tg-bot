import {Keyboard} from "telegram-keyboard";
import {mainKeyboardTexts} from "../messages/keyboards";

const mainKeyboard = Keyboard.make(
    [
        [
            mainKeyboardTexts.setSubs,
            mainKeyboardTexts.getSubs
        ],
        [
           mainKeyboardTexts.pauseRestart,
           mainKeyboardTexts.about,
        ]
    ]
)
export default mainKeyboard;
