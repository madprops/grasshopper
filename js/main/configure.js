// Setup configure
App.setup_configure = function () {
  App.config = App.get_local_storage(App.ls_config)

  if (App.config === null) {
    App.config = App.default_config()
  }

  App.el("#configure_button").addEventListener("click", function () {
    App.show_configure()
  })

  App.el("#configure_history_max_results_input").addEventListener("blur", function () {
    let n = App.only_numbers(this.value)

    if (!isNaN(n)) {
      if (n < 1) {
        n = 1
      }

      if (n > 100000) {
        n = 100000
      }

      App.config.history_max_results = n
      App.save_config()
    }

    App.fill_config()
  })

  App.el("#configure_history_months_input").addEventListener("blur", function () {
    let n = App.only_numbers(this.value)

    if (!isNaN(n)) {
      if (n < 1) {
        n = 1
      }
            
      if (n > 120) {
        n = 120
      }

      App.config.history_months = n
      App.save_config()
    }

    App.fill_config()
  })

  App.el("#configure_max_favorites_input").addEventListener("blur", function () {
    let n = App.only_numbers(this.value)

    if (!isNaN(n)) {
      if (n < 1) {
        n = 1
      }

      if (n > 10000) {
        n = 10000
      }

      App.config.max_favorites = n
      App.save_config()
      App.get_favorites()
    }

    App.fill_config()
  })

  App.el("#configure_defaults").addEventListener("click", function () {
    if (confirm("Are you sure?")) {
      App.config = App.default_config()
      App.save_config()
      App.fill_config()
    }
  })  
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
    App.fill_config()
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
App.fill_config = function () {
  App.el("#configure_history_max_results_input").value = App.locale_number(App.config.history_max_results)
  App.el("#configure_history_months_input").value = App.locale_number(App.config.history_months)
  App.el("#configure_max_favorites_input").value = App.locale_number(App.config.max_favorites)
}