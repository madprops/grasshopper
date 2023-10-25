App.show_item_menu = async (args = {}) => {
  if (!args.item) {
    return
  }

  App.command_item = args.item
  let active = App.get_active_items({mode: args.item.mode, item: args.item})
  let multiple = active.length > 1
  let items = []

  if (App.get_setting(`extra_menu_mode`) === `total`) {
    items = App.custom_menu_items(`extra_menu`)
  }
  else {
    if (args.item.mode === `tabs`) {
      let some_pinned = false
      let some_unpinned = false
      let some_muted = false
      let some_unmuted = false
      let some_loaded = false
      let some_unloaded = false

      for (let it of active) {
        if (it.pinned) {
          some_pinned = true
        }
        else {
          some_unpinned = true
        }

        if (it.muted) {
          some_muted = true
        }
        else {
          some_unmuted = true
        }

        if (it.discarded) {
          some_unloaded = true
        }
        else {
          some_loaded = true
        }
      }

      if (some_unloaded) {
        items.push(App.item_menu_item({cmd: `load_tabs`, item: args.item}))
      }

      if (some_unpinned) {
        items.push(App.item_menu_item({cmd: `pin_tabs`, item: args.item}))
      }

      if (some_pinned) {
        items.push(App.item_menu_item({cmd: `unpin_tabs`, item: args.item}))
      }

      items.push({
        icon: App.settings_icons.colors,
        text: `Color`,
        get_items: () => {
          return App.color_menu_items(args.item)
        }
      })

      items.push(App.item_menu_item({cmd: `edit_title`, item: args.item}))
      items.push(App.item_menu_item({cmd: `edit_tags`, item: args.item}))
      App.common_menu_items(items, args.item, multiple)
      App.extra_menu_items(items)
      App.more_menu_items(items, args.item, multiple, some_loaded, some_unmuted, some_muted)
      App.sep(items)
      items.push(App.item_menu_item({cmd: `close_tabs`, item: args.item}))
    }
    else {
      items.push(App.item_menu_item({cmd: `open_items`, item: args.item}))
      App.common_menu_items(items, args.item, multiple)
      App.more_menu_items(items, args.item, multiple)
    }
  }

  App.show_center_context(items, args.e)
}

App.show_item_menu_2 = (item) => {
  if (!item) {
    return
  }

  let rect = item.element.getBoundingClientRect()
  App.show_item_menu({item: item, x: rect.left, y: rect.top})
}

App.common_menu_items = (o_items, item, multiple) => {
  let items = []

  if (App.get_media_type(item)) {
    items.push(App.item_menu_item({cmd: `view_media`, item: item}))
  }

  if (!multiple) {
    items.push({
      icon: App.settings_icons.filter,
      text: `Filter`,
      get_items: () => {
        return App.filter_menu_items(item)
      }
    })
  }

  if (!multiple) {
    let copy_items = []
    copy_items.push(App.item_menu_item({cmd: `copy_item_url`, item: item}))
    copy_items.push(App.item_menu_item({cmd: `copy_item_title`, item: item}))

    items.push({
      icon: App.clipboard_icon,
      text: `Copy`,
      items: copy_items,
    })
  }

  if (items.length) {
    for (let c of items) {
      o_items.push(c)
    }
  }
}

App.more_menu_items = (o_items, item, multiple, some_loaded, some_unmuted, some_muted) => {
  let items = []

  if (item.mode === `tabs`) {
    if (some_unmuted) {
      items.push(App.item_menu_item({cmd: `mute_tabs`, item: item}))
    }

    if (some_muted) {
      items.push(App.item_menu_item({cmd: `unmute_tabs`, item: item}))
    }

    if (some_loaded) {
      items.push(App.item_menu_item({cmd: `unload_tabs`, item: item}))
    }

    items.push(App.item_menu_item({cmd: `duplicate_tabs`, item: item}))

    if (App.tab_is_edited(item)) {
      items.push(App.item_menu_item({cmd: `remove_item_edits`, item: item}))
    }
  }

  items.push(App.item_menu_item({cmd: `bookmark_items`, item: item}))

  if (item.image && !multiple) {
    items.push(App.item_menu_item({cmd: `set_background_image`, item: item}))
  }

  if (item.mode === `tabs`) {
    if (items.length) {
      App.sep(items)
    }

    items.push(App.item_menu_item({cmd: `move_tabs_to_top`, item: item}))
    items.push(App.item_menu_item({cmd: `move_tabs_to_bottom`, item: item}))

    items.push({
      icon: App.command_icon,
      text: `To Window`,
      get_items: async () => {
        return await App.get_window_menu_items(item)
      }
    })
  }

  if (item.mode === `closed`) {
    items.push(App.item_menu_item({cmd: `forget_closed_item`, item: item}))
  }

  if (items.length) {
    o_items.push({
      icon: App.command_icon,
      text: `More`,
      items: items,
    })
  }
}

App.extra_menu_items = (o_items) => {
  let mode = App.get_setting(`extra_menu_mode`)

  if (mode === `none`) {
    return
  }

  let items = App.custom_menu_items(`extra_menu`)

  if (mode === `normal`) {
    if (items.length) {
      o_items.push({
        icon: App.command_icon,
        text: `Extra`,
        items: items,
      })
    }
  }
  else if (mode === `flat`) {
    for (let item of items) {
      o_items.push(item)
    }
  }
  else if (mode === `total`) {
    o_items = items
  }
}

App.filter_menu_items = (item) => {
  let items = []

  if (item.custom_color.value) {
    items.push(App.item_menu_item({cmd: `filter_color`, item: item}))
  }

  items.push(App.item_menu_item({cmd: `filte_domain`, item: item}))
  return items
}

App.item_menu_item = (obj) => {
  obj.from = `item_menu`
  return App.cmd_item(obj)
}