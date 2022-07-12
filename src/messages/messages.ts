export const messages = {
    alreadyRegistered: 'You have been already registered, you can set up your subscriptions with /setSubscriptions command',
    defaultErrorReply: 'Something went wrong, try again later',
    subsListFirstLine: '*Your subscriptions are:* \n\n',
    setSubsRequest: `Provide the list of the pages ids that you want to subscribe using the following format:
    \`subscription1, subscription2, subscription3\`
    `,
    subsVerifyLastLine: '\n*Is everything right?*',
    subsSetUp: 'Your subscriptions are set up',
    positive: 'Yes',
    negative: 'No',
    cancel: 'Cancel'
}

export const getMessage = {
    welcome: (name: string) => `Hey there, ${name}! You have been successfully registered. Press the button below or use /setSubscriptions command to set up your subscriptions`,
    subsList: (acc: string, value: string) => acc + `[${value}](https://vk.com/${value})\n`
}