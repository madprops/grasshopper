// Setup configure
App.setup_configure = function () {
  App.config = App.get_local_storage(App.ls_config)

  if (App.config === null) {
    App.config = App.default_config()
  }

  App.el("#configure_button").addEventListener("click", function () {
    App.show_configure()
  })

  for (let item of App.els(".configure_item")) {
    let name = item.dataset.name
    let input = App.el("input", item)

    input.addEventListener("blur", function () {
      let n = App.only_numbers(input.value)

      if (!isNaN(n)) {
        if (n < item.dataset.min) {
          n = item.dataset.min
        }

        if (n > item.dataset.max) {
          n = item.dataset.max
        }

        App.config[name] = n
        App.save_config()
      }

      App.fill_config_input(item)
    })

    App.el(".config_default_button", item).addEventListener("click", function () {
      if (confirm("Are you sure?")) {
        App.config[name] = App.default_config()[name]
        App.save_config()
        App.fill_config_input(item)
      }
    })
  }
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
}