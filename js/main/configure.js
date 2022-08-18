// Setup configure
App.setup_configure = function () {
  App.config = App.get_local_storage(App.ls_config)

  if (App.config === null) {
    App.config = App.default_config()
  }

  App.ev(App.el("#configure_button"), "click", function () {
    App.show_configure()
  })

  for (let item of App.els(".configure_item")) {
    let name = item.dataset.name
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

    App.ev(App.el(".config_default_button", item), "click", function () {
      if (confirm("Are you sure?")) {
        App.restore_config_default(item)
      }
    })
  }

  App.ev(App.el("#config_defaults"), "click", function () {
    if (confirm("Are you sure?")) {
      for (let item of App.els(".configure_item")) {
        App.restore_config_default(item)
      }
    }
  })
}

// Restore config default
App.restore_config_default = function (item) {
  let name = item.dataset.name
  App.config[name] = App.default_config()[name]
  App.save_config()
  App.fill_config_input(item)
}

// Default config
App.default_config = function () {
  return {
    history_max_results: 3000,
    history_months: 12,
    max_favorites: 1000,
  }
}

// Save config
App.save_config = function () {
  App.save_local_storage(this.ls_config, App.config)
}

// Show configure
App.show_configure = function () {
  if (App.layout === "main") {
    App.el("#top_container").classList.add("hidden")
    App.el("#list").classList.add("hidden")
    App.el("#configure").classList.remove("hidden")

    for (let item of App.els(".configure_item")) {
      App.fill_config_input(item)
    }

    App.layout = "configure"
  } else {
    App.el("#top_container").classList.remove("hidden")
    App.el("#list").classList.remove("hidden")
    App.el("#configure").classList.add("hidden")
    App.reload_favorites()
    App.empty_history()
    App.show_favorites()
    App.layout = "main"
  }
}

// Fill config
App.fill_config_input = function (item) {
  let name = item.dataset.name
  App.el("input", item).value = App.locale_number(App.config[name])

  let def = App.el(".config_default_button", item)

  if (App.config[name] === App.default_config()[name]) {
    def.classList.add("hidden")
  } else {
    def.classList.remove("hidden")
  }
}