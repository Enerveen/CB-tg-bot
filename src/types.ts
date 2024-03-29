export interface VkReqUser {
    tgId: string,
    subscriptions: string[],
    lastRequestTimestamp: string
    personalApiKey?: string
}

export interface TopLevelUnknownMessageReply {
    message?: string,
    sticker?: string
}

export type messageType = 'text' | 'voice' | 'music' | 'photo' | 'video' | 'other'

export type vkRequestParams = {
    domains: string,
    timestamp: string,
    apiKey?: string
}