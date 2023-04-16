// Setup media
App.setup_media = () => {
  App.create_media_windows(`image`)
  App.create_media_windows(`video`)
}

// Create media windows
App.create_media_windows = (what) => {
  App.create_window({id: what, setup: () => {
    let media = App.el(`#${what}`)
    let buttons = App.el(`#${what}_buttons`)

    let prev = App.create(`div`, `button`, `${what}_prev`)
    prev.textContent = `<`
    prev.title = `Go To Previous (Left)`
    buttons.append(prev)

    let open = App.create(`div`, `button`, `${what}_open`)
    open.textContent = `Open`
    open.title = `Open Tab (Enter)`
    buttons.append(open)

    let star = App.create(`div`, `button icon_button`, `${what}_star`)
    star.title = `Toggle Star (Space)`
    let star_icon = App.create_icon(`star`)
    star.append(star_icon)
    buttons.append(star)

    let copy = App.create(`div`, `button`, `${what}_copy`)
    copy.textContent = `Copy`
    copy.title = `Copy URL (Up)`
    buttons.append(copy)

    let next = App.create(`div`, `button`, `${what}_next`)
    next.textContent = `>`
    next.title = `Go To Next (Right)`
    buttons.append(next)

    if (what === `image`) {
      App.ev(media, `load`, () => {
        App.stop_media_timeout(what)
        media.classList.remove(`hidden`)
        App.el(`#${what}_loading`).classList.add(`hidden`)
      })
    }
    else if (what === `video`) {
      App.ev(media, `canplay`, () => {
        App.stop_media_timeout(what)
        media.classList.remove(`hidden`)
        App.el(`#${what}_loading`).classList.add(`hidden`)
        media.play()
      })
    }

    App.ev(media, `error`, () => {
      App.media_show_error(what)
    })

    App.ev(media, `click`, () => {
      App.windows[what].hide()
    })

    App.ev(open, `click`, () => {
      App.open_media(what)
    })

    App.ev(star, `click`, () => {
      App.star_media(what)
    })

    App.ev(copy, `click`, () => {
      App.media_copy(what)
    })

    App.ev(App.el(`#${what}_prev`), `click`, () => {
      App.media_prev(what)
    })

    App.ev(App.el(`#${what}_next`), `click`, () => {
      App.media_next(what)
    })
  }, on_hide: () => {
    if (what === `video`) {
      App.stop_video()
    }

    let item = App[`current_${what}_item`]
    App.hide_media_elements(what)
    App.stop_media_timeout(what)
    App.raise_window(item.mode)
  }})
}

// Show media
App.show_media = (what, item) => {
  App.hide_media_elements(what)
  App[`current_${what}_item`] = item
  App.el(`#${what}`).src = item.url
  App.stop_media_timeout(what)

  App[`${what}_loading_timeout`] = setTimeout(() => {
    App.el(`#${what}_loading`).classList.remove(`hidden`)
  }, 500)

  App.el(`#${what}_url`).textContent = item.url
  App.show_window(what)
  App.media_show_loading(what)
  App.check_media_star(what, App.get_star_by_url(item.url))
}

// Hide media
App.hide_media = (what) => {
  App.windows[what].hide()
}

// Stop video
App.stop_video = () => {
  let video = App.el(`#video`)
  video.pause()
  video.src = ``
}

// Hide media
App.hide_media_elements = (what) => {
  App.el(`#${what}`).classList.add(`hidden`)
  App.el(`#${what}_loading`).classList.add(`hidden`)
}

// Stop media timeout
App.stop_media_timeout = (what) => {
  clearTimeout(App[`${what}_loading_timeout`])
}

// Media prev
App.media_prev = (what) => {
  App.cycle_media(App[`current_${what}_item`], what, `prev`)
}

// Media next
App.media_next = (what) => {
  App.cycle_media(App[`current_${what}_item`], what, `next`)
}

// Show prev image
App.cycle_media = (item, what, dir) => {
  let items = App.get_visible_media(item.mode, what)

  if (items.length <= 1) {
    return
  }

  let waypoint = false
  let next_item

  if (dir === `prev`) {
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
App.media_show_loading = (what) => {
  App.el(`#${what}_loading`).textContent = `Loading...`
}

// Media show error
App.media_show_error = (what) => {
  App.el(`#${what}_loading`).textContent = `Error`
}

// Check media
App.check_media = (item) => {
  if (!App.settings.media_viewer) {
    return false
  }

  if (item.image) {
    App.show_media(`image`, item)
    return true
  }

  if (item.video) {
    App.show_media(`video`, item)
    return true
  }

  return false
}

// Check to fill or not the star icon
App.check_media_star = (what, starred) => {
  let use = App.el(`#${what}_star use`)

  if (starred) {
    use.href.baseVal = `#star_solid_icon`
  }
  else {
    use.href.baseVal = `#star_icon`
  }
}

// Toggle star media
App.star_media = (what) => {
  let item = App[`current_${what}_item`]
  let prepend = item.mode === `stars`
  let starred = App.toggle_star(item, prepend)
  App.check_media_star(what, starred)
}

// Open media in tab
App.open_media = (what) => {
  let item = App[`current_${what}_item`]

  if (item.mode === `tabs`) {
    App.focus_tab(item)
  }
  else if (item.mode === `stars`) {
    App.open_star(item)
  }
  else {
    App.focus_or_open_item(item)
  }
}

// Copy media url to clipboard
App.media_copy = (what, feedback = false) => {
  App.copy_to_clipboard(App[`current_${what}_item`].url, feedback)
}