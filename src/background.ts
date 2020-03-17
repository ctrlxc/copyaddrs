import toClipboardPopup from './clipborad.js'
import { getAddrs } from './address.js'

browser.messageDisplay.onMessageDisplayed.addListener(
  async (_tabId, message) => {
    const text = getAddrs([message]).join(',')
    console.log(`selected => ${text}`)

    toClipboardPopup(text)
  }
)

// browser.mailTabs.onSelectedMessagesChanged.addListener(async () => {
//   const msg = await browser.mailTabs.getSelectedMessages()
//   toCopyHelper(msg.messages)
// })

// browser.browserAction.onClicked.addListener(async () => {
//   const msg = await browser.mailTabs.getSelectedMessages()
//   const text = getAddrs(msg.messages).join(',')

//   const url = browser.extension.getURL(`copyhelper/index.html?text=${text}`)

//   browser.windows
//     .create({
//       url,
//       type: 'popup',
//       height: 200,
//       width: 200
//     })
//     .then((w) => {
//       timer(0.5, () => {
//         if (w.id) {
//           browser.windows.remove(w.id)
//         }
//       })
//     })
// })
