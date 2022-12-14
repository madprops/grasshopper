// Setup about
App.setup_about = function () {
  App.create_window({id: "about", setup: function () {
    App.about_info_items = [
      "Explore with the top-left menu or (Shift) Tab",
      "Up, Down, and Enter keys to navigate and pick items",
      "Type anytime to filter items, press Tab to reuse",
      "Use Middle Click to close or remove items",
      "Shift + Middle Click on items to bypass confirmations",
      "Some buttons respond to mousewheel and keyboard",
      "Shift + Up/Down to select multiple items",
      "Ctrl + Click to select multiple items",
      "Shift + Click to select item range",
      "Right Click to show context menus",
      "Shift + Enter to show context menus",
      "Ctrl + A to pick all items",
      "Delete key removes items",
      "Ctrl + Left togles Main Menu",
      "Ctrl + Down toggles Filter Modes",
      "Ctrl + Right toggles Actions",
      "Ctrl + Up goes to playing tab",
      "Arrows, Enter, and Space work in media"
    ]

    App.about_info_index = 0

    App.ev(App.el("#about_info"), "click", function () {
      App.show_full_about_info()
    })

    let image = App.el("#about_image")

    App.ev(image, "click", function () {
      if (image.classList.contains("hue_rotate")) {
        image.classList.remove("hue_rotate")
        image.classList.add("invert")
      }
      else if (image.classList.contains("invert")) {
        image.classList.remove("invert")
      }
      else {
        image.classList.add("hue_rotate")
      }
    })

    let info_full = App.el("#about_info_full")

    for (let item of App.about_info_items) {
      let el = App.create("div")
      el.textContent = item + "."
      info_full.append(el)
    }

    let manifest = browser.runtime.getManifest()
    let s = `Grasshopper v${manifest.version}`
    App.el("#about_name").textContent = s
    App.update_about_info()
  }, after_show: function () {
    App.start_about_info()
  }, on_hide: function () {
    App.stop_about_info()
    App.show_last_window()
  }, persistent: false})
}

// Update about info
App.update_about_info = function () {
  App.el("#about_info").textContent = App.about_info_items[App.about_info_index]
}

// Previous about info
App.prev_about_info = function (manual = true) {
  if (manual) {
    App.stop_about_info()
  }

  App.about_info_index -= 1

  if (App.about_info_index < 0) {
    App.about_info_index = App.about_info_items.length - 1
  }

  App.update_about_info()
}

// Next about info
App.next_about_info = function (manual = true) {
  if (manual) {
    App.stop_about_info()
  }

  App.about_info_index += 1

  if (App.about_info_index >= App.about_info_items.length) {
    App.about_info_index = 0
  }

  App.update_about_info()
}

// Start about info
App.start_about_info = function () {
  App.el("#about_info").classList.remove("hidden")
  App.el("#about_image").classList.remove("hidden")
  App.el("#about_info_full").classList.add("hidden")

  App.about_info_interval = setInterval(function () {
    App.next_about_info(false)
  }, 3000)
}

// Stop about info
App.stop_about_info = function () {
  clearInterval(App.about_info_interval)
}

// Show full about info
App.show_full_about_info = function () {
  App.stop_about_info()
  App.el("#about_info").classList.add("hidden")
  App.el("#about_image").classList.add("hidden")
  App.el("#about_info_full").classList.remove("hidden")
}