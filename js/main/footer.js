App.update_footer_info_debouncer = App.create_debouncer((item) => {
  App.do_update_footer_info(item)
}, App.footer_delay)

App.update_footer_info = (item) => {
  if (App.get_setting(`show_footer`)) {
    App.update_footer_info_debouncer.call(item)
  }
}

App.do_update_footer_info = (item) => {
  App.update_footer_info_debouncer.cancel()

  if (item) {
    App.footer_item = item
    App.set_footer_info(item.mode, item.footer)
  }
  else {
    App.empty_footer_info()
  }
}

App.empty_footer_info = () => {
  App.footer_item = undefined
  App.set_footer_info(App.window_mode, `No Results`)
}

App.set_footer_info = (mode, text) => {
  let footer = App.get_footer(mode)

  if (footer) {
    let info = DOM.el(`.footer_info`, footer)
    info.textContent = text
    info.title = `Click to go to bottom`
  }
}

App.get_footer = (mode) => {
  return DOM.el(`#${mode}_footer`)
}

App.create_footer = (mode) => {
  let footer = DOM.create(`div`, `footer`, `${mode}_footer`)

  let footer_count = DOM.create(`div`, `footer_count`, `${mode}_footer_count`)
  footer.append(footer_count)

  let footer_info = DOM.create(`div`, `footer_info`, `${mode}_footer_info`)
  footer.append(footer_info)

  DOM.ev(footer, `click`, (e) => {
    if (e.ctrlKey) {
      return
    }

    if (e.shiftKey) {
      App.select_to_edge(mode, `down`)
    }

    App.goto_bottom(mode)
  })

  DOM.ev(footer, `contextmenu`, (e) => {
    let items = []

    items.push({
      text: `Copy URL`,
      action: () => {
        App.copy_url(App.get_selected())
      }
    })

    items.push({
      text: `Copy Title`,
      action: () => {
        App.copy_title(App.get_selected())
      },
      selected: true,
    })

    e.preventDefault()
    NeedContext.show(e.clientX, e.clientY, items)
  })

  DOM.ev(footer, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_footer`)

      if (cmd !== `none`) {
        App.run_command({cmd: cmd, from: `footer`})
      }
    }
  })

  return footer
}

App.footer_count_debouncer = App.create_debouncer((mode) => {
  App.do_update_footer_count(mode)
}, App.footer_delay)

App.update_footer_count = (mode) => {
  if (App.get_setting(`show_footer`)) {
    App.footer_count_debouncer.call(mode)
  }
}

App.do_update_footer_count = (mode) => {
  App.footer_count_debouncer.cancel()
  let n1 = App.selected_items(mode).length
  let n2 = App.get_visible(mode).length
  let count

  if (n1 > 1) {
    count= `(${n1}/${n2})`
  }
  else {
    count = `(${n2})`
  }

  DOM.el(`#${mode}_footer_count`).textContent = count
}