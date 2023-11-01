App.setup_tabs = () => {
  App.build_tab_filters()
  App.debug_tabs = false

  browser.tabs.onCreated.addListener(async (info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Created: ID: ${info.id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      let item = await App.refresh_tab(info.id, false, info)

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
      await App.refresh_tab(id, false, info)
      App.check_playing()
    }
  })

  browser.tabs.onActivated.addListener(async (info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Activated: ID: ${info.tabId}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      await App.on_tab_activated(info)
      App.check_playing()
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
      App.check_playing()
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
}

App.build_tab_filters = () => {
  let def_icon = App.mode_icons.tabs

  App.tabs_filter_modes = [
    {
      type: `pinned`, text:`Pinned`, skip: false, info: `Show pinned tabs`,
      icon: App.get_setting(`pin_icon`) || def_icon
    },
    {
      type: `normal`, text:`Normal`, skip: false, info: `Show normal tabs`,
      icon: App.get_setting(`normal_icon`) || def_icon
    },
    {
      type: `playing`, text:`Playing`, skip: false, info: `Show tabs emitting sound`,
      icon: App.get_setting(`playing_icon`) || def_icon
    },
    {
      type: `loaded`, text:`Loaded`, skip: false, info: `Show tabs that are loaded`,
      icon: App.get_setting(`loaded_icon`) || def_icon
    },
    {
      type: `unloaded`, text:`Unloaded`, skip: false, info: `Show unloaded tabs`,
      icon: App.get_setting(`unloaded_icon`) || def_icon
    },
    {
      type: `unread`, text:`Unread`, skip: false, info: `Show tabs that haven't been visited yet`,
      icon: App.get_setting(`unread_icon`) || def_icon
    },
    {type: App.separator_string, skip: true},
    {
      type: `tag`, text:`Tag`, skip: true, info: `Filter a specific tag`,
      icon: App.tag_icon
    },
    {
      type: `color`, text:`Color`, skip: true, info: `Filter by a specific color`,
      icon: App.settings_icons.theme
    },
    {
      type: `titled`, text:`Titled`, skip: false, info: `Show tabs that have a custom title`,
      icon: App.edit_icon
    },
    {
      type: `notes`, text:`Notes`, skip: false, info: `Show tabs that have notes`,
      icon: App.edit_icon
    },
    {
      type: `edited`, text:`Edited`, skip: false, info: `Show tabs that have custom properties`,
      icon: App.get_setting(`edited_icon`) || App.edit_icon
    },
    {type: App.separator_string, skip: true},
    {
      type: `duplicate`, text:`Duplicate`, skip: false, info: `Show tabs that have duplicates`,
    },
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

  let sort = App.get_setting(`tab_sort`)

  if (sort === `normal`) {
    tabs.sort((a, b) => {
      return a.index < b.index ? -1 : 1
    })
  }
  else if (sort === `recent`) {
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
    App.check_playing()
  }

  App.after_focus(args)
}

App.open_new_tab = async (url) => {
  try {
    await browser.tabs.create({url: url, active: true})
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

App.refresh_tab = async (id, select, info) => {
  if (!info) {
    try {
      info = await App.get_tab_info(id)
    }
    catch (err) {
      App.check_pinline()
      return
    }
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
    if (item.pinned !== info.pinned) {
      App.check_pinline()
    }

    App.update_item(`tabs`, item.id, info)
  }
  else {
    item = App.insert_item(`tabs`, info)
    App.check_pinline()
  }

  if (select) {
    if (App.get_selected(`tabs`) !== item) {
      App.select_item({item: item, scroll: `nearest`})
    }
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

App.tabs_action = async (item) => {
  App.on_action(`tabs`)
  App.do_empty_previous_tabs()

  await App.focus_tab({
    item: item,
    scroll: `nearest_smooth`,
  })
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
          next = App.get_next_item(`tabs`, {mode: `tabs`, no_discarded: true, item: item})
        }

        if (next) {
          await App.focus_tab({item: next, scroll: `nearest`, method: `unload`})
        }
        else {
          await App.open_new_tab(`about:blank`)
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
  let current
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

  let select = true

  if (App.is_filtered(`tabs`)) {
    select = false
  }

  let new_active = await App.refresh_tab(info.tabId, select)
  App.update_active_history(current, new_active)

  for (let item of old_active) {
    App.update_item(`tabs`, item.id, item)
  }
}

App.move_tabs = async (item, window_id) => {
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

App.detach_tabs = async (item) => {
  if (App.get_active_items({mode: `tabs`, item: item}).length === 1) {
    await App.detach_tab(item)
  }
  else {
    let info = await browser.windows.create({focused: false})

    setTimeout(() => {
      App.move_tabs(item, info.id)
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
    App.close_tab_or_tabs(ids)
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
    else if (type === `unloaded`) {
      valid = item.discarded
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

App.check_tab_first = (item) => {
  if (App.get_setting(`tab_sort`) === `recent`) {
    App.make_item_first(item)
  }
}