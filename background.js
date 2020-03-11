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
  let addrs = []

  for (const m of messages) {
    addrs = addrs.concat([
      ...[m.author],
      ...m.recipients,
      ...m.ccList,
      ...m.bccList,
    ])
  }

  return [...new Set(addrs)]
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
  const b = document.execCommand("copy") // may be false if opened thunderbird's debugger

  if (b) {
    return
  }

  retryTimer(5, 0.2, () => {
    console.log("retry copy")
    return document.execCommand("copy")
  }).catch((_) => {
    console.log("copy failture!")
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

async function retryTimer(num, sec, callback) {
  let b = false
  for ( let i = 0; i < num; i++ ) {
    b = await timer(sec, callback)
    if (b) break
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
