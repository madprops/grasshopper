// Setup info
App.setup_info = function () {
  App.log("Setting up info")
  App.msg_info = Msg.factory(Object.assign({}, App.msg_settings))
  App.info_ready = true
}

// Setup info window
App.setup_info_window = function () {
  App.log("Setting up info window")
  App.msg_info_window = Msg.factory(Object.assign({}, App.msg_settings_window))
  App.info_window_ready = true
}

// Show the help window
App.show_help = function () {
  if (!App.info_window_ready) {
    App.setup_info_window()
  }

  let lines = [
    "This is an addon to go back to often-used URLs quickly.",
    "There's 2 panes, Recent, and History.",
    "Recent are items you visited recently through this addon.",
    "History shows the recent browser history minus Recent.",
    "Type something to filter the items.",
    "The filter has different modes for more precise search.",
    "Items are ordered by last visit date, most recent at the top.",
    "You can use the arrows to select items up and down.",
    "You can use Tab to switch between Recent and History.",
    "You can use the Delete key to clear the filter.",
    "You can middle click an item to open without exiting.",
    "Some settings are configurable in Configure.",
    "Recent and Configuration are sync'd to your account.",
    "URL Level refers to the path's deepness (aa/bb/cc == 3).",
    "Shift + Space opens an item's menu.",
  ]

  let info = `<div id="help_container">`

  for (let line of lines) {
    info += `<div>${line}</div>`
  }

  info += "</div>"

  App.msg_info_window.set_title("Help")
  App.msg_info_window.show(info)
}

// Show info menu
App.show_info_menu = function () {
  let items = []

  items.push({
    text: "Configure",
    action: function () {
      App.show_configure()
    }
  })

  items.push({
    text: "Help",
    action: function () {
      App.show_help()
    }
  })

  items.push({
    text: "About",
    action: function () {
      App.show_about()
    }
  })

  NeedContext.show_on_element(App.el("#info_button"), items)
}

// Show about information
App.show_about = function () {
  if (!App.info_ready) {
    App.setup_info()
  }

  let manifest = browser.runtime.getManifest()
  let s = `Grasshopper v${manifest.version}`
  let info = `<div id="about_container">`
  info += `<div id="about_text">${s}</div>`
  info += `<div id="about_author">By madprops (2022)</div>`
  info += `<img src="img/icon.jpg" id="about_image">`
  info += `</div>`

  App.msg_info.set_title("About")
  App.msg_info.show(info)
}