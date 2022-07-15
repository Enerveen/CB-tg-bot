import {Keyboard} from "telegram-keyboard";
import {setSubsKeyboardTexts} from "../messages/keyboards"

const setSubsKeyboard = Keyboard.make(
    [
        [
            setSubsKeyboardTexts.positive,
            setSubsKeyboardTexts.negative
        ],
        [
            setSubsKeyboardTexts.cancel
        ]
    ]
)

export const cancelOnlyKeyboard = Keyboard.make(
    [
        setSubsKeyboardTexts.cancel
    ]
)

export default setSubsKeyboard