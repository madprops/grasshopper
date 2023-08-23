App.setup_settings_widgets = () => {
  App.create_popup({
    id: `add_alias`, setup: () => {
      DOM.ev(DOM.el(`#add_alias_add`), `click`, () => {
        App.do_add_alias()
      })

      DOM.ev(DOM.el(`#add_alias_remove`), `click`, () => {
        App.remove_equals_parts(`aliases`, `alias`)
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
        App.do_add_pool()
      })

      DOM.ev(DOM.el(`#add_pool_remove`), `click`, () => {
        App.do_remove_pool()
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
    }, element: App.add_setting_list_item_html(`pool`, `image_url`, [`effect__select`, `tiles__select`], true)
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

App.add_setting_list_item_html = (short, left, props, to = false) => {
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
  return container
}

App.add_alias = (args = {}) => {
  App.show_popup(`add_alias`)
  DOM.el(`#add_alias_term_1`).value = args.term_1 || ``
  DOM.el(`#add_alias_term_2`).value = args.term_2 || ``
  DOM.el(`#add_alias_term_1`).focus()
}

App.do_add_alias = () => {
  App.do_add_setting_list_item(`aliases`, `alias`, `term_1`, [`term_2`])
}

App.add_custom_filter = () => {
  App.show_popup(`add_custom_filter`)
  DOM.el(`#add_custom_filter_filter`).value = ``
  DOM.el(`#add_custom_filter_filter`).focus()
}

App.do_add_custom_filter = () => {
  App.do_add_setting_list_item(`custom_filters`, `custom_filter`, `filter`)
}

App.add_pool = (args = {}) => {
  let url_el = DOM.el(`#add_pool_image_url`)
  App.show_popup(`add_pool`)
  DOM.el(`#add_pool_effect`).value = args.effect || App.get_setting(`background_effect`)
  DOM.el(`#add_pool_tiles`).value = args.tiles || App.get_setting(`background_tiles`)
  url_el.value = ``

  if (args.url) {
    url_el.value = url
  }

  url_el.focus()
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

App.do_remove_pool = () => {
  let url = DOM.el(`#add_pool_image_url`).value

  if (url) {
    App.remove_from_background_pool(url)
  }
}

App.remove_from_background_pool = (url, force) => {
  let pool = App.get_setting(`background_pool`)

  if (!pool.length) {
    return
  }

  if (!url) {
    url = App.get_setting(`background_image`)
  }

  let match = false

  for (let image of pool) {
    if (image.startsWith(url)) {
      match = true
      break
    }
  }

  if (match) {
    App.show_confirm(`Remove from background pool?`, () => {
      pool = pool.filter(x => !x.startsWith(url))
      App.set_setting(`background_pool`, pool)
      App.check_theme_refresh()
      return
    }, undefined, force)
  }
  else {
    App.show_feedback(`Not in background pool`)
  }
}

App.get_pool_parts = (full) => {
  let image, effect, tiles

  if (full.includes(`;`)) {
    let split = full.split(`;`)

    if (split.length >= 1) {
      image = split[0].trim()
    }

    if (split.length >= 2) {
      effect = split[1].toLowerCase().trim()
    }

    if (split.length >= 3) {
      tiles = split[2].toLowerCase().trim()
    }
  }
  else {
    image = full
  }

  return {
    image: image,
    effect: effect,
    tiles: tiles,
  }
}

App.get_equals_parts = (full) => {
  let split = full.split(`=`)
  let term_1 = split[0].trim()
  let term_2 = split[1].trim()

  return {
    term_1: term_1,
    term_2: term_2,
  }
}

App.remove_equals_parts = (setting, short) => {
  let term_1 = DOM.el(`#add_${short}_term_1`).value
  let term_2 = DOM.el(`#add_${short}_term_2`).value
  let items = App.get_setting(setting)

  for (let item of items) {
    let split = item.split(`=`)
    let term_1b = split[0].trim()
    let term_2b = split[1].trim()

    if ((term_1 === term_1b) && (term_2 === term_2b)) {
      App.show_confirm(`Remove item?`, () => {
        items = items.filter(x => x !== item)
        App.set_setting(setting, items)
        let el = DOM.el(`#settings_${setting}`)
        el.value = App.get_textarea_setting_value(setting)
      })
    }
  }
}

App.on_line_click = (e, type, short) => {
  let line = App.get_line_under_caret(e.target)

  if (line) {
    let parts

    if (type === `components`) {
      parts = App.get_pool_parts(line)
    }
    else if (type === `equals`) {
      parts = App.get_equals_parts(line)
    }

    App[`add_${short}`](parts)
  }
}