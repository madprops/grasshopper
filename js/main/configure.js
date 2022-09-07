// Default config
App.default_config = function () {
  return {
    history_max_results: 2000,
    history_max_months: 12,
    max_recent: 2000,
    text_mode: "title",
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
  App.ev(App.el("#configure_button"), "click", function () {  
    App.show_configure()
  })

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

  App.msg_configure.set_title("Configure")
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
    App.start_items()
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