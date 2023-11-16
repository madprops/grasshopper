App.insert_header = async (item) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  let first = active.at(0)
  let index = App.get_item_element_index(first.mode, first.element)
  let tab = await App.open_new_tab({url: App.header_file, index: index, pinned: item.pinned, active: false})
  let header = App.get_item_by_id(item.mode, tab.id)

  if (active.length > 1) {
    for (let it of active.slice(1, -1)) {
      if (App.apply_edit(`split_top`, it, false)) {
        App.custom_save(it.id, `custom_split_top`, false)
      }

      if (App.apply_edit(`split_bottom`, it, false)) {
        App.custom_save(it.id, `custom_split_bottom`, false)
      }
    }

    let bottom = active.at(-1)

    if (App.apply_edit(`split_bottom`, bottom, true)) {
      App.custom_save(bottom.id, `custom_split_bottom`, true)
    }
  }

  if (header) {
    App.select_item({item: header, scroll: `nearest`})
    App.edit_title(header)
  }
}

App.header_group = (item) => {
  let waypoint = false
  let select = false
  let selected = []
  let items = App.get_items(item.mode)

  for (let [i, it] of items.entries()) {
    if (waypoint) {
      if (it.header) {
        select = true
        break
      }
      else if (item.pinned && !it.pinned) {
        select = true
        break
      }
      else if (App.get_split(it, `top`)) {
        select = true
        break
      }
      else if (App.get_split(it, `bottom`)) {
        selected.push(it)
        select = true
        break
      }
      else {
        selected.push(it)
      }

      if (i === (items.length - 1)) {
        select = true
      }
    }

    if (it === item) {
      selected.push(it)
      waypoint = true
      continue
    }
  }

  if (select) {
    return selected
  }
  else {
    return []
  }
}

App.select_header_group = (item) => {
  let group = App.header_group(item)

  if (group.length) {
    if ((group.at(0).selected) && (group.at(-1).selected)) {
      App.deselect(item.mode, `selected`)
    }
    else {
      App.deselect(item.mode, `none`)
      let first

      for (let item of group) {
        if (!first) {
          if (!item.header) {
            first = item
            continue
          }
        }

        App.toggle_selected(item, true)
      }

      if (first) {
        App.toggle_selected(first, true)
      }
    }
  }
}

App.get_header_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.header)
}

App.remove_all_headers = () => {
  let items = App.get_header_tabs()

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.set_header_text = (item) => {
  let title = App.get_title(item, false) || `Give me a title`

  if (!item.tab_box && (item.title === title)) {
    return
  }

  let text_el = DOM.el(`.item_text_1`, item.element)
  text_el.textContent = title
  item.title = title
  item.element.title = title
}

App.is_header = (item) => {
  if (!item.url.startsWith(App.browser_protocol)) {
    return false
  }

  if (!item.url.endsWith(App.header_file)) {
    return false
  }

  return true
}

App.check_header = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (App.is_header(item)) {
    item.header = true
    item.unread = false
    item.discarded = false
    item.element.classList.add(`header_item`)
  }
  else {
    item.header = false
    item.element.classList.remove(`header_item`)
  }
}

App.check_header_first = (item) => {
  if (!item) {
    return false
  }

  if (item.header) {
    return false
  }

  if (App.get_split(item, `top`)) {
    return false
  }

  return true
}

App.select_header_first = (item, scroll) => {
  let next = App.get_other_item({mode: item.mode, item: item, wrap: false})

  if (App.check_header_first(next)) {
    App.tabs_action(next, `header`, scroll)
    return true
  }
  else {
    App.scroll_to_item({item: item, scroll: scroll})
  }

  return false
}