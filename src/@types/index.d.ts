/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/member-delimiter-style */
declare namespace browser.folders {
  type MailFolder = {
    accountId: string
    path: string
    name?: string
    subFolders?: MailFolder[]
    type?: string
  }
}

declare namespace browser.mailTabs {
  type MailTab = {
    active: boolean
    displayedFolder: browser.folders.MailFolder
    folderPaneVisible: boolean
    id: number
    layout: string
    messagePaneVisible: boolean
    sortOrder: string
    sortType: string
    windowId: number
  }

  function query(queryInfo: {
    active?: boolean
    currentWindow?: boolean
    lastFocusedWindow?: boolean
    windowId?: number
  }): Promise<MailTab[]>

  function getSelectedMessages(
    tabId?: number
  ): Promise<browser.messages.MessageList>

  const onDisplayedFolderChanged: EvListener<() => void>
  const onSelectedMessagesChanged: EvListener<() => void>
}

declare namespace browser.messageDisplay {
  const onMessageDisplayed: EvListener<(
    tabId: number,
    message: browser.messages.MessageHeader
  ) => void>
}

declare namespace browser.messages {
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
