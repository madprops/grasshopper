// Setup media
App.setup_media = () => {
  App.create_media_windows(`image`)
  App.create_media_windows(`video`)
}

// Create media windows
App.create_media_windows = (what) => {
  App.create_window({id: what, setup: () => {
    let media = DOM.el(`#${what}`)
    let buttons = DOM.el(`#${what}_buttons`)

    let prev = DOM.create(`div`, `button`, `${what}_prev`)
    prev.textContent = `<`
    prev.title = `Go To Previous (Left)`
    buttons.append(prev)

    let open = DOM.create(`div`, `button`, `${what}_open`)
    open.textContent = `Open`
    open.title = `Open Tab (Enter)`
    buttons.append(open)

    let star = DOM.create(`div`, `button icon_button`, `${what}_star`)
    star.title = `Toggle Star (Space)`
    let star_icon = App.create_icon(`star`)
    star.append(star_icon)
    buttons.append(star)

    let copy = DOM.create(`div`, `button`, `${what}_copy`)
    copy.textContent = `Copy`
    copy.title = `Copy URL (Up)`
    buttons.append(copy)

    let next = DOM.create(`div`, `button`, `${what}_next`)
    next.textContent = `>`
    next.title = `Go To Next (Right)`
    buttons.append(next)

    if (what === `image`) {
      DOM.ev(media, `load`, () => {
        App.stop_media_timeout(what)
        media.classList.remove(`hidden`)
        DOM.el(`#${what}_loading`).classList.add(`hidden`)
      })
    }
    else if (what === `video`) {
      DOM.ev(media, `canplay`, () => {
        App.stop_media_timeout(what)
        media.classList.remove(`hidden`)
        DOM.el(`#${what}_loading`).classList.add(`hidden`)
        media.play()
      })
    }

    DOM.ev(media, `error`, () => {
      App.media_show_error(what)
    })

    DOM.ev(media, `click`, () => {
      App.windows[what].hide()
    })

    DOM.ev(open, `click`, () => {
      App.open_media(what)
    })

    DOM.ev(star, `click`, () => {
      App.star_media(what)
    })

    DOM.ev(copy, `click`, () => {
      App.media_copy(what, true)
    })

    DOM.ev(DOM.el(`#${what}_prev`), `click`, () => {
      App.media_prev(what)
    })

    DOM.ev(DOM.el(`#${what}_next`), `click`, () => {
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
  DOM.el(`#${what}`).src = item.url
  App.stop_media_timeout(what)

  App[`${what}_loading_timeout`] = setTimeout(() => {
    DOM.el(`#${what}_loading`).classList.remove(`hidden`)
  }, 500)

  DOM.el(`#${what}_url`).textContent = item.url
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
  let video = DOM.el(`#video`)
  video.pause()
  video.src = ``
}

// Hide media
App.hide_media_elements = (what) => {
  DOM.el(`#${what}`).classList.add(`hidden`)
  DOM.el(`#${what}_loading`).classList.add(`hidden`)
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
  DOM.el(`#${what}_loading`).textContent = `Loading...`
}

// Media show error
App.media_show_error = (what) => {
  DOM.el(`#${what}_loading`).textContent = `Error`
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
  let use = DOM.el(`#${what}_star use`)

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