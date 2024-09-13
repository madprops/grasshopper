function open_popup(mode) {
  localStorage.setItem(`init_mode`, mode)
  browser.browserAction.openPopup()
}

browser.commands.onCommand.addListener((command) => {
  if (command === `popup_tabs`) {
    open_popup(`tabs`)
  }
  else if (command === `popup_history`) {
    open_popup(`history`)
  }
  else if (command === `popup_bookmarks`) {
    open_popup(`bookmarks`)
  }
  else if (command === `popup_closed`) {
    open_popup(`closed`)
  }
})