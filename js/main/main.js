// For internal checks
App.favorites_need_refresh = false
App.history_fetched = false
App.mouse_over_disabled = true
App.configure_ready = false
App.help_ready = false
App.edit_ready = false
App.modal_open = false

// Local storage paths
App.ls_favorites = "favorites_v1"
App.ls_config = "config_v1"

// Items
App.favorite_items = []
App.history_items = []

App.init = async function () {
  App.setup_windows()
  App.setup_items()
  App.setup_list()
  App.setup_info()
  App.setup_keyboard()

  await App.get_config()
  await App.get_favorites()

  if (App.favorites.length > 0) {
    App.show_favorites()
  } else {
    App.get_history()
  }
}

App.init()