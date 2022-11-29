// Setup tabs
App.setup_tabs = function () {
  App.tabs_filter_modes = [
    ["all", "All"],
    ["pins", "Pins"],
    ["normal", "Normal"],
    ["playing", "Playing"],
    ["muted", "Muted"],
    ["suspended", "Suspended"],
    ["secure", "Secure"],
    ["insecure", "Insecure"],
    ["active", "Active"],
  ]

  let actions = [
    ["Recent", function () {
      App.show_recent_tabs()
    }],   
    
    ["New Tab", function () {
      App.new_tab()
    }],  

    ["Information", function () {
      App.show_tabs_information()
    }],  
    
    ["Tab State", undefined, [
      {
        text: "Save State",
        items: App.get_save_tab_state_items()
      },

      {
        text: "Load State",
        items: App.get_load_tab_state_items()
      }
    ]], 

    ["--separator--"],
    
    ["Star Tabs", undefined, [
      {
        text: "Star Normal",
        action: function () {
          App.star_tabs("normal")
        }
      },
      {
        text: "Star Pins",
        action: function () {
          App.star_tabs("pinned")
        }
      },
      {
        text: "Star All",
        action: function () {
          App.star_tabs("all")
        }
      }   
    ]],     

    ["(Un) Pin", undefined, [
      {
        text: "Pin All",
        action: function () {
          App.pin_all_tabs()
        }
      },
      {
        text: "Unpin All",
        action: function () {
          App.unpin_all_tabs()
        }
      }
    ]],

    ["(Un) Mute", undefined, [
      {
        text: "Mute Playing",
        action: function () {
          App.mute_tabs()
        }
      },
      {
        text: "Unmute Muted",
        action: function () {
          App.unmute_tabs()
        }
      }
    ]],

    ["Suspend", undefined, [
      {
        text: "Suspend Normal",
        action: function () {
          App.suspend_tabs("normal")
        }
      },
      {
        text: "Suspend Pins",
        action: function () {
          App.suspend_tabs("pinned")
        }
      },
      {
        text: "Suspend All",
        action: function () {
          App.suspend_tabs("all")
        }
      }
    ]], 
    
    ["--separator--"],    

    ["Close", undefined, [
      {
        text: "Close Normal",
        action: function () {
          App.close_tabs("normal")
        }
      },
      {
        text: "Close Playing",
        action: function () {
          App.close_tabs("audible")
        }
      },
      {
        text: "Close Muted",
        action: function () {
          App.close_tabs("muted")
        }
      },      
      {
        text: "Close Suspended",
        action: function () {
          App.close_tabs("discarded")
        }
      },
      {
        text: "Close Pins",
        action: function () {
          App.close_tabs("pinned")
        }
      },
      {
        text: "Close Others",
        action: function () {
          App.close_tabs(undefined, "active")
        }
      },    
      {
        text: "Close All",
        action: function () {
          App.close_tabs()
        }
      },
      {
        separator: true
      },
      {
        text: "Undo",
        action: function () {
          App.undo_close()
        }
      }    
    ]],
  ]

  App.setup_item_window("tabs", actions)

  browser.tabs.onUpdated.addListener(function (id) {
    if (App.window_mode === "tabs") {
      App.refresh_tab(id)
    }
  })
  
  browser.tabs.onActivated.addListener(function (e) {
    if (App.window_mode === "tabs") {
      App.on_tab_activated(e)
    }
  })  
  
  browser.tabs.onRemoved.addListener(function (id) {
    if (App.window_mode === "tabs") {
      App.remove_closed_tab(id)
    }
  })

  browser.tabs.onMoved.addListener(function (id, info) {
    App.move_item("tabs", info.fromIndex, info.toIndex)
  })
}

// Get open tabs
App.get_tabs = async function () {
  let tabs = await browser.tabs.query({currentWindow: true})

  if (App.tab_sort_mode === "index") {
    App.sort_tabs_by_index(tabs)
  } else if (App.tab_sort_mode === "access") {
    App.sort_tabs_by_access(tabs)
  }

  return tabs  
}

// Sort tabs by access
App.sort_tabs_by_access = function (tabs) {
  tabs.sort(function (a, b) {
    return a.lastAccessed > b.lastAccessed ? -1 : 1
  })
}

// Sort tabs by index
App.sort_tabs_by_index = function (tabs) {
  tabs.sort(function (a, b) {
    return a.index < b.index ? -1 : 1
  })
}

// Open a new tab
App.focus_tab = async function (tab, close = true) {
  if (tab.window_id) {
    await browser.windows.update(tab.window_id, {focused: true})
  }

  await browser.tabs.update(tab.id, {active: true})

  if (close) {
    window.close()
  }
}

// Close tab with possible confirm
App.confirm_close_tab = function (tab) {
  if (!App.tab_is_normal(tab)) {
    let s

    if (tab.audible) {
      s = "Close playing tab?"
    } else if (tab.pinned) {
      s = "Close pinned tab?"
    } else {
      s = "Close tab?"
    }

    App.show_confirm(s, function () {
      App.backup_tabs()
      App.close_tab(tab.id)
    })
  } else {
    App.backup_tabs()
    App.close_tab(tab.id)
  }
}

// Close a tab
App.close_tab = function (id) {
  browser.tabs.remove(id)
}

// Open a new tab
App.new_tab = function (url = undefined) {
  browser.tabs.create({active: true, url: url})
  window.close()
}

// Refresh tabs
App.refresh_tab = async function (id) {
  let info = await browser.tabs.get(id)
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    if (tab.closed) {
      return
    }

    App.update_item("tabs", tab.id, info)
  } else {
    let tab = App.process_item("tabs", info)
    App.tabs_items.splice(info.index, 0, tab)
    App.create_item_element(tab)
    App.el("#tabs_container").append(tab.element)
    App.move_item_element("tabs", tab.element, info.index)
    App.update_info("tabs")
  }
}

// Pin a tab
App.pin_tab = async function (id) {
  await browser.tabs.update(id, {pinned: true})
}

// Unpin a tab
App.unpin_tab = async function (id) {
  await browser.tabs.update(id, {pinned: false})
}

// Mute a tab
App.mute_tab = async function (id) {
  await browser.tabs.update(id, {muted: true})
}

// Unmute a tab
App.unmute_tab = async function (id) {
  await browser.tabs.update(id, {muted: false})
}

// Return pinned tabs
App.get_pinned_tabs = function () {
  return App.tabs_items.filter(x => x.pinned)
}

// Return playing tabs
App.get_playing_tabs = function () {
  return App.tabs_items.filter(x => x.audible)
}

// Return muted tabs
App.get_muted_tabs = function () {
  return App.tabs_items.filter(x => x.muted)
}

// Return suspended tabs
App.get_suspended_tabs = function () {
  return App.tabs_items.filter(x => x.discarded)
}

// Remove a closed tab
App.remove_closed_tab = function (id) {
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    App.remove_item(tab)
  }
}

// Tabs action
App.tabs_action = function (item, shift_key = false) {
  if (shift_key) {
    App.highlight_tab(item)
  } else {
    App.focus_tab(item)
  }
}

// Tabs action alt
App.tabs_action_alt = function (item, shift_key = false) {
  App.check_tab_close(item, shift_key)
}

// Check tab close
App.check_tab_close = function (item, bypass = false) {
  if (bypass || !App.settings.warn_on_close) {
    App.backup_tabs()
    App.close_tab(item.id)
  } else {
    App.confirm_close_tab(item)
  }
}

// Open tab in new window
App.detach_tab = async function (tab) {
  browser.windows.create({tabId: tab.id})
  window.close()
}

// Move tab to another existing window
App.move_tab = async function (tab, window_id) {
  await browser.tabs.move(tab.id, {index: -1, windowId: window_id})
  browser.tabs.update(tab.id, {active: true})
  window.close()
}

// Duplicate a tab
App.duplicate_tab = function (tab) {
  browser.tabs.create({active: true, url: tab.url})
  window.close()
}

// Suspend a tab
App.suspend_tab = async function (tab) {
  if (tab.active) {
    await browser.tabs.create({active: true})
  }

  await browser.tabs.discard(tab.id)
}

// Pin tabs
App.pin_all_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || tab.pinned) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  App.show_confirm(`Pin tabs? (${s})`, function () {
    for (let id of ids) {
      App.pin_tab(id)
    }
  })
}

// Unpin tabs
App.unpin_all_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.pinned) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  App.show_confirm(`Unpin tabs? (${s})`, function () {
    for (let id of ids) {
      App.unpin_tab(id)
    }
  }) 
}

// Suspend normal tabs
App.suspend_tabs = function (type) {
  let tabs = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !App.is_http(tab)) {
      continue
    }

    if (type === "normal") {
      if (!App.tab_is_normal(tab)) {
        continue
      }
    } else if (type === "pinned") {
      if (!tab.pinned) {
        continue
      }
    }
    
    tabs.push(tab)
  }

  if (tabs.length === 0) {
    return
  }
  
  let s = App.plural(tabs.length, "tab", "tabs")

  App.show_confirm(`Suspend tabs? (${s})`, function () {
    for (let tab of tabs) {
      App.suspend_tab(tab)
    }
  })
}

// Close tabs
App.close_tabs = function (include, exclude) {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible) {
      continue
    }

    if (include) {
      if (include === "normal") {
        if (!App.tab_is_normal(tab)) {
          continue
        }
      } else if (!tab[include]) {
        continue
      }
    }

    if (exclude && tab[exclude]) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  App.do_close_tabs(ids)
}

// Mute tabs
App.mute_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.audible || tab.muted) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  App.show_confirm(`Mute playing tabs? (${s})`, function () {
    for (let id of ids) {
      App.mute_tab(id)
    }
  })
}

// Unmute tabs
App.unmute_tabs = function () {
  let ids = []

  for (let tab of App.tabs_items) {
    if (!tab.visible || !tab.muted) {
      continue
    }
    
    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }
  
  let s = App.plural(ids.length, "tab", "tabs")

  App.show_confirm(`Unmute muted tabs? (${s})`, function () {
    for (let id of ids) {
      App.unmute_tab(id)
    }
  })
}

// Check if tab is normal
App.tab_is_normal = function (tab) {
  let special = tab.pinned || tab.audible || tab.discarded
  return !special
}

// Show tabs information
App.show_tabs_information = function () {
  let all = App.tabs_items.length
  let pins = App.get_pinned_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let suspended = App.get_suspended_tabs().length

  let s = "Tab Count:\n\n"

  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
  s += `Playing: ${playing}\n`
  s += `Muted: ${muted}\n`
  s += `Suspended: ${suspended}`

  App.show_alert(s)
}

// Pin or unpin
App.toggle_pin = function (item) {
  if (item.pinned) {
    App.unpin_tab(item.id)
  } else {
    App.pin_tab(item.id)
  }
}

// Save tab state
App.save_tab_state = async function (n) {
  App.show_confirm(`Save tab state on #${n}?`, async function () {
    if (!App.tab_state) {
      await App.stor_get_tab_state()
    }
  
    App.tab_state[n] = App.get_tab_state()
    App.stor_save_tab_state()
  })
}

// Load tab state
App.load_tab_state = async function (n) {
  if (!App.tab_state) {
    await App.stor_get_tab_state()
  }

  let items = App.tab_state[n]

  if (!items) {
    App.show_alert(`Nothing saved on #${n}`)
    return
  }

  App.do_load_tab_state(items)
}

// Do load tab state
App.do_load_tab_state = function (items, confirm = true) {
  let urls = items.map(x => x.url)
  let to_open = items.slice(0)
  let to_close = []
  let tabs = App.get_http_tabs()

  for (let item of tabs) {
    for (let [i, it] of to_open.entries()) {
      if (item.url === it.url) {
        to_open.splice(i, 1)
        break
      }
    }
  }

  for (let item of tabs) {
    let i = urls.indexOf(item.url)

    if (i === -1) {
      to_close.push(item)
    } else {
      urls.splice(i, 1)
    }
  }
  
  let s1 = App.plural(to_open.length, "tab", "tabs")
  let s2 = App.plural(to_close.length, "tab", "tabs")

  async function restore () {
    App.show_alert("Restoring...")
    for (let item of to_close) {
      App.close_tab(item.id)
    }

    for (let item of to_open) {
      try {
        await App.open_tab(item.url, false)
      } catch (e) {
        console.error(e)
      }
    }

    setTimeout(async function () {
      setTimeout(function () {
        App.hide_popup("alert")
        App.show_item_window("tabs")
      }, 900)
      
      let tabs = App.tabs_items.slice(0)

      for (let tab of tabs) {
        tab.xset = false
        tab.xindex = tabs.length
      }
  
      for (let [i, item] of items.entries()) {
        for (let tab of tabs) {                  
          if (!item.empty && (item.url === tab.url)) {         
            if (!tab.xset) {
              tab.pinned = item.pinned
              tab.discarded = item.discarded
              tab.xset = true
              tab.xindex = i
              break
            }
          }
        }
      }

      tabs.sort(function (a, b) {
        return a.xindex < b.xindex ? -1 : 1
      })

      for (let [i, tab] of tabs.entries()) {
        try {
          if (tab.pinned) {
            await App.pin_tab(tab.id)
          }

          if (tab.discarded) {
            await App.suspend_tab(tab)
          }          

          await App.do_move_tab_index(tab.id, i)
        } catch (err) {
          console.error(err)
        }
      }  
    }, 900)  

    App.show_item_window("tabs")
  }

  if (confirm) {
    App.show_confirm(`Open ${s1} and close ${s2}?`, function () {
      restore()
    })
  } else {
    restore()
  }
}

// Get tab state
App.get_tab_state = function () {
  let items = []

  for (let tab of App.get_http_tabs()) {
    items.push({
      url: tab.url,
      pinned: tab.pinned,
      discarded: tab.discarded,
    })
  }

  return items
}

// Open a tab
App.open_tab = async function (url, close = true, args = {}) {
  let opts = {}
  opts.url = url
  opts.active = close
  opts = Object.assign(opts, args)

  let tab = await browser.tabs.create(opts)
  return tab
}

// Do tabs close with ids
App.do_close_tabs = function (ids) {
  let s = App.plural(ids.length, "tab", "tabs")

  App.show_confirm(`Close tabs? (${s})`, function () {
    App.backup_tabs()

    for (let id of ids) {
      App.close_tab(id)
    }
  })  
}

// Get http or https tabs
App.get_http_tabs = function () {
  let tabs = []

  for (let tab of App.tabs_items) {
    if (App.is_http(tab)) {
      tabs.push(tab)
    }
  }

  return tabs
}

// Uno tabs close
App.undo_close = function () {
  if (!App.tabs_backup) {
    App.show_alert("Nothing to undo")
  } else {
    App.do_load_tab_state(App.tabs_backup)
    App.tabs_backup = undefined
  }
}

// Backup tab state
App.backup_tabs = function () {
  App.tabs_backup = App.get_tab_state()
}

// Star tabs
App.star_tabs = async function (type) {
  let tabs = []

  for (let tab of App.tabs_items) {
    if (!tab.visible) {
      continue
    }

    if (type === "normal") {
      if (!App.tab_is_normal(tab)) {
        continue
      }
    } else if (type === "pinned") {
      if (!tab.pinned) {
        continue
      }
    }
    
    let exists = await App.get_star_by_url(tab.url)

    if (exists) {
      continue
    }

    tabs.push(tab)
  }

  if (tabs.length === 0) {
    return
  }

  let s = App.plural(tabs.length, "tab", "tabs")

  App.show_confirm(`Star tabs? (${s})`, async function () {
    for (let tab of tabs) {
      await App.star_item(tab, false)
    }

    App.stor_save_stars()
    App.show_alert("Stars created")
  })  
}

// Get save tab state items
App.get_save_tab_state_items = function () {
  let items = [
    {
      text: "Save on #1",
      action: function () {
        App.save_tab_state(1)
      }
    },
    {
      text: "Save on #2",
      action: function () {
        App.save_tab_state(2)
      }
    },
    {
      text: "Save on #3",
      action: function () {
        App.save_tab_state(3)
      }
    },
    {
      text: "Save on #4",
      action: function () {
        App.save_tab_state(4)
      }
    },
    {
      text: "Save on #5",
      action: function () {
        App.save_tab_state(5)
      }
    }  
  ]

  return items 
}

// Get load tab state items
App.get_load_tab_state_items = function () {
  let items = [
    {
      text: "Load #1",
      action: function () {
        App.load_tab_state(1)
      }
    },
    {
      text: "Load #2",
      action: function () {
        App.load_tab_state(2)
      }
    },
    {
      text: "Load #3",
      action: function () {
        App.load_tab_state(3)
      }
    },
    {
      text: "Load #4",
      action: function () {
        App.load_tab_state(4)
      }
    },
    {
      text: "Load #5",
      action: function () {
        App.load_tab_state(5)
      }
    } 
  ]

  return items
}

// Update tab index
App.update_tab_index = async function () {  
  let pinned, index_first, items
  let highlighted = App.get_highlighted_tabs()
  let item = App.get_item_by_id("tabs", parseInt(App.drag_element.dataset.id))

  if (item.highlighted) {
    index_first = App.get_item_element_index("tabs", highlighted[0].element)
    items = highlighted
  } else {
    index_first = App.get_item_element_index("tabs", App.drag_element)
    items = [item]
  }

  if (App.drag_start_index > index_first) {
    let index_last = App.get_item_element_index("tabs", items[items.length - 1].element)
    pinned = App.tabs_items[index_last].pinned
  } else {
    pinned = App.tabs_items[index_first].pinned
  }  

  // if (App.drag_start_index < index_first) {
  //   highlighted.reverse()
  // }

  let index = index_first

  for (let tab of items) {
    if (pinned) {
      if (!tab.pinned) {
        await App.pin_tab(tab.id)
      }
    } else {
      if (App.pinned) {
        await App.unpin_tab(tab.id)
      }
    }

    await App.do_move_tab_index(tab.id, index)
    index += 1
  }
}

// Do tab index move
App.do_move_tab_index = async function (id, index) {
  let ans = await browser.tabs.move(id, {index: index})
  return ans
}

// Show recent tabs
App.show_recent_tabs = function () {
  App.tab_sort_mode = "access"
  App.show_item_window("tabs")
}

// Highlight a tab
App.highlight_tab = async function (tab) {
  if (tab.highlighted) {
    tab.element.classList.remove("highlighted")
  } else {
    tab.element.classList.add("highlighted")
  }

  tab.highlighted = !tab.highlighted
}

// On tab activated
App.on_tab_activated = async function (e) {
  for (let tab of App.tabs_items) {
    tab.active = false
  }
  
  App.refresh_tab(e.tabId)
}

// Get highlighted tabs
App.get_highlighted_tabs = function () {
  let ans = []

  for (let tab of App.tabs_items) {
    if (tab.highlighted) {
      ans.push(tab)
    }
  }

  return ans
}