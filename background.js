browser.browserAction.onClicked.addListener(async (_) => {
  const msg = await browser.mailTabs.getSelectedMessages()

  if (msg.messages.length === 0) {
    return;
  }

  const addrs = getAddrs(msg.messages)
  console.log(addrs)

  const text = addrs.join(",")
  toClipboard(text)
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

function toClipboard(text) {
  console.log('toClipboard!')

  function onCopy(e) {
    console.log('onCopy!')
    document.removeEventListener("copy", onCopy, true)
    e.stopImmediatePropagation()
    e.preventDefault()
    e.clipboardData.setData("text/plain", text)
  }

  document.addEventListener("copy", onCopy, true)

  retry(2, 0.2, () => {
    return document.execCommand("copy") // may be false if opened thunderbird's debugger
  }).catch((_) => {
    console.log("copy failure!")
    setError(true)
  })
}

function setError(e) {
  browser.browserAction.setPopup({popup: e ? "error/index.html" : null})
  browser.browserAction.setBadgeText({text: e ? "1" : null})
}

async function timer(sec, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const b = callback()
      resolve(b)
    }, sec * 1000)
  })
}

async function retry(num, sec, callback) {
  let b = callback()

  for ( let i = 0; !b && i < num; i++ ) {
    console.log(`retry! [${i+1}/${num}]`)
    b = await timer(sec, callback)
  }

  return b ? Promise.resolve() : Promise.reject()
}

// [for test]
// browser.messageDisplay.onMessageDisplayed.addListener(async (_tabId, message) => {
//   console.log(message)

//   const addrs = getAddrs([message])
//   console.log(addrs)

//   const text = addrs.join(",")

//   toClipboard(text)
// })
