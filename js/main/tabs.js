App.setup_tabs = () => {
  App.build_tab_filters()
  App.debug_tabs = false

  browser.tabs.onCreated.addListener(async (info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Created: ID: ${info.id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      let item = await App.refresh_tab({id: info.id, info: info})

      if (item) {
        App.check_tab_session([item])
      }
    }
  })

  browser.tabs.onUpdated.addListener(async (id, changed, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Updated: ID: ${id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      await App.refresh_tab({id: id, info: info})

      if (changed.audible !== undefined) {
        App.check_playing()
      }
    }
  })

  browser.tabs.onActivated.addListener(async (info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Activated: ID: ${info.tabId}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      await App.on_tab_activated(info)
    }
  })

  browser.tabs.onRemoved.addListener((id, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Removed: ID: ${id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      App.remove_closed_tab(id)
      App.check_playing()
    }
  })

  browser.tabs.onMoved.addListener((id, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Moved: ID: ${id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      App.move_item(`tabs`, info.fromIndex, info.toIndex)
    }
  })

  browser.tabs.onDetached.addListener((id, info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Detached: ID: ${id}`, App.debug_tabs)

    if (info.oldWindowId === App.window_id) {
      App.remove_closed_tab(id)
      App.check_playing()
    }
  })

  App.tabs_actions = [
    `open_new_tab`,
    `sort_tabs`,
    `reopen_tab`,
    `show_tabs_info`,
    `show_tab_urls`,
    `open_tab_urls`,
    `show_close_tabs_menu`,
  ]
}

App.build_tab_filters = () => {
  App.tabs_filter_modes = [
    {cmd: `filter_pinned_tabs`},
    {cmd: `filter_normal_tabs`},
    {cmd: `filter_playing_tabs`},
    {cmd: `filter_loaded_tabs`},
    {cmd: `filter_unloaded_tabs`},
    {cmd: `filter_unread_tabs`},
    {cmd: `filter_header_tabs`},
    {cmd: `filter_duplicate_tabs`},
  ]
}

App.start_sort_tabs = () => {
  if (App.check_ready(`sort_tabs`)) {
    return
  }

  App.create_popup({
    id: `sort_tabs`,
    setup: () => {
      DOM.ev(DOM.el(`#sort_tabs_button`), `click`, () => {
        App.sort_tabs_action()
      })
    },
  })
}

App.pre_show_tabs = () => {
  App.tabs_locked = false
}

App.get_tabs = async () => {
  App.getting(`tabs`)
  let tabs

  try {
    tabs = await browser.tabs.query({currentWindow: true})
  }
  catch (err) {
    App.error(err)
    return
  }

  if (App.tabs_normal()) {
    tabs.sort((a, b) => {
      return a.index < b.index ? -1 : 1
    })
  }
  else if (App.tabs_recent()) {
    tabs.sort((a, b) => {
      return a.lastAccessed > b.lastAccessed ? -1 : 1
    })
  }

  return tabs
}

App.focus_tab = async (args = {}) => {
  let def_args = {
    method: `normal`,
    show_tabs: false,
    scroll: `center`,
    select: true,
  }

  App.def_args(def_args, args)

  if (!args.item) {
    return
  }

  App.check_tab_first(args.item)

  if (args.select) {
    args.item.active = true
    App.check_tab_active(args.item)
    App.select_item({item: args.item, scroll: args.scroll})
  }

  if (args.item.window_id) {
    await browser.windows.update(args.item.window_id, {focused: true})
  }

  try {
    await browser.tabs.update(args.item.id, {active: true})
  }
  catch (err) {
    App.error(err)
    App.remove_closed_tab(args.item.id)
  }

  App.after_focus(args)
}

App.open_new_tab = async (args = {}) => {
  let def_args = {
    active: true,
  }

  App.def_args(def_args, args)

  try {
    return await browser.tabs.create(args)
  }
  catch (err) {
    App.error(err)
  }
}

App.new_tab = async () => {
  await App.open_new_tab()
  App.after_focus({show_tabs: true})
}

App.get_tab_info = async (id) => {
  try {
    let info = await browser.tabs.get(id)
    return info
  }
  catch (err) {
    App.error(err)
    return
  }
}

App.refresh_tab = async (args = {}) => {
  let def_args = {
    select: false,
  }

  App.def_args(def_args, args)

  if (!args.info) {
    try {
      args.info = await App.get_tab_info(args.id)
    }
    catch (err) {
      App.check_pinline()
      return
    }
  }

  if (!args.info) {
    return
  }

  let item = App.get_item_by_id(`tabs`, args.id)

  if (item) {
    if (item.pinned !== args.info.pinned) {
      App.check_pinline()
    }

    App.update_item(`tabs`, item.id, args.info)
  }
  else {
    item = App.insert_item(`tabs`, args.info)
    App.check_pinline()
  }

  if (args.select && !item.selected && item.visible) {
    App.select_item({item: item, scroll: `nearest_smooth`})
  }

  return item
}

App.mute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: true})
  }
  catch (err) {
    App.error(err)
  }
}

App.unmute_tab = async (id) => {
  try {
    await browser.tabs.update(id, {muted: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.get_pinned_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.pinned)
}

App.get_normal_tabs = () => {
  return App.get_items(`tabs`).filter(x => !x.pinned)
}

App.get_muted_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.muted)
}

App.get_loaded_tabs = () => {
  return App.get_items(`tabs`).filter(x => !x.discarded)
}

App.get_unloaded_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.discarded)
}

App.get_unread_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.unread)
}

App.get_edited_tabs = () => {
  return App.get_items(`tabs`).filter(x => App.edited(x))
}

App.remove_closed_tab = (id) => {
  let item = App.get_item_by_id(`tabs`, id)

  if (item) {
    App.remove_item(item)
    App.check_pinline()
  }
}

App.tabs_action = async (item, from, scroll) => {
  function blink(it) {
    if ([`tab_box`, `header_first`].includes(from)) {
      if (App.get_setting(`tab_box_blink`)) {
        App.blink_item(it)
      }
    }
    else if ([`tab_list`].includes(from)) {
      if (App.get_setting(`tab_list_blink`)) {
        App.blink_item(it)
      }
    }
  }

  if (from === `tab_box`) {
    if (App.is_filtered(`tabs`)) {
      App.filter_all(`tabs`)
    }
  }

  if (!scroll) {
    if (from === `tab_box`) {
      scroll = `center_smooth`
    }
    else {
      scroll = `nearest_smooth`
    }
  }

  if (item.header) {
    let header_action = App.get_setting(`header_action`)

    if (header_action === `none`) {
      if (from === `tab_box`) {
        App.select_item({item: item, scroll: scroll})
        blink(item)
      }

      return
    }
    else if (header_action === `select`) {
      App.select_item({item: item, scroll: scroll})
      blink(item)
      return
    }
    else if (header_action === `first`) {
      App.focus_header_first(item, from, scroll)
      return
    }
  }

  await App.focus_tab({
    item: item,
    select: true,
    scroll: scroll,
  })

  App.on_action(`tabs`)
  blink(item)
}

App.duplicate_tab = async (item) => {
  try {
    await browser.tabs.duplicate(item.id)
  }
  catch (err) {
    App.error(err)
  }
}

App.duplicate_tabs = (item) => {
  let items = App.get_active_items({mode: `tabs`, item: item})
  let force = App.check_force(`warn_on_duplicate_tabs`, items)

  App.show_confirm({
    message:`Duplicate tabs? (${items.length})`,
    confirm_action: () => {
      for (let it of items) {
        App.duplicate_tab(it)
      }
    },
    force: force,
  })
}

App.pin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: true})
  }
  catch (err) {
    App.error(err)
  }
}

App.unpin_tab = async (id) => {
  try {
    await browser.tabs.update(id, {pinned: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.pin_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
    if (it.pinned || it.discarded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_pin_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Pin items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.pin_tab(id)
      }
    },
    force: force,
  })
}

App.unpin_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
    if (!it.pinned || it.discarded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_unpin_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unpin items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.unpin_tab(id)
      }
    },
    force: force,
  })
}

App.unload_tabs = (item, multiple = true) => {
  let items = []
  let active = false

  for (let it of App.get_active_items({mode: `tabs`, item: item, multiple: multiple})) {
    if (it.discarded || App.is_new_tab(it.url)) {
      continue
    }

    if (it.active) {
      active = true
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_unload_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unload tabs? (${ids.length})`,
    confirm_action: async () => {
      if (active) {
        let next

        if (ids.length > 1) {
          next = App.get_next_item(`tabs`, {mode: `tabs`, no_selected: true, no_discarded: true})
        }
        else {
          next = App.get_next_item(`tabs`, {mode: `tabs`, no_discarded: true, item: items[0]})
        }

        if (next) {
          await App.focus_tab({item: next, scroll: `nearest`, method: `unload`})
        }
        else {
          await App.open_new_tab({url: `about:blank`})
        }
      }

      App.do_unload_tabs(ids)
    },
    force: force,
  })
}

App.do_unload_tabs = async (ids) => {
  try {
    await browser.tabs.discard(ids)
  }
  catch (err) {
    App.error(err)
  }
}

App.unload_other_tabs = (item) => {
  let items = []

  function proc (include_pins) {
    if (!include_pins) {
      items = items.filter(x => !x.pinned)
    }

    let ids = items.map(x => x.id)

    App.show_confirm({
      message: `Unload other tabs? (${ids.length})`,
      confirm_action: () => {
        App.do_unload_tabs(ids)
      },
    })
  }

  let active = App.get_active_items({mode: `tabs`, item: item})

  if (!active.length) {
    return
  }

  for (let it of App.get_items(`tabs`)) {
    if (active.includes(it)) {
      continue
    }

    if (it.discarded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  App.show_confirm({
    message: `Include pins?`,
    confirm_action: () => {
      proc(true)
    },
    cancel_action: () => {
      proc(false)
    },
  })
}

App.mute_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
    if (!it.muted) {
      items.push(it)
    }
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_mute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Mute items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.mute_tab(id)
      }
    },
    force: force,
  })
}

App.unmute_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
    if (it.muted) {
      items.push(it)
    }
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_unmute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unmute items? (${ids.length})`,
      confirm_action: async () => {
      for (let id of ids) {
        App.unmute_tab(id)
      }
    },
    force: force,
  })
}

App.show_tabs_info = () => {
  let all = App.get_items(`tabs`).length
  let pins = App.get_pinned_tabs().length
  let normal = App.get_normal_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let loaded = App.get_loaded_tabs().length
  let unloaded = App.get_unloaded_tabs().length
  let unread = App.get_unread_tabs().length
  let edited = App.get_edited_tabs().length

  let items = [
    `All: ${all}`,
    `Pins: ${pins}`,
    `Normal: ${normal}`,
    `Playing: ${playing}`,
    `Muted: ${muted}`,
    `Loaded: ${loaded}`,
    `Unloaded: ${unloaded}`,
    `Unread: ${unread}`,
    `Edited: ${edited}`,
  ]

  App.alert(items.join(`\n`))
}

App.show_tab_urls = () => {
  let urls = []

  for (let item of App.get_items(`tabs`)) {
    if (item.header) {
      continue
    }

    if (!App.is_url(item.url)) {
      continue
    }

    urls.push(item.url)
  }

  urls = App.to_set(urls)
  let s = urls.join(`\n`)
  App.show_textarea(`All Open Tabs (${urls.length})`, s)
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

  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
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

  if (!ids.length) {
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

  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
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

  if (!ids.length) {
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
    App.error(err)
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
    App.error(err)
  }

  return ans
}

App.on_tab_activated = async (info) => {
  let old_active = []

  for (let item of App.get_items(`tabs`)) {
    if (item.active) {
      old_active.push(item)
    }

    item.active = item.id === info.tabId

    if (item.active) {
      item.unread = false
      App.check_tab_first(item)
    }
  }

  let new_active = await App.refresh_tab({id: info.tabId, select: true})
  new_active.unread = false

  for (let item of old_active) {
    App.update_item(`tabs`, item.id, item)
  }

  App.check_tab_box_scroll()
}

App.move_tabs_to_window = async (item, window_id) => {
  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
    let index = it.pinned ? 0 : -1

    try {
      await browser.tabs.move(it.id, {index: index, windowId: window_id})
    }
    catch (err) {
      App.error(err)
    }
  }
}

App.detach_tab = async (item) => {
  try {
    await browser.windows.create({tabId: item.id, focused: false})
  }
  catch (err) {
    App.error(err)
  }
}

App.move_tabs_to_new_window = async (item) => {
  if (App.get_active_items({mode: `tabs`, item: item}).length === 1) {
    await App.detach_tab(item)
  }
  else {
    let info = await browser.windows.create({focused: false})

    setTimeout(() => {
      App.move_tabs_to_window(item, info.id)
    }, 250)
  }
}

App.get_active_tab = async () => {
  try {
    let tabs = await browser.tabs.query({active: true, currentWindow: true})
    return tabs[0]
  }
  catch (err) {
    App.error(err)
  }
}

App.get_active_tab_item = () => {
  for (let item of App.get_items(`tabs`)) {
    if (item.active) {
      return item
    }
  }
}

App.focus_current_tab = async (scroll = `nearest`) => {
  let item = await App.get_active_tab_item()

  if (item) {
    App.select_item({item: item, scroll: scroll})
  }
}

App.move_tabs_vertically = (direction, item) => {
  if (!item) {
    item = App.get_selected(`tabs`)
  }

  if (!item) {
    return
  }

  if (!App.tabs_normal()) {
    return
  }

  let items = App.get_active_items({mode: item.mode, item: item})

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

App.browser_reload = (id) => {
  if (id !== undefined) {
    browser.tabs.reload(id)
  }
  else {
    browser.tabs.reload()
  }
}

App.browser_back = () => {
  browser.tabs.goBack()
}

App.browser_forward = () => {
  browser.tabs.goForward()
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
  let selected = false
  let prev_selected = App.get_selected(`tabs`)

  for (let item of App.get_items(`tabs`)) {
    let valid

    if (type === `pins`) {
      valid = item.pinned
    }
    else if (type === `normal`) {
      valid = !item.pinned
    }
    else if (type === `unloaded`) {
      valid = item.discarded
    }

    if (item.visible && valid) {
      if (!first) {
        first = item
      }

      if (!item.selected) {
        App.toggle_selected({item: item, what: true, select: false})
      }

      selected = true
    }
    else {
      if (item.selected) {
        App.toggle_selected({item: item, fwhat: alse, select: false})
      }
    }
  }

  if (first) {
    App.set_selected(first)
    App.scroll_to_item({item: first, scroll: `center_smooth`})
  }

  if (!selected && prev_selected) {
    App.toggle_selected({item: prev_selected, what: true, select: false})
  }
}

App.is_new_tab = (url) => {
  return App.new_tab_url === url
}

App.sort_tabs = () => {
  App.start_sort_tabs()
  App.show_popup(`sort_tabs`)
  DOM.el(`#sort_tabs_pins`).checked = false
  DOM.el(`#sort_tabs_reverse`).checked = false
}

App.do_sort_tabs = () => {
  function sort (list, reverse) {
    list.sort((a, b) => {
      if (a.hostname !== b.hostname) {
        if (reverse) {
          return a.hostname < b.hostname ? 1 : -1
        }
        else {
          return a.hostname > b.hostname ? 1 : -1
        }
      }

      return a.title < b.title ? -1 : 1
    })
  }

  App.show_confirm({
    message: `Sort tabs?`,
    confirm_action: async () => {
      let items = App.get_items(`tabs`).slice(0)

      if (!items.length) {
        return
      }

      let include_pins = DOM.el(`#sort_tabs_pins`).checked
      let reverse = DOM.el(`#sort_tabs_reverse`).checked
      let normal = items.filter(x => !x.pinned)
      let pins = items.filter(x => x.pinned)
      sort(normal, reverse)

      if (include_pins) {
        sort(pins, reverse)
      }

      let all = [...pins, ...normal]
      App.tabs_locked = true

      for (let [i, item] of all.entries()) {
        await App.do_move_tab_index(item.id, i)
      }

      App.tabs_locked = false
      App.hide_all_popups()

      if (App.tabs_normal()) {
        App.clear_all_items()
        await App.do_show_mode({mode: `tabs`})
      }
    },
  })
}

App.open_tab_urls = () => {
  App.show_input({
    message: `Open URLs`,
    button: `Open`,
    action: (text) => {
      let urls = text.split(`\n`).map(x => x.trim()).filter(x => x !== ``)
      let to_open = []

      if (urls.length) {
        for (let url of urls) {
          if (App.is_url(url)) {
            if (App.get_item_by_url(`tabs`, url)) {
              continue
            }

            to_open.push(url)
          }
        }
      }

      if (to_open.length) {
        App.show_confirm({
          message: `Open URLs? (${to_open.length})`,
          confirm_action: () => {
            for (let url of to_open) {
              App.open_tab({url: url})
            }
          },
        })
      }

      return true
    },
  })
}

App.load_tabs = (item) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item: item})) {
    if (!it.discarded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_load_tabs`, items)

  App.show_confirm({
    message: `Load items? (${items.length})`,
    confirm_action: async () => {
      for (let it of items) {
        App.focus_tab({item: it, scroll: `none`, method: `load`})
      }
    },
    force: force,
  })
}

App.sort_tabs_action = () => {
  let sort_pins = DOM.el(`#sort_tabs_pins`).checked
  App.do_sort_tabs(sort_pins)
}

App.tabs_normal = () => {
  return App.get_setting(`tab_sort`) === `normal`
}

App.tabs_recent = () => {
  return App.get_setting(`tab_sort`) === `recent`
}

App.check_tab_first = (item) => {
  if (App.tabs_recent()) {
    App.make_item_first(item)
  }
}

App.mute_playing_tabs = () => {
  let items = App.get_playing_tabs()

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_mute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Mute items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.mute_tab(id)
      }
    },
    force: force,
  })
}

App.unmute_all_tabs = () => {
  let items = App.get_muted_tabs()

  if (!items.length) {
    return
  }

  let force = App.check_force(`warn_on_unmute_tabs`, items)
  let ids = items.map(x => x.id)

  App.show_confirm({
    message: `Unmute items? (${ids.length})`,
    confirm_action: async () => {
      for (let id of ids) {
        App.unmute_tab(id)
      }
    },
    force: force,
  })
}

App.check_on_tabs = async () => {
  if (App.active_mode !== `tabs`) {
    await App.do_show_mode({mode: `tabs`})
  }
  else {
    App.filter_all(`tabs`)
  }
}

App.check_tab_loading = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  let effect = App.get_setting(`loading_effect`)

  if (effect === `none`) {
    return
  }

  if (App.tab_ready(item)) {
    let effects = [`fade`, `spin`, `icon`]

    for (let effect of effects) {
      item.element.classList.remove(`${effect}_effect`)
    }
  }
  else {
    item.element.classList.add(`${effect}_effect`)
  }
}

App.tab_ready = (item) => {
  return item.status === `complete`
}

App.check_pins = (item) => {
  if (App.get_setting(`hide_pins`) && !item.tab_box) {
    if (item.pinned) {
      item.element.classList.add(`hidden_2`)
      item.visible = false
    }
    else {
      item.element.classList.remove(`hidden_2`)
      item.visible = true
    }
  }
}

App.check_tab_active = (item) => {
  if (item.active) {
    item.element.classList.add(`active_tab`)
  }
  else {
    item.element.classList.remove(`active_tab`)
  }
}

App.copy_tabs = (item) => {
  let active = App.get_active_items({mode: `tabs`, item: item})
  App.copied_tabs = active
}

App.paste_tabs = async (item) => {
  if (!App.copied_tabs.length) {
    return
  }

  for (let tab of App.copied_tabs) {
    if (item.pinned) {
      await App.pin_tab(tab.id)
    }
    else {
      await App.unpin_tab(tab.id)
    }
  }

  let index = App.get_item_element_index(`tabs`, item.element)
  let tabs = App.copied_tabs.slice(0)
  let index_og = App.get_item_element_index(`tabs`, tabs[0].element)
  let i

  if (index < index_og) {
    tabs.reverse()
    i = index + 1
  }
  else {
    i = index
  }

  for (let tab of tabs) {
    await App.do_move_tab_index(tab.id, i)
  }

  App.check_pinline()
  App.deselect({mode: `tabs`})

  for (let tab of tabs) {
    App.toggle_selected({item: tab, what: true, select: false})
  }
}