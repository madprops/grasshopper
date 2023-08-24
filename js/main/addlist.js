App.setup_addlist = () => {
  App.create_popup({
    id: `addlist_alias`, setup: () => {
      DOM.ev(DOM.el(`#add_alias_add`), `click`, () => {
        App.do_addlist_parts(`aliases`, `alias`)
      })

      DOM.ev(DOM.el(`#add_alias_remove`), `click`, () => {
        App.addlist_remove_parts(`aliases`, `alias`)
      })
    }, element: App.addlist_html({short: `alias`, left: `term_1`, props: [`term_2`]})
  })

  App.create_popup({
    id: `addlist_custom_filter`, setup: () => {
      DOM.ev(DOM.el(`#add_custom_filter_add`), `click`, () => {
        App.do_addlist_single(`custom_filters`, `custom_filter`)
      })

      DOM.ev(DOM.el(`#add_custom_filter_remove`), `click`, () => {
        App.addlist_remove_single(`custom_filters`, `custom_filter`)
      })
    }, element: App.addlist_html({short: `custom_filter`, left: `value`})
  })

  App.create_popup({
    id: `addlist_pool`, setup: () => {
      DOM.ev(DOM.el(`#add_pool_add`), `click`, () => {
        App.do_addlist_components(`background_pool`, `pool`)
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
    }, element: App.addlist_html({short: `pool`, left: `image_url`,
    props: [`effect__select`, `tiles__select`], to: true,
    settings: [`background_image`, `background_effect`, `background_tiles`]})
  })
}

App.do_addlist = (setting, short, left, props = []) => {
  let name

  if (left) {
    name = DOM.el(`#add_${short}_${left}`).value.trim()
  }

  let values = []

  for (let prop of props) {
    let v = DOM.el(`#add_${short}_${prop}`).value.trim()
    values.push(v)
  }

  let textarea = DOM.el(`#settings_${setting}`)
  let new_value, ans

  if (props.length > 0) {
    let value

    if (props.length === 1) {
      value = values[0]
    }
    else {
      let joined = values.join(` ; `)
      value = joined.replace(/[;\s]+$/g, ``)
    }

    if (value) {
      let line

      if (name) {
        line = `${name} = ${value}`
      }
      else {
        line = value
      }

      ans = line
      new_value = App.one_linebreak(`${line}\n${textarea.value}`)
    }
  }
  else {
    new_value = App.one_linebreak(`${name}\n${textarea.value}`)
    ans = name
  }

  if (new_value) {
    textarea.value = new_value
    App.do_save_text_setting(setting, textarea)
  }

  App.hide_popup()
  return ans
}

App.addlist_html = (args = {}) => {
  let def_args = {
    to: false,
    props: [],
  }

  args = Object.assign(def_args, args)
  let container = DOM.create(`div`, `flex_column_center addlist_container`)
  let name = DOM.create(`input`, `text editor_text`, `add_${args.short}_${args.left}`)
  name.type = `text`
  name.spellcheck = false
  name.autocomplete = false
  name.placeholder = App.capitalize_words(args.left.replace(/_/g, ` `))
  let els = []
  let ids = [name.id]

  for (let prop of args.props) {
    let el

    if (prop.endsWith(`__select`)) {
      el = DOM.create(`div`, `flex_column_center gap_1`)
      let label = DOM.create(`div`)
      label.textContent = App.capitalize_words(prop.replace(`__select`, ``).replace(/_/g, ` `))
      let p = prop.replace(`__select`, ``)
      let select = DOM.create(`select`, `editor_select`, `add_${args.short}_${p}`)
      el.append(label)
      el.append(select)
      ids.push(select.id)
    }
    else {
      el = DOM.create(`input`, `text text editor_text text_smaller`, `add_${args.short}_${prop}`)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = App.capitalize_words(prop.replace(/_/g, ` `))
      ids.push(el.id)
    }

    els.push(el)
  }

  let btns = DOM.create(`div`, `flex_row_center gap_1`)
  let add = DOM.create(`div`, `button`, `add_${args.short}_add`)
  let label = App.capitalize_words(args.short.replace(/_/g, ` `))

  if (args.to) {
    add.textContent = `Add To ${label}`
  }
  else {
    add.textContent = `Add ${label}`
  }

  let remove = DOM.create(`div`, `button`, `add_${args.short}_remove`)
  remove.textContent = `Remove`
  container.append(name)
  container.append(...els)
  btns.append(remove)
  btns.append(add)
  container.append(btns)
  App[`setting_list_props_${args.short}`] = []
  App[`setting_list_props_${args.short}`].push(args.left.replace(`__select`, ``))
  App[`setting_list_props_${args.short}`].push(...args.props.map(x => x.replace(`__select`, ``)))
  App[`setting_list_ids_${args.short}`] = ids
  App[`setting_list_settings_${args.short}`] = args.settings
  return container
}

App.addlist_single = (args = {}) => {
  App.show_popup(`addlist_${args.short}`)
  let el = DOM.el(`#add_${args.short}_value`)
  el.value = args.items || ``
  el.focus()

  App.addlist_data = {
    mode: `single`,
    setting: args.setting,
    short: args.short,
    value: args.items,
    action: args.action,
  }
}

App.do_addlist_single = (setting, short) => {
  let value = DOM.el(`#add_${short}_value`).value.trim()

  if (!value) {
    return
  }

  if (App.addlist_data.value) {
    App.addlist_remove_single(setting, short, App.addlist_data.value, true)
  }

  App.do_addlist(setting, short, `value`)
}

App.addlist_remove_single = (setting, short, value, force = false) => {
  if (!value) {
    value = DOM.el(`#add_${short}_value`).value
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
  let term_1 = split[0].trim()
  let term_2 = split[1].trim()
  return [term_1, term_2]
}

App.addlist_parts = (args = {}) => {
  let def_args = {
    items: [],
  }

  args = Object.assign(def_args, args)
  App.show_popup(`addlist_${args.short}`)
  DOM.el(`#add_${args.short}_term_1`).value = args.items[0] || ``
  DOM.el(`#add_${args.short}_term_2`).value = args.items[1] || ``
  DOM.el(`#add_${args.short}_term_1`).focus()

  App.addlist_data = {
    mode: `parts`,
    setting: args.setting,
    short: args.short,
    parts: args.items,
    action: args.action,
  }
}

App.do_addlist_parts = (setting, short) => {
  let term_1 = DOM.el(`#add_${short}_term_1`).value.trim()
  let term_2 = DOM.el(`#add_${short}_term_2`).value.trim()

  if (!term_1 || !term_2) {
    return
  }

  let parts = App.addlist_data.parts

  if (parts.length) {
    App.addlist_remove_parts(setting, short, parts, true)
  }

  App.do_addlist(setting, short, `term_1`, [`term_2`])
}

App.addlist_remove_parts = (setting, short, parts = [], force = false) => {
  if (!parts.length) {
    parts.push(DOM.el(`#add_${short}_term_1`).value.trim())
    parts.push(DOM.el(`#add_${short}_term_2`).value.trim())
  }

  let items = App.get_setting(setting)

  for (let item of items) {
    let split = item.split(`=`)
    let term_1b = split[0].trim()
    let term_2b = split[1].trim()

    if ((parts[0] === term_1b) && (parts[1] === term_2b)) {
      App.show_confirm(`Remove item?`, () => {
        items = items.filter(x => x !== item)
        App.after_addlist(setting, items, item)
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
  let def_args = {
    items: [],
  }

  args = Object.assign(def_args, args)
  App.show_popup(`addlist_${args.short}`)

  if (!args.items.length) {
    for (let setting of App[`setting_list_settings_${args.short}`]) {
      let value = App.get_setting(setting)
      args.items.push(value)
    }
  }

  let ids = App[`setting_list_ids_${args.short}`]

  for (let [i, id] of ids.entries()) {
    DOM.el(`#${id}`).value = args.items[i]
  }

  DOM.el(`#${ids[0]}`).focus()

  App.addlist_data = {
    mode: `components`,
    setting: args.setting,
    short: args.short,
    components: args.items,
    action: args.action,
  }
}

App.do_addlist_components = (setting, short) => {
  let ids = App[`setting_list_ids_${short}`]
  let first = DOM.el(`#${ids[0]}`).value.trim()

  if (!first) {
    return
  }

  App.addlist_remove_components(setting, short, first, true)
  let value = App.do_addlist(setting, short, undefined, App[`setting_list_props_${short}`])

  if (App.addlist_data.action) {
    App.addlist_data.action(value)
  }
}

App.addlist_remove_components = (setting, short, first, force) => {
  if (!first) {
    let ids = App[`setting_list_ids_${short}`]
    first = DOM.el(`#${ids[0]}`).value.trim()
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
      setting: args.setting,
      short: args.short,
      items: items,
      action: args.action,
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
  let d = App.addlist_data

  if (d.mode === `single`) {
    App.do_addlist_single(d.setting, d.short)
  }
  else if (d.mode === `parts`) {
    App.do_addlist_parts(d.setting, d.short)
  }
  else if (d.mode === `components`) {
    App.do_addlist_components(d.setting, d.short)
  }
}

App.after_addlist = (setting, items) => {
  App.set_setting(setting, items)
  let el = DOM.el(`#settings_${setting}`)
  el.value = App.get_textarea_setting_value(setting)
  App.check_theme_refresh()
}