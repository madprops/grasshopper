App.create_main_title = () => {
  let el = DOM.create(`div`, `main_title`)
  let inner = DOM.create(`div`, `main_title_inner`)
  el.append(inner)

  let title = App.get_setting(`main_title`)
  inner.textContent = title

  el.title = `Right Click: Show the Title Menu`
  App.trigger_title(el, `middle_click_main_title`)
  App.trigger_title(el, `double_click_main_title`)

  DOM.ev(el, `contextmenu`, (e) => {
    App.main_title_right_click(e)
  })

  DOM.ev(el, `dblclick`, (e) => {
    App.main_title_double_click(e)
  })

  DOM.ev(el, `auxclick`, (e) => {
    if (e.button === 1) {
      App.main_title_middle_click(e)
    }
  })

  return el
}

App.check_main_title = (title = ``) => {
  let els = DOM.els(`.main_title_inner`)

  if (!title) {
    title = App.get_setting(`main_title`)
  }

  if (App.last_main_title !== undefined) {
    if (title === App.last_main_title) {
      return
    }
  }

  for (let el of els) {
    el.textContent = title
    App.last_main_title = title
    let elm = el.closest(`.main_title`)

    if (title) {
      elm.classList.remove(`hidden`)
    }
    else {
      elm.classList.add(`hidden`)
    }
  }
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
      App.set_setting({setting: `main_title_date`, value: false})
    },
  })
}

App.set_main_title = (title) => {
  App.set_setting({setting: `main_title`, value: title})
  App.check_refresh_settings()
  App.check_main_title(title)
  App.apply_theme()
}

App.copy_main_title = () => {
  App.copy_to_clipboard(App.get_setting(`main_title`))
}

App.main_title_right_click = (e) => {
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

App.start_main_title_date = () => {
  let delay = App.check_main_title_date_delay

  if (!delay || (delay < App.SECOND)) {
    App.error(`Main title date delay is invalid`)
    return
  }

  setInterval(() => {
    App.check_main_title_date()
  }, delay)
}

App.check_main_title_date = () => {
  if (!App.get_setting(`main_title_date`)) {
    return
  }

  let format = App.get_setting(`main_title_date_format`)
  let date = dateFormat(App.now(), format)
  App.check_main_title(date)
}

App.toggle_main_title_date = () => {
  let show_date = !App.get_setting(`main_title_date`)
  App.set_setting({setting: `main_title_date`, value: show_date})
  App.check_refresh_settings()
  App.apply_theme()

  if (show_date) {
    App.check_main_title_date()
  }
  else {
    App.check_main_title()
  }
}