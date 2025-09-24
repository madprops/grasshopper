App.image_extensions = [`jpg`, `jpeg`, `png`, `gif`, `webp`, `bmp`]
App.video_extensions = [`mp4`, `webm`]
App.audio_extensions = [`mp3`, `ogg`, `flac`, `wav`]

App.start_media = (what) => {
  if (App.check_ready(`media_${what}`)) {
    return
  }

  App.create_window({
    id: `media_${what}`,
    setup: () => {
      let media = DOM.el(`#media_${what}_player`)
      let buttons = DOM.el(`#media_${what}_buttons`)

      let prev = DOM.create(`div`, `button arrow_button arrow_prev`, `media_${what}_prev`)
      prev.textContent = `<`
      prev.title = `Go To Previous (Left)`
      buttons.append(prev)

      let open = DOM.create(`div`, `button`, `media_${what}_open`)
      open.textContent = `Open`
      open.title = `Open Tab (Enter)`
      buttons.append(open)

      let menu = DOM.create(`div`, `button icon_button`, `media_${what}_menu`)
      menu.title = `Menu (Space)`
      menu.append(App.get_svg_icon(`sun`))
      buttons.append(menu)

      let close = DOM.create(`div`, `button`, `media_${what}_close`)
      close.textContent = App.close_text
      close.title = `Close this window`
      buttons.append(close)

      let next = DOM.create(`div`, `button arrow_button arrow_next`, `media_${what}_next`)
      next.textContent = `>`
      next.title = `Go To Next (Right)`
      buttons.append(next)

      if (what === `image`) {
        DOM.ev(media, `load`, () => {
          App.stop_media_timeout(what)
          DOM.show(media)
          DOM.hide(`#media_${what}_loading`)
        })
      }
      else if ((what === `video`) || (what === `audio`)) {
        DOM.ev(media, `canplay`, () => {
          App.stop_media_timeout(what)
          DOM.show(media)
          DOM.hide(`#media_${what}_loading`)
          media.play()
        })
      }

      DOM.ev(media, `error`, () => {
        App.media_show_error(what)
      })

      DOM.ev(media, `dblclick`, () => {
        App.open_media(what)
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

      DOM.ev(`#media_${what}_prev`, `click`, () => {
        App.media_prev(what)
      })

      DOM.ev(`#media_${what}_next`, `click`, () => {
        App.media_next(what)
      })

      DOM.ev(`#media_${what}_url`, `click`, () => {
        App.media_copy(what)
      })

      DOM.ev(buttons, `wheel`, (e) => {
        App.media_wheel.call(e, what)
      })
    },
    after_hide: () => {
      if ((what === `video`) || (what === `audio`)) {
        App.stop_media_player(what)
      }

      App.hide_media_elements(what)
      App.stop_media_timeout(what)
      App.do_check_scroller()
    },
    colored_top: true,
    cls: `media`,
  })

  App.fill_media_window(what)

  App.media_wheel = App.create_debouncer((e, what) => {
    let direction = App.wheel_direction(e)

    if (direction === `up`) {
      App.media_prev(what)
    }
    else if (direction === `down`) {
      App.media_next(what)
    }
  }, App.wheel_delay)
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

  App.media_o_item = o_item
  App.start_media(what)
  let item = App.soft_copy_item(o_item)
  App.hide_media_elements(what)
  App[`current_media_${what}_item`] = item
  App.current_media_type = what
  DOM.el(`#media_${what}_player`).src = item.url
  App.stop_media_timeout(what)

  App[`media_${what}_loading_timeout`] = setTimeout(() => {
    DOM.show(`#media_${what}_loading`)
  }, 500)

  let url_el = DOM.el(`#media_${what}_url`)
  url_el.textContent = item.url
  url_el.title = item.url
  App.show_window(`media_${what}`)
  App.media_show_loading(what)

  if (App.get_visible_media(item.mode, what).length <= 1) {
    DOM.el(`#media_${what}_prev`).classList.add(`disabled`)
    DOM.el(`#media_${what}_next`).classList.add(`disabled`)
  }
  else {
    DOM.el(`#media_${what}_prev`).classList.remove(`disabled`)
    DOM.el(`#media_${what}_next`).classList.remove(`disabled`)
  }

  if (App.is_filtered(o_item.mode)) {
    App.update_filter_history(o_item.mode)
  }
}

App.stop_media_player = (what) => {
  let player = DOM.el(`#media_${what}_player`)
  player.pause()
  player.src = ``
}

App.hide_media_elements = (what) => {
  DOM.hide(`#media_${what}_player`)
  DOM.hide(`#media_${what}_loading`)
}

App.stop_media_timeout = (what) => {
  clearTimeout(App[`media_${what}_loading_timeout`])
}

App.media_prev = (what = App.current_media_type) => {
  App.cycle_media(App[`current_media_${what}_item`], what, `prev`)
}

App.media_next = (what = App.current_media_type) => {
  App.cycle_media(App[`current_media_${what}_item`], what, `next`)
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
  DOM.el(`#media_${what}_loading`).textContent = `Loading...`
}

App.media_show_error = (what) => {
  DOM.el(`#media_${what}_loading`).textContent = `Unable to load`
}

App.open_media = (what = App.current_media_type) => {
  if ((what === `video`) || (what === `audio`)) {
    App.stop_media_player(what)
  }

  let item = App[`current_media_${what}_item`]
  App.hide_window()
  App.focus_or_open_item(item)
}

App.media_copy = (what) => {
  App.copy_url(App[`current_media_${what}_item`])
}

App.media_background = (what) => {
  if (what === `image`) {
    let item = App[`current_media_${what}_item`]
    App.change_background(item.url)
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

App.on_media = () => {
  return App.window_mode.startsWith(`media_`)
}

App.show_media_menu = (what) => {
  let items = []
  let item = App.current_media_item()

  items.push({
    icon: App.mode_icon(item.mode),
    text: `Select`,
    action: () => {
      App.hide_window()
      App.select_item_by_id(item.mode, item.id)
    },
  })

  items.push({
    icon: App.clipboard_icon,
    text: `Copy URL`,
    action: () => {
      App.media_copy(what)
    },
  })

  items.push({
    icon: App.mode_icon(`bookmarks`),
    text: `Bookmark`,
    action: () => {
      App.bookmark_items({item})
    },
  })

  if (what === `image`) {
    items.push({
      icon: App.settings_icons.theme,
      text: `Background`,
      action: () => {
        App.media_background(what)
      },
    })
  }

  let btn = DOM.el(`#media_${what}_menu`)
  App.show_context({element: btn, items})
}

App.search_media = (mode, e) => {
  let items = []

  for (let type of App.media_types) {
    let subitems = []
    let icon = App.get_setting(`${type}_icon`)

    for (let ext of App[`${type}_extensions`]) {
      subitems.push({text: ext, icon, action: () => {
        App.set_filter_mode({mode, cmd: `filter_media_${type}`, filter: false})
        App.set_filter({mode, text: `.${ext}`})
      }})
    }

    items.push({
      text: App.capitalize(type), icon, action: () => {
        App.show_context({items: subitems, e})
      }})
  }

  App.show_context({items, e})
}

App.scroll_media_up = (what = App.active_mode) => {
  DOM.el(`#window_content_media_${what}`).scrollTop -= App.media_scroll
}

App.scroll_media_down = (what = App.active_mode) => {
  DOM.el(`#window_content_media_${what}`).scrollTop += App.media_scroll
}

App.current_media_item = () => {
  let what = App.current_media_type
  return App[`current_media_${what}_item`]
}

App.is_image = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.image_extensions.includes(extension)
}

App.is_video = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.video_extensions.includes(extension)
}

App.is_audio = (src) => {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.audio_extensions.includes(extension)
}

App.fill_media_window = (what) => {
  let c = DOM.create(`div`, `flex_column_center gap_2`)
  let url = DOM.create(`div`, `media_url action`, `media_${what}_url`)
  c.append(url)
  let mc = DOM.create(`div`, `media_container`, `media_${what}_container`)
  let loading = DOM.create(`div`, `media_loading bigger hidden`, `media_${what}_loading`)
  mc.append(loading)
  let media

  if (what === `image`) {
    media = DOM.create(`img`, `media_player`, `media_${what}_player`)
  }
  else if (what === `video`) {
    media = DOM.create(`video`, `media_player`, `media_${what}_player`)
    media.controls = true
  }
  else if (what === `audio`) {
    media = DOM.create(`audio`, `media_player`, `media_${what}_player`)
    media.controls = true
  }

  mc.append(media)
  c.append(mc)
  DOM.el(`#window_content_media_${what}`).append(c)
  let top = DOM.create(`div`, `flex_row_center gap_2 grow`, `media_${what}_buttons`)
  DOM.el(`#window_top_media_${what}`).append(top)
}

App.open_first_media = (what) => {
  let tabs = App.get_all_tabs()

  for (let tab of tabs) {
    if (tab[what]) {
      App.view_media(tab)
      return
    }
  }
}