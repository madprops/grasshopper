// Open the popup
function open_popup() {
  browser.browserAction.openPopup()
}

// Set local storage to read at init
function set_item(what, value) {
  localStorage.setItem(`init_${what}`, value)
}

// Open the popup in a specific mode
function open_popup_mode(mode) {
  set_item(`mode`, mode)
  open_popup()
}

// Run a browser command
// Could be the sidebar
function browser_command(num) {
  browser.runtime.sendMessage({action: "browser_command", number: num})
}

// Open the popup and run a command
async function popup_command(num) {
  set_item(`popup_command`, num)
  open_popup()
}

browser.commands.onCommand.addListener((command) => {
  if (command === `popup_tabs`) {
    open_popup_mode(`tabs`)
  }
  else if (command === `popup_history`) {
    open_popup_mode(`history`)
  }
  else if (command === `popup_bookmarks`) {
    open_popup_mode(`bookmarks`)
  }
  else if (command === `popup_closed`) {
    open_popup_mode(`closed`)
  }
  else if (command.startsWith(`browser_command_`)) {
    let num = command.split(`_`).at(-1)

    if (num) {
      browser_command(num)
    }
  }
  else if (command.startsWith(`popup_command_`)) {
    let num = command.split(`_`).at(-1)

    if (num) {
      popup_command(num)
    }
  }
})