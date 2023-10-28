App.create_tab_box = () => {
  let tab_box = DOM.create(`div`, `box`, `tab_box`)
  let title = DOM.create(`div`, `box_title action`, `tab_box_title`)
  title.textContent = `Recent Tabs`
  title.title = `This is the Tab Box`

  DOM.ev(title, `click`, (e) => {
    App.tab_box_menu(e)
  })

  tab_box.append(title)
  let container = DOM.create(`div`, `box_container`, `tab_box_container`)
  tab_box.append(container)
  return tab_box
}

App.update_tab_box = () => {
  let c = DOM.el(`#tab_box_container`)
  c.innerHTML = ``

  for (let item of App.active_history) {
    if (item.active) {
      if (!App.get_setting(`tab_box_active`))
      continue
    }

    let clone = DOM.create(`div`, `box_item action`)
    let icon = DOM.create(`div`, `box_item_icon`)
    let o_icon = DOM.el(`.item_icon`, item.element).cloneNode(true)
    let playing_icon = App.get_setting(`playing_icon`)

    if (o_icon.tagName === `IMG`) {
      icon.append(o_icon)
    }
    else if (o_icon.tagName === `CANVAS`) {
      icon.append(App.get_jdenticon(item.hostname))
    }

    clone.append(icon)

    if (item.custom_color) {
      let c_icon = App.color_icon(item.custom_color)
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
      text = item.url
    }

    text = text.substring(0, App.max_text_length).trim()
    text_el.textContent = text
    clone.append(text_el)
    clone.title = item.url

    DOM.ev(clone, `click`, () => {
      App.tabs_action(item)
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

    c.append(clone)
    App.scroll_to_top(c)
  }
}

App.tab_box_menu = (e) => {
  let items = []
  let index = 0

  for (let [i, size] of App.sizes.entries()) {
    if (App.get_setting(`tab_box`) === size.value) {
      index = i
    }

    items.push({
      text: size.text,
      action: (e) => {
        App.set_setting(`tab_box`, size.value)
        App.apply_theme()
      },
    })
  }

  App.show_context({items: items, x: e.clientX, y: e.clientY, index: index})
}