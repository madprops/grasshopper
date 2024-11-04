App.setup_tabs = () => {
  App.build_tab_filters()
  App.debug_tabs = false

  browser.tabs.onCreated.addListener(async (info) => {
    if (App.tabs_locked) {
      return
    }

    App.debug(`Tab Created: ID: ${info.id}`, App.debug_tabs)

    if (info.windowId === App.window_id) {
      let item = await App.refresh_tab({id: info.id, info})

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
      await App.refresh_tab({id, info, url: changed.url})

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
    {cmd: `filter_all_parent_tabs`},
    {cmd: `filter_all_node_tabs`},
  ]
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

    App.set_tabs_title(`Tabs`)
  }
  else if (App.tabs_recent()) {
    tabs.sort((a, b) => {
      return a.lastAccessed > b.lastAccessed ? -1 : 1
    })

    App.set_tabs_title(`Recent`)
  }

  for (let tab of tabs) {
    await App.check_tab_container(tab)
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

  if (!App.tab_box_make_item_first(args.item)) {
    App.update_tab_box()
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

App.new_tab = async (item, from = `normal`) => {
  let args = {}
  App.get_new_tab_args(item, from, args)
  await App.open_new_tab(args)
  App.after_focus({show_tabs: true})
}

App.create_new_tab = async (args, item, from = `normal`) => {
  App.get_new_tab_args(item, from, args)
  await App.open_new_tab(args)
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

  await App.check_tab_container(args.info)
  let item = App.get_item_by_id(`tabs`, args.id)

  if (item) {
    if (item.pinned !== args.info.pinned) {
      App.check_pinline()
    }

    App.update_item({mode: `tabs`, id: item.id, info: args.info, url: args.url})
  }
  else {
    item = App.insert_item(`tabs`, args.info)
    App.check_pinline()
  }

  if (args.select && !item.selected && item.visible) {
    App.select_item({item, scroll: `nearest_smooth`})
  }

  return item
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
  return App.get_items(`tabs`).filter(x => !x.unloaded)
}

App.get_unloaded_tabs = () => {
  return App.get_items(`tabs`).filter(x => x.unloaded)
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

App.tabs_action = async (args = {}) => {
  let def_args = {
    on_action: true,
    soft: false,
    hard: false,
    reload: false,
  }

  App.def_args(def_args, args)

  if (!args.scroll) {
    if (args.from === `tab_box`) {
      args.scroll = `center_smooth`
    }
    else if (args.from === `jump_zone`) {
      args.scroll = `center_smooth`
    }
    else if (args.from === `tab_cmd`) {
      args.scroll = `nearest_instant`
    }
    else if ((args.from === `autoclick`) && App.get_setting(`autoclick_no_scroll`)) {
      args.scroll = `none`
    }
    else {
      args.scroll = `nearest_smooth`
    }
  }

  if (args.soft && args.item.unloaded) {
    App.select_item({item: args.item, scroll: args.scroll})
    return
  }

  function check_blink() {
    if (!App.get_setting(`tab_blink`)) {
      return false
    }

    if (App.tabs_recent()) {
      return false
    }

    let no_blink = [`click`, `enter`, `tab_cmd`, `close`, `autoclick`]

    if (no_blink.includes(args.from)) {
      return false
    }

    let items = App.get_items(`tabs`)
    let selected = items.filter(x => x.selected)
    let index_old = 0

    if (selected.length) {
      index_old = items.indexOf(selected[0])
    }

    let index_new = items.indexOf(args.item)
    let index_diff = Math.abs(index_old - index_new)

    if (index_diff === 0) {
      return args.from === `node`
    }
    else if (index_diff <= App.tab_blink_diff) {
      return false
    }

    return true
  }

  let do_blink = check_blink()

  function blink_item() {
    if (do_blink) {
      App.blink_item(args.item)
    }
  }

  if (args.from === `tab_box`) {
    if (App.is_filtered(`tabs`)) {
      App.filter_all(`tabs`)
    }
  }

  if (args.item.header) {
    let header_action = App.get_setting(`header_action`)

    if (header_action === `none`) {
      if (args.from === `tab_box`) {
        App.select_item({item: args.item, scroll: args.scroll, from: args.from})
        blink_item()
      }

      return
    }
    else if (header_action === `activate`) {
      if (args.item.active && (args.from === `click`)) {
        return
      }
    }
    else if (header_action === `select`) {
      if (App.active_mode !== `tabs`) {
        await App.do_show_mode({mode: `tabs`})
      }

      if (args.item.selected) {
        return
      }

      App.select_item({item: args.item, scroll: args.scroll, from: args.from})
      blink_item()
      return
    }
    else if (header_action === `first`) {
      App.focus_header_first(args.item, args.from, args.scroll)
      return
    }
  }

  let method

  if (args.from === `previous`) {
    method = args.from
  }

  await App.focus_tab({
    item: args.item,
    select: true,
    scroll: args.scroll,
    method,
  })

  if (args.from === `tab_box`) {
    if (!App.get_setting(`tab_box_focus`)) {
      args.on_action = false
    }
  }

  let filter_change = false

  if (args.on_action) {
    filter_change = App.on_action(`tabs`)
  }

  if (filter_change) {
    do_blink = false
  }

  if (args.reload) {
    App.browser_reload(args.item)
  }
  else if (args.hard) {
    App.browser_reload(args.item, true)
  }

  blink_item()
}

App.duplicate_tab = async (item, args = {}) => {
  try {
    await browser.tabs.duplicate(item.id, args)
  }
  catch (err) {
    App.error(err)
  }
}

App.duplicate_tabs = (item) => {
  let items = App.get_active_items({mode: `tabs`, item})
  let force = App.check_warn(`warn_on_duplicate_tabs`, items)
  let args = {}
  App.get_new_tab_args(item, `duplicate`, args)

  App.show_confirm({
    message:`Duplicate tabs? (${items.length})`,
    confirm_action: () => {
      for (let it of items) {
        App.duplicate_tab(it, args)
      }
    },
    force,
  })
}

App.get_tab_succ = (items) => {
  let list = App.get_recent_tabs()
  list = list.filter(x => x.visible)
  list = list.filter(x => !x.unloaded)
  list = list.filter(x => !items.includes(x))
  return list.at(0)
}

App.show_tab_info = () => {
  let all = App.get_items(`tabs`).length
  let pins = App.get_pinned_tabs().length
  let normal = App.get_normal_tabs().length
  let playing = App.get_playing_tabs().length
  let muted = App.get_muted_tabs().length
  let loaded = App.get_loaded_tabs().length
  let unloaded = App.get_unloaded_tabs().length
  let unread = App.get_unread_tabs().length
  let edited = App.get_edited_tabs().length
  let headers = App.get_header_tabs().length
  let subheaders = App.get_subheader_tabs().length
  let parents = App.get_parent_tabs().length
  let nodes = App.get_node_tabs().length

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
    `Headers: ${headers}`,
    `Subheaders: ${subheaders}`,
    `Parents: ${parents}`,
    `Nodes: ${nodes}`,
  ]

  App.alert(items.join(`\n`))
}

App.get_url_list = () => {
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

  return App.to_set(urls)
}

App.show_tab_urls = () => {
  let urls = App.get_url_list()
  let text = urls.join(`\n`)
  App.show_textarea({title: `All Open URLs (${urls.length})`, text})
}

App.open_tab = async (item) => {
  try {
    return await browser.tabs.create({url: item.url})
  }
  catch (err) {
    App.error(err)
  }
}

App.change_tab = async (item) => {
  try {
    let current = await App.get_active_tab()

    if (!current) {
      return
    }

    return await browser.tabs.update(current.id, {url: item.url})
  }
  catch (err) {
    App.error(err)
  }
}

App.change_url = async (item, url) => {
  try {
    item.url = url
    return await browser.tabs.update(item.id, {url})
  }
  catch (err) {
    App.error(err)
  }
}

App.update_tabs_index = async (items, direction) => {
  if (direction === `down`) {
    items = items.slice(0).reverse()
  }

  let pinline = App.pinline_index(false)

  for (let item of items) {
    let index = App.get_item_element_index({
      mode: `tabs`,
      element: item.element,
      include_all: true,
    })

    let index_2 = App.get_item_element_index({
      mode: `tabs`,
      element: item.element,
    })

    if (item.pinned) {
      if (index > pinline) {
        await App.unpin_tab(item.id)
      }
    }
    else if (index < pinline) {
      await App.pin_tab(item.id)
    }

    await App.do_move_tab_index(item.id, index_2)
  }
}

App.do_move_tab_index = async (id, index) => {
  let ans

  try {
    ans = await browser.tabs.move(id, {index})
  }
  catch (err) {
    App.error(err)
  }

  return ans
}

App.on_tab_activated = async (info) => {
  let old_active = []

  for (let item of App.get_items(`tabs`)) {
    let current = item.id === info.tabId

    if (item.active && !current) {
      old_active.push(item)
    }

    item.active = current

    if (item.active) {
      item.unread = false
      App.check_tab_first(item)
    }
  }

  let new_active = await App.refresh_tab({id: info.tabId, select: true})
  new_active.unread = false

  for (let item of old_active) {
    App.update_item({mode: `tabs`, id: item.id, info: item})
  }

  App.check_tab_box_scroll()
}

App.move_tabs_to_window = async (item, window_id) => {
  for (let it of App.get_active_items({mode: `tabs`, item})) {
    let index = it.pinned ? 0 : -1

    try {
      await browser.tabs.move(it.id, {index, windowId: window_id})
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
  if (App.get_active_items({mode: `tabs`, item}).length === 1) {
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
    App.select_item({item, scroll})
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

  let active = App.get_active_items({mode: item.mode, item})

  if ((direction === `down`) && active.at(-1).pinned) {
    if (active.at(-1) === App.get_last_pinned_tab()) {
      App.unpin_tabs(item)
      return
    }
  }
  else if ((direction === `up`) && !active[0].pinned) {
    if (active[0] === App.get_first_normal_tab()) {
      App.pin_tabs(item)
      return
    }
  }

  let first, last
  let els = active.map(x => x.element)
  let items = App.get_items(`tabs`)

  if (direction === `up`) {
    if (item.pinned) {
      first = 0
    }
    else {
      first = App.get_first_normal_index()
    }

    items[first].element.before(...els)
  }
  else if (direction === `down`) {
    if (item.pinned) {
      last = App.get_last_pin_index()
    }
    else {
      last = items.length - 1
    }

    items[last].element.after(...els)
  }

  App.update_tabs_index(active, direction)
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
    pinned,
    normal,
    pinned_f,
    normal_f,
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
      valid = item.unloaded
    }

    if (item.visible && valid) {
      if (!first) {
        first = item
      }

      if (!item.selected) {
        App.toggle_selected({item, what: true, select: false})
      }

      selected = true
    }
    else if (item.selected) {
      App.toggle_selected({item, what: false, select: false})
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

App.open_tab_urls = () => {
  App.show_input({
    title: `Open URLs`,
    button: `Open`,
    action: (text) => {
      let urls = text.split(`\n`).map(x => x.trim()).filter(x => x !== ``)
      let to_open = []

      if (urls.length) {
        for (let url of urls) {
          let url_ = App.fix_url(url)

          if (App.get_item_by_url(`tabs`, url_)) {
            continue
          }

          to_open.push(url_)
        }
      }

      if (to_open.length) {
        App.show_confirm({
          message: `Open URLs? (${to_open.length})`,
          confirm_action: () => {
            for (let url of to_open) {
              App.open_tab({url})
            }
          },
        })
      }

      return true
    },
  })
}

App.load_tabs = (item, multiple = true) => {
  let items = []

  for (let it of App.get_active_items({mode: `tabs`, item, multiple})) {
    if (!it.unloaded) {
      continue
    }

    items.push(it)
  }

  if (!items.length) {
    return
  }

  let force = App.check_warn(`warn_on_load_tabs`, items)

  App.show_confirm({
    message: `Load items? (${items.length})`,
    confirm_action: async () => {
      for (let it of items) {
        App.focus_tab({item: it, scroll: `none`, method: `load`})
      }
    },
    force,
  })
}

App.check_tab_first = (item) => {
  if (App.tabs_recent()) {
    App.make_item_first(item)
  }
}

App.check_on_tabs = async (show_all = true) => {
  if (App.active_mode !== `tabs`) {
    await App.do_show_mode({mode: `tabs`})
  }
  else if (show_all) {
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
    let effects = App.remove_separators(App.loading_effects).map(x => x.value)

    for (let effect of effects) {
      item.element.classList.remove(`loading_${effect}_effect`)
    }
  }
  else {
    item.element.classList.add(`loading_${effect}_effect`)
  }
}

App.tab_ready = (item) => {
  return item.status === `complete`
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
  let active = App.get_active_items({mode: `tabs`, item})
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

  let index = App.get_item_element_index({mode: `tabs`, element: item.element})
  let tabs = App.copied_tabs.slice(0)
  let index_og = App.get_item_element_index({mode: `tabs`, element: tabs[0].element})
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

App.tabs_in_same_place = (items) => {
  let all_pinned = items.every(x => x.pinned)
  let all_normal = items.every(x => !x.pinned)
  return all_pinned || all_normal
}

App.get_first_normal_tab = () => {
  let items = App.get_items(`tabs`)
  return items.find(x => !x.pinned)
}

App.first_normal_tab = () => {
  let first = App.get_first_normal_tab()

  if (first) {
    App.tabs_action({item: first})
  }
}

App.get_last_normal_tab = () => {
  let items = App.get_items(`tabs`)
  return items.slice(0).reverse().find(x => !x.pinned)
}

App.last_normal_tab = () => {
  let last = App.get_last_normal_tab()

  if (last) {
    App.tabs_action({item: last})
  }
}

App.edge_tab_up_down = (direction) => {
  let item = App.get_selected(`tabs`)
  let items = App.get_items(`tabs`)

  if (items.length <= 1) {
    return
  }

  let pins = items.filter(x => x.pinned)
  let normal = items.filter(x => !x.pinned)

  if (!item) {
    item = App.get_active_tab_item()
  }

  if (direction === `up`) {
    if (item.pinned) {
      if (pins[0] === item) {
        if (normal.length) {
          App.last_normal_tab()
        }
        else {
          App.last_pinned_tab()
        }
      }
      else {
        App.first_pinned_tab()
      }
    }
    else if (normal[0] === item) {
      if (pins.length) {
        App.last_pinned_tab()
      }
      else {
        App.last_normal_tab()
      }
    }
    else {
      App.first_normal_tab()
    }
  }
  else if (direction === `down`) {
    if (item.pinned) {
      if (pins.at(-1) !== item) {
        App.last_pinned_tab()
      }
      else if (normal.length) {
        App.first_normal_tab()
      }
      else {
        App.first_pinned_tab()
      }
    }
    else if (normal.at(-1) !== item) {
      App.last_normal_tab()
    }
    else if (pins.length) {
      App.first_pinned_tab()
    }
    else {
      App.first_normal_tab()
    }
  }
}

App.get_new_tab_args = (item, from, args) => {
  let items = App.get_items(`tabs`)
  let new_mode = App.get_setting(`new_tab_mode`)
  let index, pinned

  if ([`empty`, `global_empty_menu`, `tabs_empty_menu`, `footer`].includes(from)) {
    index = items.length + 10
    args.pinned = false
  }
  else if ([`top`, `bottom`].includes(new_mode)) {
    if (new_mode === `top`) {
      index = 0
      pinned = items.length && items[0].pinned
    }
    else if (new_mode === `bottom`) {
      index = items.length + 10
      pinned = false
    }
  }
  else if (item && [`above`, `below`].includes(new_mode)) {
    let indx = items.indexOf(item)
    pinned = item.pinned

    if (new_mode === `above`) {
      index = indx
    }
    else if (new_mode === `below`) {
      index = indx + 1
    }
  }

  if (index !== undefined) {
    args.index = index
    args.pinned = pinned
  }

  if (from === `duplicate`) {
    delete args.pinned
  }

  return args
}

App.focus_tab_number = (num) => {
  let items = App.get_items(`tabs`)
  let item = items.at(num - 1)

  if (item) {
    App.tabs_action({item})
  }
}

App.get_tab_snapshot = (only_active = false) => {
  let items

  if (only_active) {
    items = [App.get_active_tab_item()]
  }
  else {
    items = App.get_items(`tabs`)
  }

  let infos = []

  for (let item of items) {
    let info = {
      id: item.id,
      url: item.url,
      pinned: item.pinned,
    }

    if (item.parent) {
      info.parent = item.parent
    }

    App.fill_custom_props(info, item)

    if (only_active) {
      return info
    }

    infos.push(info)
  }

  return infos
}

App.export_tabs = () => {
  App.export_data(`Tabs`, App.get_tab_snapshot())
}

App.import_tabs = async (value = ``) => {
  App.import_data(`Tabs`, async (json) => {
    if (!json) {
      return
    }

    let win = await browser.windows.create({})
    let id_map = {}

    for (let info of json) {
      try {
        let tab = await browser.tabs.create({
          windowId: win.id,
          url: info.url,
          pinned: info.pinned,
        })

        id_map[info.id] = tab.id
        let props = App.get_edit_prop_list()

        for (let prop of props) {
          let name = `custom_${prop}`
          let value = info[name]

          if (value !== undefined) {
            await browser.sessions.setTabValue(tab.id, name, value)
          }
        }
      }
      catch (err) {
        App.error(err)
      }
    }

    let ids = Object.values(id_map)
    await browser.tabs.discard(ids)

    for (let info of json) {
      if (info.parent) {
        let new_id = id_map[info.id]

        if (!new_id) {
          continue
        }

        let parent = id_map[info.parent]

        if (parent) {
          try {
            await browser.tabs.update(new_id, {openerTabId: parent})
          }
          catch (err) {
            App.error(err)
          }
        }
      }
    }
  }, value)
}

App.blank_tab = async () => {
  await App.open_new_tab({url: `about:blank`})
}

App.set_tabs_title = (title) => {
  let btn = DOM.el(`#tabs_main_menu`)
  App.set_main_menu_text(btn, `tabs`, title)
}

App.new_normal_tab = () => {
  let index = App.get_first_normal_index()
  App.open_new_tab({index})
}

App.check_hide_tabs = (item) => {
  if (item.tab_box) {
    return
  }

  let show_pinned = App.get_setting(`show_pinned_tabs`)
  let show_unloaded = App.get_setting(`show_unloaded_tabs`)

  if (!show_pinned && item.pinned) {
    App.hide_item_2(item)
  }
  else if (!show_unloaded && item.unloaded) {
    App.hide_item_2(item)
  }
  else {
    App.show_item_2(item)
  }
}

App.get_domain_tabs = (item) => {
  let items = App.get_items(`tabs`)
  return items.filter(x => x.hostname === item.hostname)
}

App.get_title_tabs = (item) => {
  let items = App.get_items(`tabs`)
  let title = App.title(item).toLowerCase()
  return items.filter(x => App.title(x).toLowerCase().includes(title))
}

App.is_empty_tab = (item) => {
  return [`about:blank`, `about:newtab`].includes(item.url)
}