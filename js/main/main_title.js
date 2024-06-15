App.create_main_title = (mode) => {
  let el = DOM.create(`div`, `main_title`)
  let inner = DOM.create(`div`, `main_title_inner`)
  el.append(inner)

  let title = App.get_setting(`main_title`)
  inner.textContent = title

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

App.check_main_titles = () => {
  let els = DOM.els(`.main_title_inner`)
  let title = App.get_setting(`main_title`)

  for (let el of els) {
    el.textContent = title
    let p = el.closest(`.main_title`)

    if (title) {
      p.classList.remove(`hidden`)
    }
    else {
      p.classList.add(`hidden`)
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
      let title = ans.trim()
      App.set_setting(`main_title`, title)
      App.check_main_titles()
      App.apply_theme()
    },
  })
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
  let command = App.get_command(cmd)

  if (command) {
    let args = {
      cmd: command.cmd,
      e: e,
    }

    App.run_command(args)
  }
}