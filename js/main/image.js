// Setup image
App.setup_image = function () {
  App.create_window({id: "image", setup: function () {
    let img = App.el("#image")

    App.ev(App.el("#image_container"), "click", function () {
      App.hide_image()
    })

    App.ev(img, "load", function () {
      clearTimeout(App.image_loading_timeout)
      img.classList.remove("hidden")
      App.el("#image_loading").classList.add("hidden")
    })

    App.ev(App.el("#image_title"), "click", function () {
      App.focus_or_open_item(App.current_image_item)
    })
  }, on_hide: function () {
    App.show_last_window()
  }})
}

// Show image
App.show_image = function (item) {
  App.show_window("image")
  let img = App.el("#image")
  let loading = App.el("#image_loading")
  
  img.classList.add("hidden")
  loading.classList.add("hidden")

  App.el("#image_title").textContent = item.url
  App.current_image_item = item
  img.src = item.url
  
  App.image_loading_timeout = setTimeout(function () {
    loading.classList.remove("hidden")
  }, 500)
}

// Hide image
App.hide_image = function () {
  clearTimeout(App.image_loading_timeout)
  App.windows["image"].hide()
}