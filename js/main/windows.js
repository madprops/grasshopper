App.create_window = (args) => {
  if (args.close_button === undefined) {
    args.close_button = true
  }

  if (args.align_top === undefined) {
    args.align_top = `center`
  }

  if (args.show_top === undefined) {
    args.show_top = true
  }

  if (args.cls === undefined) {
    args.cls = `normal`
  }

  if (args.persistent === undefined) {
    args.persistent = true
  }

  let w = {}
  let el = DOM.create(`div`, `window_main window_main_${args.cls}`, `window_${args.id}`)
  let top, top_html

  if (args.show_top) {
    let extra_cls = ``

    if (args.colored_top) {
      extra_cls = ` colored_top`
    }

    top = DOM.create(`div`, `window_top window_top_${args.align_top} window_top_${args.cls}${extra_cls}`, `window_top_${args.id}`)
    top_html = App.get_template(`${args.id}_top`)

    if (top_html) {
      top.innerHTML = top_html
    }

    el.append(top)
  }

  let middle = DOM.create(`div`, `window_middle window_middle_${args.cls}`, `window_middle_${args.id}`)
  el.append(middle)
  let content = DOM.create(`div`, `window_content window_content_${args.cls}`, `window_content_${args.id}`)
  let content_html

  if (args.element) {
    content.append(args.element.cloneNode(true))
  }
  else {
    let content_html = App.get_template(args.id)

    if (content_html) {
      content.innerHTML = content_html
    }
  }

  el.append(content)
  w.element = el
  DOM.el(`#main_center`).append(el)
  w.setup = false
  w.visible = false

  w.check_setup = () => {
    if (args.setup) {
      if (!args.persistent || !w.setup) {
        args.setup()
        w.setup = true
        App.debug(`Setup Window: ${args.id}`)
      }
    }
  }

  w.rebuild = () => {
    if (args.element) {
      content.innerHTML = ``
      content.append(args.element.cloneNode(true))
    }
    else {
      content.innerHTML = content_html
    }

    if (top_html) {
      top.innerHTML = top_html
    }
  }

  w.clear = () => {
    content.innerHTML = ``
    top.innerHTML = ``
  }

  w.show = (scroll = true) => {
    if (!args.persistent) {
      w.rebuild()
    }

    w.check_setup()
    App.hide_all_windows()

    if (args.main_top) {
      DOM.show(`#main_top`)
    }
    else {
      DOM.hide(`#main_top`)
    }

    if (args.main_bottom) {
      DOM.show(`#main_bottom`)
    }
    else {
      DOM.hide(`#main_bottom`)
    }

    w.element.style.display = `flex`

    if (App.window_mode !== args.id) {
      App.last_window_mode = App.window_mode
      App.window_mode = args.id
    }

    if (scroll) {
      content.scrollTop = 0
    }

    if (args.after_show) {
      args.after_show()
    }
  }

  w.hide = (bypass = false) => {
    if (!bypass && args.on_hide) {
      args.on_hide(args.id)
    }
    else {
      App.show_last_window()

      if (args.after_hide) {
        args.after_hide(args.id)
      }
    }
  }

  App.windows[args.id] = w
}

App.hide_all_windows = () => {
  for (let id in App.windows) {
    App.windows[id].element.style.display = `none`
  }
}

App.show_window = (mode) => {
  App.debug(`Show Window: ${mode}`)

  if (App.on_items(mode)) {
    App.do_show_mode({mode})
  }
  else {
    App.windows[mode].show()
  }
}

App.show_last_window = () => {
  App.raise_window(App.last_window_mode)
}

App.raise_window = (mode) => {
  App.windows[mode].show(false)
}

App.setup_window = () => {
  DOM.ev(document.documentElement, `mouseenter`, () => {
    App.mouse_inside = true

    if (App.get_setting(`auto_restore`) !== `never`) {
      App.clear_restore()
    }

    App.clear_context_auto_hide()
    App.remove_auto_blur()
    App.mouse_inside_check()
  })

  DOM.ev(document.documentElement, `mouseleave`, () => {
    App.mouse_inside = false
    App.reset_triggers()

    if (App.dragging) {
      return
    }

    if (App.get_setting(`auto_restore`) !== `never`) {
      App.start_auto_restore()
    }

    App.start_context_auto_hide()
    App.auto_blur()
    App.mouse_inside_check()
  })
}

App.start_context_auto_hide = () => {
  if (!App.get_setting(`autohide_context`)) {
    return
  }

  App.clear_context_auto_hide()

  App.context_auto_hide_timeout = setTimeout(() => {
    App.hide_context()
    App.hide_palette()
  }, App.context_auto_hide_delay)
}

App.clear_context_auto_hide = () => {
  clearTimeout(App.context_auto_hide_timeout)
}

App.window_goto_top = (mode) => {
  DOM.el(`#window_content_${mode}`).scrollTop = 0
}

App.window_goto_bottom = (mode) => {
  let el = DOM.el(`#window_content_${mode}`)
  el.scrollTop = el.scrollHeight
}

App.hide_window = (bypass = false) => {
  if (App.on_items()) {
    return
  }

  App.windows[App.window_mode].hide(bypass)
}

App.make_window_visible = () => {
  DOM.show(`#all`)
}

App.close_window = () => {
  window.close()
}

App.get_window_menu_items = async (item) => {
  let wins = await browser.windows.getAll({populate: false})
  let items = []

  items.push({
    text: `New Window`,
    action: () => {
      App.move_tabs_to_new_window(item)
    },
  })

  for (let win of wins) {
    if (item.window_id === win.id) {
      continue
    }

    let text = `${win.title.substring(0, 25).trim()} (ID: ${win.id})`

    items.push({
      text,
      action: () => {
        App.move_tabs_to_window(item, win.id)
      },
    })
  }

  return items
}

App.show_windows_menu = async (item, e) => {
  let items = await App.get_window_menu_items(item)

  if (items) {
    let element = item?.element
    let title_icon = App.window_icon
    App.show_context({items, e, title: `Windows`, title_icon, element})
  }
}

App.toggle_auto_blur = () => {
  let setting = !App.get_setting(`auto_blur`)
  App.set_setting({setting: `auto_blur`, value: setting, refresh: true})
  App.check_refresh_settings()

  if (setting) {
    App.footer_message(`Auto Blur Enabled`)
  }
  else {
    App.footer_message(`Auto Blur Disabled`)
  }
}

App.build_shell = () => {
  let top_c = DOM.el(`#main_top`)
  let bottom_c = DOM.el(`#main_bottom`)
  top_c.innerHTML = ``
  bottom_c.innerHTML = ``

  let title = App.create_main_title()
  top_c.append(title)

  let tab_box = App.create_tab_box()
  bottom_c.append(tab_box)

  let footer = App.create_footer()
  bottom_c.append(footer)
}

App.focus_window_menu = async () => {
  let wins = await browser.windows.getAll({populate: false})
  let items = []

  for (let win of wins) {
    if (App.window_id === win.id) {
      continue
    }

    let text = `${win.title.substring(0, 25).trim()} (ID: ${win.id})`

    items.push({
      text,
      action: () => {
        App.focus_a_window(win.id)
      },
    })
  }

  return items
}

App.show_focus_a_window = async (e) => {
  let items = await App.focus_window_menu()

  if (items) {
    let title_icon = App.window_icon
    App.show_context({items, e, title: `Windows`, title_icon})
  }
}

App.focus_a_window = async (id) => {
  await browser.windows.update(id, {focused: true})
}