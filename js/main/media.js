App.setup_media = () => {
  for (let type of App.media_types) {
    App.create_media_windows(type)
  }
}

App.create_media_windows = (what) => {
  App.create_window({id: what, setup: () => {
    let media = DOM.el(`#${what}`)
    let buttons = DOM.el(`#${what}_buttons`)

    let prev = DOM.create(`div`, `button arrow_prev`, `${what}_prev`)
    prev.textContent = `<`
    prev.title = `Go To Previous (Left)`
    buttons.append(prev)

    let open = DOM.create(`div`, `button`, `${what}_open`)
    open.textContent = `Open`
    open.title = `Open Tab (Enter)`
    buttons.append(open)

    let menu = DOM.create(`div`, `button icon_button`, `${what}_menu`)
    menu.title = `Menu (Space)`
    menu.append(App.create_icon(`sun`))
    buttons.append(menu)

    let close = DOM.create(`div`, `button`, `${what}_close`)
    close.textContent = `Close`
    close.title = `Close this window`
    buttons.append(close)

    let next = DOM.create(`div`, `button arrow_next`, `${what}_next`)
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
    else if (what === `video` || what === `audio`) {
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

    DOM.ev(open, `click`, () => {
      App.open_media(what)
    })

    DOM.ev(menu, `click`, () => {
      App.show_media_menu(what)
    })

    DOM.ev(close, `click`, () => {
      App.hide_window()
    })

    DOM.ev(DOM.el(`#${what}_prev`), `click`, () => {
      App.media_prev(what)
    })

    DOM.ev(DOM.el(`#${what}_next`), `click`, () => {
      App.media_next(what)
    })

    DOM.ev(buttons, `wheel`, (e) => {
      App.media_wheel.call(e, what)
    })
  }, after_hide: () => {
    if (what === `video` || what === `audio`) {
      App.stop_media_player(what)
    }

    App.hide_media_elements(what)
    App.stop_media_timeout(what)
  }, colored_top: true, cls: `media`})
}

App.get_media_type = (item) => {
  for (let type of App.media_types) {
    if (item[type]) {
      return type
    }
  }
}

App.view_media = (o_item) => {
  let what = App.get_media_type(o_item)

  if (!what) {
    return
  }

  let item = App.soft_copy_item(o_item)
  App.hide_media_elements(what)
  App[`current_${what}_item`] = item
  App[`current_media_type`] = what
  let container = DOM.el(`#${what}`)

  if (what === `text`) {
    container.data = item.url
  }
  else {
    container.src = item.url
  }

  App.stop_media_timeout(what)

  App[`${what}_loading_timeout`] = setTimeout(() => {
    DOM.el(`#${what}_loading`).classList.remove(`hidden`)
  }, 500)

  let url_el = DOM.el(`#${what}_url`)
  url_el.textContent = item.url
  url_el.title = item.url
  App.show_window(what)
  App.media_show_loading(what)

  if (App.get_visible_media(item.mode, what).length <= 1) {
    DOM.el(`#${what}_prev`).classList.add(`disabled`)
    DOM.el(`#${what}_next`).classList.add(`disabled`)
  }
  else {
    DOM.el(`#${what}_prev`).classList.remove(`disabled`)
    DOM.el(`#${what}_next`).classList.remove(`disabled`)
  }
}

App.stop_media_player = (what) => {
  let player = DOM.el(`#${what}`)
  player.pause()
  player.src = ``
}

App.hide_media_elements = (what) => {
  if (what === `text`) {
    return
  }

  DOM.el(`#${what}`).classList.add(`hidden`)
  DOM.el(`#${what}_loading`).classList.add(`hidden`)
}

App.stop_media_timeout = (what) => {
  clearTimeout(App[`${what}_loading_timeout`])
}

App.media_prev = (what = App.window_mode) => {
  App.cycle_media(App[`current_${what}_item`], what, `prev`)
}

App.media_next = (what = App.window_mode) => {
  App.cycle_media(App[`current_${what}_item`], what, `next`)
}

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
      if (it.url !== item.url) {
        next_item = it
        break
      }
    }

    if (it.id === item.id) {
      waypoint = true
    }
  }

  if (!next_item) {
    next_item = items[0]
  }

  App.view_media(next_item)
}

App.media_show_loading = (what) => {
  if (what === `text`) {
    return
  }

  DOM.el(`#${what}_loading`).textContent = `Loading...`
}

App.media_show_error = (what) => {
  DOM.el(`#${what}_loading`).textContent = `Error`
}

App.open_media = (what = App.window_mode) => {
  if (what === `video` || what === `audio`) {
    App.stop_media_player(what)
  }

  let item = App[`current_${what}_item`]
  App.focus_or_open_item(item)
}

App.media_copy = (what) => {
  App.copy_url(App[`current_${what}_item`])
}

App.media_background = (what = App.window_mode) => {
  if (what === `image`) {
    App.change_background(App[`current_${what}_item`].url)
  }
}

App.get_visible_media = (mode, what) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (item[what]) {
      items.push(item)
    }
  }

  return items
}

App.media_wheel = App.create_debouncer((e, what) => {
  let direction = App.wheel_direction(e)

  if (direction === `down`) {
    App.media_next(what)
  }
  else if (direction === `up`) {
    App.media_prev(what)
  }
}, App.wheel_delay)

App.on_media = () => {
  return App.media_types.includes(App.window_mode)
}

App.show_media_menu = async (what) => {
  let items = []
  let item = App.current_media_item()

  items.push({
    text: `Copy URL`,
    action: () => {
      App.media_copy(what)
    }
  })

  if (item.mode !== `bookmarks`) {
    let bmarked = await App.all_bookmarked(item)

    if (!bmarked) {
      items.push({
        text: `Bookmark `,
        action: () => {
          App.bookmark_items(item)
        }
      })
    }
  }

  if (what === `image`) {
    items.push({
      text: `Background`,
      action: () => {
        App.media_background(what)
      }
    })
  }

  let btn = DOM.el(`#${what}_menu`)
  NeedContext.show_on_element(btn, items)
}

App.search_media = (mode) => {
  let items = []

  for (let type of App.media_types) {
    let subitems = []

    for (let ext of App[`${type}_extensions`]) {
      subitems.push({text: ext, action: () => {
        App.set_filter_mode(mode, type, false)
        App.set_filter(mode, `.${ext}`)
      }})
    }

    items.push({text: App.capitalize(type), items: subitems})
  }

  return items
}

App.scroll_media_up = (what = App.window_mode) => {
  DOM.el(`#window_content_${what}`).scrollTop -= App.media_scroll
}

App.scroll_media_down = (what = App.window_mode) => {
  DOM.el(`#window_content_${what}`).scrollTop += App.media_scroll
}

App.current_media_item = () => {
  let what = App[`current_media_type`]
  return App[`current_${what}_item`]
}