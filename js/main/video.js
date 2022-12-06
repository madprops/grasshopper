// Setup video
App.setup_video = function () {
  App.create_window({id: "video", setup: function () {
    let vid = App.el("#video")

    App.ev(App.el("#video_container"), "click", function () {
      App.hide_video()
    })

    App.ev(vid, "canplay", function () {
      clearTimeout(App.video_loading_timeout)
      vid.classList.remove("hidden")
      App.el("#video_loading").classList.add("hidden")
      vid.play()
    })

    App.ev(App.el("#video_title"), "click", function () {
      App.focus_or_open_item(App.current_video_item)
    })
  }, on_hide: function () {
    App.stop_video()
    clearTimeout(App.video_loading_timeout)
    App.show_last_window()
  }})
}

// Show video
App.show_video = function (item) {
  App.show_window("video")
  let vid = App.el("#video")
  let loading = App.el("#video_loading")
  
  vid.classList.add("hidden")
  loading.classList.add("hidden")

  App.el("#video_title").textContent = item.url
  App.current_video_item = item
  vid.src = item.url
  
  App.video_loading_timeout = setTimeout(function () {
    loading.classList.remove("hidden")
  }, 500)
}

// Hide video
App.hide_video = function () {
  App.windows["video"].hide()
}

// Stop video
App.stop_video = function () {
  let vid = App.el("#video")
  vid.pause()
  vid.src = ""
}