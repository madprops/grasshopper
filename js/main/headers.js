App.insert_header = async (item, full = true) => {
  let active = App.get_active_items({mode: item.mode, item: item})
  let first = active.at(0)
  let index = App.get_item_element_index(first.mode, first.element)
  let tab = await App.open_new_tab({url: App.header_url, index: index, pinned: item.pinned, active: false})
  let header = App.get_item_by_id(item.mode, tab.id)

  if (active.length > 1) {
    for (let it of active.slice(1, -1)) {
      App.apply_edit({what: `split_top`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `custom_split_top`, value)
      }})

      App.apply_edit({what: `split_bottom`, item: it, value: false, on_change: (value) => {
        App.custom_save(it.id, `custom_split_bottom`, value)
      }})
    }

    let bottom = active.at(-1)

    App.apply_edit({what: `split_bottom`, item: bottom, value: true, on_change: (value) => {
      App.custom_save(bottom.id, `custom_split_bottom`, value)
    }})
  }

  if (header) {
    if (full) {
      App.edit_tab_split({item: header, which: `top`})
    }

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
      else if (App.get_split_top(it)) {
        select = true
        break
      }
      else if (App.get_split_bottom(it)) {
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
      App.deselect({mode: item.mode, select: `selected`})
    }
    else {
      App.deselect({mode: item.mode, select: `none`})
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
  let headers = App.get_items(`tabs`).filter(x => x.header)
  return headers.filter(x => App.is_header(x))
}

App.get_subheader_tabs = () => {
  let headers = App.get_items(`tabs`).filter(x => x.header)
  return headers.filter(x => !App.is_header(x))
}

App.get_headers = () => {
  return App.get_items(`tabs`).filter(x => x.header)
}

App.close_headers = () => {
  let items = App.get_header_tabs()

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.close_subheaders = () => {
  let items = App.get_subheader_tabs()

  if (!items.length) {
    return
  }

  App.close_tabs_method(items)
}

App.set_header_text = (item) => {
  let title = App.title(item, false)
  let text_el = DOM.el(`.item_text_1`, item.element)
  text_el.textContent = title
  item.element.title = `Header: ${title}`
}

App.is_header_url = (url) => {
  if (!url.startsWith(App.browser_protocol)) {
    return false
  }

  if (!url.endsWith(App.header_file)) {
    return false
  }

  return true
}

App.check_header = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  if (App.is_header_url(item.url)) {
    // The header url is now obsolete, so update it
    if (item.url !== App.header_url) {
      item.header = false
      browser.tabs.update(item.id, {url: App.header_url})
      return
    }

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

  if (App.get_split_top(item)) {
    return false
  }

  return true
}

App.focus_header_first = (item, from, scroll = `nearest_smooth`) => {
  let next = App.get_other_item({mode: item.mode, item: item, wrap: false})

  if (App.check_header_first(next)) {
    App.tabs_action(next, from, scroll)
  }
}

App.is_header = (item) => {
  return item.header && App.get_split_top(item)
}

App.is_subheader = (item) => {
  return item.header && !App.get_split_top(item)
}