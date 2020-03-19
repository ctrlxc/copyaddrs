import toClipboardPopup from './clipborad.js'
import { getAddrs } from './address.js'

browser.mailTabs.onSelectedMessagesChanged.addListener(async () => {
  const msg = await browser.mailTabs.getSelectedMessages()
  messageAddrsToClipbordPopup(msg.messages)
})

// browser.messageDisplay.onMessageDisplayed.addListener(
//   async (_tabId, message) => {
//     messageAddrsToClipbordPopup(message)
//   }
// )

// browser.browserAction.onClicked.addListener(async () => {
// })

async function messageAddrsToClipbordPopup(
  messages: browser.messages.MessageHeader | browser.messages.MessageHeader[]
): Promise<void> {
  const text = getAddrs(messages).join(',')
  console.log(`selected => ${text}`)

  return toClipboardPopup(text)
}
