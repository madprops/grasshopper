function open_popup() {
  browser.browserAction.openPopup()
}

function set_item(what, value) {
  localStorage.setItem(what, value)
}

function open_popup_mode(mode) {
  set_item(`init_mode`, mode)
  open_popup()
}

function browser_command(num) {
  browser.runtime.sendMessage({action: "browser_command", number: num})
}

async function popup_command(num) {
  set_item(`init_popup_command`, num)
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