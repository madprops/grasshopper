App.add_icons = (item) => {
  if (item.mode === `tabs`) {
    if (App.get_setting(`active_icon`)) {
      let icon = DOM.create(`div`, `active_icon item_node hidden`)
      icon.textContent = App.get_setting(`active_icon`)
      icon.title = `Active`
      item.element.append(icon)
    }

    if (App.get_setting(`pin_icon`)) {
      let icon = DOM.create(`div`, `pin_icon item_node hidden`)
      icon.textContent = App.get_setting(`pin_icon`)
      icon.title = `Pinned`
      item.element.append(icon)
    }

    if (App.get_setting(`normal_icon`)) {
      let icon = DOM.create(`div`, `normal_icon item_node hidden`)
      icon.textContent = App.get_setting(`normal_icon`)
      icon.title = `Normal`
      item.element.append(icon)
    }

    if (App.get_setting(`loaded_icon`)) {
      let icon = DOM.create(`div`, `loaded_icon item_node hidden`)
      icon.textContent = App.get_setting(`loaded_icon`)
      icon.title = `Loaded`
      item.element.append(icon)
    }

    if (App.get_setting(`unloaded_icon`)) {
      let icon = DOM.create(`div`, `unloaded_icon item_node hidden`)
      icon.textContent = App.get_setting(`unloaded_icon`)
      icon.title = `Unloaded`
      item.element.append(icon)
    }

    let cls = ``

    if (App.get_setting(`mute_click`)) {
      cls += ` grower`
    }

    if (App.get_setting(`playing_icon`)) {
      let icon = DOM.create(`div`, `playing_icon item_node hidden${cls}`)
      icon.textContent = App.get_setting(`playing_icon`)
      icon.title = `Playing`
      item.element.append(icon)
    }

    if (App.get_setting(`muted_icon`)) {
      let icon = DOM.create(`div`, `muted_icon item_node hidden${cls}`)
      icon.textContent = App.get_setting(`muted_icon`)
      icon.title = `Muted`
      item.element.append(icon)
    }

    if (App.get_setting(`unread_icon`)) {
      let icon = DOM.create(`div`, `unread_icon item_node hidden`)
      icon.textContent = App.get_setting(`unread_icon`)
      icon.title = `Unread`
      item.element.append(icon)
    }

    if (App.get_setting(`loading_icon`)) {
      let icon = DOM.create(`div`, `loading_icon item_node hidden`)
      icon.textContent = App.get_setting(`loading_icon`)
      icon.title = `Loading`
      item.element.append(icon)
    }
  }

  if (App.get_setting(`titled_icon`)) {
    let icon = DOM.create(`div`, `titled_icon item_node hidden`)
    icon.textContent = App.get_setting(`titled_icon`)
    icon.title = `Titled`
    item.element.append(icon)
  }

  if (App.get_setting(`tagged_icon`)) {
    let icon = DOM.create(`div`, `tagged_icon item_node hidden`)
    icon.textContent = App.get_setting(`tagged_icon`)
    icon.title = `Tagged`
    item.element.append(icon)
  }

  if (App.get_setting(`edited_icon`)) {
    let icon = DOM.create(`div`, `edited_icon item_node hidden`)
    icon.textContent = App.get_setting(`edited_icon`)
    icon.title = `Edited`
    item.element.append(icon)
  }

  if (App.get_setting(`hover_button`) !== `none`) {
    let btn = App.create_hover_button()
    item.element.append(btn)
  }
}

App.check_icons = (item) => {
  if (item.tab_box) {
    if (!App.get_setting(`tab_box_icons`)) {
      return
    }
  }

  if (App.get_setting(`notes_icon`)) {
    let icon = DOM.el(`.notes_icon`, item.element)

    if (App.get_notes(item)) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`titled_icon`)) {
    if (!item.header) {
      let icon = DOM.el(`.titled_icon`, item.element)

      if (App.get_title(item)) {
        icon.classList.remove(`hidden`)
      }
      else {
        icon.classList.add(`hidden`)
      }
    }
  }

  if (App.get_setting(`tagged_icon`)) {
    let icon = DOM.el(`.tagged_icon`, item.element)

    if (App.tagged(item)) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`edited_icon`)) {
    let icon = DOM.el(`.edited_icon`, item.element)

    if (App.edited(item)) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  let custom_icon = App.get_icon(item)
  let custom_icon_el = DOM.el(`.custom_icon`, item.element)

  if (custom_icon) {
    custom_icon_el.innerHTML = custom_icon
    custom_icon_el.classList.remove(`hidden`)
  }
  else {
    custom_icon_el.classList.add(`hidden`)
  }

  if (item.mode !== `tabs`) {
    return
  }

  if (App.get_setting(`active_icon`)) {
    let icon = DOM.el(`.active_icon`, item.element)

    if (item.active) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`pin_icon`)) {
    let icon = DOM.el(`.pin_icon`, item.element)

    if (item.pinned) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`normal_icon`)) {
    let icon = DOM.el(`.normal_icon`, item.element)

    if (!item.pinned) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`loaded_icon`)) {
    let icon = DOM.el(`.loaded_icon`, item.element)

    if (!item.discarded) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`unloaded_icon`)) {
    let icon = DOM.el(`.unloaded_icon`, item.element)

    if (item.discarded) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`playing_icon`)) {
    let icon = DOM.el(`.playing_icon`, item.element)

    if (item.audible && !item.muted) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`muted_icon`)) {
    let icon = DOM.el(`.muted_icon`, item.element)

    if (item.muted) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }

  if (App.get_setting(`unread_icon`)) {
    let icon = DOM.el(`.unread_icon`, item.element)

    if (item.unread) {
      icon.classList.remove(`hidden`)
    }
    else {
      icon.classList.add(`hidden`)
    }
  }
}

App.check_item_icon = (item) => {
  if (App.get_setting(`item_icon`) !== `none`) {
    let ans = App.make_item_icon(item)

    if (!ans.add) {
      return
    }

    let container = DOM.el(`.item_icon_container`, item.element)

    if (ans.icon) {
      container.innerHTML = ``
      container.append(ans.icon)
      container.classList.remove(`hidden`)
    }
    else {
      container.classList.add(`hidden`)
    }
  }
}

App.make_item_icon = (item, normal = true) => {
  let icon, text_icon, svg_icon

  if (item.tab_box) {
    normal = false
  }

  if (!text_icon && item.header) {
    if (App.is_full_header(item)) {
      text_icon = App.get_setting(`header_icon`)
    }
    else {
      text_icon = App.get_setting(`subheader_icon`)
    }

    if (!text_icon) {
      svg_icon = `arrow_down`
    }
  }

  let no_favicon = App.no_favicons.includes(item.mode)
  let fetch = no_favicon && App.get_setting(`fetch_favicons`)

  if (svg_icon) {
    icon = App.get_svg_icon(svg_icon, `item_icon`)

    if (normal) {
      item.svg_icon_used = svg_icon
      item.text_icon_used = undefined
      item.favicon_used = undefined
      item.generated_icon = undefined
    }
  }
  else if (text_icon) {
    if (normal) {
      if (item.text_icon_used === text_icon) {
        return {add: false}
      }
    }

    icon = App.get_text_icon(text_icon)

    if (normal) {
      item.text_icon_used = text_icon
      item.favicon_used = undefined
      item.generated_icon = undefined
      item.svg_icon = undefined
    }
  }
  else if (item.favicon || fetch) {
    if (!item.favicon) {
      item.favicon = App.fetch_favicon_url(item)
    }

    if (normal) {
      if (item.favicon_used === item.favicon) {
        return {add: false}
      }
    }

    icon = App.make_favicon(item)

    if (normal) {
      item.favicon_used = item.favicon
      item.generated_icon = undefined
      item.text_icon_used = undefined
      item.svg_icon = undefined
    }
  }
  else if (App.get_setting(`generate_icons`)) {
    if (normal) {
      if (item.generated_icon === item.hostname) {
        return {add: false}
      }
    }

    icon = App.generate_icon(item.hostname)

    if (normal) {
      item.generated_icon = item.hostname
      item.favicon_used = undefined
      item.text_icon_used = undefined
      item.svg_icon = undefined
    }
  }

  return {
    add: true,
    icon: icon,
  }
}

App.get_svg_icon = (name, cls = `svg_icon`) => {
  let icon = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`)
  icon.classList.add(cls)
  let icon_use = document.createElementNS(`http://www.w3.org/2000/svg`, `use`)
  icon_use.href.baseVal = `#${name}_icon`
  icon.append(icon_use)
  return icon
}

App.get_text_icon = (text_icon) => {
  let icon = DOM.create(`div`, `item_icon`)
  icon.textContent = text_icon
  return icon
}

App.make_favicon = (item) => {
  let icon = DOM.create(`img`, `item_icon`)
  icon.loading = `lazy`

  DOM.ev(icon, `error`, () => {
    if (App.get_setting(`generate_icons`)) {
      let icon_2 = App.generate_icon(item.hostname)
      icon.replaceWith(icon_2)
    }
  })

  icon.src = item.favicon
  return icon
}

App.generate_icon = (hostname) => {
  let icon = DOM.create(`canvas`, `item_icon`)
  icon.width = App.icon_size
  icon.height = App.icon_size
  jdenticon.update(icon, hostname || `hostname`)
  return icon
}

App.get_notes_icon = (item) => {
  let cls = ``

  if (App.get_setting(`notes_icon_click`)) {
    cls += ` grower`
  }

  if (App.get_setting(`notes_icon`)) {
    let icon = DOM.create(`div`, `notes_icon item_node hidden${cls}`)
    icon.textContent = App.get_setting(`notes_icon`)
    icon.title = `Notes`
    item.element.append(icon)
  }
}

App.edit_tab_icon = (args = {}) => {
  let def_args = {
    icon: ``,
  }

  App.def_args(def_args, args)
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let s = args.icon ? `Edit icon?` : `Remove icon?`
  let force = App.check_force(`warn_on_edit_tabs`, active)

  App.show_confirm({
    message: `${s} (${active.length})`,
    confirm_action: () => {
      for (let it of active) {
        App.apply_edit({what: `icon`, item: it, value: args.icon, on_change: (value) => {
          App.custom_save(it.id, `custom_icon`, value)
          App.push_to_icon_history([value])
        }})
      }
    },
    force: force,
  })
}

App.edit_icon = (item) => {
  App.edit_prompt({what: `icon`, item: item})
}

App.get_all_icons = (include_rules = true) => {
  let icons = []

  for (let icon of App.icon_history) {
    if (!icons.includes(icon)) {
      icons.push(icon)
    }
  }

  for (let item of App.get_items(`tabs`)) {
    if (item.custom_icon) {
      if (!icons.includes(item.custom_icon)) {
        icons.push(item.custom_icon)
      }
    }

    if (include_rules) {
      if (item.rule_icon) {
        if (!icons.includes(item.rule_icon)) {
          icons.push(item.rule_icon)
        }
      }
    }
  }

  return icons
}

App.push_to_icon_history = (icons) => {
  if (!icons.length) {
    return
  }

  for (let icon of icons) {
    if (!icon) {
      continue
    }

    App.icon_history = App.icon_history.filter(x => x !== icon)
    App.icon_history.unshift(icon)
    App.icon_history = App.icon_history.slice(0, App.icon_history_max)
  }

  App.stor_save_icon_history()
}

App.remove_item_icon = (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})

  if (active.length === 1) {
    let it = active[0]

    if (it.rule_icon && !it.custom_icon) {
      App.domain_rule_message()
      return
    }
  }

  App.remove_edits({what: [`icon`], items: active})
}

App.fetch_favicon_url = (item) => {
  return `https://www.google.com/s2/favicons?sz=64&domain=${item.hostname}`
}

App.add_custom_icon = (item) => {
  let cls = `custom_icon item_node hidden`

  if (App.get_setting(`custom_icon_click`)) {
    cls += ` grower`
  }

  let icon = DOM.create(`div`, cls)
  icon.title = `Custom Icon`
  item.element.append(icon)
}

App.get_icon_items = (mode) => {
  function icon_sort(a, b) {
    let ai = App.icon_history.indexOf(a)
    let bi = App.icon_history.indexOf(b)
    if (ai === -1) ai = App.icon_history.length
    if (bi === -1) bi = App.icon_history.length
    return ai - bi
  }

  let items = []
  let icons = []

  for (let tab of App.get_items(`tabs`)) {
    let icon = App.get_icon(tab)

    if (icon) {
      if (!icons.includes(icon)) {
        icons.push(icon)
      }
    }
  }

  if (icons.length) {
    icons.sort(icon_sort)

    items.push({
      text: `All`,
      action: () => {
        App.filter_icon(mode, `all`)
      },
    })

    for (let icon of icons.slice(0, App.max_icon_picks)) {
      items.push({
        text: icon,
        action: () => {
          App.filter_icon(mode, icon)
        },
      })
    }
  }
  else {
    items.push({
      text: `No icons in use`,
      action: () => {
        App.alert(`You can add icons to tabs`)
      },
    })
  }

  return items
}

App.filter_by_icon = (item) => {
  let icon = App.get_icon(item)

  if (icon) {
    App.filter_icon(item.mode, icon)
  }
}

App.custom_icon_menu_items = (item) => {
  let items = []

  items.push({
    text: `Filter`,
    action: () => {
      App.filter_by_icon(item)
    }
  })

  items.push({
    text: `Change`,
    action: () => {
      App.change_icon(item)
    }
  })

  if (item.custom_icon) {
    items.push({
      text: `Remove`,
      action: () => {
        App.remove_item_icon(item)
      }
    })
  }

  return items
}

App.custom_icon_menu = (item, e) => {
  let items = App.custom_icon_menu_items(item)
  App.show_context({items: items, e: e})
}

App.change_icon = (item) => {
  App.edit_prompt({what: `icon`, item: item})
}

App.show_filter_icon_menu = (mode, e) => {
  let items = App.get_icon_items(mode)
  App.show_context({items: items, e: e})
}