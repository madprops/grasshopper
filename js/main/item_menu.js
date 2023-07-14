App.show_item_menu = (item, x, y) => {
  let active = App.get_active_items(item.mode, item)
  let multiple = active.length > 1
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

    App.common_menu_items(items, item, multiple)
    App.more_menu_items(items, item, multiple, some_loaded)

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

  else if (item.mode === `stars`) {
    items.push({
      text: `Open`,
      action: () => {
        App.open_items(item, true)
      }
    })

    if (!multiple) {
      items.push({
        text: `Edit`,
        action: () => {
          App.add_or_edit_star(item)
        }
      })
    }

    App.common_menu_items(items, item, multiple)
    App.more_menu_items(items, item, multiple)

    if (items.length >= min_close_sep) {
      items.push({
        separator: true
      })
    }

    items.push({
      text: `Remove`,
      action: () => {
        App.remove_stars(item)
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

  if (item.mode !== `stars`) {
    items.push({
      text: `Star`,
      action: () => {
        App.star_items(item)
      }
    })
  }

  if (!multiple) {
    items.push({
      text: `Filter`,
      action: () => {
        App.filter_domain(item)
      }
    })
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
    if (!multiple) {
      items.push({
        text: `Title`,
        action: () => {
          App.show_title_editor(item)
        }
      })
    }

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

  if (item.image && !multiple) {
    items.push({
      text: `Background `,
      action: () => {
        App.set_background_image(item.url)
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

  if (items.length > 0) {
    o_items.push({
      text: `More`,
      get_items: () => {
        return items
      }
    })
  }
}