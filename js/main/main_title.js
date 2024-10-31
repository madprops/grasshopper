App.start_main_title = () => {
  App.start_main_title_intervals()
}

App.reset_main_title = () => {
  App.refresh_main_title()
  App.start_main_title_intervals()
}

App.start_main_title_intervals = () => {
  clearInterval(App.main_title_date_interval)
  clearTimeout(App.main_title_scroll_timeout)
  let delay = App.check_main_title_date_delay

  if (!delay || (delay < App.SECOND)) {
    App.error(`Main title date delay is invalid`)
    return
  }

  App.main_title_date_interval = setInterval(() => {
    App.check_main_title_date()
  }, delay)

  if (App.get_setting(`main_title_auto_scroll`)) {
    App.main_title_scroll_do_timeout()
  }
  else {
    clearTimeout(App.main_title_scroll_timeout)
  }
}

App.main_title_scroll_do_timeout = () => {
  clearTimeout(App.main_title_scroll_timeout)

  if (App.main_title_scroll_pause) {
    let delay = App.get_setting(`main_title_scroll_pause`)
    App.main_title_scroll_pause = false

    App.main_title_scroll_timeout = setTimeout(() => {
      App.main_title_scroll_do_timeout()
    }, delay)
  }
  else {
    let delay = App.get_setting(`main_title_scroll_delay`)

    if (!delay || (delay < 1)) {
      App.error(`Title auto-scroll delay is invalid`)
      return
    }

    App.main_title_scroll_timeout = setTimeout(() => {
      App.main_title_auto_scroll()
      App.main_title_scroll_do_timeout()
    }, delay)
  }
}

App.create_main_title = () => {
  let el = DOM.create(`div`, ``, `main_title`)
  let inner = DOM.create(`div`, ``, `main_title_inner`)
  let title = App.get_setting(`main_title`)
  let rclick = App.get_cmd_name(`show_main_title_menu`)
  inner.textContent = App.check_caps(title)

  if (App.get_setting(`main_title_left_button`) !== `none`) {
    let btn_left = DOM.create(`div`, `main_title_button`, `main_title_left_button`)
    btn_left.textContent = `◄`
    App.main_title_side_button_tooltips(btn_left, `left`)
    el.append(btn_left)
  }

  el.append(inner)

  if (App.get_setting(`main_title_right_button`) !== `none`) {
    let btn_right = DOM.create(`div`, `main_title_button`, `main_title_right_button`)
    btn_right.textContent = `►`
    App.main_title_side_button_tooltips(btn_right, `right`)
    el.append(btn_right)
  }

  if (App.tooltips()) {
    el.title = `Right Click: ${rclick}`
    App.trigger_title(el, `middle_click_main_title`)
    App.trigger_title(el, `double_click_main_title`)
    App.trigger_title(el, `click_press_main_title`)
    App.trigger_title(el, `middle_click_press_main_title`)
    App.trigger_title(el, `wheel_up_main_title`)
    App.trigger_title(el, `wheel_down_main_title`)
    App.trigger_title(el, `wheel_up_shift_main_title`)
    App.trigger_title(el, `wheel_down_shift_main_title`)
  }

  App.main_title_tooltip = el.title
  App.update_main_title_tooltips(el)
  App.last_main_title = ``
  return el
}

App.check_main_title = () => {
  let title

  if (App.get_setting(`main_title_date`)) {
    title = App.get_main_title_date()
  }
  else {
    title = App.get_setting(`main_title`)
  }

  if (!title) {
    title = `No Title`
  }

  if (App.last_main_title !== undefined) {
    if (App.last_main_title === title) {
      return
    }
  }

  App.last_main_title = title
  App.set_main_title_text(title)
  App.refresh_main_title()
}

App.set_main_title_text = (text) => {
  let el = DOM.el(`#main_title_inner`)
  el.textContent = App.check_caps(text)
  App.update_main_title_tooltips(el)
  el.scrollLeft = 0
  App.main_title_pause()
}

App.update_main_title_tooltips = (el) => {
  if (!App.tooltips()) {
    return
  }

  let text = App.last_main_title

  if (!text) {
    return
  }

  el.title = `${text}\n${App.main_title_tooltip}`
}

App.edit_main_title = () => {
  App.show_prompt({
    value: App.get_setting(`main_title`),
    placeholder: `Title`,
    on_submit: (ans) => {
      App.set_main_title(ans.trim())
    },
  })
}

App.set_main_title = (title, force = true) => {
  App.set_setting({setting: `main_title`, value: title})

  if (!title && force) {
    App.set_setting({setting: `main_title_date`, value: true})
  }
  else if (title && force) {
    App.set_setting({setting: `main_title_date`, value: false})
  }

  App.check_main_title()
}

App.copy_main_title = () => {
  App.copy_to_clipboard(App.get_setting(`main_title`), `Title`)
}

App.show_main_title_menu = (e) => {
  let items = App.custom_menu_items({
    name: `main_title_menu`,
  })

  let compact = App.get_setting(`compact_main_title_menu`)
  App.show_context({items, e, compact})
}

App.show_main_title_left_button_menu = (e) => {
  let items = App.custom_menu_items({
    name: `main_title_left_button_menu`,
  })

  let compact = App.get_setting(`compact_main_title_left_button_menu`)
  App.show_context({items, e, compact})
}

App.show_main_title_right_button_menu = (e) => {
  let items = App.custom_menu_items({
    name: `main_title_right_button_menu`,
  })

  let compact = App.get_setting(`compact_main_title_right_button_menu`)
  App.show_context({items, e, compact})
}

App.main_title_double_click = (e) => {
  let cmd = App.get_setting(`double_click_main_title`)
  let command = App.get_command(cmd)

  if (command) {
    let args = {
      cmd: command.cmd,
      e,
    }

    App.run_command(args)
  }
}

App.main_title_click = (e) => {
  let cmd = App.get_setting(`click_main_title`)
  App.run_command({cmd, from: `main_title`, e})
}

App.main_title_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_main_title`)
  App.run_command({cmd, from: `main_title`, e})
}

App.color_main_title = (what) => {
  let bg_color = ``
  let text = App.semi_white_color

  if (what === `red`) {
    bg_color = App.red_title
  }
  else if (what === `green`) {
    bg_color = App.green_title
  }
  else if (what === `blue`) {
    bg_color = App.blue_title
  }
  else if (what === `black`) {
    bg_color = App.black_title
  }
  else if (what === `white`) {
    bg_color = App.white_title
    text = App.semi_black_color
  }

  let bg = bg_color
  App.set_main_title_color(text, bg)
}

App.set_main_title_color = (text, bg) => {
  App.set_setting({setting: `main_title_colors`, value: true})
  App.set_setting({setting: `main_title_text_color`, value: text})
  App.set_setting({setting: `main_title_background_color`, value: bg})
  App.apply_theme()
}

App.uncolor_main_title = () => {
  App.set_setting({setting: `main_title_colors`, value: false})
  App.apply_theme()
}

App.check_main_title_date = () => {
  if (!App.main_title_enabled()) {
    return
  }

  if (App.get_setting(`main_title_date`)) {
    App.check_main_title()
  }
}

App.get_main_title_date = () => {
  let format = App.get_setting(`main_title_date_format`)
  return dateFormat(App.now(), format)
}

App.toggle_main_title_date = () => {
  let show_date = !App.get_setting(`main_title_date`)
  App.set_setting({setting: `main_title_date`, value: show_date})
  App.check_main_title()
}

App.next_main_title_color = (dir = `next`) => {
  let enabled = App.get_setting(`main_title_colors`)

  if (!enabled) {
    return
  }

  let current = App.get_setting(`main_title_background_color`)
  let colors = [`red`, `green`, `blue`, `black`, `white`]

  if (dir === `prev`) {
    colors = colors.reverse()
  }

  for (let i = 0; i < colors.length; i++) {
    if (current === App[`${colors[i]}_title`]) {
      let next = colors[i + 1]

      if (!next) {
        next = colors[0]
      }

      App.color_main_title(next)
      return
    }
  }

  App.color_main_title(colors[0])
}

App.main_title_enabled = () => {
  if (!App.get_setting(`show_main_title`)) {
    return false
  }

  if (App.screen_locked) {
    return false
  }

  return true
}

App.toggle_main_title = () => {
  let new_value = !App.get_setting(`show_main_title`)
  App.set_setting({setting: `show_main_title`, value: new_value, action: true})
  App.refresh_main_title()
  App.apply_theme()
}

App.refresh_main_title = () => {
  let el = DOM.el(`#main_title`)

  if (App.get_setting(`show_main_title`)) {
    DOM.show(el)
  }
  else {
    DOM.hide(el)
  }
}

App.scroll_main_title = (dir, manual = true) => {
  let el = DOM.el(`#main_title_inner`)
  let amount

  if (manual) {
    amount = 20
  }
  else {
    amount = App.get_setting(`main_title_scroll_amount`)
  }

  if (dir === `left`) {
    el.scrollLeft -= amount
  }
  else if (dir === `right`) {
    el.scrollLeft += amount
  }

  if (manual) {
    App.main_title_pause()
  }
}

App.main_title_auto_scroll = () => {
  if (!App.main_title_enabled()) {
    return
  }

  if (!App.get_setting(`main_title_auto_scroll`)) {
    return
  }

  if (App.get_setting(`wrap_main_title`)) {
    return
  }

  let el = DOM.el(`#main_title_inner`)
  let dir = App.main_title_scroll_direction
  let overflow = el.scrollWidth - el.clientWidth

  if (overflow < App.main_title_min_overflow) {
    return
  }

  if ((dir === `left`) && App.at_left(el)) {
    dir = `right`
  }
  else if ((dir === `right`) && App.at_right(el)) {
    dir = `left`
  }

  App.main_title_set_dir(dir)

  if (dir === `right`) {
    App.main_title_right(el)
  }
  else if (dir === `left`) {
    App.main_title_left(el)
  }
}

App.main_title_set_dir = (dir) => {
  App.main_title_scroll_direction = dir
}

App.main_title_left = (el) => {
  App.scroll_main_title(`left`, false)

  if (App.at_left(el)) {
    App.main_title_set_dir(`right`)
    App.main_title_pause()
  }
}

App.main_title_right = (el) => {
  App.scroll_main_title(`right`, false)

  if (App.at_right(el)) {
    App.main_title_set_dir(`left`)
    App.main_title_pause()
  }
}

App.main_title_pause = () => {
  App.main_title_scroll_pause = true
}

App.main_title_click_left_button = (e) => {
  let cmd = App.get_setting(`click_main_title_left_button`)
  App.run_command({cmd, from: `main_title`, e})
}

App.main_title_click_right_button = (e) => {
  let cmd = App.get_setting(`click_main_title_right_button`)
  App.run_command({cmd, from: `main_title`, e})
}

App.main_title_double_click_left_button = (e) => {
  let cmd = App.get_setting(`double_click_main_title_left_button`)
  App.run_command({cmd, from: `main_title`, e})
}

App.main_title_double_click_right_button = (e) => {
  let cmd = App.get_setting(`double_click_main_title_right_button`)
  App.run_command({cmd, from: `main_title`, e})
}

App.main_title_middle_click_left_button = (e) => {
  let cmd = App.get_setting(`middle_click_main_title_left_button`)
  App.run_command({cmd, from: `main_title`, e})
}

App.main_title_middle_click_right_button = (e) => {
  let cmd = App.get_setting(`middle_click_main_title_right_button`)
  App.run_command({cmd, from: `main_title`, e})
}

App.main_title_side_button_tooltips = (el, what) => {
  App.trigger_title(el, `click_main_title_${what}_button`)
  el.title += `\nRight Click: Show Menu`
  App.trigger_title(el, `middle_click_main_title_${what}_button`)
  App.trigger_title(el, `double_click_main_title_${what}_button`)
  App.trigger_title(el, `click_press_main_title_${what}_button`)
  App.trigger_title(el, `middle_click_press_main_title_${what}_button`)
}