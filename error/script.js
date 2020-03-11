showError()
clearPopup()

function showError() {
  const params = (new URL(document.location)).searchParams
  const error = params.get('error') || 'Unknown Error!'
  document.getElementById("error").innerHTML = error
}

function clearPopup() {
  browser.browserAction.setPopup({popup: null})
  browser.browserAction.setBadgeText({text: null})
}
