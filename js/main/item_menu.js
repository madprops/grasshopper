App.show_item_menu = (item, x, y) => {
  let highlights = App.get_highlights(item.mode)
  let multiple = highlights.length > 0
  let items = []

  if (item.mode === `tabs`) {
    if (!item.discarded) {
      if (item.pinned) {
        items.push({
          text: `Unpin`,
          action: () => {
            App.unpin_tabs(item)
          }
        })
      }
      else {
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
      else {
        items.push({
          text: `Mute`,
          action: () => {
            App.mute_tabs(item)
          }
        })
      }

      items.push({
        separator: true
      })
    }
  }
  else {
    items.push({
      text: `Launch`,
      action: () => {
        App.launch_items(item, true)
      }
    })
  }

  if (item.mode !== `stars`) {
    items.push({
      text: `Star`,
      action: () => {
        App.star_items(item, false)
      }
    })
  }
  else {
    if (!multiple) {
      items.push({
        text: `Edit`,
        action: () => {
          App.add_or_edit_star(item)
        }
      })
    }
  }

  if (!multiple) {
    items.push({
      text: `Filter`,
      action: () => {
        App.filter_domain(item)
      }
    })

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

  if (item.mode === `stars`) {
    items.push({
      text: `Remove`,
      action: () => {
        App.remove_stars(item)
      }
    })
  }

  if (item.mode === `tabs`) {
    items.push({
      text: `More`,
      get_items: () => {
        return App.more_tab_menu_items(item, multiple)
       }
    })

    items.push({
      separator: true
    })

    items.push({
      text: `Close`,
      action: () => {
        App.close_tabs(item)
      }
    })
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

App.more_tab_menu_items = (item, multiple) => {
  let items = []

  if (!item.discarded) {
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

  if (!multiple) {
    items.push({
      text: `Title`,
      action: () => {
        App.show_title_editor(item)
      }
    })
  }

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

  return items
}