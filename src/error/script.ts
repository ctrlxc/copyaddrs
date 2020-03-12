showError()
clearPopup()

function showError(): void {
  const params = new URL(document.location.href).searchParams
  const error = params.get('error') || 'Unknown Error!'
  const elm = document.getElementById('error')
  if (elm) {
    // eslint-disable-next-line no-unsanitized/property
    elm.innerHTML = error
  }
}

function clearPopup(): void {
  browser.browserAction.setPopup({ popup: null })
  browser.browserAction.setBadgeText({ text: null })
}
