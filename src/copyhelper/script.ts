function setClipboard(): void {
  const params = new URL(document.location.href).searchParams
  const text = params.get('text')
  const elm = document.getElementById('text') as HTMLTextAreaElement

  elm.style.display = 'block'
  elm.value = text || ''
  elm.focus()
  elm.select()

  const success = document.execCommand('copy')
  if (success) {
    clearPopup()
  } else {
    console.log('copy failture!')
  }

  elm.style.display = 'none'
}

function clearPopup(): void {
  browser.browserAction.setPopup({ popup: null })
  browser.browserAction.setBadgeText({ text: null })
}

// function showError(): void {
//   const params = new URL(document.location.href).searchParams
//   const error = params.get('error') || 'Unknown Error!'
//   const elm = document.getElementById('error')
//   if (elm) {
//     // eslint-disable-next-line no-unsanitized/property
//     elm.innerHTML = error
//   }
// }

setClipboard()
