App.create_tab_box = () => {
  let tab_box = DOM.create(`div`, `box`, `tab_box`)
  return tab_box
}

App.update_tab_box = () => {
  let c = DOM.el(`#tab_box`)
  c.innerHTML = ``

  for (let item of App.active_history) {
    if (item.active) {
      if (!App.get_setting(`tab_box_active`))
      continue
    }

    let clone = DOM.create(`div`, `box_item action`)
    let icon = DOM.create(`div`, `box_item_icon`)
    let o_icon = DOM.el(`.item_icon`, item.element).cloneNode(true)

    if (o_icon.tagName === `IMG`) {
      icon.append(o_icon)
    }
    else if (o_icon.tagName === `CANVAS`) {
      icon.append(App.get_jdenticon(item.hostname))
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
    clone.append(icon)
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
      App.run_command({cmd: cmd, item: item, from: `middle_click`})
    })

    DOM.ev(clone, `contextmenu`, (e) => {
      e.preventDefault()
      App.show_item_menu(item, e.clientX, e.clientY)
    })

    c.append(clone)
    App.scroll_to_top(c)
  }
}