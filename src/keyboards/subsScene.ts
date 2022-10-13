import {Keyboard} from "telegram-keyboard";
import {manageSubsKeyboardTexts, setSubsKeyboardTexts} from "../messages/keyboards"

export const manageSubsKeyboard = Keyboard.make(
    [
        manageSubsKeyboardTexts.addSubs,
        manageSubsKeyboardTexts.deleteSubs,
        manageSubsKeyboardTexts.cancel
    ]
)

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