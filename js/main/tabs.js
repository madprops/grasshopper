// Setup tabs
App.setup_tabs = function () {
  App.tabs_filter_modes = [
    ["pins", "Pins"],
    ["playing", "Playing"],
    ["muted", "Muted"],
    ["active", "Active"],
    ["normal", "Normal"],
    ["http", "Http"],
    ["https", "Https"],
    ["suspended", "zzz"],
  ]

  App.tabs_actions = [
    {text: "--separator--"},

    {text: "New", action: function () {
      App.new_tab()
    }},

    {text: "Info", action: function () {
      App.show_tabs_information()
    }},

    {text: "Clean", action: function () {
      App.clean_tabs()
    }},
  ]

  App.setup_item_window("tabs")

  browser.tabs.onUpdated.addListener(async function (id, cinfo, info) {
    console.info(`Tab Updated: ${id}`)
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      await App.refresh_tab(id)
      App.tabs_check()
    }
  })

  browser.tabs.onActivated.addListener(async function (info) {
    console.info(`Tab Activated: ${info.tabId}`)
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      await App.on_tab_activated(info)
      App.tabs_check()
    }
  })

  browser.tabs.onRemoved.addListener(function (id, info) {
    console.info(`Tab Removed: ${id}`)
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      App.remove_closed_tab(id)
      App.tabs_check()
    }
  })

  browser.tabs.onMoved.addListener(function (id, info) {
    console.info(`Tab Moved: ${id}`)
    if (App.window_mode === "tabs" && info.windowId === App.window_id) {
      App.move_item("tabs", info.fromIndex, info.toIndex)
      App.tabs_check()
    }
  })

  browser.tabs.onDetached.addListener(function (id, info) {
    console.info(`Tab Detached: ${id}`)
    if (App.window_mode === "tabs" && info.oldWindowId === App.window_id) {
      App.remove_closed_tab(id)
      App.tabs_check()
    }
  })

  App.empty_previous_tabs = App.create_debouncer(function () {
    App.do_empty_previous_tabs()
  }, App.empty_previous_tabs_delay)

  App.ev(App.el("#window_tabs"), "dblclick", function (e) {
    if (e.target.id === "tabs_container") {
      App.new_tab()
    }
  })
}

// Some checks after tab operations
App.tabs_check = function () {
  App.check_playing()
  App.show_pinline()
}

// Get open tabs
App.get_tabs = async function () {
  let tabs

  try {
    tabs = await browser.tabs.query({currentWindow: true})
  } catch (err) {
    console.info("Error at get tabs")
    return
  }

  tabs.sort(function (a, b) {
    return a.index < b.index ? -1 : 1
  })

  return tabs
}

// Open a new tab
App.focus_tab = async function (tab, close = true) {
  if (tab.window_id) {
    await browser.windows.update(tab.window_id, {focused: true})
  }

  try {
    await browser.tabs.update(tab.id, {active: true})
  } catch (err) {
    console.info("Error at focus tab")
    App.remove_closed_tab(tab.id)
    App.tabs_check()
  }

  if (close && App.settings.switch_to_tabs) {
    App.close_window()
  }
}

// Close a tab
App.close_tab = async function (id) {
  try {
    await browser.tabs.remove(id)
  } catch (err) {
    console.info("Error at close tab")
  }
}

// Open a new tab
App.new_tab = async function (url = undefined, close = true) {
  try {
    await browser.tabs.create({active: close, url: url})
  } catch (err) {
    console.info("Error at new tab")
  }

  if (close) {
    App.close_window()
  }
}

// Refresh tabs
App.refresh_tab = async function (id, select = false) {
  let info

  try {
    info = await browser.tabs.get(id)
  } catch (err) {
    console.info("Error at refresh tab")
    return
  }

  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    App.update_item("tabs", tab.id, info)
  }
  else {
    tab = App.insert_item("tabs", info)
  }

  if (select) {
    App.select_item(tab)
  }
}

// Pin a tab
App.pin_tab = async function (id) {
  try {
    await browser.tabs.update(id, {pinned: true})
  } catch (err) {
    console.info("Error at pin tab")
  }
}

// Unpin a tab
App.unpin_tab = async function (id) {
  try {
    await browser.tabs.update(id, {pinned: false})
  } catch (err) {
    console.info("Error at unpin tab")
  }
}

// Mute a tab
App.mute_tab = async function (id) {
  try {
    await browser.tabs.update(id, {muted: true})
  } catch (err) {
    console.info("Error at mute tab")
  }
}

// Unmute a tab
App.unmute_tab = async function (id) {
  try {
    await browser.tabs.update(id, {muted: false})
  } catch (err) {
    console.info("Error at unmute tab")
  }
}

// Return pinned tabs
App.get_pinned_tabs = function () {
  return App.get_items("tabs").filter(x => x.pinned)
}

// Return playing tabs
App.get_playing_tabs = function () {
  return App.get_items("tabs").filter(x => x.audible)
}

// Return muted tabs
App.get_muted_tabs = function () {
  return App.get_items("tabs").filter(x => x.muted)
}

// Return suspended tabs
App.get_suspended_tabs = function () {
  return App.get_items("tabs").filter(x => x.discarded)
}

// Remove a closed tab
App.remove_closed_tab = function (id) {
  let tab = App.get_item_by_id("tabs", id)

  if (tab) {
    App.remove_item(tab)
  }
}

// Tabs action
App.tabs_action = function (item) {
  App.focus_tab(item)
}

// Tabs action alt
App.tabs_action_alt = function (item, shift_key = false) {
  App.close_tabs(item, shift_key)
}

// Duplicate a tab
App.duplicate_tab = async function (tab) {
  try {
    await browser.tabs.create({active: true, url: tab.url})
  } catch (err) {
    console.info("Error at duplicate tab")
  }

  App.close_window()
}

// Suspend a tab
App.suspend_tab = async function (tab) {
  if (tab.active) {
    try {
      await browser.tabs.create({active: true})
    } catch (err) {
      console.info("Error at suspend tab")
    }
  }

  try {
    await browser.tabs.discard(tab.id)
  } catch (err) {
    console.info("Error at suspend tab")
  }
}

// Pin tabs
App.pin_tabs = function (item) {
  let ids = []
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (tab.pinned) {
      continue
    }

    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }

  for (let id of ids) {
    App.pin_tab(id)
  }

  App.dehighlight("tabs")
}

// Unpin tabs
App.unpin_tabs = function (item) {
  let ids = []
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (!tab.pinned) {
      continue
    }

    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }

  for (let id of ids) {
    App.unpin_tab(id)
  }

  App.dehighlight("tabs")
}

// Suspend normal tabs
App.suspend_tabs = function (item) {
  let tabs = []
  let warn = false
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (!App.is_http(tab)) {
      continue
    }

    if (tab.pinned || tab.audible) {
      warn = true
    }

    tabs.push(tab)
  }

  if (tabs.length === 0) {
    return
  }

  if (warn) {
    App.show_confirm(`Suspend tabs? (${tabs.length})`, function () {
      for (let tab of tabs) {
        App.suspend_tab(tab)
      }

      App.dehighlight("tabs")
    }, function () {
      App.dehighlight("tabs")
    })
  }
  else {
    for (let tab of tabs) {
      App.suspend_tab(tab)
    }

    App.dehighlight("tabs")
  }
}

// Close tabs
App.close_tabs = function (item, force = false) {
  let ids = []
  let warn = false
  let active = App.get_active_items("tabs", item)

  for (let tab of active) {
    if (tab.pinned || tab.audible) {
      warn = true
    }

    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }

  App.show_confirm(`Close tabs? (${ids.length})`, function () {
    App.do_close_tabs(ids)
    App.dehighlight("tabs")
  }, function () {
    App.dehighlight("tabs")
  }, force || !warn)
}

// Do close tabs
App.do_close_tabs = function (ids) {
  for (let id of ids) {
    App.close_tab(id)
  }
}

// Mute tabs
App.mute_tabs = function (item) {
  let active = App.get_active_items("tabs", item)

  for (let item of active) {
    App.mute_tab(item.id)
  }

  App.dehighlight("tabs")
}

// Unmute tabs
App.unmute_tabs = function (item) {
  let active = App.get_active_items("tabs", item)

  for (let item of active) {
    App.unmute_tab(item.id)
  }

  App.dehighlight("tabs")
}

// Check if tab is normal
App.tab_is_normal = function (tab) {
  let special = tab.pinned || tab.audible || tab.muted || tab.discarded
  return !special
}

// Show tabs information
App.show_tabs_information = function () {
  let all = App.get_items("tabs").length
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
  }
  else {
    App.pin_tab(item.id)
  }
}

// Open a tab
App.open_tab = async function (url, close = true, args = {}) {
  let opts = {}
  opts.url = url
  opts.active = close
  opts = Object.assign(opts, args)

  let tab

  try {
    tab = await browser.tabs.create(opts)
  } catch (err) {
    console.info("Error at open tab")
  }

  return tab
}

// Update tab index
App.update_tab_index = async function () {
  for (let el of App.els(".tabs_item")) {
    let index = App.get_item_element_index("tabs", el)
    await App.do_move_tab_index(parseInt(el.dataset.id), index)
  }
}

// Do tab index move
App.do_move_tab_index = async function (id, index) {
  let ans

  try {
    ans = await browser.tabs.move(id, {index: index})
  } catch (err) {
    console.info("Error at move tab index")
  }

  return ans
}

// On tab activated
App.on_tab_activated = async function (e) {
  for (let tab of App.get_items("tabs")) {
    tab.active = false
  }

  await App.refresh_tab(e.tabId, true)
}

// Move tabs
App.move_tabs = async function (item, window_id) {
  let active = App.get_active_items("tabs", item)

  for (let item of active) {
    let index = item.pinned ? 0 : -1

    try {
      await browser.tabs.move(item.id, {index: index, windowId: window_id})
    } catch (err) {
      console.info("Error at move tabs")
    }
  }

  App.close_window()
}

// Open tab in new window
App.detach_tab = function (tab) {
  browser.windows.create({tabId: tab.id, focused: false})
  App.close_window()
}

// Clean tabs
App.clean_tabs = function () {
  let ids = []

  for (let tab of App.get_items("tabs")) {
    if (!tab.pinned && !tab.audible) {
      ids.push(tab.id)
    }
  }

  if (ids.length === 0) {
    return
  }

  App.show_confirm(`Clean tabs? (${ids.length})`, function () {
    App.do_close_tabs(ids)
  })
}

// Show playing icon
App.show_playing = function () {
  App.el("#tabs_playing").classList.remove("hidden")
}

// Hide playing icon
App.hide_playing = function () {
  App.el("#tabs_playing").classList.add("hidden")
}

// Check if a tab is playing
App.check_playing = function () {
  let playing = App.get_playing_tabs()

  if (playing.length > 0) {
    App.show_playing()
  }
  else {
    App.hide_playing()
  }
}

// Remove the pinline
App.remove_pinline = function () {
  for (let el of App.els("#tabs_container .pinline")) {
    el.classList.remove("pinline")
  }
}

// Show the pinline after the last pin
App.show_pinline = function () {
  let tabs = App.get_items("tabs")

  if (!tabs) {
    return
  }

  let last

  App.remove_pinline()

  if (App.get_filter("tabs") || App.tabs_filter_mode !== "all") {
    return
  }

  for (let tab of tabs) {
    if (tab.pinned) {
      last = tab
    }
    else {
      if (last) {
        last.element.classList.add("pinline")
      }

      break
    }
  }
}

// Check pinline
App.check_pinline = function () {
  if (App.get_filter("tabs") || App.tabs_filter_mode !== "all") {
    App.remove_pinline()
  } else {
    App.show_pinline()
  }
}

// Go the a tab emitting sound
App.go_to_playing = function () {
  let tabs = App.get_items("tabs").slice(0)
  let waypoint = false
  let first

  for (let tab of tabs) {
    if (tab.audible) {
      if (!first) {
        first = tab
      }

      if (waypoint) {
        App.focus_tab(tab)
        return
      }
    }

    if (!waypoint && tab.active) {
      waypoint = true
      continue
    }
  }

  // If none found then pick the first one
  if (first) {
    App.focus_tab(first)
  }
}

// Empty previous tabs
App.do_empty_previous_tabs = function () {
  App.previous_tabs = []
}

// Get previous tabs
App.get_previous_tabs = async function () {
  App.previous_tabs = await App.get_tabs()

  App.previous_tabs.sort(function (a, b) {
    return a.lastAccessed > b.lastAccessed ? -1 : 1
  })

  App.previous_tabs_index = 1
}

// Go to previous tab
App.go_to_previous_tab = async function () {
  if (App.previous_tabs.length === 0) {
    await App.get_previous_tabs()
  }

  App.empty_previous_tabs.call()

  if (App.previous_tabs.length <= 1) {
    return
  }

  App.focus_tab(App.previous_tabs[App.previous_tabs_index])
  App.previous_tabs_index += 1

  if (App.previous_tabs_index >= App.previous_tabs.length) {
    App.previous_tabs_index = 0
  }
}

// Get active tab
App.get_active_tab = async function () {
  let tabs

  try {
    tabs = await browser.tabs.query({currentWindow: true})
  } catch (err) {
    console.info("Error at get active tab")
    return
  }

  for (let tab of tabs) {
    if (tab.active) {
      return tab
    }
  }
}