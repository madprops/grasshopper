App.setup_addlist = () => {
  App.create_popup({
    id: `addlist_alias`, element: App.addlist_register({id: `alias`, setting: `aliases`, type: `parts`,
    widgets: [`text`, `text`], labels: [`Term 1`, `Term 2`], title: `Alias Editor`})
  })

  App.create_popup({
    id: `addlist_custom_filter`, element: App.addlist_register({id: `custom_filter`, setting: `custom_filters`, type: `single`,
    widgets: [`text`], labels: [`Filter`], title: `Custom Filter Editor`})
  })

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
    }, element: App.addlist_register({id: `pool`, setting: `background_pool`, type: `components`,
    widgets: [`text`, `select`, `select`], labels: [`Image URL`, `Effect`, `Tiles`], title: `Pool Editor`, image: 0})
  })
}

App.do_addlist = (id) => {
  let o_args = App[`addlist_args_${id}`]
  let area = DOM.el(`#settings_${o_args.setting}`)
  let new_value
  let values = []

  for (let [i, w] of o_args.widgets.entries()) {
    let el = App.addlist_widget(id, i)
    values.push(el.value.trim())
  }

  if (o_args.type === `single`) {
    new_value = values[0]
  }
  else if (o_args.type === `parts`) {
    new_value = line = `${values[0]} = ${values[1]}`
  }
  else if (o_args.type === `components`) {
    let joined = values.join(` ; `)
    new_value = joined.replace(/[;\s]+$/g, ``)
  }

  if (new_value) {
    let new_area = App.one_linebreak(`${new_value}\n${area.value}`)

    if (new_value) {
      area.value = new_area
      App.do_save_text_setting(o_args.setting, area)
    }

    App.hide_popup()
  }

  return new_value
}

App.addlist_register = (args = {}) => {
  let def_args = {
    labels: [],
  }

  args = Object.assign(def_args, args)
  let container = DOM.create(`div`, `flex_column_center addlist_container`)
  let title = DOM.create(`div`, `bigger`)
  title.textContent = args.title
  container.append(title)
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
  let use = DOM.create(`div`, `button`, `addlist_button_use_${args.id}`)
  use.textContent = `Use`
  let remove = DOM.create(`div`, `button`, `addlist_button_remove_${args.id}`)
  remove.textContent = `Remove`
  let add = DOM.create(`div`, `button`, `addlist_button_add_${args.id}`)
  add.textContent = `Add`
  btns.append(use)
  btns.append(remove)
  btns.append(add)
  container.append(btns)

  if (args.type === `single`) {
    DOM.ev(add, `click`, () => {
      App.do_addlist_single(args.id)
    })

    DOM.ev(remove, `click`, () => {
      App.addlist_remove_single(args.id)
    })
  }
  else if (args.type === `parts`) {
    DOM.ev(add, `click`, () => {
      App.do_addlist_parts(args.id)
    })

    DOM.ev(remove, `click`, () => {
      App.addlist_remove_parts(args.id)
    })
  }
  else if (args.type === `components`) {
    DOM.ev(add, `click`, () => {
      App.do_addlist_components(args.id)
    })

    DOM.ev(remove, `click`, () => {
      App.addlist_remove_components(args.id)
    })
  }

  DOM.ev(use, `click`, () => {
    App.addlist_use()
  })

  App[`addlist_args_${args.id}`] = args
  return container
}

App.addlist_single = (args = {}) => {
  let def_args = App.addlist_def_args()
  args = Object.assign(def_args, args)
  App.show_popup(`addlist_${args.id}`)
  App.check_addlist_buttons(args)
  let el = App.addlist_widget(args.id, 0)
  el.value = args.items || ``
  el.focus()
  args.mode = `single`
  App.addlist_data = args
}

App.do_addlist_single = (id) => {
  let value = App.addlist_widget(id, 0).value.trim()

  if (!value) {
    return
  }

  if (App.addlist_data.items) {
    App.addlist_remove_single(id, App.addlist_data.items, true)
  }

  App.do_addlist(id)
}

App.addlist_remove_single = (id, value, force = false) => {
  let o_args = App[`addlist_args_${id}`]

  if (!value) {
    value = App.addlist_widget(id, 0).value.trim()
  }

  let items = App.get_setting(o_args.setting)

  for (let item of items) {
    if (item === value) {
      App.show_confirm(`Remove item?`, () => {
        items = items.filter(x => x !== item)
        App.after_addlist(o_args.setting, items)
      }, undefined, force)
    }
  }
}

App.addlist_get_parts = (full) => {
  let split = full.split(`=`)
  let value_1 = split[0].trim()
  let value_2 = split[1].trim()
  return [value_1, value_2]
}

App.addlist_parts = (args = {}) => {
  let def_args = App.addlist_def_args()
  args = Object.assign(def_args, args)
  App.show_popup(`addlist_${args.id}`)
  App.check_addlist_buttons(args)
  let o_args = App[`addlist_args_${args.id}`]

  for (let [i, w] of o_args.widgets.entries()) {
    let el = App.addlist_widget(args.id, i)
    let value = args.items[i] || ``
    el.value = value
  }

  App.addlist_widget(args.id, 0).focus()
  args.mode = `parts`
  App.addlist_data = args
}

App.do_addlist_parts = (id) => {
  let value_1 = App.addlist_widget(id, 0).value.trim()
  let value_2 = App.addlist_widget(id, 1).value.trim()

  if (!value_1 || !value_2) {
    return
  }

  let parts = App.addlist_data.items

  if (parts.length) {
    App.addlist_remove_parts(id, parts, true)
  }

  App.do_addlist(id)
}

App.addlist_remove_parts = (id, parts = [], force = false) => {
  let o_args = App[`addlist_args_${id}`]

  if (!parts.length) {
    let el_1 = App.addlist_widget(id, 0)
    let el_2 = App.addlist_widget(id, 1)
    parts.push(el_1.value.trim())
    parts.push(el_2.value.trim())
  }

  let items = App.get_setting(o_args.setting)

  for (let item of items) {
    let split = item.split(`=`)
    let value_1b = split[0].trim()
    let value_2b = split[1].trim()

    if ((parts[0] === value_1b) && (parts[1] === value_2b)) {
      App.show_confirm(`Remove item?`, () => {
        items = items.filter(x => x !== item)
        App.after_addlist(o_args.setting, items)
      }, undefined, force)
    }
  }
}

App.addlist_get_components = (full) => {
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

App.addlist_components = (args = {}) => {
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
      el.value = value
    }
  }

  App.update_image(args.id)
  App.addlist_widget(args.id, 0).focus()
  args.mode = `components`
  App.addlist_data = args
}

App.do_addlist_components = (id) => {
  let first = App.addlist_widget(id, 0).value.trim()

  if (!first) {
    return
  }

  App.addlist_remove_components(id, first, true)
  let value = App.do_addlist(id)

  if (App.addlist_data.action) {
    App.addlist_data.action(value)
  }
}

App.addlist_remove_components = (id, first, force) => {
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
  let o_args = App[`addlist_args_${args.id}`]
  let line = App.get_line_under_caret(args.e.target)
  let items

  if (line) {
    if (o_args.type === `single`) {
      items = line
    }
    else if (o_args.type === `parts`) {
      items = App.addlist_get_parts(line)
    }
    else if (o_args.type === `components`) {
      items = App.addlist_get_components(line)
    }
  }

  if (!line || !items) {
    return
  }

  let obj = {
    id: args.id,
    items: items,
    action: args.action,
    use: args.use,
    update: true,
  }

  if (o_args.type === `single`) {
    App.addlist_single(obj)
  }
  else if (o_args.type === `parts`) {
    App.addlist_parts(obj)
  }
  else if (o_args.type === `components`) {
    App.addlist_components(obj)
  }
}

App.addlist_enter = () => {
  let data = App.addlist_data

  if (data.mode === `single`) {
    App.do_addlist_single(data.id)
  }
  else if (data.mode === `parts`) {
    App.do_addlist_parts(data.id)
  }
  else if (data.mode === `components`) {
    App.do_addlist_components(data.id)
  }
}

App.after_addlist = (setting, items) => {
  App.set_setting(setting, items)
  let el = DOM.el(`#settings_${setting}`)
  el.value = App.get_textarea_setting_value(setting)
  App.check_theme_refresh()
}

App.check_addlist_buttons = (args) => {
  let use_el = DOM.el(`#addlist_button_use_${args.id}`)
  let remove_el = DOM.el(`#addlist_button_remove_${args.id}`)
  let add_el = DOM.el(`#addlist_button_add_${args.id}`)

  if (args.update) {
    remove_el.classList.remove(`hidden`)
    add_el.textContent = `Update`
  }
  else {
    remove_el.classList.add(`hidden`)
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
  img.src = el.value.trim()
}

App.addlist_use = () => {
  let data = App.addlist_data

  if (data.use) {
    data.use(data.items)
  }

  App.hide_popup()
}