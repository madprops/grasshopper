App.setup_windows = function () {
  let settings = {
    class: "blue",
    enable_titlebar: true,
    window_x: "inner_right",
    disable_content_padding: true,
  }

  let settings_window = Object.assign({
    window_height: "100vh",
    window_min_height: "100vh",
    window_max_height: "100vh",
    window_width: "100vw",
    window_min_width: "100vw",
    window_max_width: "100vw",
  }, settings)

  App.msg_help = Msg.factory(Object.assign(settings_window, {}))
  App.msg_edit = Msg.factory(Object.assign(settings, {}))

  let edit_html = `<input id="edit_input" type="text">`
  edit_html += `<div id="edit_submit" class="action unselectable">Submit</div>`
  App.msg_edit.set(edit_html)

  App.ev(App.el("#edit_submit"), "click", function () {
    App.submit_edit()
  })
}

// Show a help message
App.show_help = function () {
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
  ]

  let s = `<div id="help_container">`

  for (let line of lines) {
    s += `<div class="help_item">${line}</div>`
  }

  s += "</div>"

  App.msg_help.show(["Information", s])
}

App.prompt = function (title, value, callback) {
  App.edit_callback = callback
  App.msg_edit.set_title(title)
  
  App.msg_edit.show(function () {
    let input = App.el("#edit_input")
    input.value = value
    input.focus()
  })
}

App.submit_edit = function () {
  if (App.edit_callback) {
    App.edit_callback(App.el("#edit_input").value.trim())
  }

  App.msg_edit.close()
}