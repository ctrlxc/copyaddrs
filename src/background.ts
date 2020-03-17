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

// browser.mailTabs.onSelectedMessagesChanged.addListener(async () => {
//   const msg = await browser.mailTabs.getSelectedMessages()
//   toCopyHelper(msg.messages)
// })

browser.messageDisplay.onMessageDisplayed.addListener(
  async (_tabId, message) => {
    toCopyHelper([message])
  }
)

async function toCopyHelper(
  messages: browser.messages.MessageHeader[]
): Promise<void> {
  const text = getAddrs(messages).join(',')
  console.log(`selected => ${text}`)

  browser.browserAction.setPopup({
    popup: `copyhelper/index.html?text=${text}`
  })
}

function getAddrs(messages: browser.messages.MessageHeader[]): string[] {
  const addrs = new Map<string, string>() // no duplication address

  for (const m of messages) {
    const addrsInMessage = [
      m.author,
      ...m.recipients,
      ...m.ccList,
      ...m.bccList
    ]

    for (const v of addrsInMessage) {
      const k = realAddr(v)
      addrs.set(k, v)
    }
  }

  return Array.from(addrs.values())
}

function realAddr(v: string): string {
  const regex = /<?([^\s]+@[^\s>]+)>?$/
  const m = v.match(regex)

  if (m && m.length > 1) {
    return m[1]
  }

  return v
}

async function toClipboard(text: string): Promise<boolean> {
  console.log('toClipboard!')

  function onCopy(ev: ClipboardEvent): void {
    console.log(`onCopy! ${text}`)

    document.removeEventListener('copy', onCopy)
    ev.stopImmediatePropagation()
    ev.preventDefault()

    if (ev.clipboardData) {
      ev.clipboardData.setData('text/plain', text)
    }
  }

  document.addEventListener('copy', onCopy)

  return retry(2, 0.1, () => {
    return document.execCommand('copy') // may be false if opened thunderbird's debugger
  }).catch((e) => {
    document.removeEventListener('copy', onCopy)
    throw e
  })
}

async function retry(
  num: number,
  sec: number,
  callback: () => boolean
): Promise<boolean> {
  let b = callback()

  for (let i = 0; !b && i < num; i++) {
    console.log(`retry! [${i + 1}/${num}]`)
    b = await timer(sec, callback)
  }

  if (!b) {
    throw new Error('retry failure')
  }

  return b
}

async function timer<T>(sec: number, callback: () => T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const r = callback()
      resolve(r)
    }, sec * 1000)
  })
}
