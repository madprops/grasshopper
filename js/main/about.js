// Setup about
App.setup_about = function () {
  App.create_window({id: "about", setup: function () {
    App.about_info_items = [
      "Switch item windows with the top-left menu or (Shift) Tab",
      "Up, Down, and Enter keys to navigate and pick items",
      "Type anytime to filter items, press Tab to carry the filter",
      "Right Click or Shift + Enter to show context menus",
      "Use Middle Click to either close items or launch items",
      "Shift + Middle Click on items to bypass confirmations",
      "Actions only apply to visible or highlighted items",
      "Some buttons respond to mousewheel and keyboard",
      "Shift + Click to select multiple items",
      "Shift + Drag to select multiple items",
      "Shift + Down to open the filter mode",
      "Shift + Space to open actions",
    ]

    App.about_info_index = 0

    App.ev(App.el("#about_info_prev"), "click", function () {
      App.prev_about_info()
    })

    App.ev(App.el("#about_info_next"), "click", function () {
      App.next_about_info()
    })

    let manifest = browser.runtime.getManifest()
    let s = `Grasshopper v${manifest.version}`
    App.el("#about_name").textContent = s
    App.update_about_info()
  }})
}

// Update about info
App.update_about_info = function () {
  App.el("#about_info").textContent = App.about_info_items[App.about_info_index]
}

// Previous about info
App.prev_about_info = function () {
  App.about_info_index -= 1

  if (App.about_info_index < 0) {
    App.about_info_index = App.about_info_items.length - 1
  }

  App.update_about_info()
}

// Next about info
App.next_about_info = function () {
  App.about_info_index += 1

  if (App.about_info_index >= App.about_info_items.length) {
    App.about_info_index = 0
  }

  App.update_about_info()
}