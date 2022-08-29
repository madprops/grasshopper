// Default config
App.default_config = function () {
  return {
    history_max_results: 5000,
    history_max_months: 24,
    max_favorites: 2500,
    max_text_length: 200,
    favorite_on_visit: true,
    text_mode: "title",
    both_on_empty: true,
    single_line: true
  }
}

// Get config object
App.get_config = async function () {
  App.config = await App.get_storage(App.ls_config, App.default_config())

  let defs = App.default_config()
  let save = false

  for (let key in defs) {
    if (!App.config.hasOwnProperty(key)) {
      App.config[key] = defs[key]
      save = true
    }
  }

  if (save) {
    App.save_config()
  }
}

// Setup configure
App.setup_configure = function () {
  App.log("Setting up configure")

  App.msg_configure = Msg.factory(Object.assign({}, App.msg_settings_window, {
    after_show: function () {
      App.msg_settings.after_show()
      App.config_edit_obj = Object.assign({}, App.config)
    },
    after_close: function () {
      App.msg_settings.after_close()
      App.on_configure_close()
    } 
  }))

  App.msg_configure.set_title(App.template_configure_title)
  App.msg_configure.set(App.template_configure)

  for (let item of App.els(".configure_item")) {
    let name = item.dataset.name
    let type = item.dataset.type

    if (type === "input") {
      let input = App.el("input", item)
  
      App.ev(input, "blur", function () {
        let n = App.only_numbers(input.value)
        let max = parseInt(item.dataset.max)
        let min = parseInt(item.dataset.min)
  
        if (!isNaN(n)) {
          if (n < min) {
            n = min
          }
  
          if (n > max) {
            n = max
          }
  
          App.config[name] = n
          App.save_config()
        }
  
        App.fill_config_input(item)
      })
    } else if (type === "checkbox") {
      let checkbox = App.el("input", item)
  
      App.ev(checkbox, "change", function () {
        App.config[name] = checkbox.checked
        App.save_config()
        App.fill_config_input(item)
      })      
    } else if (type === "select") {
      let select = App.el("select", item)
  
      App.ev(select, "change", function () {
        App.config[name] = select.value
        App.save_config()
        App.fill_config_input(item)
      })      
    }

    App.ev(App.el(".config_default_button", item), "click", function () {
      if (confirm("Are you sure?")) {
        App.restore_config_default(item)
      }
    })  
  }

  App.ev(App.el("#config_favorites_data"), "click", function () {  
    App.show_favorites_data()
  })

  App.ev(App.el("#config_defaults"), "click", function () {
    if (confirm("Are you sure?")) {
      for (let item of App.els(".configure_item")) {
        App.restore_config_default(item)
      }
    }
  })

  App.configure_ready = true
}

// Restore config default
App.restore_config_default = function (item) {
  let name = item.dataset.name
  App.config[name] = App.default_config()[name]
  App.save_config()
  App.fill_config_input(item)
}

// Save config
App.save_config = async function () {
  await App.save_storage(App.ls_config, App.config)
}

// Show configure
App.show_configure = function () {
  if (!App.configure_ready) {
    App.setup_configure()
  }

  for (let item of App.els(".configure_item")) {
    App.fill_config_input(item)
  }
  
  App.msg_configure.show()
}

// After the config window closes
App.on_configure_close = function () {
  let changed = false

  for (let key in App.config_edit_obj) {
    if (App.config_edit_obj[key] !== App.config[key]) {
      changed = true
      break
    }
  }

  if (changed) {
    App.reload_favorites()
    App.empty_history()
    App.show_favorites()
  }
}

// Fill config
App.fill_config_input = function (item) {
  let name = item.dataset.name
  let type = item.dataset.type
  
  if (type === "input") {
    App.el("input", item).value = App.locale_number(App.config[name])
  } else if (type === "checkbox") {
    App.el("input", item).checked = App.config[name]
  } else if (type === "select") {
    App.el("select", item).value = App.config[name]
  }

  let def = App.el(".config_default_button", item)

  if (App.config[name] === App.default_config()[name]) {
    def.classList.add("hidden")
  } else {
    def.classList.remove("hidden")
  }
}

// Configure favorites data
App.configure_favorites_data = function () {
  App.log("Setting up favorites data")
  App.msg_favorites_data = Msg.factory(Object.assign({}, App.msg_settings))
  App.msg_favorites_data.set_title("Favorites Data")
  App.msg_favorites_data.set(App.template_favorites_data)
  
  App.ev(App.el("#favorites_data_submit"), "click", function () {
    App.submit_favorites_data()
  })

  App.favorites_data_ready = true
}

// Show the favorites data editor
App.show_favorites_data = function () {
  if (!App.favorites_data_ready) {
    App.configure_favorites_data()
  }

  let easy_data = App.to_easy_data(App.favorites)
  App.el("#favorites_data_textarea").value = easy_data
  App.msg_favorites_data.show()
}

// Submit favorites data change
App.submit_favorites_data = function () {
  if (confirm("Are you sure you want to modify the favorites data?")) {
    App.msg_favorites_data.close()
    let value = App.el("#favorites_data_textarea").value
    let new_json = App.from_easy_data(value)
    App.favorites = App.remove_duplicates(new_json)
    App.save_favorites()
    App.reload_favorites()
    App.empty_history()
    App.show_favorites()    
  }
}