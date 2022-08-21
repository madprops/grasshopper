// Main mode
App.layout = "main"

// For internal checks
App.favorites_need_refresh = false
App.history_fetched = false
App.configure_setup = false

// Local storage paths
App.ls_favorites = "favorites_v1"
App.ls_config = "config_v1"

// Items
App.favorite_items = []
App.history_items = []

App.init = async function () {
  App.setup_items()
  App.setup_keyboard()
  App.setup_list()
  App.setup_info()

  await App.get_config()
  await App.get_favorites()

  if (App.favorites.length > 0) {
    App.show_favorites()
  } else {
    App.get_history()
  }
}

App.init()