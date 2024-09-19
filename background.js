function open_popup(mode) {
  localStorage.setItem(`init_mode`, mode)
  browser.browserAction.openPopup()
}

function browser_command(num) {
  browser.runtime.sendMessage({action: "browser_command", number: num})
}

async function popup_command(num) {
  localStorage.setItem(`init_popup_command`, num)
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