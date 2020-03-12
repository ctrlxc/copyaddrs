/* eslint-disable @typescript-eslint/member-delimiter-style */
declare namespace browser.mailTabs {
  function getSelectedMessages(tabId?: number): Promise<MessageList>

  type MessageList = {
    id: string
    messages: MessageHeader[]
  }

  type MessageHeader = {
    author: string
    bccList: string[]
    ccList: string[]
    date: Date
    flagged: boolean
    folder: browser.folders.MailFolder
    id: number
    junk: boolean
    junkScore: number
    read: boolean
    recipients: string[]
    subject: string
    tags: string[]
  }
}

// eslint-disable-next-line no-redeclare
declare namespace browser.folders {
  type MailFolder = {
    accountId: string
    path: string
    name?: string
    subFolders?: MailFolder[]
    type?: string
  }
}
