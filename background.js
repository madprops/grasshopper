function open_popup(mode) {
  localStorage.setItem(`init_mode`, mode)
  browser.browserAction.openPopup()
}

function browser_command(num) {
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
    browser_command(1)
  }
  else if (command === `browser_command_2`) {
    browser_command(2)
  }
  else if (command === `browser_command_3`) {
    browser_command(3)
  }
  else if (command === `browser_command_4`) {
    browser_command(4)
  }
  else if (command === `browser_command_5`) {
    browser_command(5)
  }
  else if (command === `browser_command_6`) {
    browser_command(6)
  }
  else if (command === `browser_command_7`) {
    browser_command(7)
  }
  else if (command === `browser_command_8`) {
    browser_command(8)
  }
  else if (command === `browser_command_9`) {
    browser_command(9)
  }
})