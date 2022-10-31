// Get local storage
App.get_storage = function (name, def) {
  let obj

  if (localStorage[name]) {
    try {
      obj = JSON.parse(localStorage.getItem(name))
    } catch (err) {
      localStorage.removeItem(name)
      obj = def
    }
  } else {
    obj = def
  }

  return obj
}

// Save local storage
App.save_storage = function (name, obj) {
  localStorage.setItem(name, JSON.stringify(obj))
}

// Get state
App.get_state = function () {
  App.state = App.get_storage(App.ls_state, {})
  let changed = false

  if (!App.state.text_mode) {
    App.state.text_mode = "title"
    changed = true
  }

  if (!App.state.history_results) {
    App.state.history_results = "normal"
    changed = true
  }

  if (!App.state.theme) {
    App.state.theme = "dark"
    changed = true
  }

  if (!App.state.font_color) {
    App.state.font_color = "#ffffff"
    changed = true
  }

  if (!App.state.background_color) {
    App.state.background_color = "#252933"
    changed = true
  }  

  if (changed) {
    App.save_state()
  }
}

// Save state
App.save_state = function () {
  App.save_storage(App.ls_state, App.state)
}