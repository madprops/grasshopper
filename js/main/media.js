// Setup media
App.setup_media = function () {
  App.create_media_windows("image")
  App.create_media_windows("video")
}

// Create media windows
App.create_media_windows = function (what) {
  App.create_window({id: what, setup: function () {
    let media = App.el(`#${what}`)

    App.ev(App.el(`#${what}_container`), "click", function () {
      App.hide_media(what)
    })

    if (what === "image") {
      App.ev(media, "load", function () {
        clearTimeout(App[`${what}_loading_timeout`])
        media.classList.remove("hidden")
        App.el(`#${what}_loading`).classList.add("hidden")
      })
    } else if (what === "video") {
      App.ev(media, "canplay", function () {
        clearTimeout(App[`${what}_loading_timeout`])
        media.classList.remove("hidden")
        App.el(`#${what}_loading`).classList.add("hidden")
        media.play()
      })
    }

    App.ev(App.el(`#${what}_open`), "click", function () {
      App.focus_or_open_item(App[`current_${what}_item`])
    })

    App.ev(App.el(`#${what}_copy`), "click", function () {
      App.copy_to_clipboard(App[`current_${what}_item`].url)
    })
  }, on_hide: function () {
    if (what === "video") {
      App.stop_video()
    }

    clearTimeout(App[`${what}_loading_timeout`])
    App.show_last_window()
  }})
}

// Show media
App.show_media = function (what, item) {
  App.show_window(what)
  let media = App.el(`#${what}`)
  let loading = App.el(`#${what}_loading`)
  
  media.classList.add("hidden")
  loading.classList.add("hidden")

  App[`current_${what}_item`] = item
  media.src = item.url
  
  App[`${what}_loading_timeout`] = setTimeout(function () {
    loading.classList.remove("hidden")
  }, 500)
}

// Hide media
App.hide_media = function (what) {
  App.windows[what].hide()
}

// Stop video
App.stop_video = function () {
  let video = App.el("#video")
  video.pause()
  video.src = ""
}