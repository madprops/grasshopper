function open_popup(mode) {
  localStorage.setItem(`init_mode`, mode)
  browser.browserAction.openPopup()
}

function commands(num) {
  browser.runtime.sendMessage({action: "browser_commands", number: num})
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
  else if (command === `browser_commands_1`) {
    commands(1)
  }
  else if (command === `browser_commands_2`) {
    commands(2)
  }
  else if (command === `browser_commands_3`) {
    commands(3)
  }
  else if (command === `browser_commands_4`) {
    commands(4)
  }
  else if (command === `browser_commands_5`) {
    commands(5)
  }
  else if (command === `browser_commands_6`) {
    commands(6)
  }
  else if (command === `browser_commands_7`) {
    commands(7)
  }
  else if (command === `browser_commands_8`) {
    commands(8)
  }
  else if (command === `browser_commands_9`) {
    commands(9)
  }
})