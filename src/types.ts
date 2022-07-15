export interface VkReqUser {
    tgId: string,
    subscriptions: string[]
    lastRequestTimestamp: string
}

export interface TopLevelUnknownMessageReply {
    message?: string,
    sticker?: string
}

export type messageType = 'text' | 'voice' | 'music' | 'photo' | 'video' | 'other'