App.setup_addlist = () => {
  App.create_popup({
    id: `addlist_alias`, setup: () => {
      DOM.ev(DOM.el(`#add_alias_add`), `click`, () => {
        App.do_addlist_parts(`aliases`, `alias`)
      })

      DOM.ev(DOM.el(`#add_alias_remove`), `click`, () => {
        App.addlist_remove_parts(`aliases`, `alias`)
      })
    }, element: App.addlist_register({id: `alias`, setting: `aliases`, type: `parts`,
    widgets: [`text`, `text`], title: `Alias Editor`})
  })

  App.create_popup({
    id: `addlist_custom_filter`, setup: () => {
      DOM.ev(DOM.el(`#add_custom_filter_add`), `click`, () => {
        App.do_addlist_single(`custom_filter`)
      })

      DOM.ev(DOM.el(`#add_custom_filter_remove`), `click`, () => {
        App.addlist_remove_single(`custom_filters`, `custom_filter`)
      })
    }, element: App.addlist_register({id: `custom_filter`, setting: `custom_filters`, type: `single`,
    widgets: [`text`], title: `Custom Filter Editor`})
  })

  App.create_popup({
    id: `addlist_pool`, setup: () => {
      DOM.ev(DOM.el(`#add_pool_add`), `click`, () => {
        App.do_addlist_components(`pool`)
      })

      DOM.ev(DOM.el(`#add_pool_remove`), `click`, () => {
        App.addlist_remove_components(`background_pool`, `pool`)
      })

      let eff = DOM.el(`#add_pool_effect`)

      for (let e of App.background_effects) {
        let o = DOM.create(`option`)
        o.textContent = e[0]
        o.value = e[1]
        eff.append(o)
      }

      let tiles = DOM.el(`#add_pool_tiles`)

      for (let e of App.background_tiles) {
        let o = DOM.create(`option`)
        o.textContent = e[0]
        o.value = e[1]
        tiles.append(o)
      }
    }, element: App.addlist_register({id: `pool`, setting: `background_pool`, type: `components`,
    widgets: [`text`, `select`, `select`], title: `Pool Editor`,})
  })
}

App.do_addlist = (id) => {
  let o_args = App[`addlist_args_${id}`]
  let area = DOM.el(`#settings_${args.setting}`)
  let new_value
  let values = []

  for (let sett of o_args.settings) {
    let el = DOM.el(`#addlist_widget_${sett}`)
    values.push(el.value.trim())
  }

  if (o_args.mode === `single`) {
    new_value = values[0]
  }
  else if (o_args.mode === `parts`) {
    new_value = line = `${values[0]} = ${values[1]}`
  }
  else if (o_args.mode === `components`) {
    let joined = values.join(` ; `)
    new_value = joined.replace(/[;\s]+$/g, ``)
  }

  if (new_value) {
    let new_area = App.one_linebreak(`${new_value}\n${area.value}`)

    if (new_value) {
      area.value = new_area
      App.do_save_text_setting(args.area, area)
    }

    App.hide_popup()
  }

  return new_value
}

App.addlist_register = (args = {}) => {
  let def_args = {
    props: [],
  }

  args = Object.assign(def_args, args)
  let container = DOM.create(`div`, `flex_column_center addlist_container`)
  let els = []

  for (let [i, w] of args.widgets.entries()) {
    if (w === `text`) {
      let el = DOM.create(`input`, `text editor_text`, `addlist_widget_${i}`)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = `Fix me`
    }
    else if (w === `select`) {
      el = DOM.create(`div`, `flex_column_center gap_1`)
      let label = DOM.create(`div`)
      label.textContent = App.capitalize_words(prop.replace(`__select`, ``).replace(/_/g, ` `))
      let select = DOM.create(`select`, `editor_select`, `addlist_widget_${i}`)
      el.append(label)
      el.append(select)
    }
  }

  container.append(...els)
  let title = DOM.create(`div`, `bigger`)
  title.textContent = args.title
  container.append(title)
  let btns = DOM.create(`div`, `flex_row_center gap_1`)
  let add = DOM.create(`div`, `button`, `addlist_button_add_${args.id}`)
  add.textContent = `Add`
  let remove = DOM.create(`div`, `button`, `addlist_button_remove_${args.id}`)
  remove.textContent = `Remove`
  container.append(...els)
  btns.append(remove)
  btns.append(add)
  container.append(btns)
  App[`addlist_args_${args.id}`] = args
  return container
}

App.addlist_single = (args = {}) => {
  let def_args = App.addlist_def_args()
  args = Object.assign(def_args, args)
  App.show_popup(`addlist_${args.id}`)
  App.check_addlist_buttons(args)
  let el = App.addlist_item(args.id, 0)
  el.value = args.items || ``
  el.focus()
  args.mode = `single`
  App.addlist_data = args
}

App.do_addlist_single = (id) => {
  let value = App.addlist_item(id, 0).value.trim()

  if (!value) {
    return
  }

  if (App.addlist_data.items) {
    App.addlist_remove_single(setting, id, App.addlist_data.items, true)
  }

  App.do_addlist(id)
}

App.addlist_remove_single = (setting, id, value, force = false) => {
  if (!value) {
    value = App.addlist_item(id, 0).value.trim()
  }

  let items = App.get_setting(setting)

  for (let item of items) {
    if (item === value) {
      App.show_confirm(`Remove item?`, () => {
        items = items.filter(x => x !== item)
        App.after_addlist(setting, items)
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

  for (let [i, sett] of o_args.settings.entries()) {
    DOM.el(`#addlist_widget_${sett}`).value = args.items[i] || ``
  }

  App.addlist_item(args.id, 0).focus()
  args.mode = `parts`
  App.addlist_data = args
}

App.do_addlist_parts = (id) => {
  let value_1 = DOM.el(`#addlist_widget_0`).value.trim()
  let value_2 = DOM.el(`#addlist_widget_1`).value.trim()

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
    parts.push(DOM.el(`#addlist_widget_0`).value.trim())
    parts.push(DOM.el(`#addlist_widget_1`).value.trim())
  }

  let items = App.get_setting(o_args.setting)

  for (let item of items) {
    let split = item.split(`=`)
    let value_1b = split[0].trim()
    let value_2b = split[1].trim()

    if ((parts[0] === value_1b) && (parts[1] === value_2b)) {
      App.show_confirm(`Remove item?`, () => {
        items = items.filter(x => x !== item)
        App.after_addlist(o_args.setting, items, item)
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

  if (!args.items.length) {
    for (let setting of o_args.settings) {
      let value = App.get_setting(setting)
      args.items.push(value)
    }
  }

  for (let [i, setting] of o_args.settings.entries()) {
    let value = args.items[i]
    DOM.el(`#addlist_widget_${setting}`).value = value
  }

  App.addlist_item(args.id, 0).focus()
  args.mode = `components`
  App.addlist_data = args
}

App.do_addlist_components = (id) => {
  let first = App.addlist_item(id, 0).value.trim()

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
  if (!first) {
    first = App.addlist_item(id, 0).value.trim()
  }

  let items = App.get_setting(setting)

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
      App.after_addlist(setting, items, first)
    }, undefined, force)
  }
  else {
    App.show_feedback(`Item not in list`)
  }
}

App.addlist_click = (args = {}) => {
  let line = App.get_line_under_caret(args.e.target)
  let items

  if (line) {
    if (args.type === `single`) {
      items = line
    }
    else if (args.type === `parts`) {
      items = App.addlist_get_parts(line)
    }
    else if (args.type === `components`) {
      items = App.addlist_get_components(line)
    }
  }

  if (!line || !items) {
    return
  }

  function edit () {
    let obj = {
      id: args.id,
      setting: args.setting,
      items: items,
      action: args.action,
      update: true,
    }

    if (args.type === `single`) {
      App.addlist_single(obj)
    }
    else if (args.type === `parts`) {
      App.addlist_parts(obj)
    }
    else if (args.type === `components`) {
      App.addlist_components(obj)
    }
  }

  if (args.use) {
    let menu = []

    menu.push({
      text: `Edit`,
      action: () => {
        edit()
      }
    })

    menu.push({
      text: `Use`,
      action: () => {
        args.use(items)
      }
    })

    NeedContext.show(args.e.clientX, args.e.clientY, menu)
  }
  else {
    edit()
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
  let remove_el = DOM.el(`#addlist_button_remvoe_${args.id}`)
  let add_el = DOM.el(`#addlist_button_add_${args.id}`)

  if (args.update) {
    remove_el.classList.remove(`hidden`)
    add_el.textContent = `Update`
  }
  else {
    remove_el.classList.add(`hidden`)
    add_el.textContent = `Add`
  }
}

App.addlist_def_args = () => {
  return {
    update: false,
    items: [],
  }
}

App.addlist_item = (id, i = 0) => {
  return DOM.el(`#addlist_widget_${i}`)
}