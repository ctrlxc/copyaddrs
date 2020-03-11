clearError()

function clearError() {
  browser.browserAction.setPopup({popup: null})
  browser.browserAction.setBadgeText({text: null})
}
