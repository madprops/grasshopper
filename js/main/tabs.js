App.setup_tabs = () => {
  App.tabs_filter_modes = [
    [`pins`, `Pins`],
    [`normal`, `Normal`],
    [`playing`, `Playing`],
    [`unloaded`, `Unloaded`],
    [`duplicate`, `Duplicate`],
  ]

  App.tabs_actions = [
    {text: `New Tab`, action: () => {
      App.new_tab()
    }},

    {text: `Undo Close`, action: () => {
      App.undo_close_tab()
    }},

    {text: `Tabs Info`, action: () => {
      App.show_tabs_info()
    }},

    {text: `Close Tabs`, get_items: () => {
      return App.get_close_tabs_items()
    }},
  ]

  App.setup_item_window(`tabs`)

  browser.tabs.onUpdated.addListener(async (id, cinfo, info) => {
    App.log(`Tab Updated: ID: ${id}`)

    if (info.windowId === App.window_id) {
      await App.refresh_tab(id, false, info)
      App.tabs_check()
    }
  })

  browser.tabs.onActivated.addListener(async (info) => {
    App.log(`Tab Activated: ID: ${info.tabId}`)

    if (info.windowId === App.window_id) {
      await App.on_tab_activated(info)
      App.tabs_check()
    }
  })

  browser.tabs.onRemoved.addListener((id, info) => {
    App.log(`Tab Removed: ID: ${id}`)

    if (info.windowId === App.window_id) {
      App.remove_closed_tab(id)
      App.tabs_check()
    }
  })

  browser.tabs.onMoved.addListener((id, info) => {
    App.log(`Tab Moved: ID: ${id}`)

    if (info.windowId === App.window_id) {
      App.move_item(`tabs`, info.fromIndex, info.toIndex)
      App.tabs_check()
    }
  })

  browser.tabs.onDetached.addListener((id, info) => {
    App.log(`Tab Detached: ID: ${id}`)

    if (info.oldWindowId === App.window_id) {
      App.remove_closed_tab(id)
      App.tabs_check()
    }
  })

  App.create_popup({
    id: `close_normal`, setup: () => {
      DOM.ev(DOM.el(`#close_normal_button`), `click`, () => {
        let close_unloaded = DOM.el(`#close_normal_unloaded`).checked
        App.do_close_normal_tabs(close_unloaded)
      })
    }
  })

  App.create_popup({
    id: `close_duplicates`, setup: () => {
      DOM.ev(DOM.el(`#close_duplicates_button`), `click`, () => {
        let close_pins = DOM.el(`#close_duplicates_pins`).checked
        App.do_close_duplicate_tabs(close_pins)
      })
    }
  })
}

App.empty_previous_tabs = App.create_debouncer(() => {
  App.do_empty_previous_tabs()
}, App.empty_previous_tabs_delay)

App.tabs_check = () => {
  App.check_playing()
}

App.get_tabs = async () => {
  App.getting(`tabs`)
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

App.after_focus_tab = (method) => {
  if (method === `normal`) {
    App.check_close_on_focus()
  }
}

App.focus_tab = async (item, scroll, method = `normal`) => {
  if (item.created) {
    App.select_item(item, scroll)
  }

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

  App.after_focus_tab(method)
}

App.close_tab = async (id) => {
  try {
    await browser.tabs.remove(id)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.open_new_tab = async (url) => {
  try {
    await browser.tabs.create({url: url, active: true})
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.new_tab = async () => {
  await App.open_new_tab()
  App.check_close_on_focus()
}

App.get_tab_info = async (id) => {
  try {
    let info = await browser.tabs.get(id)
    return info
  }
  catch (err) {
    App.log(err, `error`)
    return
  }
}

App.refresh_tab = async (id, select, info) => {
  if (!info) {
    info = await App.get_tab_info(id)
  }

  if (!info) {
    return
  }

  if (App.get_setting(`single_new_tab`)) {
    if (App.is_new_tab(info.url)) {
      App.close_other_new_tabs(info.id)
    }
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
    if (App.get_selected(`tabs`) !== item) {
      App.select_item(item, `nearest_smooth`)
    }
  }

  App.check_item_theme()
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

App.get_normal_tabs = () => {
  return App.get_items(`tabs`).filter(x => !x.pinned)
}

App.get_playing_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.audible)
}

App.get_muted_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.muted)
}

App.get_unloaded_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.discarded)
}

App.remove_closed_tab = (id) => {
  let item = App.get_item_by_id(`tabs`, id)

  if (item) {
    App.remove_item(item)
    App.check_pinline()
  }
}

App.tabs_action = async (item) => {
  await App.focus_tab(item, `nearest_smooth`)
  App.check_close_on_focus()
}

App.tabs_action_alt = (item) => {
  App.close_tabs(item, false)
}

App.duplicate_tab = async (item) => {
  try {
    await browser.tabs.duplicate(item.id)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.duplicate_tabs = (item) => {
  let items = App.get_active_items(`tabs`, item)
  let force = App.check_force(`warn_on_duplicate_tabs`, items.length)

  if (items.length === 1) {
    force = true
  }

  App.show_confirm(`Duplicate tabs? (${items.length})`, () => {
    for (let it of items) {
      App.duplicate_tab(it)
    }
  }, undefined, force)
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

App.pin_tabs = (item) => {
  let ids = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (it.pinned || it.discarded) {
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
}

App.unpin_tabs = (item) => {
  let ids = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!it.pinned || it.discarded) {
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
}

App.unload_tabs = (item, multiple = true) => {
  let items = []
  let active = false

  for (let it of App.get_active_items(`tabs`, item, multiple)) {
    if (it.discarded || App.is_new_tab(it.url)) {
      continue
    }

    if (it.active) {
      active = true
    }

    items.push(it)
  }

  if (items.length === 0) {
    return
  }

  let force = App.check_tab_force(`warn_on_unload_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm(`Unload items? (${ids.length})`, async () => {
    if (active) {
      let next

      if (ids.length > 1) {
        next = App.get_next_item(`tabs`, {mode: `tabs`, no_selected: true, no_discarded: true})
      }
      else {
        next = App.get_next_item(`tabs`, {mode: `tabs`, no_discarded: true, item: item})
      }

      if (next) {
        await App.focus_tab(next, `nearest_smooth`, `unload`)
      }
      else {
        await App.open_new_tab(`about:blank`)
      }
    }

    App.do_unload_tabs(ids)
  }, undefined, force)
}

App.do_unload_tabs = async (ids) => {
  try {
    await browser.tabs.discard(ids)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.check_tab_force = (warn_setting, items) => {
  if (items.length >= App.max_warn_limit) {
    return false
  }

  let warn_on_action = App.get_setting(warn_setting)

  if (warn_on_action === `always`) {
    return false
  }
  else if (warn_on_action === `never`) {
    return true
  }

  for (let item of items) {
    if (item.pinned || item.audible) {
      if (warn_on_action === `special`) {
        return false
      }
    }
  }

  return true
}

App.close_tabs = (item, multiple = true) => {
  let items = App.get_active_items(`tabs`, item, multiple)
  let force = App.check_tab_force(`warn_on_close_tabs`, items)
  let ids = items.map(x => x.id)

  if (ids.length === 0) {
    return
  }

  let s = App.plural(ids.length, `Close this tab?`, `Close these tabs? (${ids.length})`)

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  }, undefined, force)
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
}

App.unmute_tabs = (item) => {
  for (let it of App.get_active_items(`tabs`, item)) {
    App.unmute_tab(it.id)
  }
}

App.show_tabs_info = () => {
  let all = App.get_items(`tabs`).length
  let pins = App.get_pinned_tabs().length
  let normal = App.get_normal_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let unloaded = App.get_unloaded_tabs().length

  let s = ``
  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
  s += `Normal: ${normal}\n`
  s += `Playing: ${playing}\n`
  s += `Muted: ${muted}\n`
  s += `Unloaded: ${unloaded}`

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

App.toggle_pin_tabs = (item) => {
  let ids = []
  let action

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!action) {
      if (it.pinned) {
        action = `unpin`
      }
      else {
        action = `pin`
      }
    }

    if (action === `pin`) {
      if (it.pinned) {
        continue
      }
    }
    else if (action === `unpin`) {
      if (!it.pinned) {
        continue
      }
    }

    ids.push(it.id)
  }

  if (ids.length === 0) {
    return
  }

  for (let id of ids) {
    if (action === `pin`) {
      App.pin_tab(id)
    }
    else {
      App.unpin_tab(id)
    }
  }
}

App.toggle_mute_tabs = (item) => {
  let ids = []
  let action

  for (let it of App.get_active_items(`tabs`, item)) {
    if (!action) {
      if (it.muted) {
        action = `unmute`
      }
      else {
        action = `mute`
      }
    }

    if (action === `mute`) {
      if (it.muted) {
        continue
      }
    }
    else if (action === `unmute`) {
      if (!it.muted) {
        continue
      }
    }

    ids.push(it.id)
  }

  if (ids.length === 0) {
    return
  }

  for (let id of ids) {
    if (action === `mute`) {
      App.mute_tab(id)
    }
    else {
      App.unmute_tab(id)
    }
  }
}

App.open_tab = async (item) => {
  try {
    let tab = await browser.tabs.create({url: item.url})
    return tab
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.update_tabs_index = async (items) => {
  let info = await App.get_tab_info(items[0].id)

  if (!info) {
    return
  }

  let first_index = App.get_item_element_index(`tabs`, items[0].element)
  let direction

  if (first_index < info.index) {
    direction = `up`
  }
  else if (first_index > info.index) {
    direction = `down`
  }
  else {
    return
  }

  if (direction === `down`) {
    items = items.slice(0).reverse()
  }

  for (let item of items) {
    let index = App.get_item_element_index(`tabs`, item.element)
    await App.do_move_tab_index(item.id, index)
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

    if (item.active) {
      exit = true
    }
  }

  let select = true

  if (App.is_filtered(`tabs`)) {
    select = false
  }

  await App.refresh_tab(info.tabId, select)
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
}

App.detach_tab = async (item) => {
  try {
    await browser.windows.create({tabId: item.id, focused: false})
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.detach_tabs = async (item) => {
  if (App.get_active_items(`tabs`, item).length === 1) {
    await App.detach_tab(item)
  }
  else {
    let info = await browser.windows.create({focused: false})

    setTimeout(() => {
      App.move_tabs(item, info.id)
    }, 250)
  }
}

App.close_normal_tabs = () => {
  App.show_popup(`close_normal`)
  DOM.el(`#close_normal_unloaded`).checked = false
}

App.do_close_normal_tabs = (close_unloaded = true) => {
  let ids = []

  for (let it of App.get_items(`tabs`)) {
    if (!close_unloaded) {
      if (it.discarded) {
        continue
      }
    }

    if (!it.pinned && !it.audible) {
      ids.push(it.id)
    }
  }

  if (ids.length === 0) {
    App.show_alert(`Nothing to close`)
    return
  }

  let force = App.check_force(`warn_on_close_normal_tabs`, ids)

  App.show_confirm(`Close these tabs? (${ids.length})`, () => {
    App.do_close_tabs(ids)
    App.check_close_popup()
  }, undefined, force)
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

App.go_to_playing_tab = () => {
  App.show_all(`tabs`)
  let items = App.get_items(`tabs`)
  let waypoint = false
  let first

  for (let item of items) {
    if (item.audible) {
      if (!first) {
        first = item
      }

      if (waypoint) {
        App.focus_tab(item, `center_smooth`, `playing`)
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
    App.focus_tab(first, `center_smooth`, `playing`)
  }
}

App.do_empty_previous_tabs = () => {
  App.previous_tabs = []
}

App.get_previous_tabs = async () => {
  App.previous_tabs = App.get_items(`tabs`).slice(0)

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
    App.focus_tab(item, `center_smooth`, `previous`)
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

App.get_active_tab_item = () => {
  for (let item of App.get_items(`tabs`)) {
    if (item.active) {
      return item
    }
  }
}

App.close_duplicate_tabs = () => {
  App.show_popup(`close_duplicates`)
  DOM.el(`#close_duplicates_pins`).checked = false
}

App.do_close_duplicate_tabs = (close_pins = true) => {
  let items = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(items, `url`)
  let excess = App.get_excess(duplicates, `url`)

  if (close_pins) {
    excess = excess.filter(x => !x.playing)
  }
  else {
    excess = excess.filter(x => !x.pinned && !x.playing)
  }

  let ids = excess.map(x => x.id)

  if (ids.length === 0) {
    App.show_alert(`No duplicates found`)
    return
  }

  let force = App.check_force(`warn_on_close_duplicate_tabs`, ids)

  App.show_confirm(`Close these tabs? (${ids.length})`, () => {
    App.do_close_tabs(ids)
    App.check_close_popup()
  }, undefined, force)
}

App.focus_current_tab = async (scroll = `nearest_smooth`) => {
  let item = await App.get_active_tab_item()

  if (item) {
    App.select_item(item, scroll)
  }
}

App.move_tabs_vertically = (direction, item) => {
  if (!item) {
    item = App.get_selected(`tabs`)
  }

  if (!item) {
    return
  }

  let items = App.get_active_items(item.mode, item)

  if (items[0].pinned) {
    for (let item of items) {
      if (!item.pinned) {
        return
      }
    }
  }
  else {
    for (let item of items) {
      if (item.pinned) {
        return
      }
    }
  }

  let first, last
  let els = items.map(x => x.element)

  if (direction === `top`) {
    if (item.pinned) {
      first = 0
    }
    else {
      first = App.get_first_normal_index()
    }

    App.get_items(`tabs`)[first].element.before(...els)
  }
  else if (direction === `bottom`) {
    if (item.pinned) {
      last = App.get_last_pin_index()
    }
    else {
      last = App.get_items(`tabs`).length - 1
    }

    App.get_items(`tabs`)[last].element.after(...els)
  }

  App.update_tabs_index(items)
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

App.browser_reload = () => {
  browser.tabs.reload()
}

App.browser_back = () => {
  browser.tabs.goBack()
}

App.browser_forward = () => {
  browser.tabs.goForward()
}

App.get_close_tabs_items = () => {
  let items = []

  items.push({
    text: `Normal`,
    action: () => {
      App.close_normal_tabs()
    }
  })

  items.push({
    text: `Duplicates`,
    action: () => {
      App.close_duplicate_tabs()
    }
  })

  return items
}

App.create_playing_icon = () => {
  playing = DOM.create(`div`, `button icon_button hidden`, `tabs_playing`)
  playing.title = `Go To Playing Tab (Ctrl + Dot)`
  let playing_icon = App.create_icon(`speaker`)

  DOM.ev(playing, `click`, () => {
    App.go_to_playing_tab()
  })

  playing.append(playing_icon)
  return playing
}

App.check_tab_item = (item) => {
  if (item.mode === `tabs`) {
    App.check_tab_pinned(item)
  }
}

App.check_tab_pinned = (item) => {
  if (App.get_setting(`pin_icon`)) {
    if (item.pinned) {
      item.element.classList.add(`pin_item`)
    }
    else {
      item.element.classList.remove(`pin_item`)
    }
  }

  if (App.get_setting(`normal_icon`)) {
    if (item.pinned) {
      item.element.classList.remove(`normal_item`)
    }
    else {
      item.element.classList.add(`normal_item`)
    }
  }
}

App.close_other_new_tabs = (id) => {
  let items = App.get_items(`tabs`)
  let ids = []

  for (let item of items) {
    if (App.is_new_tab(item.url)) {
      if (item.id !== id) {
        ids.push(item.id)
      }
    }
  }

  if (ids.length) {
    App.do_close_tabs(ids)
  }
}

App.check_new_tabs = () => {
  if (!App.get_setting(`single_new_tab`)) {
    return
  }

  let items = App.get_items(`tabs`)
  let first = false
  let ids = []

  for (let item of items) {
    if (App.is_new_tab(item.url)) {
      if (first) {
        ids.push(item.id)
      }
      else {
        first = true
      }
    }
  }

  if (ids.length) {
    App.do_close_tabs(ids)
  }
}

App.divide_tabs = (filter) => {
  let pinned = []
  let normal = []
  let pinned_f = []
  let normal_f = []

  for (let item of App.get_items(`tabs`)) {
    if (item.pinned) {
      pinned.push(item)
    }
    else {
      normal.push(item)
    }
  }

  if (filter) {
    pinned_f = pinned.filter(x => x[filter])
    normal_f = normal.filter(x => x[filter])
  }

  return {
    pinned: pinned,
    normal: normal,
    pinned_f: pinned_f,
    normal_f: normal_f,
  }
}

App.select_tabs = (type = `pins`) => {
  let first

  for (let item of App.get_items(`tabs`)) {
    let valid

    if (type === `pins`) {
      valid = item.pinned
    }
    else if (type === `normal`) {
      valid = !item.pinned
    }

    if (item.visible && valid) {
      if (!first) {
        first = item
      }

      if (!item.selected) {
        App.toggle_selected(item, true, false)
      }
    }
    else {
      if (item.selected) {
        App.toggle_selected(item, false, false)
      }
    }
  }

  if (first) {
    App.set_selected(first)
  }
}

App.is_new_tab = (url) => {
  return App.new_tab_urls.includes(url)
}