App.setup_tabs = () => {
  App.tabs_filter_modes = [
    [`pins`, `Pinned`],
    [`playing`, `Playing`],
    [`normal`, `Normal`],
    [`suspended`, `Suspended`],
    [`duplicates`, `Duplicates`],
    [`star`, `Has Star`],
    [`title`, `Has Title`],
    [`http`, `^ http:`],
    [`https`, `^ https:`],
  ]

  App.tabs_actions = [
    {text: `--separator--`},

    {text: `New Tab`, action: () => {
      App.new_tab()
    }},

    {text: `Show Info`, action: () => {
      App.show_tabs_info()
    }},

    {text: `Titles Data`, get_items: () => {
      return App.get_title_items()
    }},

    {text: `Duplicates`, action: () => {
      App.close_duplicates()
    }},

    {text: `Clean Tabs`, action: () => {
      App.clean_tabs()
    }},
  ]

  App.setup_item_window(`tabs`)

  browser.tabs.onUpdated.addListener(async (id, cinfo, info) => {
    if (App.window_mode === `tabs` && info.windowId === App.window_id) {
      App.log(`Tab Updated: ID: ${id}`)
      let keys = Object.keys(cinfo)

      // If it's a title change...
      if (keys.length === 1 && keys[0] === `title`) {
        let item = App.get_item_by_id(`tabs`, id)

        if (!item.custom_title) {
          // Update only the title & text
          item.title = cinfo.title
          App.set_item_text(item)
        }

        // No need to fully update the item
        return
      }

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

App.tabs_check = () => {
  App.check_playing()
}

App.get_tabs = async () => {
  let tabs

  try {
    tabs = await browser.tabs.query({currentWindow: true})
  }
  catch (err) {
    App.log(err, `error`)
    return
  }

  tabs.sort((a, b) => {
    return a.index < b.index ? -1 : 1
  })

  return tabs
}

App.focus_tab = async (tab, close = true) => {
  if (tab.window_id) {
    await browser.windows.update(tab.window_id, {focused: true})
  }

  try {
    await browser.tabs.update(tab.id, {active: true})
  }
  catch (err) {
    App.log(err, `error`)
    App.remove_closed_tab(tab.id)
    App.tabs_check()
  }

  if (close) {
    App.close_window()
  }
}

App.close_tab = async (id) => {
  try {
    await browser.tabs.remove(id)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.new_tab = async (url = undefined, close = true) => {
  try {
    await browser.tabs.create({active: close, url: url})
  }
  catch (err) {
    App.log(err, `error`)
  }

  if (close) {
    App.close_window()
  }
}

App.refresh_tab = async (id, select = false) => {
  let info

  try {
    info = await browser.tabs.get(id)
  }
  catch (err) {
    App.log(err, `error`)
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

App.pin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: true})
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.unpin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: false})
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.mute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: true})
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.unmute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: false})
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.get_pinned_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.pinned)
}

App.get_playing_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.audible)
}

App.get_muted_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.muted)
}

App.get_suspended_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.discarded)
}

App.remove_closed_tab = (id) => {
  let tab = App.get_item_by_id(`tabs`, id)

  if (tab) {
    App.remove_item(tab)
  }
}

App.tabs_action = (item) => {
  if (App.check_media(item)) {
    return
  }

  App.focus_tab(item)
}

App.tabs_action_alt = (item, shift_key = false) => {
  App.close_tabs(item, shift_key)
}

App.duplicate_tab = async (tab) => {
  try {
    await browser.tabs.duplicate(tab.id)
  }
  catch (err) {
    App.log(err, `error`)
  }

  App.close_window()
}

App.suspend_tab = async (tab) => {
  if (tab.active) {
    try {
      await browser.tabs.create({active: true})
    }
    catch (err) {
      App.log(err, `error`)
    }
  }

  try {
    await browser.tabs.discard(tab.id)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

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

App.do_close_tabs = (ids) => {
  for (let id of ids) {
    App.close_tab(id)
  }
}

App.mute_tabs = (item) => {
  let active = App.get_active_items(`tabs`, item)

  for (let item of active) {
    App.mute_tab(item.id)
  }

  App.dehighlight(`tabs`)
}

App.unmute_tabs = (item) => {
  let active = App.get_active_items(`tabs`, item)

  for (let item of active) {
    App.unmute_tab(item.id)
  }

  App.dehighlight(`tabs`)
}

App.tab_is_normal = (tab) => {
  let special = tab.pinned || tab.audible || tab.muted || tab.discarded
  return !special
}

App.show_tabs_info = () => {
  let tabs = App.get_items(`tabs`)
  let all = tabs.length
  let pins = App.get_pinned_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let suspended = App.get_suspended_tabs().length

  let s = ``
  s += `Tab Count:\n\n`
  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
  s += `Playing: ${playing}\n`
  s += `Muted: ${muted}\n`
  s += `Suspended: ${suspended}`

  App.show_alert(s)
}

App.toggle_pin = (item) => {
  if (item.pinned) {
    App.unpin_tab(item.id)
  }
  else {
    App.pin_tab(item.id)
  }
}

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
    App.log(err, `error`)
  }

  return tab
}

App.update_tab_index = async () => {
  for (let el of DOM.els(`.tabs_item`)) {
    let index = App.get_item_element_index(`tabs`, el)
    await App.do_move_tab_index(parseInt(el.dataset.id), index)
  }
}

App.do_move_tab_index = async (id, index) => {
  let ans

  try {
    ans = await browser.tabs.move(id, {index: index})
  }
  catch (err) {
    App.log(err, `error`)
  }

  return ans
}

App.on_tab_activated = async (e) => {
  for (let item of App.get_items(`tabs`)) {
    item.active = item.id === e.tabId
  }

  let selected = App.get_selected(`tabs`)

  if (selected && selected.id === e.tabId) {
    return
  }

  await App.refresh_tab(e.tabId, true)
}

App.move_tabs = async (item, window_id) => {
  let active = App.get_active_items(`tabs`, item)

  for (let item of active) {
    let index = item.pinned ? 0 : -1

    try {
      await browser.tabs.move(item.id, {index: index, windowId: window_id})
    }
    catch (err) {
      App.log(err, `error`)
    }
  }

  App.close_window()
}

App.detach_tab = (tab) => {
  browser.windows.create({tabId: tab.id, focused: false})
  App.close_window()
}

App.clean_tabs = () => {
  let ids = []

  for (let tab of App.get_items(`tabs`)) {
    if (!tab.pinned && !tab.audible) {
      ids.push(tab.id)
    }
  }

  if (ids.length === 0) {
    App.show_alert(`Nothing to close`)
    return
  }

  let s = ``
  s += `Close normal and suspended tabs\n`
  s += `Tabs playing audio are not closed\n`
  s += `Close these tabs? (${ids.length})`

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  })
}

App.show_playing = () => {
  DOM.el(`#tabs_playing`).classList.remove(`hidden`)
}

App.hide_playing = () => {
  DOM.el(`#tabs_playing`).classList.add(`hidden`)
}

App.check_playing = () => {
  let playing = App.get_playing_tabs()

  if (playing.length > 0) {
    App.show_playing()
  }
  else {
    App.hide_playing()
  }
}

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
        App.select_item(tab)
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
    App.select_item(first)
    App.focus_tab(first)
  }
}

App.do_empty_previous_tabs = () => {
  App.previous_tabs = []
}

App.get_previous_tabs = async () => {
  App.previous_tabs = await App.get_tabs()

  App.previous_tabs.sort((a, b) => {
    return a.lastAccessed > b.lastAccessed ? -1 : 1
  })

  App.previous_tabs_index = 1
}

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

App.get_active_tab = async () => {
  try {
    let tabs = await browser.tabs.query({active: true, currentWindow: true})
    return tabs[0]
  }
  catch (err) {
    App.log(err, `error`)
  }
}

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

  // Apply title to existing items
  for (let item of App.get_items(`tabs`)) {
    if (url.startsWith(item.url)) {
      App.refresh_tab(item.id)
    }
  }

  App.show_last_window()
}

App.remove_title = () => {
  DOM.el(`#title_editor_title`).value = ``
  App.title_editor_save()
}

App.get_title = (url) => {
  for (let item of App.titles) {
    if (url.startsWith(item.url)) {
      return item.title
    }
  }
}

App.remove_all_titles = () => {
  if (App.titles.length === 0) {
    App.show_alert(`No titles saved`)
    return
  }

  App.show_confirm(`Remove all titles? (${App.titles.length})`, () => {
    App.titles = []
    App.stor_save_titles()
    App.show_item_window(`tabs`)
  })
}

App.get_title_items = () => {
  let items = []

  items.push({
    text: `Remove All`,
    action: () => {
      App.remove_all_titles()
    }
  })

  items.push({
    text: `Export Data`,
    action: () => {
      App.export_titles()
    }
  })

  items.push({
    text: `Import Data`,
    action: () => {
      App.import_titles()
    }
  })

  return items
}

App.export_titles = () => {
  App.show_textarea(`Copy this to import it later`, JSON.stringify(App.titles, null, 2))
}

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

App.close_duplicates = () => {
  let items = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(items, `url`)

  let excess = App.get_excess(duplicates, `url`)
    .filter(x => !x.pinned && !x.playing)

  let ids = excess.map(x => x.id)

  if (ids.length === 0) {
    App.show_alert(`No duplicates found`)
    return
  }

  let s = ``
  s += `Close excess duplicate tabs\n`
  s += `Excluding pinned and playing\n`
  s += `Close these tabs? (${ids.length})`

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  })
}

App.focus_current_tab = async () => {
  let tab = await App.get_active_tab()
  let item = App.get_item_by_id(`tabs`, tab.id)
  let container = DOM.el(`#tabs_container`)
  let visible = App.element_is_visible(container, item.element)
  let selected = App.get_selected(`tabs`) === item

  if (!selected || !visible) {
    App.select_item(item, `center`)
    return true
  }

  return false
}

App.tabs_back_action = async () => {
  let scrolled = await App.focus_current_tab()

  if (!scrolled) {
    App.go_to_previous_tab()
  }
}