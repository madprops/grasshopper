// Setup media
App.setup_media = function () {
  App.create_media_windows("image")
  App.create_media_windows("video")
}

// Create media windows
App.create_media_windows = function (what) {
  App.create_window({id: what, setup: function () {
    let media = App.el(`#${what}`)

    if (what === "image") {
      App.ev(media, "load", function () {
        App.stop_media_timeout(what)
        media.classList.remove("hidden")
        App.el(`#${what}_loading`).classList.add("hidden")
      })
    }
    else if (what === "video") {
      App.ev(media, "canplay", function () {
        App.stop_media_timeout(what)
        media.classList.remove("hidden")
        App.el(`#${what}_loading`).classList.add("hidden")
        media.play()
      })
    }

    App.ev(media, "error", function () {
      App.media_show_error(what)
    })

    App.ev(App.el(`#${what}_open`), "click", function () {
      let item = App[`current_${what}_item`]

      if (item.mode === "tabs") {
        App.focus_tab(item)
      }
      else {
        App.focus_or_open_item(item)
      }
    })

    App.ev(App.el(`#${what}_copy`), "click", function () {
      App.copy_to_clipboard(App[`current_${what}_item`].url)
    })

    App.ev(App.el(`#${what}_prev`), "click", function () {
      App.media_prev(what)
    })

    App.ev(App.el(`#${what}_next`), "click", function () {
      App.media_next(what)
    })
  }, on_hide: function () {
    if (what === "video") {
      App.stop_video()
    }

    let item = App[`current_${what}_item`]
    App.hide_media_elements(what)
    App.stop_media_timeout(what)
    App.raise_window(item.mode)
    App.select_item(item)
  }})

  App.el(`#${what}_prev`).title = "Go To Previous"
  App.el(`#${what}_next`).title = "Go To Next"
}

// Show media
App.show_media = function (what, item) {
  App.hide_media_elements(what)
  App[`current_${what}_item`] = item
  App.el(`#${what}`).src = item.url
  App.stop_media_timeout(what)

  App[`${what}_loading_timeout`] = setTimeout(function () {
    App.el(`#${what}_loading`).classList.remove("hidden")
  }, 500)

  App.el(`#${what}_url`).textContent = item.url
  App.show_window(what)
  App.media_show_loading(what)
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

// Media prev
App.media_prev = function (what) {
  App.cycle_media(App[`current_${what}_item`], what, "prev")
}

// Media next
App.media_next = function (what) {
  App.cycle_media(App[`current_${what}_item`], what, "next")
}

// Show prev image
App.cycle_media = function (item, what, dir) {
  let items = App.get_visible_media(item.mode, what)

  if (items.length <= 1) {
    return
  }

  let waypoint = false
  let next_item

  if (dir === "prev") {
    items.reverse()
  }

  for (let it of items) {
    if (!it[what] || !it.visible) {
      continue
    }

    if (waypoint) {
      next_item = it
      break
    }

    if (it === item) {
      waypoint = true
    }
  }

  if (!next_item) {
    next_item = items[0]
  }

  App.show_media(what, next_item)
}

// Media show loading
App.media_show_loading = function (what) {
  App.el(`#${what}_loading`).textContent = "Loading..."
}

// Media show error
App.media_show_error = function (what) {
  App.el(`#${what}_loading`).textContent = "Error"
}

// Check media
App.check_media = function (item) {
  if (!App.settings.media_viewer) {
    return false
  }

  if (item.image) {
    App.show_media("image", item)
    return true
  }

  if (item.video) {
    App.show_media("video", item)
    return true
  }

  return false
}