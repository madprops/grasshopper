App.setup_tabs = () => {
  App.tabs_filter_modes = [
    [`--separator--`],
    [`pins`, `Pins`],
    [`normal`, `Normal`],
    [`--separator--`],
    [`playing`, `Playing`],
    [`suspended`, `Suspended`],
    [`duplicates`, `Duplicates`],
    [`--separator--`],
    [`star`, `Has Star`],
    [`title`, `Has Title`],
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
    App.log(`Tab Updated: ID: ${id}`)

    if (App.window_mode === `tabs` && info.windowId === App.window_id) {
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

  DOM.ev(DOM.el(`#window_tabs`), `dblclick`, (e) => {
    if (e.target.id === `tabs_container`) {
      App.new_tab()
    }
  })
}

App.empty_previous_tabs = App.create_debouncer(() => {
  App.do_empty_previous_tabs()
}, App.empty_previous_tabs_delay)

App.pinline_debouncer = App.create_debouncer(() => {
  App.do_check_pinline()
}, 25)

App.check_pinline = () => {
  App.pinline_debouncer.call()
}

App.tabs_check = () => {
  App.check_playing()
}

App.get_tabs = async () => {
  App.log(`Getting tabs`)
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

App.focus_tab = async (item, close = true) => {
  App.select_item(item)

  if (item.window_id) {
    await browser.windows.update(item.window_id, {focused: true})
  }

  try {
    await browser.tabs.update(item.id, {active: true})
  }
  catch (err) {
    App.log(err, `error`)
    App.remove_closed_tab(item.id)
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

  let item = App.get_item_by_id(`tabs`, id)

  if (item) {
    App.update_item(`tabs`, item.id, info)
  }
  else {
    item = App.insert_item(`tabs`, info)
  }

  App.check_pinline()

  if (select) {
    App.select_item(item)
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
  let item = App.get_item_by_id(`tabs`, id)

  if (item) {
    App.remove_item(item)
    App.check_pinline()
  }
}

App.tabs_action = (item) => {
  if (App.check_media(item)) {
    return
  }

  if (!App.active_tab_is(item)) {
    let star = App.get_star_by_url(item.url)

    if (star) {
      App.update_star(star)
    }
  }

  App.focus_tab(item)
  App.check_clear_filter()

}

App.tabs_action_alt = (item, shift_key = false) => {
  App.close_tabs(item, shift_key)
}

App.duplicate_tab = async (item) => {
  try {
    await browser.tabs.duplicate(item.id)
  }
  catch (err) {
    App.log(err, `error`)
  }

  App.close_window()
}

App.suspend_tab = async (item) => {
  if (item.active) {
    try {
      await browser.tabs.create({active: true})
    }
    catch (err) {
      App.log(err, `error`)
    }
  }

  try {
    await browser.tabs.discard(item.id)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.pin_tabs = (item) => {
  let ids = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (it.pinned) {
      continue
    }

    ids.push(it.id)
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

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!it.pinned) {
      continue
    }

    ids.push(it.id)
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

  for (let it of App.get_active_items(`tabs`, item)) {
    if (App.settings.warn_on_suspend) {
      if (it.pinned || it.audible) {
        warn = true
      }
    }

    tabs.push(it)
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

  for (let it of App.get_active_items(`tabs`, item)) {
    if (App.settings.warn_on_close) {
      if (it.pinned || it.audible) {
        warn = true
      }
    }

    ids.push(it.id)
  }

  if (ids.length === 0) {
    return
  }

  let s = App.plural(ids.length, `Close this tab?`, `Close these tabs? (${ids.length})`)

  App.show_confirm(s, () => {
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
  for (let it of App.get_active_items(`tabs`, item)) {
    App.mute_tab(it.id)
  }

  App.dehighlight(`tabs`)
}

App.unmute_tabs = (item) => {
  for (let it of App.get_active_items(`tabs`, item)) {
    App.unmute_tab(it.id)
  }

  App.dehighlight(`tabs`)
}

App.tab_is_normal = (item) => {
  let special = item.pinned || item.audible || item.muted || item.discarded
  return !special
}

App.show_tabs_info = () => {
  let all = App.get_items(`tabs`).length
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

App.on_tab_activated = async (info) => {
  for (let item of App.get_items(`tabs`)) {
    item.active = item.id === info.tabId
  }

  await App.refresh_tab(info.tabId, true)
}

App.move_tabs = async (item, window_id) => {
  for (let it of App.get_active_items(`tabs`, item)) {
    let index = it.pinned ? 0 : -1

    try {
      await browser.tabs.move(it.id, {index: index, windowId: window_id})
    }
    catch (err) {
      App.log(err, `error`)
    }
  }

  App.close_window()
}

App.detach_tabs = async (item) => {
  if (App.get_active_items(`tabs`, item).length === 1) {
    await browser.windows.create({tabId: item.id, focused: false})
    App.close_window()
  }
  else {
    let info = await browser.windows.create({focused: false})

    setTimeout(() => {
      App.move_tabs(item, info.id)
      App.close_window()
    }, 250)
  }
}

App.clean_tabs = () => {
  let ids = []

  for (let it of App.get_items(`tabs`)) {
    if (!it.pinned && !it.audible) {
      ids.push(it.id)
    }
  }

  if (ids.length === 0) {
    if (App.settings.warn_on_clean) {
      App.show_alert(`Nothing to close`)
    }

    return
  }

  let s = ``
  s += `Close normal and suspended tabs\n`
  s += `Tabs playing audio are not closed\n`
  s += `Close these tabs? (${ids.length})`

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  }, undefined, !App.settings.warn_on_clean)
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
  let items = App.get_items(`tabs`)
  let waypoint = false
  let first

  for (let item of items) {
    if (item.audible) {
      if (!first) {
        first = item
      }

      if (waypoint) {
        App.focus_tab(item)
        return
      }
    }

    if (!waypoint && item.active) {
      waypoint = true
      continue
    }
  }

  // If none found then pick the first one
  if (first) {
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

  let prev_tab = App.previous_tabs[App.previous_tabs_index]
  let item = App.get_item_by_id(`tabs`, prev_tab.id)

  if (item) {
    App.focus_tab(item)
    App.previous_tabs_index += 1

    if (App.previous_tabs_index >= App.previous_tabs.length) {
      App.previous_tabs_index = 0
    }
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

App.get_active_tab_item = () => {
  for (let item of App.get_items(`tabs`)) {
    if (item.active) {
      return item
    }
  }
}

App.active_tab_is = (item) => {
  let active = App.get_active_tab_item()

  if (active) {
    return active === item
  }

  return false
}

App.close_duplicates = () => {
  let items = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(items, `url`)

  let excess = App.get_excess(duplicates, `url`)
    .filter(x => !x.pinned && !x.playing)

  let ids = excess.map(x => x.id)

  if (ids.length === 0) {
    if (App.settings.warn_on_duplicates) {
      App.show_alert(`No duplicates found`)
    }

    return
  }

  let s = ``
  s += `Close excess duplicate tabs\n`
  s += `Excluding pinned and playing\n`
  s += `Close these tabs? (${ids.length})`

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  }, undefined, !App.settings.warn_on_duplicates)
}

App.focus_current_tab = async () => {
  let tab = await App.get_active_tab()
  let item = App.get_item_by_id(`tabs`, tab.id)
  let visible = App.element_is_visible(item.element)
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

App.move_tabs_to_top = async (item) => {
  let first

  if (item.pinned) {
    first = 0
  }
  else {
    first = App.get_first_normal_index()
  }

  for (let it of App.get_active_items(item.mode, item)) {
    await App.do_move_tab_index(it.id, first)
    first += 1
  }

  App.check_pinline()
  App.select_item(App.get_selected(item.mode), `center`, false)
}

App.move_tabs_to_bottom = async (item) => {
  let last

  if (item.pinned) {
    last = App.get_last_pin_index()
  }
  else {
    last = App.get_items(`tabs`).length - 1
  }

  for (let it of App.get_active_items(item.mode, item).slice(0).reverse()) {
    await App.do_move_tab_index(it.id, last)
    last -= 1
  }

  App.check_pinline()
  App.select_item(App.get_selected(item.mode), `center`, false)
}

App.get_first_normal_index = () => {
  let i = -1

  for (let item of App.get_items(`tabs`)) {
    i += 1

    if (!item.pinned) {
      return i
    }
  }

  return i
}

App.get_last_pin_index = () => {
  let i = -1

  for (let item of App.get_items(`tabs`)) {

    if (item.pinned) {
      i += 1
    }
    else {
      return i
    }
  }

  return i
}

App.remove_pinline = () => {
  for (let el of DOM.els(`.pinline`, DOM.el(`#tabs_container`))) {
    el.classList.remove(`pinline`)
  }
}

App.do_check_pinline = () => {
  if (App.window_mode !== `tabs`) {
    return
  }

  if (!App.settings.show_pinline) {
    return
  }

  App.log(`Checking pinline`)
  App.remove_pinline()
  let last_pinned

  for (let item of App.get_items(`tabs`)) {
    if (!item.visible) {
      continue
    }

    if (item.pinned) {
      last_pinned = item
    }
    else {
      if (!last_pinned) {
        return
      }
      else {
        let pinline = DOM.create(`div`, `pinline`)
        last_pinned.element.after(pinline)
        return
      }
    }
  }
}