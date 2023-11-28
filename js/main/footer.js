App.setup_footer = () => {
  App.footer_count_debouncer = App.create_debouncer((mode) => {
    App.do_update_footer_count(mode)
  }, App.footer_delay)

  App.update_footer_info_debouncer = App.create_debouncer((item) => {
    App.do_update_footer_info(item)
  }, App.footer_delay)
}

App.update_footer_info = (item) => {
  App.update_footer_info_debouncer.call(item)
}

App.do_update_footer_info = (item) => {
  App.update_footer_info_debouncer.cancel()

  if (!App.get_setting(`show_footer`)) {
    return
  }

  if (item) {
    let info

    if (item.header) {
      info = `Header: ${item.title}`
    }
    else {
      info = item.footer
    }

    App.footer_item = item
    App.set_footer_info(item.mode, info)
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
    info.title = text
  }
}

App.get_footer = (mode) => {
  return DOM.el(`#${mode}_footer`)
}

App.create_footer = (mode) => {
  let footer = DOM.create(`div`, `footer`, `${mode}_footer`)

  if (mode === `tabs`) {
    let tab_box_btn = DOM.create(`div`, `grower`, `footer_tab_box`)
    tab_box_btn.append(App.create_icon(`arrow_up`))
    tab_box_btn.title = `Toggle Tab Box`

    DOM.ev(tab_box_btn, `click`, () => {
      App.toggle_tab_box()
    })

    footer.append(tab_box_btn)
  }

  let footer_content = DOM.create(`div`, `footer_content glow`)
  let footer_count = DOM.create(`div`, `footer_count`, `${mode}_footer_count`)
  footer_content.append(footer_count)
  let footer_info = DOM.create(`div`, `footer_info`, `${mode}_footer_info`)
  footer_content.append(footer_info)

  DOM.ev(footer_content, `click`, (e) => {
    if (e.shiftKey || e.ctrlKey) {
      return
    }

    App.goto_bottom(mode)
  })

  DOM.ev(footer_content, `contextmenu`, (e) => {
    e.preventDefault()

    let cmds = [
      `copy_item_url`,
      `copy_item_title`,
    ]

    let items = App.cmd_list(cmds)
    App.show_context({items: items, e: e})
  })

  DOM.ev(footer_content, `auxclick`, (e) => {
    if (e.button === 1) {
      let cmd = App.get_setting(`middle_click_footer`)
      App.run_command({cmd: cmd, from: `footer`, e: e})
    }
  })

  footer.append(footer_content)
  return footer
}

App.update_footer_count = (mode) => {
  App.footer_count_debouncer.call(mode)
}

App.do_update_footer_count = (mode) => {
  App.footer_count_debouncer.cancel()

  if (!App.get_setting(`show_footer`)) {
    return
  }

  let el = DOM.el(`#${mode}_footer_count`)

  if (App.get_setting(`show_footer_count`)) {
    el.classList.remove(`hidden`)
  }
  else {
    el.classList.add(`hidden`)
    return
  }

  let n1 = App.selected_items(mode).length
  let n2 = App.get_visible(mode).length
  let count

  if (n1 > 1) {
    count= `(${n1}/${n2})`
  }
  else {
    count = `(${n2})`
  }

  el.textContent = count
}