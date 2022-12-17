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

    App.ev(App.el(`#${what}_container`), "wheel", function (e) {
      let direction = e.deltaY > 0 ? "down" : "up"

      if (direction === "up") {
        App.media_prev(what)
      } else if (direction === "down") {
        App.media_next(what)
      }
    })

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

    App.ev(App.el(`#${what}_open`), "click", function () {
      let item = App[`current_${what}_item`]

      if (item.mode === "tabs") {
        App.focus_tab(item)
      } 
      
      else if (item.mode === "stars") {
        App.open_star(item)
      } 
      
      else {
        App.focus_or_open_item(item)
      }
    })

    App.ev(App.el(`#${what}_copy`), "click", function () {
      App.copy_to_clipboard(App[`current_${what}_item`].url)
    })

    App.ev(App.el(`#${what}_star`), "click", function () {
      App.add_or_edit_star(App[`current_${what}_item`])
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
    App.select_media_item(item)
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

  App.el(`#${what}_copy`).title = item.url
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

// Select media item in the item window
App.select_media_item = function (item) {
  if (App.item_order.includes(item.mode)) {
    App.select_item(item)
  }
}