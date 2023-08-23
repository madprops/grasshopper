App.setup_settings_widgets = () => {
  App.create_popup({
    id: `add_alias`, setup: () => {
      DOM.ev(DOM.el(`#add_alias_add`), `click`, () => {
        App.do_add_parts(`aliases`, `alias`)
      })

      DOM.ev(DOM.el(`#add_alias_remove`), `click`, () => {
        App.remove_parts(`aliases`, `alias`)
      })
    }, element: App.add_setting_list_item_html(`alias`, `term_1`, [`term_2`])
  })

  App.create_popup({
    id: `add_custom_filter`, setup: () => {
      DOM.ev(DOM.el(`#add_custom_filter_add`), `click`, () => {
        App.do_add_custom_filter()
      })
    }, element: App.add_setting_list_item_html(`custom_filter`, `filter`, [])
  })

  App.create_popup({
    id: `add_pool`, setup: () => {
      DOM.ev(DOM.el(`#add_pool_add`), `click`, () => {
        App.do_add_components()
      })

      DOM.ev(DOM.el(`#add_pool_remove`), `click`, () => {
        App.remove_from_components()
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
    }, element: App.add_setting_list_item_html(`pool`, `image_url`,
    [`effect__select`, `tiles__select`], true, [`background_image`, `background_effect`, `background_tiles`])
  })
}

App.do_add_setting_list_item = (setting, short, left, props = []) => {
  let name

  if (left) {
    name = DOM.el(`#add_${short}_${left}`).value
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

App.add_setting_list_item_html = (short, left, props, to = false, settings) => {
  let container = DOM.create(`div`, `flex_column_center add_setting_container`)
  let name = DOM.create(`input`, `text editor_text`, `add_${short}_${left}`)
  name.type = `text`
  name.spellcheck = false
  name.autocomplete = false
  name.placeholder = App.capitalize_words(left.replace(/_/g, ` `))
  let els = []

  for (let prop of props) {
    let el

    if (prop.endsWith(`__select`)) {
      el = DOM.create(`div`, `flex_column_center gap_1`)
      let label = DOM.create(`div`)
      label.textContent = App.capitalize_words(prop.replace(`__select`, ``).replace(/_/g, ` `))
      let p = prop.replace(`__select`, ``)
      let select = DOM.create(`select`, `editor_select`, `add_${short}_${p}`)
      el.append(label)
      el.append(select)
    }
    else {
      el = DOM.create(`input`, `text text editor_text text_smaller`, `add_${short}_${prop}`)
      el.type = `text`
      el.spellcheck = false
      el.autocomplete = false
      el.placeholder = App.capitalize_words(prop.replace(/_/g, ` `))
    }

    els.push(el)
  }

  let btns = DOM.create(`div`, `flex_row_center gap_1`)
  let add = DOM.create(`div`, `button`, `add_${short}_add`)
  let label = App.capitalize_words(short.replace(/_/g, ` `))

  if (to) {
    add.textContent = `Add To ${label}`
  }
  else {
    add.textContent = `Add ${label}`
  }

  let remove = DOM.create(`div`, `button`, `add_${short}_remove`)
  remove.textContent = `Remove`

  container.append(name)
  container.append(...els)

  btns.append(remove)
  btns.append(add)
  container.append(btns)
  App[`setting_list_els_${short}`] = [name, ...els]
  App[`setting_list_settings_${short}`] = settings
  return container
}

App.add_parts = (short, parts = []) => {
  App.show_popup(`add_${short}`)
  DOM.el(`#add_${short}_term_1`).value = parts[0] || ``
  DOM.el(`#add_${short}_term_2`).value = parts[1] || ``
  DOM.el(`#add_${short}_term_1`).focus()
  App.add_parts_item = parts
}

App.do_add_parts = (setting, short) => {
  let term_1 = DOM.el(`#add_${short}_term_1`).value
  let term_2 = DOM.el(`#add_${short}_term_2`).value

  if (!term_1 || !term_2) {
    return
  }

  if (App.add_parts_item.length) {
    App.remove_parts(setting, short, App.add_parts_item, true)
  }

  App.do_add_setting_list_item(setting, short, `term_1`, [`term_2`])
}

App.add_custom_filter = () => {
  App.show_popup(`add_custom_filter`)
  DOM.el(`#add_custom_filter_filter`).value = ``
  DOM.el(`#add_custom_filter_filter`).focus()
}

App.do_add_custom_filter = () => {
  App.do_add_setting_list_item(`custom_filters`, `custom_filter`, `filter`)
}

App.add_components = (short, components = []) => {
  if (!components.length) {
    for (let setting of App[`setting_list_settings_${short}`]) {
      let value = App.get_setting(setting)
      components.push(value)
    }
  }

  App.show_popup(`add_${short}`)
  let els = App[`setting_list_els_${short}`]

  for (let [i, el] of els.entries()) {
    el.value = components[i]
  }

  els[0].focus()
}

App.do_add_pool = () => {
  let url = DOM.el(`#add_pool_image_url`).value

  if (!url) {
    return
  }

  App.remove_from_background_pool(url, true)
  let value = App.do_add_setting_list_item(`background_pool`, `pool`, undefined, [`image_url`, `effect`, `tiles`])

  if (value) {
    App.apply_pool(value)
  }
}

App.remove_from_pool = () => {
  let url = DOM.el(`#add_pool_image_url`).value

  if (url) {
    App.remove_from_background_pool(url)
  }
}

App.remove_from_background_pool = (url, force) => {
  App.remove_component(`background_pool`, url, force, () => {
    App.check_theme_refresh()
  })
}

App.remove_component = (setting, url, force, action) => {
  let items = App.get_setting(setting)

  if (!items.length) {
    return
  }

  if (!url) {
    url = App.get_setting(`background_image`)
  }

  let match = false

  for (let image of items) {
    if (image.startsWith(url)) {
      match = true
      break
    }
  }

  if (match) {
    App.show_confirm(`Remove item?`, () => {
      items = items.filter(x => !x.startsWith(url))
      App.set_setting(setting, items)

      if (action) {
        action()
      }
    }, undefined, force)
  }
  else {
    App.show_feedback(`Item not in list`)
  }
}

App.get_components = (full) => {
  let components = []

  if (full.includes(`;`)) {
    let split = full.split(`;`)

    for (let c of split) {
      components.push(c.trim())
    }
  }
  else {
    components.push(full)
  }

  return components
}

App.get_parts = (full) => {
  let split = full.split(`=`)
  let term_1 = split[0].trim()
  let term_2 = split[1].trim()
  return [term_1, term_2]
}

App.remove_parts = (setting, short, parts = [], force = false) => {
  if (parts.length === 0) {
    parts.push(DOM.el(`#add_${short}_term_1`).value)
    parts.push(DOM.el(`#add_${short}_term_2`).value)
  }

  let items = App.get_setting(setting)

  for (let item of items) {
    let split = item.split(`=`)
    let term_1b = split[0].trim()
    let term_2b = split[1].trim()

    if ((parts[0] === term_1b) && (parts[1] === term_2b)) {
      App.show_confirm(`Remove item?`, () => {
        items = items.filter(x => x !== item)
        App.set_setting(setting, items)
        let el = DOM.el(`#settings_${setting}`)
        el.value = App.get_textarea_setting_value(setting)
      }, undefined, force)
    }
  }
}

App.on_line_click = (e, type, short) => {
  let line = App.get_line_under_caret(e.target)

  if (line) {
    let data

    if (type === `components`) {
      data = App.get_components(line)
      App.add_components(short, data)
    }
    else if (type === `parts`) {
      data = App.get_parts(line)
      App.add_parts(short, data)
    }
  }
}

App.do_save_text_setting = (setting, el) => {
  let value = el.value.trim()

  if (el.classList.contains(`settings_textarea`)) {
    value = App.one_linebreak(value)
    value = value.split(`\n`).filter(x => x !== ``).map(x => x.trim())
    value = App.to_set(value)
    el.value = value.join(`\n`)
  }
  else {
    el.value = value
  }

  el.scrollTop = 0
  App.set_setting(setting, value)
  App.settings_do_action(el.dataset.action)
}