// Arrange items depending on space
App.setup_info = function () {
  App.ev(App.el("#configure_button"), "click", function () {  
    App.show_configure()
  })
  
  App.ev(App.el("#help_button"), "click", function () {
    App.show_help()
  })

  let manifest = browser.runtime.getManifest()
  App.el("#version").textContent = `v${manifest.version}`
}

// Create the help message
App.setup_help = function () {
  App.log("Setting up help")
  App.msg_help = Msg.factory(Object.assign({}, App.msg_settings_window))

  let lines = [
    "This is a tool to go back to often-used URLs quickly.",
    "There's 2 modes, Favorites, and History.",
    "Favorites are items you save by clicking the icons on the left.",
    "History searches the browser history so you can save favorites.",
    "History is only fetched when necessary, so it's fast.",
    "Opening a history item will automatically add it to favorites.",
    "Type something to filter the items.",
    "The filter has different modes for more precise search.",
    "Items are ordered by last visit date, most recent at the top.",
    "You can use the arrows to select items up and down.",
    "You can use Tab to switch between Favorites and History.",
    "You can use Shift + Enter to add/remove a favorite.",
    "You can use the Delete key to clear the filter.",
    "You can middle click an item to open without exiting.",
    "Some settings are configurable in Configure.",
    "Favorites and Configuration are sync'd to your account.",
    "URL Level refers to the path's deepness (aa/bb/cc == 3).",
    "Shift + Clicking Favorites or History activates both buttons.",
    "When both buttons are active all results will appear.",
    "If filtering in one mode yields no results, both buttons activate.",
    "You can also use Shift + Tab to select both buttons.",
    "Shift + Space opens an item's menu.",
    "Shift + ArrowDown shows the quick add favorite.",
  ]

  let info = `<div id="help_container">`

  for (let line of lines) {
    info += `<div>${line}</div>`
  }

  info += "</div>"


  App.msg_help.set_title("Information")
  App.msg_help.set(info)
  App.help_ready = true
}

// Show the help window
App.show_help = function () {
  if (!App.help_ready) {
    App.setup_help()
  }
    
  App.msg_help.show()
}