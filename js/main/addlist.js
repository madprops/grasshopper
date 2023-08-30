App.setup_addlist = () => {
  App.create_popup({
    id: `addlist_pool`, setup: () => {
      let eff = DOM.el(`#addlist_widget_pool_1`)

      for (let e of App.background_effects) {
        let o = DOM.create(`option`)
        o.textContent = e[0]
        o.value = e[1]
        eff.append(o)
      }

      let tiles = DOM.el(`#addlist_widget_pool_2`)

      for (let e of App.background_tiles) {
        let o = DOM.create(`option`)
        o.textContent = e[0]
        o.value = e[1]
        tiles.append(o)
      }
    }, element: App.addlist_register({id: `pool`, setting: `background_pool`,
    widgets: [`text`, `select`, `select`], labels: [`Image URL`, `Effect`, `Tiles`], title: `BG Pool`, image: 0})
  })

  App.create_popup({
    id: `addlist_custom_filter`, element: App.addlist_register({id: `custom_filter`, setting: `custom_filters`,
    widgets: [`text`], labels: [`Filter`], title: `Custom Filters`})
  })

  App.create_popup({
    id: `addlist_alias`, element: App.addlist_register({id: `alias`, setting: `aliases`,
    widgets: [`text`, `text`], labels: [`Term 1`, `Term 2`], title: `Aliases`})
  })

  App.create_popup({
    id: `addlist_extra_menu`, setup: () => {
      let commands = DOM.el(`#addlist_widget_extra_menu_1`)
      let cmds = App.commands.filter(x => !x.name.startsWith(`--`)).slice(0)

      for (let cmd of cmds) {
        let o = DOM.create(`option`)
        o.textContent = cmd.name
        o.value = cmd.cmd
        commands.append(o)
      }
    }, element: App.addlist_register({id: `extra_menu`, setting: `extra_menu`,
    widgets: [`text`, `select`], labels: [`Title`, `Command`], title: `Extra Menu`})
  })
}

App.do_addlist = (id) => {
  let o_args = App[`addlist_args_${id}`]
  let values = []

  for (let [i, w] of o_args.widgets.entries()) {
    let el = App.addlist_widget(id, i)
    let value = el.value.trim()

    if (value) {
      values.push(value)
    }
  }

  if (values.length !== o_args.widgets.length) {
    return
  }

  App.addlist_remove(id, values[0], true)
  let area = DOM.el(`#settings_${o_args.setting}`)
  let new_value = values.join(` ; `)

  if (new_value) {
    let new_area = App.one_linebreak(`${new_value}\n${area.value}`)

    if (new_value) {
      area.value = new_area
      App.do_save_text_setting(o_args.setting, area)
    }

    App.hide_popup()
  }

  if (App.addlist_data.action) {
    App.addlist_data.action(new_value)
  }
}

App.addlist_register = (args = {}) => {
  let def_args = {
    labels: [],
  }

  args = Object.assign(def_args, args)
  let container = DOM.create(`div`, `flex_column_center addlist_container`, `addlist_container_${args.id}`)
  container.tabIndex = 0
  let top = DOM.create(`div`, `flex_row_center gap_3 full_width`)
  let title = DOM.create(`div`, `addlist_title`)
  title.textContent = args.title
  let btn_prev = DOM.create(`div`, `button`, `addlist_prev_${args.id}`)
  btn_prev.textContent = `<`
  let btn_next = DOM.create(`div`, `button`, `addlist_next_${args.id}`)
  btn_next.textContent = `>`

  DOM.ev(btn_prev, `click`, () => {
    App.addlist_next(args.id, true)
  })

  DOM.ev(btn_next, `click`, () => {
    App.addlist_next(args.id)
  })

  top.append(btn_prev)
  top.append(title)
  top.append(btn_next)
  container.append(top)
  let els = []

  for (let [i, w] of args.widgets.entries()) {
    let id = `addlist_widget_${args.id}_${i}`

    if (w === `text`) {
      let el = DOM.create(`input`, `text editor_text`, id)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = args.labels[i] || `Value`
      els.push(el)
    }
    else if (w === `select`) {
      el = DOM.create(`div`, `flex_column_center gap_1`)
      let label = DOM.create(`div`)
      label.textContent = args.labels[i] || `Select`
      let select = DOM.create(`select`, `editor_select`, id)
      el.append(label)
      el.append(select)
      els.push(el)
    }
  }

  if (args.image !== undefined) {
    DOM.ev(els[args.image], `input`, () => {
      App.update_image(args.id)
    })

    let img = DOM.create(`img`, `small_image hidden`, `addlist_image_${args.id}`)

    DOM.ev(img, `load`, (e) => {
      e.target.classList.remove(`hidden`)
    })

    DOM.ev(img, `error`, (e) => {
      e.target.classList.add(`hidden`)
    })

    container.append(img)
  }

  container.append(...els)
  let btns = DOM.create(`div`, `flex_row_center gap_1`)
  let use = DOM.create(`div`, `button`, `addlist_use_${args.id}`)
  use.textContent = `Use`
  let remove = DOM.create(`div`, `button`, `addlist_remove_${args.id}`)
  remove.textContent = `Remove`
  let add = DOM.create(`div`, `button`, `addlist_add_${args.id}`)
  add.textContent = `Add`

  DOM.ev(add, `click`, () => {
    App.do_addlist(args.id)
  })

  DOM.ev(remove, `click`, () => {
    App.addlist_remove(args.id)
  })

  DOM.ev(use, `click`, () => {
    App.addlist_use()
  })

  btns.append(use)
  btns.append(remove)
  btns.append(add)
  container.append(btns)
  App[`addlist_args_${args.id}`] = args
  return container
}

App.addlist_components = (full) => {
  let c = []

  if (full.includes(`;`)) {
    let split = full.split(`;`)

    for (let item of split) {
      c.push(item.trim())
    }
  }
  else {
    c.push(full)
  }

  return c
}

App.addlist = (args = {}) => {
  let def_args = App.addlist_def_args()
  args = Object.assign(def_args, args)
  App.show_popup(`addlist_${args.id}`)
  App.check_addlist_buttons(args)
  let o_args = App[`addlist_args_${args.id}`]

  for (let [i, w] of o_args.widgets.entries()) {
    let value = args.items[i] || ``
    let el = App.addlist_widget(args.id, i)

    if (w === `image`) {
      el.src = value
    }
    else {
      if (!value && (w === `select`)) {
        el.selectedIndex = 0
      }
      else {
        el.value = value
      }
    }
  }

  if (o_args.image !== undefined) {
    App.update_image(args.id)
  }

  App.addlist_check_focus(args.id)
  App.addlist_data = args
}

App.addlist_remove = (id, first, force) => {
  let o_args = App[`addlist_args_${id}`]

  if (!first) {
    first = App.addlist_widget(id, 0).value.trim()
  }

  let items = App.get_setting(o_args.setting)

  if (!items.length) {
    return
  }

  let match = false

  for (let item of items) {
    if (item.startsWith(first)) {
      match = true
      break
    }
  }

  if (match) {
    App.show_confirm(`Remove item?`, () => {
      items = items.filter(x => !x.startsWith(first))
      App.after_addlist(o_args.setting, items)
    }, undefined, force)
  }
  else {
    App.show_feedback(`Item not in list`)
  }
}

App.addlist_click = (args = {}) => {
  if (!args.line) {
    args.line = App.get_line_under_caret(args.e.target)
  }

  if (!args.line) {
    return
  }

  let items = App.addlist_components(args.line)

  if (!items) {
    return
  }

  let obj = {
    id: args.id,
    items: items,
    action: args.action,
    use: args.use,
    line: args.line,
    update: true,
  }

  App.addlist(obj)
}

App.addlist_enter = () => {
  let data = App.addlist_data
  let modified = App.addlist_modified(data.id)

  if (data.use && !modified) {
    App.addlist_use()
  }
  else {
    App.do_addlist(data.id)
  }
}

App.addlist_left = () => {
  App.addlist_next(App.addlist_data.id, true)
}

App.addlist_right = () => {
  App.addlist_next(App.addlist_data.id)
}

App.after_addlist = (setting, items) => {
  App.set_setting(setting, items)
  let el = DOM.el(`#settings_${setting}`)
  el.value = App.get_textarea_setting_value(setting)
  App.check_theme_refresh()
  App.hide_popup()
}

App.check_addlist_buttons = (args) => {
  let use_el = DOM.el(`#addlist_use_${args.id}`)
  let remove_el = DOM.el(`#addlist_remove_${args.id}`)
  let add_el = DOM.el(`#addlist_add_${args.id}`)
  let prev_el = DOM.el(`#addlist_prev_${args.id}`)
  let next_el = DOM.el(`#addlist_next_${args.id}`)

  if (args.update) {
    remove_el.classList.remove(`hidden`)
    prev_el.classList.remove(`hidden`)
    next_el.classList.remove(`hidden`)
    add_el.textContent = `Update`
  }
  else {
    remove_el.classList.add(`hidden`)
    prev_el.classList.add(`hidden`)
    next_el.classList.add(`hidden`)
    add_el.textContent = `Add`
  }

  if (args.use) {
    use_el.classList.remove(`hidden`)
  }
  else {
    use_el.classList.add(`hidden`)
  }
}

App.addlist_def_args = () => {
  return {
    update: false,
    items: [],
  }
}

App.addlist_widget = (id, i = 0) => {
  return DOM.el(`#addlist_widget_${id}_${i}`)
}

App.update_image = (id) => {
  let o_args = App[`addlist_args_${id}`]
  let img = DOM.el(`#addlist_image_${o_args.id}`)
  let el = App.addlist_widget(id, o_args.image)
  let url = el.value.trim()

  if (!App.is_url(url)) {
    url = `/img/${url}`
  }

  img.src = url
}

App.addlist_use = () => {
  let data = App.addlist_data

  if (data.use) {
    data.use(data.items)
  }

  App.hide_popup()
}

App.addlist_next = (id, reverse = false) => {
  let data = App.addlist_data
  let o_args = App[`addlist_args_${id}`]
  let lines = App.get_setting(o_args.setting).slice(0)

  if (lines.length < 2) {
    return
  }

  let waypoint = false

  if (reverse) {
    lines.reverse()
  }

  let next

  for (let line of lines) {
    if (waypoint) {
      next = line
      break
    }

    if (line === data.line) {
      waypoint = true
    }
  }

  if (!next) {
    next = lines[0]
  }

  data.line = next
  App.addlist_click(data)
}

App.addlist_check_focus = (id) => {
  let el = App.addlist_widget(id, 0)

  if (!el.value) {
    el.focus()
  }
  else {
    DOM.el(`#addlist_container_${id}`).focus()
  }
}

App.addlist_modified = (id) => {
  let data = App.addlist_data

  if (!data.items.length) {
    return
  }

  let o_args = App[`addlist_args_${id}`]

  for (let [i, w] of o_args.widgets.entries()) {
    let el = App.addlist_widget(id, i)

    if (data.items[i] !== el.value.trim()) {
      return true
    }
  }

  return false
}