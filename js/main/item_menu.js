App.show_item_menu = async (args = {}) => {
  if (!args.item) {
    return
  }

  App.command_item = args.item
  let active = App.get_active_items(args.item.mode, args.item)
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
        items.push({
          text: `Load`,
          action: () => {
            App.load_tabs(args.item)
          }
        })
      }

      if (some_unpinned) {
        items.push({
          icon: App.mode_icons.tabs,
          text: `Pin`,
          action: () => {
            App.pin_tabs(args.item)
          }
        })
      }

      if (some_pinned) {
        items.push({
          icon: App.mode_icons.tabs,
          text: `Unpin`,
          action: () => {
            App.unpin_tabs(args.item)
          }
        })
      }

      items.push({
        icon: App.settings_icons.colors,
        text: `Color`,
        get_items: () => {
          return App.color_menu_items(args.item)
        }
      })

      items.push({
        icon: App.edit_icon,
        text: `Title`,
        action: () => {
          App.prompt_tab_title(args.item)
        }
      })

      App.common_menu_items(items, args.item, multiple)
      App.extra_menu_items(items)
      App.more_menu_items(items, args.item, multiple, some_loaded, some_unmuted, some_muted)
      App.sep(items)

      items.push({
        icon: App.close_icon,
        text: `Close`,
        action: () => {
          App.close_tabs(args.item)
        }
      })
    }
    else {
      items.push({
        icon: App.mode_icons.tabs,
        text: `Open`,
        action: () => {
          App.open_items(args.item, true)
        }
      })

      App.common_menu_items(items, args.item, multiple)
      App.more_menu_items(items, args.item, multiple)
    }
  }

  NeedContext.show({x: args.x, y: args.y, items: items})
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
    items.push({
      icon: App.settings_icons.media,
      text: `View`,
      action: () => {
        App.view_media(item)
      }
    })
  }

  if (!multiple) {
    if (item.custom_color) {
      items.push({
        icon: App.settings_icons.filter,
        text: `Filter`,
        get_items: () => {
          return App.filter_menu_items(item)
        }
      })
    }
    else {
      items.push({
        icon: App.settings_icons.filter,
        text: `Filter`,
        action: () => {
          App.filter_domain(item)
        }
      })
    }
  }

  if (!multiple) {
    items.push({
      icon: App.clipboard_icon,
      text: `Copy`,
      items: [
      {
        text: `Copy URL`,
        action: () => {
          App.copy_url(item)
        }
      },
      {
        text: `Copy Title`,
        action: () => {
          App.copy_title(item)
        }
      }]
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
      items.push({
        icon: App.get_setting(`muted_icon`) || App.command_icon,
        text: `Mute`,
        action: () => {
          App.mute_tabs(item)
        }
      })
    }

    if (some_muted) {
      items.push({
        icon: App.get_setting(`muted_icon`) || App.command_icon,
        text: `Unmute`,
        action: () => {
          App.unmute_tabs(item)
        }
      })
    }

    if (some_loaded) {
      items.push({
        icon: App.get_setting(`unloaded_icon`) || App.command_icon,
        text: `Unload`,
        action: () => {
          App.unload_tabs(item)
        }
      })
    }

    items.push({
      icon: App.mode_icons.tabs,
      text: `Duplicate`,
      action: () => {
        App.duplicate_tabs(item)
      }
    })
  }

  items.push({
    icon: App.mode_icons.bookmarks,
    text: `Bookmark`,
    action: () => {
      App.bookmark_items(item)
    }
  })

  if (item.image && !multiple) {
    items.push({
      icon: App.settings_icons.theme,
      text: `Background`,
      action: () => {
        App.change_background(item.url)
      }
    })
  }

  if (item.mode === `tabs`) {
    if (items.length) {
      App.sep(items)
    }

    items.push({
      icon: App.up_arrow_icon,
      text: `To Top`,
      action: () => {
        App.move_tabs_vertically(`top`, item)
      }
    })

    items.push({
      icon: App.down_arrow_icon,
      text: `To Bottom`,
      action: () => {
        App.move_tabs_vertically(`bottom`, item)
      }
    })

    items.push({
      icon: App.command_icon,
      text: `To Window`,
      get_items: async () => {
        return await App.get_window_menu_items(item)
      }
    })
  }

  if (item.mode === `closed`) {
    items.push({
      icon: App.mode_icons.closed,
      text: `Forget`,
      action: () => {
        App.forget_closed_item(item)
      }
    })
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

  if (item.custom_color) {
    items.push({
      icon: App.settings_icons.theme,
      text: `Color`,
      action: () => {
        App.filter_color(item.mode, item.custom_color)
      }
    })
  }

  items.push({
    icon: App.settings_icons.filter,
    text: `Domain`,
    action: () => {
      App.filter_domain(item)
    }
  })

  return items
}