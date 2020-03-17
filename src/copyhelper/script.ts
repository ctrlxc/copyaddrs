async function getCopyText(): Promise<string> {
  const params = new URL(document.location.href).searchParams
  const text = params.get('text')

  if (!text) {
    throw new Error('no text')
  }

  return text
}

async function setClipboard(text: string): Promise<boolean> {
  const elm = document.getElementById('text') as HTMLTextAreaElement
  elm.style.display = 'block'
  elm.value = text || ''
  elm.focus()
  elm.select()

  console.log(`copytext => ${elm.value}`)

  const success = document.execCommand('copy')
  console.log(`copy ${success ? 'success' : 'failure'}`)

  elm.style.display = 'none'

  return success
}

function setMessage(success: boolean, text: string | void): void {
  let elm = document.getElementById('message') as HTMLHeadingElement
  elm.textContent = success
    ? browser.i18n.getMessage('successCopy')
    : browser.i18n.getMessage('failureCopy')

  const addrs = (success ? text || '' : '').split(',')

  const maxlen = 5
  let submessage = ''
  const addSubmessage = (v: string): void => {
    submessage += (submessage.length ? '\n' : '') + v
  }

  for (let i = 0; i < addrs.length; i++) {
    if (i >= maxlen) {
      addSubmessage(`... (${addrs.length - i} more)`)
      break
    }

    addSubmessage(addrs[i])
  }

  elm = document.getElementById('submessage') as HTMLHeadingElement
  elm.innerText = submessage
}

function clearPopup(): void {
  browser.browserAction.setPopup({ popup: null })
  // browser.browserAction.setBadgeText({ text: null })
}

async function main(): Promise<void> {
  try {
    const text = await getCopyText()
    const success = await setClipboard(text)
    setMessage(success, text)
  } catch (e) {
    console.log(e.message)
    setMessage(false)
  } finally {
    clearPopup()
  }
}

main()
