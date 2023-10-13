App.show_item_menu = async (item, x, y) => {
  if (!item) {
    return
  }

  let active = App.get_active_items(item.mode, item)
  let multiple = active.length > 1
  let items = []

  if (item.mode === `tabs`) {
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
          App.load_tabs(item)
        }
      })
    }

    if (some_unpinned) {
      items.push({
        text: `Pin`,
        action: () => {
          App.pin_tabs(item)
        }
      })
    }

    if (some_pinned) {
      items.push({
        text: `Unpin`,
        action: () => {
          App.unpin_tabs(item)
        }
      })
    }

    App.common_menu_items(items, item, multiple)
    App.more_menu_items(items, item, multiple, some_loaded, some_unmuted, some_muted)
    App.extra_menu_items(items)
    App.sep(items)

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
    App.extra_menu_items(items)
  }

  NeedContext.show(x, y, items)
}

App.show_item_menu_2 = (item) => {
  if (!item) {
    return
  }

  let rect = item.element.getBoundingClientRect()
  App.show_item_menu(item, rect.left, rect.top)
}

App.common_menu_items = (o_items, item, multiple) => {
  let items = []

  items.push({
    text: `Edit`,
    get_items: () => {
      return App.get_edit_items(item)
    }
  })

  if (item.has_notes) {
    items.push({
      text: `Notes`,
      action: () => {
        return App.show_notes(item)
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
        text: `Mute`,
        action: () => {
          App.mute_tabs(item)
        }
      })
    }

    if (some_muted) {
      items.push({
        text: `Unmute`,
        action: () => {
          App.unmute_tabs(item)
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
      icon: App.mode_icons.closed,
      text: `Forget`,
      action: () => {
        App.forget_closed_item(item)
      }
    })
  }

  if (items.length) {
    o_items.push({
      text: `More`,
      items: items,
    })
  }
}

App.extra_menu_items = (o_items) => {
  let items = App.custom_menu_items(`extra_menu`)

  if (items.length) {
    o_items.push({
      text: `Extra`,
      items: items,
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
      icon: App.settings_icons.theme,
      text: `Color`,
      action: () => {
        App.filter_color(item.mode, item.color)
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