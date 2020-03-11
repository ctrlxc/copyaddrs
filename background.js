browser.browserAction.onClicked.addListener(async (_) => {
  const msg = await browser.mailTabs.getSelectedMessages()

  if (msg.messages.length === 0) {
    return
  }

  const addrs = getAddrs(msg.messages)
  console.log(addrs)

  const text = addrs.join(",")

  toClipboard(text).catch((_) => {
    setError("Copy Failure!")
  })
})

function getAddrs(messages) {
  let addrs = new Map() // no duplication address

  for (const m of messages) {
    const addrsInMessage = [
      m.author,
      ...m.recipients,
      ...m.ccList,
      ...m.bccList,
    ]

    for (const v of addrsInMessage) {
      const k = realAddr(v)
      addrs.set(k, v)
    }
  }

  return Array.from(addrs.values())
}

function realAddr(v) {
  const regex = /<?([^\s]+@[^\s>]+)>?$/
  const m = v.match(regex)

  if ( m && m.length > 1 ) {
    return m[1]
  }

  return v
}

async function toClipboard(text) {
  console.log('toClipboard!')

  function onCopy(ev) {
    console.log(`onCopy! ${text}`)
    document.removeEventListener("copy", onCopy)
    ev.stopImmediatePropagation()
    ev.preventDefault()
    ev.clipboardData.setData("text/plain", text)
  }

  document.addEventListener("copy", onCopy)
  
  return retry(2, 0.1, () => {
    return document.execCommand("copy") // may be false if opened thunderbird's debugger
  }).catch((e) => {
    document.removeEventListener("copy", onCopy)
    throw e
  })
}

async function retry(num, sec, callback) {
  let b = callback()

  for (let i = 0; !b && i < num; i++) {
    console.log(`retry! [${i+1}/${num}]`)
    b = await timer(sec, callback)
  }

  if (!b) {
    throw new Error("retry failure")
  }

  return b
}

async function timer(sec, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const b = callback()
      resolve(b)
    }, sec * 1000)
  })
}

function setError(msg) {
  console.log(`[error] ${msg}`)
  browser.browserAction.setPopup({popup: `error/index.html?error=${msg}`})
  browser.browserAction.setBadgeText({text: "1"})
}

// [for test]
// browser.messageDisplay.onMessageDisplayed.addListener(async (_tabId, message) => {
//   console.log(message)

//   const addrs = getAddrs([message])
//   console.log(addrs)

//   const text = addrs.join(",")

//   toClipboard(text)
// })
