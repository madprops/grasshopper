// Setup image
App.setup_image = function () {
  App.create_window({id: "image", setup: function () {
    App.ev(App.el("#image"), "click", function () {
      App.hide_image()
    })

    App.ev(App.el("#image_title"), "click", function () {
      App.focus_tab(App.current_image_item)
    })
  }, on_hide: function () {
    App.show_last_window()
  }})
}

// Show image
App.show_image = function (item) {
  App.show_window("image")
  App.el("#image").src = item.url
  App.el("#image_title").textContent = item.url
  App.current_image_item = item
}

// Hide image
App.hide_image = function () {
  App.windows["image"].hide()
}