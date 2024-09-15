App.start_main_title = () => {
  // Date

  let delay = App.check_main_title_date_delay

  if (!delay || (delay < App.SECOND)) {
    App.error(`Main title date delay is invalid`)
    return
  }

  setInterval(() => {
    App.check_main_title_date()
  }, delay)

  // Signal

  delay = App.get_setting(`main_title_signal_delay`)

  if (!delay || (delay < 250)) {
    App.error(`Clock delay is invalid`)
    return
  }

  setInterval(() => {
    App.main_title_signal()
  }, delay)
}

App.create_main_title = () => {
  let el = DOM.create(`div`, `main_title`)
  let inner = DOM.create(`div`, `main_title_inner`)
  el.append(inner)

  let title = App.get_setting(`main_title`)
  inner.textContent = title

  let rclick = App.get_cmd_name(`show_main_title_menu`)
  el.title = `Right Click: ${rclick}`
  App.trigger_title(el, `middle_click_main_title`)
  App.trigger_title(el, `double_click_main_title`)
  App.main_title_tooltip = el.title

  DOM.ev(el, `click`, (e) => {
    App.check_double_click(`main_title`, e, () => {
      App.main_title_double_click(e)
    })
  })

  DOM.ev(el, `contextmenu`, (e) => {
    App.show_main_title_menu(e)
  })

  DOM.ev(el, `auxclick`, (e) => {
    if (e.button === 1) {
      App.main_title_middle_click(e)
    }
  })

  return el
}

App.check_main_title = (check = false) => {
  let title

  if (App.get_setting(`main_title_date`)) {
    title = App.get_main_title_date()
  }
  else {
    title = App.get_setting(`main_title`)
  }

  if (check) {
    if (App.last_main_title !== undefined) {
      if (title === App.last_main_title) {
        return
      }
    }
  }

  App.last_main_title = title
  App.set_main_title_text(title)

  for (let el of DOM.els(`.main_title`)) {
    if (title) {
      DOM.show(el)
    }
    else {
      DOM.hide(el)
    }
  }

  App.main_title_enabled = Boolean(title)
}

App.edit_main_title = () => {
  let auto = App.get_setting(`edit_title_auto`)
  let highlight = auto ? true : false

  App.show_prompt({
    value: App.get_setting(`main_title`),
    placeholder: `Title`,
    highlight: highlight,
    on_submit: (ans) => {
      App.set_main_title(ans.trim())
    },
  })
}

App.set_main_title = (title) => {
  App.set_setting({setting: `main_title`, value: title})
  App.set_setting({setting: `main_title_date`, value: false})
  App.check_refresh_settings()
  App.check_main_title()
  App.apply_theme()
}

App.copy_main_title = () => {
  App.copy_to_clipboard(App.get_setting(`main_title`))
}

App.show_main_title_menu = (e) => {
  e.preventDefault()

  let items = App.custom_menu_items({
    name: `main_title_menu`,
  })

  App.show_context({items: items, e: e})
}

App.main_title_double_click = (e) => {
  let cmd = App.get_setting(`double_click_main_title`)
  let command = App.get_command(cmd)

  if (command) {
    let args = {
      cmd: command.cmd,
      e: e,
    }

    App.run_command(args)
  }
}

App.main_title_middle_click = (e) => {
  let cmd = App.get_setting(`middle_click_main_title`)
  App.run_command({cmd: cmd, from: `filter_menu`, e: e})
}

App.color_main_title = (what) => {
  let bg_color = ``

  if (what === `red`) {
    bg_color = App.red_title
  }
  else if (what === `green`) {
    bg_color = App.green_title
  }
  else if (what === `blue`) {
    bg_color = App.blue_title
  }

  let text_color = `white`
  let background_color = bg_color
  App.set_setting({setting: `main_title_colors`, value: true})
  App.set_setting({setting: `main_title_text_color`, value: text_color})
  App.set_setting({setting: `main_title_background_color`, value: background_color})
  App.check_refresh_settings()
  App.apply_theme()
}

App.uncolor_main_title = () => {
  App.set_setting({setting: `main_title_colors`, value: false})
  App.check_refresh_settings()
  App.apply_theme()
}

App.check_main_title_date = () => {
  if (App.get_setting(`main_title_date`)) {
    App.check_main_title(true)
  }
}

App.get_main_title_date = () => {
  let format = App.get_setting(`main_title_date_format`)
  return dateFormat(App.now(), format)
}

App.toggle_main_title_date = () => {
  let show_date = !App.get_setting(`main_title_date`)
  App.set_setting({setting: `main_title_date`, value: show_date})
  App.check_refresh_settings()
  App.apply_theme()
  App.check_main_title()
}

App.previous_main_title_color = () => {
  let enabled = App.get_setting(`main_title_colors`)
  let current = App.get_setting(`main_title_background_color`)

  if (enabled && (current === App.blue_title)) {
    App.color_main_title(`green`)
  }
  else if (enabled && (current === App.green_title)) {
    App.color_main_title(`red`)
  }
  else if (enabled && (current === App.red_title)) {
    App.uncolor_main_title()
  }
  else {
    App.color_main_title(`blue`)
  }
}

App.next_main_title_color = () => {
  let enabled = App.get_setting(`main_title_colors`)
  let current = App.get_setting(`main_title_background_color`)

  if (enabled && (current === App.red_title)) {
    App.color_main_title(`green`)
  }
  else if (enabled && (current === App.green_title)) {
    App.color_main_title(`blue`)
  }
  else if (enabled && (current === App.blue_title)) {
    App.uncolor_main_title()
  }
  else {
    App.color_main_title(`red`)
  }
}

App.main_title_signal = async () => {
  if (!App.main_title_enabled) {
    return
  }

  let cmd = App.get_setting(`main_title_signal`)

  if (cmd === `none`) {
    return
  }

  let signal = App.get_signal(cmd)

  if (!signal) {
    return
  }

  let text = await App.send_signal(signal, false)

  if (text) {
    App.set_main_title_text(text)
  }
}

App.set_main_title_text = (text) => {
  let els = DOM.els(`.main_title_inner`)

  for (let el of els) {
    el.textContent = text
    el.title = `${text}\n${App.main_title_tooltip}`
  }
}