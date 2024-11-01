App.setup_footer = () => {
  App.footer_count_debouncer = App.create_debouncer(() => {
    App.do_update_footer_count()
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

  if (App.footer_showing_message) {
    return
  }

  if (!App.get_setting(`show_footer`)) {
    return
  }

  let pre = ``
  let info = ``
  let mode = App.active_mode

  if (item) {
    if ((mode === `bookmarks`) && item.parent_id) {
      let folder = App.get_bookmarks_folder_by_id(item.parent_id)

      if (folder) {
        let length = App.get_setting(`bookmarks_footer_folder`)

        if (length > 0) {
          let title = folder.title
          pre = title || ``
          pre = pre.slice(0, length)
        }
      }
    }

    if (item.header) {
      info = item.header_title
    }
    else {
      info = item.footer
    }
  }

  if (pre) {
    info = `${pre} | ${info}`.trim()
  }

  if (info) {
    App.set_footer_info(info)
  }
  else {
    App.empty_footer_info()
  }
}

App.empty_footer_info = () => {
  App.set_footer_info(``)
}

App.set_footer_info = (text) => {
  let footer = DOM.el(`#footer`)

  if (footer) {
    let info = DOM.el(`#footer_info`)
    info.textContent = App.check_caps(text)
  }
}

App.create_footer = () => {
  let footer = DOM.create(`div`, ``, `footer`)

  if (App.get_setting(`show_footer_tab_box`)) {
    let tab_box_btn = DOM.create(`div`, `footer_button grower`, `footer_tab_box`)
    tab_box_btn.append(App.get_svg_icon(`arrow_up`))

    if (App.tooltips()) {
      let click = App.get_cmd_name(`toggle_tab_box`)
      tab_box_btn.title = `Click: ${click}`
    }

    footer.append(tab_box_btn)
  }

  let tips = App.tooltips()
  let footer_content = DOM.create(`div`, `glow`, `footer_content`)
  let footer_count = DOM.create(`div`, ``, `footer_count`)

  if (tips) {
    let click = App.get_cmd_name(`select_all_items`)
    footer_count.title = `Number of items\nClick: ${click}`
    App.footer_tips(footer_count)
  }

  footer_content.append(footer_count)
  let footer_info = DOM.create(`div`, ``, `footer_info`)

  if (tips) {
    App.footer_tips(footer_info)
  }

  footer_content.append(footer_info)
  footer.append(footer_content)

  if (App.get_setting(`show_footer_buttons`)) {
    let btn_up = DOM.create(`div`, `footer_button grower footer_ghost`, `footer_up_tabs`)
    btn_up.textContent = App.up_arrow_icon
    footer.append(btn_up)

    let btn_down = DOM.create(`div`, `footer_button grower footer_ghost`, `footer_down_tabs`)
    btn_down.textContent = App.down_arrow_icon

    if (App.tooltips()) {
      let cmd_1 = App.get_cmd_name(`move_tabs_to_top`)
      let cmd_2 = App.get_cmd_name(`select_items_above`)
      let cmd_3 = App.get_cmd_name(`page_up`)
      let cmd_4 = App.get_cmd_name(`jump_tabs_all_up`)

      let up_tips = [
        `Click: ${cmd_1}`,
        `Middle Click: ${cmd_2}`,
        `Shift + Click: ${cmd_3}`,
        `Ctrl + Click: ${cmd_4}`,
      ]

      btn_up.title = up_tips.join(`\n`)

      cmd_1 = App.get_cmd_name(`move_tabs_to_bottom`)
      cmd_2 = App.get_cmd_name(`select_items_below`)
      cmd_3 = App.get_cmd_name(`page_down`)
      cmd_4 = App.get_cmd_name(`jump_tabs_all_down`)

      let down_tips = [
        `Click: ${cmd_1}`,
        `Middle Click: ${cmd_2}`,
        `Shift + Click: ${cmd_3}`,
        `Ctrl + Click: ${cmd_4}`,
      ]

      btn_down.title = down_tips.join(`\n`)
    }

    footer.append(btn_down)
  }

  return footer
}

App.update_footer_count = () => {
  App.footer_count_debouncer.call()
}

App.do_update_footer_count = () => {
  App.footer_count_debouncer.cancel()

  if (!App.get_setting(`show_footer`)) {
    return
  }

  let el = DOM.el(`#footer_count`)

  if (App.get_setting(`show_footer_count`)) {
    DOM.show(el)
  }
  else {
    DOM.hide(el)
    return
  }

  let mode = App.active_mode
  let n1 = App.selected_items(mode).length
  let n2 = App.get_visible(mode).length
  let count

  if (n1 > 1) {
    count = `(${n1}/${n2})`
  }
  else {
    count = `(${n2})`
  }

  el.textContent = count
}

App.set_show_footer = (what) => {
  App.set_setting({setting: `show_footer`, value: what})
  App.check_refresh_settings()
}

App.init_footer = () => {
  if (App.get_setting(`show_footer`)) {
    App.show_footer()
  }
  else {
    App.hide_footer()
  }
}

App.refresh_footer = () => {
  App.update_footer_count()
  App.update_footer_info(App.get_selected(App.active_mode))
}

App.show_footer = (refresh = false, set = false) => {
  App.main_add(`show_footer`)

  if (refresh) {
    App.refresh_footer()
  }

  if (set) {
    App.set_show_footer(true)
  }
}

App.hide_footer = (set = false) => {
  App.main_remove(`show_footer`)

  if (set) {
    App.set_show_footer(false)
  }
}

App.toggle_footer = () => {
  if (App.get_setting(`show_footer`)) {
    App.hide_footer(true)
  }
  else {
    App.show_footer(true, true)
  }
}

App.footer_message = (msg) => {
  clearTimeout(App.footer_message_timeout)
  App.set_footer_info(msg)
  App.footer_showing_message = true

  App.footer_message_timeout = setTimeout(() => {
    App.footer_showing_message = false
    App.restore_footer_info()
  }, App.footer_message_delay)
}

App.restore_footer_info = () => {
  App.update_footer_info(App.get_selected(App.active_mode))
}

App.show_footer_menu = (e) => {
  let items = App.custom_menu_items({
    name: `footer_menu`,
  })

  let compact = App.get_setting(`compact_footer_menu`)
  App.show_context({items, e, compact})
}

App.footer_tips = (el) => {
  App.trigger_title(el, `click_footer`)
  App.trigger_title(el, `double_click_footer`)
  App.trigger_title(el, `middle_click_footer`)
  App.trigger_title(el, `click_press_footer`)
  App.trigger_title(el, `middle_click_press_footer`)
  App.trigger_title(el, `wheel_up_footer`)
  App.trigger_title(el, `wheel_down_footer`)
  App.trigger_title(el, `wheel_up_shift_footer`)
  App.trigger_title(el, `wheel_down_shift_footer`)
}

App.footer_double_click = (e) => {
  let cmd = App.get_setting(`double_click_footer`)
  App.run_command({cmd, from: `footer`, e})
}

App.footer_click = (e) => {
  let cmd = App.get_setting(`click_footer`)
  App.run_command({cmd, from: `footer`, e})
}

App.footer_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_footer`)
  App.run_command({cmd, from: `footer`, e})
}

App.footer_up_click = (e) => {
  let mode = App.active_mode

  if (e.shiftKey) {
    App.scroll_page(mode, `up`)
    return
  }
  else if (e.ctrlKey) {
    App.jump_tabs_all(true)
    return
  }

  App.move_tabs_vertically(`up`)
}

App.footer_down_click = (e) => {
  let mode = App.active_mode

  if (e.shiftKey) {
    App.scroll_page(mode, `down`)
    return
  }
  else if (e.ctrlKey) {
    App.jump_tabs_all()
    return
  }

  App.move_tabs_vertically(`down`)
}

App.footer_up_middle_click = (e) => {
  App.select_to_edge(`tabs`, `up`)
}

App.footer_down_middle_click = (e) => {
  App.select_to_edge(`tabs`, `down`)
}

App.check_footer_mode = (mode) => {
  if (!App.get_setting(`show_footer_buttons`)) {
    return
  }

  let up = DOM.el(`#footer_up_tabs`)
  let down = DOM.el(`#footer_down_tabs`)

  if (mode === `tabs`) {
    DOM.show(up)
    DOM.show(down)
  }
  else {
    DOM.hide(up)
    DOM.hide(down)
  }
}