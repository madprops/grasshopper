App.setup_box = () => {
  App.update_tab_box_debouncer = App.create_debouncer((clean = false) => {
    if (clean) {
      App.clean_active_history()
    }

    App.do_update_tab_box()
  }, App.tab_box_delay)
}

App.create_box = (mode) => {
  let box = DOM.create(`div`, `box`, `box_${mode}`)
  return box
}

App.update_tab_box = () => {
  App.update_tab_box_debouncer.call()
}

App.do_update_tab_box = () => {
  let c = DOM.el(`#box_tabs`)
  c.innerHTML = ``

  for (let item of App.active_history) {
    if (item.active) {
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

    let text = DOM.create(`div`, `box_item_text`)
    text.textContent = item.title
    clone.append(icon)
    clone.append(text)
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

    c.append(clone)
    App.scroll_to_top(c)
  }
}