// Setup tabs
App.setup_tabs = () => {
  // Store dates of when a tab is first processed
  App.tabs_created = {}

  App.tabs_filter_modes = [
    [`pins`, `Pins`],
    [`playing`, `Playing`],
    [`muted`, `Muted`],
    [`active`, `Active`],
    [`normal`, `Normal`],
    [`duplicates`, `Dups`],
    [`http`, `http:`],
    [`https`, `https:`],
    [`suspended`, `zzz`],
  ]

  App.tabs_actions = [
    {text: `--separator--`},

    {text: `New`, action: () => {
      App.new_tab()
    }},

    {text: `Info`, action: () => {
      App.show_tabs_info()
    }},

    {text: `Titles`, get_items: () => {
      return App.get_title_items()
    }},

    {text: `Dups`, action: () => {
      App.remove_dups()
    }},

    {text: `Clean`, action: () => {
      App.clean_tabs()
    }},
  ]

  App.setup_item_window(`tabs`)

  browser.tabs.onUpdated.addListener(async (id, cinfo, info) => {
    if (App.window_mode === `tabs` && info.windowId === App.window_id) {
      let keys = Object.keys(cinfo)

      // If it's a title change...
      // Ignore if the tab has a fixed title
      if (keys.length === 1 && keys[0] === `title`) {
        let tab = App.get_item_by_id(`tabs`, id)

        if (App.get_title(tab.url)) {
          return
        }
      }

      App.log(`Tab Updated: ID: ${id}`)
      await App.refresh_tab(id)
      App.tabs_check()
    }
  })

  browser.tabs.onActivated.addListener(async (info) => {
    App.log(`Tab Activated: ID: ${info.tabId}`)
    if (App.window_mode === `tabs` && info.windowId === App.window_id) {
      await App.on_tab_activated(info)
      App.tabs_check()
    }
  })

  browser.tabs.onRemoved.addListener((id, info) => {
    App.log(`Tab Removed: ID: ${id}`)
    if (App.window_mode === `tabs` && info.windowId === App.window_id) {
      App.remove_closed_tab(id)
      App.tabs_check()
    }
  })

  browser.tabs.onMoved.addListener((id, info) => {
    App.log(`Tab Moved: ID: ${id}`)
    if (App.window_mode === `tabs` && info.windowId === App.window_id) {
      App.move_item(`tabs`, info.fromIndex, info.toIndex)
      App.tabs_check()
    }
  })

  browser.tabs.onDetached.addListener((id, info) => {
    App.log(`Tab Detached: ID: ${id}`)
    if (App.window_mode === `tabs` && info.oldWindowId === App.window_id) {
      App.remove_closed_tab(id)
      App.tabs_check()
    }
  })

  App.empty_previous_tabs = App.create_debouncer(() => {
    App.do_empty_previous_tabs()
  }, App.empty_previous_tabs_delay)

  DOM.ev(DOM.el(`#window_tabs`), `dblclick`, (e) => {
    if (e.target.id === `tabs_container`) {
      App.new_tab()
    }
  })

  App.create_window({id: `title_editor`, setup: () => {
    DOM.ev(DOM.el(`#title_editor_save`), `click`, () => {
      App.title_editor_save()
    })

    DOM.ev(DOM.el(`#title_editor_remove`), `click`, () => {
      App.remove_title()
    })
  },
  on_x: () => {
    App.show_last_window()
  },
  after_show: () => {
    //
  },
  on_hide: () => {
    App.show_last_window()
  }})
}

// Some checks after tab operations
App.tabs_check = () => {
  App.check_playing()
}

// Get open tabs
App.get_tabs = async () => {
  let tabs

  try {
    tabs = await browser.tabs.query({currentWindow: true})
  }
  catch (err) {
    App.log(`Error at get tabs`, `error`)
    return
  }

  tabs.sort((a, b) => {
    return a.index < b.index ? -1 : 1
  })

  return tabs
}

// Open a new tab
App.focus_tab = async (tab, close = true) => {
  if (tab.window_id) {
    await browser.windows.update(tab.window_id, {focused: true})
  }

  try {
    await browser.tabs.update(tab.id, {active: true})
  }
  catch (err) {
    App.log(`Error at focus tab`, `error`)
    App.remove_closed_tab(tab.id)
    App.tabs_check()
  }

  if (close && App.settings.switch_to_tabs) {
    App.close_window()
  }
}

// Close a tab
App.close_tab = async (id) => {
  try {
    await browser.tabs.remove(id)
  }
  catch (err) {
    App.log(`Error at close tab`, `error`)
  }
}

// Open a new tab
App.new_tab = async (url = undefined, close = true) => {
  try {
    await browser.tabs.create({active: close, url: url})
  }
  catch (err) {
    App.log(`Error at new tab`, `error`)
  }

  if (close) {
    App.close_window()
  }
}

// Refresh tabs
App.refresh_tab = async (id, select = false) => {
  let info

  try {
    info = await browser.tabs.get(id)
  }
  catch (err) {
    App.log(`Error at refresh tab`, `error`)
    return
  }

  let tab = App.get_item_by_id(`tabs`, id)

  if (tab) {
    App.update_item(`tabs`, tab.id, info)
  }
  else {
    tab = App.insert_item(`tabs`, info)
  }

  if (select) {
    App.select_item(tab)
  }
}

// Pin a tab
App.pin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: true})
  }
  catch (err) {
    App.log(`Error at pin tab`, `error`)
  }
}

// Unpin a tab
App.unpin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: false})
  }
  catch (err) {
    App.log(`Error at unpin tab`, `error`)
  }
}

// Mute a tab
App.mute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: true})
  }
  catch (err) {
    App.log(`Error at mute tab`, `error`)
  }
}

// Unmute a tab
App.unmute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: false})
  }
  catch (err) {
    App.log(`Error at unmute tab`, `error`)
  }
}

// Return pinned tabs
App.get_pinned_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.pinned)
}

// Return playing tabs
App.get_playing_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.audible)
}

// Return muted tabs
App.get_muted_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.muted)
}

// Return suspended tabs
App.get_suspended_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.discarded)
}

// Remove a closed tab
App.remove_closed_tab = (id) => {
  let tab = App.get_item_by_id(`tabs`, id)
  delete App.tabs_created[id]

  if (tab) {
    App.remove_item(tab)
  }
}

// Tabs action
App.tabs_action = (item) => {
  App.focus_tab(item)
}

// Tabs action alt
App.tabs_action_alt = (item, shift_key = false) => {
  App.close_tabs(item, shift_key)
}

// Duplicate a tab
App.duplicate_tab = async (tab) => {
  try {
    await browser.tabs.duplicate(tab.id)
  }
  catch (err) {
    App.log(`Error at duplicate tab`, `error`)
  }

  App.close_window()
}

// Suspend a tab
App.suspend_tab = async (tab) => {
  if (tab.active) {
    try {
      await browser.tabs.create({active: true})
    }
    catch (err) {
      App.log(`Error at suspend tab`, `error`)
    }
  }

  try {
    await browser.tabs.discard(tab.id)
  }
  catch (err) {
    App.log(`Error at suspend tab`, `error`)
  }
}

// Pin tabs
App.pin_tabs = (item) => {
  let ids = []
  let active = App.get_active_items(`tabs`, item)

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

  App.dehighlight(`tabs`)
}

// Unpin tabs
App.unpin_tabs = (item) => {
  let ids = []
  let active = App.get_active_items(`tabs`, item)

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

  App.dehighlight(`tabs`)
}

// Suspend normal tabs
App.suspend_tabs = (item) => {
  let tabs = []
  let warn = false
  let active = App.get_active_items(`tabs`, item)

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
    App.show_confirm(`Suspend tabs? (${tabs.length})`, () => {
      for (let tab of tabs) {
        App.suspend_tab(tab)
      }

      App.dehighlight(`tabs`)
    }, () => {
      App.dehighlight(`tabs`)
    })
  }
  else {
    for (let tab of tabs) {
      App.suspend_tab(tab)
    }

    App.dehighlight(`tabs`)
  }
}

// Close tabs
App.close_tabs = (item, force = false) => {
  let ids = []
  let warn = false
  let active = App.get_active_items(`tabs`, item)

  for (let tab of active) {
    if (tab.pinned || tab.audible) {
      warn = true
    }

    ids.push(tab.id)
  }

  if (ids.length === 0) {
    return
  }

  App.show_confirm(`Close tabs? (${ids.length})`, () => {
    App.do_close_tabs(ids)
    App.dehighlight(`tabs`)
  }, () => {
    App.dehighlight(`tabs`)
  }, force || !warn)
}

// Do close tabs
App.do_close_tabs = (ids) => {
  for (let id of ids) {
    App.close_tab(id)
  }
}

// Mute tabs
App.mute_tabs = (item) => {
  let active = App.get_active_items(`tabs`, item)

  for (let item of active) {
    App.mute_tab(item.id)
  }

  App.dehighlight(`tabs`)
}

// Unmute tabs
App.unmute_tabs = (item) => {
  let active = App.get_active_items(`tabs`, item)

  for (let item of active) {
    App.unmute_tab(item.id)
  }

  App.dehighlight(`tabs`)
}

// Check if tab is normal
App.tab_is_normal = (tab) => {
  let special = tab.pinned || tab.audible || tab.muted || tab.discarded
  return !special
}

// Show tabs information
App.show_tabs_info = () => {
  let tabs = App.get_items(`tabs`)
  let all = tabs.length
  let pins = App.get_pinned_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let suspended = App.get_suspended_tabs().length

  let s = `Tab Count:\n\n`
  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
  s += `Playing: ${playing}\n`
  s += `Muted: ${muted}\n`
  s += `Suspended: ${suspended}\n\n`

  s + `URLs:\n\n`

  for (let tab of tabs) {
    s += `${tab.url}\n`
  }

  App.show_alert(s.trim())
}

// Pin or unpin
App.toggle_pin = (item) => {
  if (item.pinned) {
    App.unpin_tab(item.id)
  }
  else {
    App.pin_tab(item.id)
  }
}

// Open a tab
App.open_tab = async (url, close = true, args = {}) => {
  let opts = {}
  opts.url = url
  opts.active = close
  opts = Object.assign(opts, args)

  let tab

  try {
    tab = await browser.tabs.create(opts)
  }
  catch (err) {
    App.log(`Error at open tab`, `error`)
  }

  return tab
}

// Update tab index
App.update_tab_index = async () => {
  for (let el of DOM.els(`.tabs_item`)) {
    let index = App.get_item_element_index(`tabs`, el)
    await App.do_move_tab_index(parseInt(el.dataset.id), index)
  }
}

// Do tab index move
App.do_move_tab_index = async (id, index) => {
  let ans

  try {
    ans = await browser.tabs.move(id, {index: index})
  }
  catch (err) {
    App.log(`Error at move tab index`, `error`)
  }

  return ans
}

// On tab activated
App.on_tab_activated = async (e) => {
  for (let tab of App.get_items(`tabs`)) {
    tab.active = false
  }

  await App.refresh_tab(e.tabId, true)
}

// Move tabs
App.move_tabs = async (item, window_id) => {
  let active = App.get_active_items(`tabs`, item)

  for (let item of active) {
    let index = item.pinned ? 0 : -1

    try {
      await browser.tabs.move(item.id, {index: index, windowId: window_id})
    }
    catch (err) {
      App.log(`Error at move tabs`, `error`)
    }
  }

  App.close_window()
}

// Open tab in new window
App.detach_tab = (tab) => {
  browser.windows.create({tabId: tab.id, focused: false})
  App.close_window()
}

// Clean tabs
App.clean_tabs = () => {
  let ids = []

  for (let tab of App.get_items(`tabs`)) {
    if (!tab.pinned && !tab.audible) {
      ids.push(tab.id)
    }
  }

  if (ids.length === 0) {
    App.show_alert(`Nothing to clean`)
    return
  }

  App.show_confirm(`Clean tabs? (${ids.length})`, () => {
    App.do_close_tabs(ids)
  })
}

// Remove duplicate tabs
App.remove_dups = () => {
  let items = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(items, `url`)
  let excess = App.get_excess(duplicates, `url`)
  let ids = excess.map(x => x.id)

  if (ids.length === 0) {
    App.show_alert(`No duplicates found`)
    return
  }

  App.show_confirm(`Close duplicate tabs? (${ids.length})`, () => {
    App.do_close_tabs(ids)
  })
}

// Show playing icon
App.show_playing = () => {
  DOM.el(`#tabs_playing`).classList.remove(`hidden`)
}

// Hide playing icon
App.hide_playing = () => {
  DOM.el(`#tabs_playing`).classList.add(`hidden`)
}

// Check if a tab is playing
App.check_playing = () => {
  let playing = App.get_playing_tabs()

  if (playing.length > 0) {
    App.show_playing()
  }
  else {
    App.hide_playing()
  }
}

// Go the a tab emitting sound
App.go_to_playing = () => {
  let tabs = App.get_items(`tabs`).slice(0)
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
App.do_empty_previous_tabs = () => {
  App.previous_tabs = []
}

// Get previous tabs
App.get_previous_tabs = async () => {
  App.previous_tabs = await App.get_tabs()

  App.previous_tabs.sort((a, b) => {
    return a.lastAccessed > b.lastAccessed ? -1 : 1
  })

  App.previous_tabs_index = 1
}

// Go to previous tab
App.go_to_previous_tab = async () => {
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
App.get_active_tab = async () => {
  let tabs

  try {
    tabs = await browser.tabs.query({currentWindow: true})
  }
  catch (err) {
    App.log(`Error at get active tab`, `error`)
    return
  }

  for (let tab of tabs) {
    if (tab.active) {
      return tab
    }
  }
}

// Show title editor window
App.show_title_editor = (item) => {
  let title = item.title
  let t = App.get_title(item.url)
  let remove = DOM.el(`#title_editor_remove`)
  let save = DOM.el(`#title_editor_save`)

  if (t) {
    remove.classList.remove(`hidden`)
    save.textContent = `Update`
    title = t
  }
  else {
    remove.classList.add(`hidden`)
    save.textContent = `Save`
  }

  DOM.el(`#title_editor_url`).value = item.url
  DOM.el(`#title_editor_title`).value = title
  App.show_window(`title_editor`)
  DOM.el(`#title_editor_title`).focus()
}

// On title editor save
App.title_editor_save = () => {
  let url = DOM.el(`#title_editor_url`).value.trim()

  if (!url) {
    return
  }

  let title = DOM.el(`#title_editor_title`).value.trim()
  App.titles = App.titles.filter(x => x.url !== url)

  if (!title) {
    App.stor_save_titles()
    App.show_item_window(`tabs`)
    return
  }

  try {
    new URL(url)
  }
  catch (err) {
    App.show_alert(`Invalid URL`)
    return
  }

  App.titles.unshift({url: url, title: title})

  if (App.titles.length > App.max_titles) {
    App.titles = App.titles.slice(0, App.max_titles)
  }

  App.stor_save_titles()
  App.show_item_window(`tabs`)
}

// Remove title
App.remove_title = () => {
  DOM.el(`#title_editor_title`).value = ``
  App.title_editor_save()
}

// Get title item
App.get_title = (url) => {
  for (let item of App.titles) {
    if (url.startsWith(item.url)) {
      return item.title
    }
  }
}

// Remove all titles
App.remove_all_titles = () => {
  App.show_confirm(`Remove all titles? (${App.titles.length})`, () => {
    App.titles = []
    App.stor_save_titles()
    App.show_item_window(`tabs`)
  })
}

// Get title items
App.get_title_items = () => {
  let items = []

  items.push({
    text: `Remove`,
    action: () => {
      App.remove_all_titles()
    }
  })

  items.push({
    text: `Export`,
    action: () => {
      App.export_titles()
    }
  })

  items.push({
    text: `Import`,
    action: () => {
      App.import_titles()
    }
  })

  return items
}

// Display titles json
App.export_titles = () => {
  App.show_textarea(`Copy this to import it later`, JSON.stringify(App.titles, null, 2))
}

// Use title json to replace titles
App.import_titles = () => {
  App.show_input(`Paste the data text here`, `Import`, (text) => {
    if (!text) {
      return
    }

    let json

    try {
      json = JSON.parse(text)
    }
    catch (err) {
      App.show_alert(`Invalid JSON`)
      return
    }

    if (json) {
      App.show_confirm(`Use this data?`, () => {
        App.titles = json
        App.stor_save_titles()
        App.show_window(`tabs`)
      })
    }
  })
}