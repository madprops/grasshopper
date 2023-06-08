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
    {text: `New Tab`, action: () => {
      App.new_tab()
    }},

    {text: `Colorscreen`, action: () => {
      App.show_colorscreen()
    }},

    {text: `Minesweeper`, action: () => {
      App.show_minesweeper()
    }},

    {text: `--separator--`},

    {text: `Show Info`, action: () => {
      App.show_tabs_info()
    }},

    {text: `Titles Data`, get_items: () => {
      return App.get_title_items()
    }},

    {text: `Close Tabs`, get_items: () => {
      return App.get_close_tabs_items()
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

App.focus_tab = async (item, scroll) => {
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
    App.select_item(item, `nearest_smooth`)
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

App.do_suspend_tab = async (item) => {
  try {
    await browser.tabs.discard(item.id)
  }
  catch (err) {
    App.log(err, `error`)
  }
}

App.suspend_tab = async (item) => {
  if (item.active) {
    try {
      await App.open_new_tab()
    }
    catch (err) {
      App.log(err, `error`)
    }
  }

  App.do_suspend_tab(item)
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

  for (let it of App.get_active_items(`tabs`, item)) {
    tabs.push(it)
  }

  if (tabs.length === 0) {
    return
  }

  let warn = App.check_tab_warn(tabs, `warn_on_suspend_tabs`)

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
    App.dehighlight(`tabs`)
    App.do_close_tabs(ids)
  }, () => {
    App.dehighlight(`tabs`)
  }, force || !warn)
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

  App.show_alert(s, undefined)
}

App.toggle_pin = (item) => {
  if (item.pinned) {
    App.unpin_tab(item.id)
  }
  else {
    App.pin_tab(item.id)
  }
}

App.open_tab = async (url, args = {}) => {
  let opts = {}
  opts.url = url
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

  App.scroll_to_item(App.get_selected(`tabs`), `center_smooth`)
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
    if (!App.get_setting(`close_suspended_tabs`)) {
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

  if (App.get_setting(`close_suspended_tabs`)) {
    s += `Including suspended tabs\n`
  }
  else {
    s += `Excluding suspended tabs\n`
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
  if (App.window_mode !== `tabs`) {
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
        App.focus_tab(item, `center_smooth`)
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
    App.focus_tab(first, `center_smooth`)
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
    App.focus_tab(item, `center_smooth`)
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
  let tab = await App.get_active_tab()
  let item = App.get_item_by_id(`tabs`, tab.id)

  if (!item) {
    return false
  }

  let visible = App.element_is_visible(item.element)
  let selected = App.get_selected(`tabs`) === item

  if (!selected || !visible) {
    App.select_item(item, `center_smooth`)
    return true
  }

  return false
}

App.tabs_back_action = async () => {
  let was_filtered = App.is_filtered(`tabs`)
  App.clear_or_all(`tabs`)

  if (was_filtered) {
    return
  }

  let scrolled = await App.focus_current_tab()

  if (!scrolled) {
    App.go_to_previous_tab()
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

  App.update_tab_index()
  App.select_item(App.get_selected(`tabs`), `center`, false)
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

App.close_current_tab = async () => {
  let tab = await App.get_active_tab()

  if (!tab) {
    return
  }

  App.close_tab(tab.id)
}

App.reload_current_tab = () => {
  browser.tabs.reload()
}

App.tab_back = () => {
  browser.tabs.goBack()
}

App.tab_forward = () => {
  browser.tabs.goForward()
}

App.duplicate_current_tab = async () => {
  let tab = await App.get_active_tab()

  if (!tab) {
    return
  }

  App.duplicate_tab(tab)
}

App.suspend_current_tab = async () => {
  let tab = await App.get_active_tab()

  if (!tab) {
    return
  }

  await App.open_new_tab()
  App.do_suspend_tab(tab)
}

App.detach_current_tab = async () => {
  let tab = await App.get_active_tab()

  if (!tab) {
    return
  }

  App.detach_tab(tab)
}

App.copy_current_tab_url = async () => {
  let tab = await App.get_active_tab()

  if (!tab) {
    return
  }

  App.copy_url(tab)
}

App.copy_current_tab_title = async () => {
  let tab = await App.get_active_tab()

  if (!tab) {
    return
  }

  App.copy_title(tab)
}

App.switch_to_tabs = () => {
  if (App.get_setting(`switch_to_tabs`)) {
    if (App.window_mode !== `tabs`) {
      App.show_item_window(`tabs`)
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

App.double_click_tab = (item) => {
  let action = App.get_setting(`double_click_tab_action`)

  if (action !== `none`) {
    App.run_command(action, item)
  }
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
    if (item.pinned) {
      item.element.classList.add(`pin_item`)
      item.element.classList.remove(`normal_item`)
    }
    else {
      item.element.classList.add(`normal_item`)
      item.element.classList.remove(`pin_item`)
    }
  }
}

App.show_plugin = async (name) => {
  let url = await browser.extension.getURL(`plugins/${name}/index.html`)

  let item = {
    url: url,
  }

  await App.focus_or_open_item(item)
  App.check_close_on_focus()
}

App.show_colorscreen = () => {
  App.show_plugin(`colorscreen`)
}

App.show_minesweeper = () => {
  App.show_plugin(`minesweeper`)
}