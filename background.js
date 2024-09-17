function open_popup(mode) {
  localStorage.setItem(`init_mode`, mode)
  browser.browserAction.openPopup()
}

function commands(num) {
  browser.runtime.sendMessage({action: "browser_command", number: num})
}

browser.commands.onCommand.addListener((command) => {
  // Popups
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
  // Commands
  else if (command === `browser_command_1`) {
    command(1)
  }
  else if (command === `browser_command_2`) {
    command(2)
  }
  else if (command === `browser_command_3`) {
    command(3)
  }
  else if (command === `browser_command_4`) {
    command(4)
  }
  else if (command === `browser_command_5`) {
    command(5)
  }
  else if (command === `browser_command_6`) {
    command(6)
  }
  else if (command === `browser_command_7`) {
    command(7)
  }
  else if (command === `browser_command_8`) {
    command(8)
  }
  else if (command === `browser_command_9`) {
    command(9)
  }
})