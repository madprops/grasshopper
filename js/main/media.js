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
        App.stop_media_timeout(what)
        media.classList.remove("hidden")
        App.el(`#${what}_loading`).classList.add("hidden")
      })
    } else if (what === "video") {
      App.ev(media, "canplay", function () {
        App.stop_media_timeout(what)
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

    App.hide_media_elements(what)
    App.stop_media_timeout(what)
    App.show_last_window()
  }})
}

// Show media
App.show_media = function (what, item) {
  App.hide_media_elements(what)
  App[`current_${what}_item`] = item
  App.el(`#${what}`).src = item.url
  
  App[`${what}_loading_timeout`] = setTimeout(function () {
    App.el(`#${what}_loading`).classList.remove("hidden")
  }, 500)

  App.show_window(what)
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

// Hide media
App.hide_media_elements = function (what) {
  App.el(`#${what}`).classList.add("hidden")
  App.el(`#${what}_loading`).classList.add("hidden")
}

// Stop media timeout
App.stop_media_timeout = function (what) {
  clearTimeout(App[`${what}_loading_timeout`])
}