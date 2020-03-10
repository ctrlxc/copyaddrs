browser.browserAction.onClicked.addListener(async (_) => {
  const msg = await browser.mailTabs.getSelectedMessages()
  // const msg = {messages: [{author: 1, recipients: [2], ccList: [3], bccList: [4]}]}
  console.log(msg)
  if (msg.messages.length === 0) {
    return;
  }

  const addrs = getAddrs(msg.messages)
  console.log(addrs)

  const text = addrs.join(",")

  toClipboard(text)
})

function getAddrs(messages) {
  var addrs = []

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
  document.execCommand("copy")
}

