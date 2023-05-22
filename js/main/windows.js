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
    top = DOM.create(`div`, `window_top window_top_${args.align_top} window_top_${args.cls}`, `window_top_${args.id}`)
    top_html = App.get_template(`${args.id}_top`)

    if (top_html) {
      top.innerHTML = top_html
    }

    if (args.close_button) {
      let x = DOM.create(`div`, `window_x action`)
      x.textContent = `x`
      top.append(x)

      DOM.ev(x, `click`, () => {
        if (args.on_x) {
          args.on_x()
        }
        else {
          w.hide()
        }
      })
    }

    el.append(top)
  }

  let content = DOM.create(`div`, `window_content window_content_${args.cls}`, `window_content_${args.id}`)
  let content_html = App.get_template(args.id)

  if (content_html) {
    content.innerHTML = content_html
  }

  el.append(content)
  w.element = el
  DOM.el(`#main`).append(el)
  w.setup = false
  w.visible = false

  w.check_setup = () => {
    if (args.setup) {
      if (!args.persistent || !w.setup) {
        args.setup()
        w.setup = true
        App.log(`${args.id} window setup`)
      }
    }
  }

  w.show = (scroll = true) => {
    if (!args.persistent) {
      content.innerHTML = content_html

      if (top_html) {
        top.innerHTML = top_html
      }
    }

    w.check_setup()
    App.hide_all_windows()
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

  w.hide = () => {
    if (args.on_hide) {
      args.on_hide()
    }
    else {
      App.show_first_window()

      if (args.after_hide) {
        args.after_hide()
      }
    }
  }

  App.windows[args.id] = w
}

App.hide_window = (w) => {
  w.element.style.display = `none`
}

App.hide_all_windows = () => {
  for (let id in App.windows) {
    App.hide_window(App.windows[id])
  }
}

App.show_window = (mode) => {
  if (App.on_item_window(mode)) {
    App.show_item_window(mode)
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
  DOM.ev(window, `blur`, () => {
    NeedContext.hide()
  })
}

App.window_goto_top = (mode) => {
  DOM.el(`#window_content_${mode}`).scrollTop = 0
}

App.window_goto_bottom = (mode) => {
  let el = DOM.el(`#window_content_${mode}`)
  el.scrollTop = el.scrollHeight
}