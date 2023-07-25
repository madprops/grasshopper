App.setup_tabs = () => {
  App.tabs_filter_modes = [
    [App.separator_string],
    [`pinned`, `Pinned`],
    [`normal`, `Normal`],
    [`playing`, `Playing`],
    [`unloaded`, `Unloaded`],
    [`duplicate`, `Duplicate`],
    [`title`, `Has Title`],
  ]

  App.tabs_actions = [
    {text: `New Tab`, action: () => {
      App.new_tab()
    }},

    {text: `Undo Close`, action: () => {
      App.undo_close_tab()
    }},

    {text: App.separator_string},

    {text: `Show Info`, action: () => {
      App.show_tabs_info()
    }},

    {text: `Titles Data`, get_items: () => {
      return App.get_title_items()
    }},

    {text: App.separator_string},

    {text: `Close Tabs`, get_items: () => {
      return App.get_close_tabs_items()
    }},
  ]

  App.setup_item_window(`tabs`)

  browser.tabs.onUpdated.addListener(async (id, cinfo, info) => {
    App.log(`Tab Updated: ID: ${id}`)

    if (App.active_mode === `tabs` && info.windowId === App.window_id) {
      await App.refresh_tab(id)
      App.tabs_check()
    }
  })

  browser.tabs.onActivated.addListener(async (info) => {
    App.log(`Tab Activated: ID: ${info.tabId}`)

    if (App.active_mode === `tabs` && info.windowId === App.window_id) {
      await App.on_tab_activated(info)
      App.tabs_check()
    }
  })

  browser.tabs.onRemoved.addListener((id, info) => {
    App.log(`Tab Removed: ID: ${id}`)

    if (info.windowId === App.window_id) {
      if (App.active_mode === `tabs`) {
        App.remove_closed_tab(id)
        App.tabs_check()
      }
    }

  })

  browser.tabs.onMoved.addListener((id, info) => {
    App.log(`Tab Moved: ID: ${id}`)

    if (App.active_mode === `tabs` && info.windowId === App.window_id) {
      App.move_item(`tabs`, info.fromIndex, info.toIndex)
      App.tabs_check()
    }
  })

  browser.tabs.onDetached.addListener((id, info) => {
    App.log(`Tab Detached: ID: ${id}`)

    if (App.active_mode === `tabs` && info.oldWindowId === App.window_id) {
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

App.after_focus_tab = (method) => {
  if (method === `normal`) {
    App.check_close_on_focus()
    App.switch_to_tabs()
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

App.new_tab = async (url) => {
  await App.open_new_tab(url)
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

App.refresh_tab = async (id, select = false) => {
  let info = await App.get_tab_info(id)

  if (!info) {
    return
  }

  if (App.get_setting(`single_new_tab`)) {
    if (info.url === App.new_tab_url) {
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
    App.select_item(item, `center_smooth`)
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
}

App.duplicate_tabs = async (item) => {
  let items = App.get_active_items(`tabs`, item)
  let warn = App.get_setting(`warn_on_duplicate_tabs`)

  if (items.length === 1) {
    warn = false
  }

  if (warn) {
    App.show_confirm(`Duplicate tabs? (${items.length})`, () => {
      for (let it of items) {
        App.duplicate_tab(it)
      }
    })
  }
  else {
    for (let it of items) {
      App.duplicate_tab(it)
    }
  }
}

App.do_unload_tab = async (item) => {
  try {
    await browser.tabs.discard(item.id)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.unload_tab = async (item) => {
  if (item.active) {
    try {
      let next_item = App.get_next_item(`tabs`)

      if (next_item) {
        await App.focus_tab(next_item, `nearest_instant`)
      }
      else {
        await App.open_new_tab()
      }
    }
    catch (err) {
      App.log(err, `error`)
    }
  }

  App.do_unload_tab(item)
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

App.unload_tabs = (item) => {
  let tabs = []

  for (let it of App.get_active_items(`tabs`, item)) {
    if (it.discarded) {
      continue
    }

    tabs.push(it)
  }

  if (tabs.length === 0) {
    return
  }

  let warn = App.check_tab_warn(tabs, `warn_on_unload_tabs`)

  if (warn) {
    App.show_confirm(`Unload tabs? (${tabs.length})`, () => {
      for (let tab of tabs) {
        App.unload_tab(tab)
      }
    })
  }
  else {
    for (let tab of tabs) {
      App.unload_tab(tab)
    }
  }
}

App.check_tab_warn = (items, setting) => {
  let warn_on_action = App.get_setting(setting)

  if (warn_on_action === `always`) {
    return true
  }
  else if (warn_on_action === `never`) {
    return false
  }

  for (let item of items) {
    if (item.pinned || item.audible) {
      if (warn_on_action === `special`) {
        return true
      }
    }
  }

  return false
}

App.close_tabs = (item, force = false, multiple = true) => {
  let ids = []
  let warn = false

  if (multiple) {
    let items = App.get_active_items(`tabs`, item)
    warn = App.check_tab_warn(items, `warn_on_close_tabs`)
    ids = items.map(x => x.id)
  }
  else {
    warn = App.check_tab_warn([item], `warn_on_close_tabs`)
    ids.push(item.id)
  }

  if (ids.length === 0) {
    return
  }

  let s = App.plural(ids.length, `Close this tab?`, `Close these tabs? (${ids.length})`)

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  }, undefined, force || !warn)
}

App.do_close_tabs = async (ids) => {
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

App.tab_is_normal = (item) => {
  let special = item.pinned || item.audible || item.muted || item.discarded
  return !special
}

App.show_tabs_info = () => {
  let all = App.get_items(`tabs`).length
  let pins = App.get_pinned_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let unloaded = App.get_unloaded_tabs().length

  let s = ``
  s += `Tab Count:\n\n`
  s += `All: ${all}\n`
  s += `Pins: ${pins}\n`
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
  let exit = false

  for (let item of App.get_items(`tabs`)) {
    item.active = item.id === info.tabId

    if (item.active) {
      if (item === App.get_selected(`tabs`)) {
        exit = true
      }
    }

    App.check_tab_active(item)
  }

  // Avoid refreshes
  // Already selected
  if (exit) {
    return
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
  let ids = []

  for (let it of App.get_items(`tabs`)) {
    if (!App.get_setting(`close_unloaded_tabs`)) {
      if (it.discarded) {
        continue
      }
    }

    if (!it.pinned && !it.audible) {
      ids.push(it.id)
    }
  }

  if (ids.length === 0) {
    if (App.get_setting(`warn_on_close_normal_tabs`)) {
      App.show_alert(`Nothing to close`)
    }

    return
  }

  let s = ``
  s += `Close normal tabs\n`

  if (App.get_setting(`close_unloaded_tabs`)) {
    s += `Including unloaded tabs\n`
  }
  else {
    s += `Excluding unloaded tabs\n`
  }

  s += `Excluding playing tabs\n`
  s += `Close these tabs? (${ids.length})`

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  }, undefined, !App.get_setting(`warn_on_close_normal_tabs`))
}

App.show_playing = () => {
  DOM.el(`#tabs_playing`).classList.remove(`hidden`)
}

App.hide_playing = () => {
  DOM.el(`#tabs_playing`).classList.add(`hidden`)
}

App.check_playing = () => {
  if (App.active_mode !== `tabs`) {
    return
  }

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

App.active_tab_is = (item) => {
  let active = App.get_active_tab_item()

  if (active) {
    return active === item
  }

  return false
}

App.close_duplicate_tabs = () => {
  let items = App.get_items(`tabs`)
  let duplicates = App.find_duplicates(items, `url`)

  let excess = App.get_excess(duplicates, `url`)

  if (App.get_setting(`close_duplicate_pins`)) {
    excess = excess.filter(x => !x.playing)
  }
  else {
    excess = excess.filter(x => !x.pinned && !x.playing)
  }

  let ids = excess.map(x => x.id)

  if (ids.length === 0) {
    if (App.get_setting(`warn_on_close_duplicate_tabs`)) {
      App.show_alert(`No duplicates found`)
    }

    return
  }

  let s = `Close duplicates\n`

  if (App.get_setting(`close_duplicate_pins`)) {
    s += `Including pinned tabs\n`
  }
  else {
    s += `Excluding pinned tabs\n`
  }

  s += `Excluding playing tabs\n`
  s += `Close these tabs? (${ids.length})`

  App.show_confirm(s, () => {
    App.do_close_tabs(ids)
  }, undefined, !App.get_setting(`warn_on_close_duplicate_tabs`))
}

App.focus_current_tab = async () => {
  let item = await App.get_active_tab_item()

  if (item) {
    App.select_item(item, `nearest_smooth`)
  }
}

App.move_tabs_vertically = async (direction, item) => {
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

App.switch_to_tabs = () => {
  if (App.get_setting(`switch_to_tabs`)) {
    if (App.window_mode !== `tabs`) {
      if (App.active_mode === `tabs`) {
        App.raise_window(`tabs`)
      }
      else {
        App.show_mode(`tabs`)
      }
    }
  }
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
    App.check_tab_active(item)
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

App.check_tab_active = (item) => {
  if (item.mode === `tabs` && App.get_setting(`active_icon`)) {
    if (item.active) {
      item.element.classList.add(`active`)
    }
    else {
      item.element.classList.remove(`active`)
    }
  }
}

App.close_other_new_tabs = (id) => {
  let items = App.get_items(`tabs`)

  for (let item of items) {
    if (item.url === App.new_tab_url) {
      if (item.id !== id) {
        App.close_tabs(item, true)
      }
    }
  }
}

App.check_new_tabs = () => {
  if (!App.get_setting(`single_new_tab`)) {
    return
  }

  let items = App.get_items(`tabs`)
  let first = false

  for (let item of items) {
    if (item.url === App.new_tab_url) {
      if (first) {
        App.close_tabs(item, true)
      }
      else {
        first = true
      }
    }
  }
}

App.toggle_tabs = () => {
  let pinned = App.get_pinned_tabs()
  let normal = App.get_normal_tabs()
  let pinned_h = pinned.filter(x => x.highlighted)
  let normal_h = normal.filter(x => x.highlighted)
  App.dehighlight(`tabs`)

  if (pinned_h.length > 0) {
    for (let item of normal) {
      App.toggle_highlight(item, true)
    }
  }
  else if (normal_h.length === 0) {
    for (let item of pinned) {
      App.toggle_highlight(item, true)
    }
  }
}