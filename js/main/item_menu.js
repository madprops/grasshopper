App.show_item_menu = async (item, x, y) => {
  let active = App.get_active_items(item.mode, item)
  let multiple = active.length > 1
  let min_more_sep = 2
  let min_close_sep = 3
  let items = []

  if (item.mode === `tabs`) {
    let some_loaded = false

    for (let it of active) {
      if (!it.discarded) {
        some_loaded = true
        break
      }
    }

    if (item.pinned && some_loaded) {
      items.push({
        text: `Unpin`,
        action: () => {
          App.unpin_tabs(item)
        }
      })
    }

    if (!item.pinned && some_loaded) {
      items.push({
        text: `Pin`,
        action: () => {
          App.pin_tabs(item)
        }
      })
    }

    if (item.muted) {
      items.push({
        text: `Unmute`,
        action: () => {
          App.unmute_tabs(item)
        }
      })
    }

    if (!item.muted) {
      items.push({
        text: `Mute`,
        action: () => {
          App.mute_tabs(item)
        }
      })
    }

    if (items.length >= min_more_sep) {
      items.push({
        separator: true
      })
    }

    App.common_menu_items(items, item, multiple)
    App.more_menu_items(items, item, multiple, some_loaded)
    App.extra_menu_items(items, item)

    if (items.length >= min_close_sep) {
      items.push({
        separator: true
      })
    }

    items.push({
      text: `Close`,
      action: () => {
        App.close_tabs(item)
      }
    })
  }
  else {
    items.push({
      text: `Open`,
      action: () => {
        App.open_items(item, true)
      }
    })

    App.common_menu_items(items, item, multiple)
    App.more_menu_items(items, item, multiple)
    App.extra_menu_items(items, item)
  }

  NeedContext.show(x, y, items)
}

App.get_window_menu_items = async (item) => {
  let items = []
  let wins = await browser.windows.getAll({populate: false})

  items.push({
    text: `Detach`,
    action: () => {
      App.detach_tabs(item)
    }
  })

  for (let win of wins) {
    if (item.window_id === win.id) {
      continue
    }

    let s = `${win.title.substring(0, 25).trim()} (ID: ${win.id})`
    let text = `Move to: ${s}`

    items.push({
      text: text,
      action: () => {
        App.move_tabs(item, win.id)
      }
    })
  }

  return items
}

App.common_menu_items = (o_items, item, multiple) => {
  let items = []

  if (multiple) {
    items.push({
      text: `Edit`,
      get_items: () => {
        return App.get_edit_items(item, multiple)
      }
    })
  }
  else {
    items.push({
      text: `Edit`,
      direct: true,
      get_items: () => {
        return App.get_edit_options(item)
      }
    })
  }

  if (App.get_media_type(item)) {
    items.push({
      text: `View`,
      action: () => {
        App.view_media(item)
      }
    })
  }

  if (!multiple) {
    if (item.color || item.tags.length) {
      items.push({
        text: `Filter`,
        get_items: () => {
          return App.filter_menu_items(item)
        }
      })
    }
    else {
      items.push({
        text: `Filter`,
        action: () => {
          App.filter_domain(item)
        }
      })
    }
  }

  if (!multiple) {
    items.push({
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

  if (items.length > 0) {
    for (let c of items) {
      o_items.push(c)
    }
  }
}

App.more_menu_items = (o_items, item, multiple, some_loaded) => {
  let items = []

  if (item.mode === `tabs`) {
    if (some_loaded) {
      items.push({
        text: `Unload`,
        action: () => {
          App.unload_tabs(item)
        }
      })
    }

    items.push({
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

    items.push({
      icon: App.settings_icons.theme,
      text: `Add To Pool`,
      action: () => {
        App.add_to_background_pool(item.url)
      }
    })
  }

  if (item.mode === `tabs`) {
    if (items.length > 0) {
      items.push({
        separator: true
      })
    }

    items.push({
      text: `To Top`,
      action: () => {
        App.move_tabs_vertically(`top`, item)
      }
    })

    items.push({
      text: `To Bottom`,
      action: () => {
        App.move_tabs_vertically(`bottom`, item)
      }
    })

    items.push({
      text: `To Window`,
      get_items: async () => {
        return await App.get_window_menu_items(item)
      }
    })
  }

  if (item.mode === `closed`) {
    items.push({
      text: `Forget`,
      action: () => {
        App.forget_closed_tabs(item)
      }
    })
  }

  if (items.length > 0) {
    o_items.push({
      text: `More`,
      get_items: () => {
        return items
      }
    })
  }
}

App.extra_menu_items = (o_items, item) => {
  let items = []
  let extra_menu = App.get_setting(`extra_menu`)

  if (!extra_menu.length) {
    return
  }

  for (let cmd of extra_menu) {
    let split = cmd.split(`;`).map(x => x.trim())

    items.push({
      text: split[0],
      action: () => {
        App.run_command({cmd: split[1], item: item, from: `extra_menu`})
      }
    })
  }

  if (items.length > 0) {
    o_items.push({
      text: `Extra`,
      get_items: () => {
        return items
      }
    })
  }
}

App.filter_menu_items = (item) => {
  let items = []

  if (item.tags.length) {
    items.push({
      text: `Tag`,
      get_items: () => {
        return App.get_item_tag_items(item)
      }
    })
  }

  if (item.color) {
    items.push({
      text: `Color`,
      action: () => {
        App.filter_color(item.mode, item.color)
      }
    })
  }

  items.push({
    text: `Domain`,
    action: () => {
      App.filter_domain(item)
    }
  })

  return items
}

App.show_empty_menu = (x, y) => {
  let items = []
  let extra_menu = App.get_setting(`empty_menu`)

  if (!extra_menu.length) {
    return
  }

  for (let cmd of extra_menu) {
    let split = cmd.split(`;`).map(x => x.trim())

    items.push({
      text: split[0],
      action: () => {
        App.run_command({cmd: split[1], from: `empty_menu`})
      }
    })
  }

  NeedContext.show(x, y, items)
}