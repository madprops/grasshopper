App.setup_tab_box = () => {
  App.update_tab_box_debouncer = App.create_debouncer((what) => {
    App.do_update_tab_box(what)
  }, App.update_tab_box_delay)
}

App.create_tab_box = () => {
  let tab_box = DOM.create(`div`, `box`, `tab_box`)
  let title = DOM.create(`div`, `box_title`, `tab_box_title`)
  title.title = `This is the Tab Box`

  DOM.ev(title, `click`, (e) => {
    App.tab_box_menu(e)
  })

  let pos = App.get_setting(`tab_box_position`)

  if (pos === `top`) {
    tab_box.classList.add(`box_top`)
  }

  tab_box.append(title)
  let container = DOM.create(`div`, `box_container`, `tab_box_container`)
  tab_box.append(container)
  App.tab_box_ready = false
  return tab_box
}

App.check_tab_box = () => {
  if (!App.tab_box_ready) {
    App.set_tab_box_items()
    App.tab_box_ready = true
  }
}

App.update_tab_box = (what) => {
  App.update_tab_box_debouncer.call(what)
}

App.do_update_tab_box = (what) => {
  if (App.get_setting(`tab_box`) === `none`) {
    return
  }

  App.check_tab_box()
  App[`update_tab_box_${what}`]()
}

App.update_tab_box_recent = () => {
  if (!App.tab_box_recent()) {
    return
  }

  let items = App.active_history

  if (!App.get_setting(`tab_box_active`)) {
    items = items.filter(x => !x.active)
  }

  let els = App.get_tab_box_els(items)
  App.fill_tab_box(els)
}

App.update_tab_box_headers = () => {
  if (!App.tab_box_headers()) {
    return
  }

  let items = App.get_header_tabs()
  let els = App.get_tab_box_els(items)
  App.fill_tab_box(els)
}

App.fill_tab_box = (els) => {
  let c = DOM.el(`#tab_box_container`)
  c.innerHTML = ``

  for (let el of els) {
    c.append(el)
  }

  App.scroll_to_top(c)
}

App.get_tab_box_els = (items) => {
  let els = []
  let item_mode = App.get_setting(`tab_box_items`)

  for (let item of items) {
    if (!item || !item.element) {
      continue
    }

    let clone = DOM.create(`div`, `tab_box_item box_item`)

    if (item.active) {
      clone.classList.add(`active_tab_box_item`)
    }

    let ans = App.make_item_icon(item, false)

    if (ans.icon) {
      clone.append(ans.icon)
    }

    if (App.get_color(item)) {
      let c_icon = App.color_icon(App.get_color(item))
      clone.append(c_icon)
    }

    if (item.audible && playing_icon) {
      let playing = DOM.create(`div`, `playing_icon`)
      playing.textContent = playing_icon
      clone.append(playing)
    }

    let text_el = DOM.create(`div`, `box_item_text`)
    let tbm = App.get_setting(`tab_box_mode`)
    let text

    if (tbm === `title`) {
      text = App.get_title(item)
    }
    else if (tbm === `url`) {
      text = item.path
    }

    text = text.substring(0, App.max_text_length).trim()
    text_el.textContent = text
    clone.append(text_el)
    clone.title = item.url

    DOM.ev(clone, `click`, () => {
      if (item_mode === `recent`) {
        App.tabs_action(item)
      }
      else if (item_mode === `headers`) {
        App.tabs_action(item)
      }
    })

    DOM.ev(clone, `auxclick`, (e) => {
      if (e.button !== 1) {
        return
      }

      let cmd = App.get_setting(`middle_click_tabs`)
      App.run_command({cmd: cmd, item: item, from: `middle_click`, e: e})
    })

    DOM.ev(clone, `contextmenu`, (e) => {
      e.preventDefault()
      App.show_item_menu({item: item, e: e})
    })

    els.push(clone)
  }

  return els
}

App.set_tab_box_items = () => {
  let item_mode = App.get_setting(`tab_box_items`)
  let title = DOM.el(`#tab_box_title`)

  if (item_mode === `recent`) {
    title.textContent = `Recent`
  }
  else if (item_mode === `headers`) {
    title.textContent = `Headers`
  }
}

App.change_tab_box_items = (what) => {
  App.set_setting(`tab_box_items`, what)
  App.set_tab_box_items()
  App.update_tab_box(what)
}

App.tab_box_menu = (e) => {
  let items = []
  let sizes = []
  let item_mode = App.get_setting(`tab_box_items`)

  if (item_mode === `recent`) {
    items.push({
      text: `Headers`,
      action: () => {
        App.change_tab_box_items(`headers`)
      }
    })
  }
  else if (item_mode === `headers`) {
    items.push({
      text: `Recent`,
      action: () => {
        App.change_tab_box_items(`recent`)
      }
    })
  }

  App.sep(items)

  for (let [i, size] of App.sizes.entries()) {
    if (App.get_setting(`tab_box`) === size.value) {
      index = i
    }

    sizes.push({
      text: size.text,
      action: (e) => {
        App.set_setting(`tab_box`, size.value)
        App.apply_theme()
      },
    })
  }

  items.push({
    text: `Size`,
    items: sizes,
  })

  items.push({
    text: `Position`,
    items: [
      {
        text: `Top`,
        action: (e) => {
          App.set_setting(`tab_box_position`, `top`)
          App.clear_show()
        },
      },
      {
        text: `Bottom`,
        action: (e) => {
          App.set_setting(`tab_box_position`, `bottom`)
          App.clear_show()
        },
      },
    ],
  })

  items.push({
    text: `Mode`,
    items: [
      {
        text: `Title`,
        action: (e) => {
          App.set_setting(`tab_box_mode`, `title`)
          App.update_tab_box(`recent`)
        },
      },
      {
        text: `URL`,
        action: (e) => {
          App.set_setting(`tab_box_mode`, `url`)
          App.update_tab_box(`recent`)
        },
      },
    ],
  })

  items.push({
    text: `Hide`,
    action: (e) => {
      App.show_confirm({
        message: `Hide the Tab Box?`,
        confirm_action: () => {
          App.set_setting(`tab_box`, `none`)
          App.apply_theme()
        },
      })
    },
  })

  App.show_context({items: items, e: e})
}

App.refresh_tab_box = () => {
  App.update_tab_box(App.get_setting(`tab_box_items`))
}

App.check_tab_box_item = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (App.tab_box_headers()) {
    App.update_tab_box(`headers`)
  }
}

App.tab_box_recent = () => {
  if (App.get_setting(`tab_box`) !== `none`) {
    if (App.get_setting(`tab_box_items`) === `recent`) {
      return true
    }
  }

  return false
}

App.tab_box_headers = () => {
  if (App.get_setting(`tab_box`) !== `none`) {
    if (App.get_setting(`tab_box_items`) === `headers`) {
      return true
    }
  }

  return false
}