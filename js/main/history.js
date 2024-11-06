App.setup_history = () => {
  if (App.setup_history_ready) {
    return
  }

  browser.history.onVisited.addListener((info) => {
    App.debug(`History Visited`)

    if (App.active_mode === `history`) {
      App.history_changed = true
    }
  })

  App.setup_history_ready = true
}

App.history_time = (deep = false) => {
  let months = App.get_setting(`history_max_months`)

  if (deep) {
    months = App.get_setting(`deep_history_max_months`)
  }

  return App.now() - (App.DAY * 30 * months)
}

App.get_history = async (query = ``, deep = false, by_what = `all`) => {
  App.getting(`history`)
  let results, max_items

  if (query && App.get_setting(`auto_deep_search_history`)) {
    deep = true
  }

  let normal_max = App.get_setting(`max_search_items_history`)
  let deep_max = App.get_setting(`deep_max_search_items_history`)
  let text = ``

  if (by_what.startsWith(`re`)) {
    max_items = Math.max(deep_max, 10 * 1000)
  }
  else {
    text = query

    if (deep) {
      max_items = deep_max
    }
    else {
      max_items = normal_max
    }
  }

  try {
    results = await browser.history.search({
      text,
      maxResults: max_items,
      startTime: App.history_time(deep),
    })
  }
  catch (err) {
    App.error(err)
    return []
  }

  results.sort((a, b) => {
    return a.lastVisitTime > b.lastVisitTime ? -1 : 1
  })

  App.last_history_query = query
  return results
}

App.history_action = (args = {}) => {
  let def_args = {
    on_action: true,
    soft: false,
  }

  App.def_args(def_args, args)
  App.check_auto_scroll(args)
  App.select_item({item: args.item, scroll: `nearest_smooth`})

  if (args.on_action) {
    App.on_action(`history`)
  }

  App.focus_or_open_item(args.item, args.soft)
}

App.search_domain_history = (item) => {
  App.do_show_mode({
    mode: `history`,
    reuse_filter: false,
    filter: item.hostname,
  })
}

App.save_history_pick = () => {
  let value = App.get_filter().trim()

  if (!value) {
    return
  }

  let picks = App.history_picks
  picks = picks.filter(x => x !== value)
  picks.unshift(value)
  picks = picks.slice(0, App.max_history_picks)
  App.history_picks = picks
  App.stor_save_history_picks()
  let tb_mode = App.get_tab_box_mode()

  if ([`history`].includes(tb_mode)) {
    App.update_tab_box()
  }
}

App.forget_history_pick = (value) => {
  App.history_picks = App.history_picks.filter(x => x !== value)
  App.stor_save_history_picks()
  let tb_mode = App.get_tab_box_mode()

  if ([`history`].includes(tb_mode)) {
    App.update_tab_box()
  }
}

App.move_history_pick = (from, to) => {
  let picks = App.history_picks
  let from_index = picks.indexOf(from)
  let to_index = picks.indexOf(to)

  if (from_index === -1 || to_index === -1) {
    return
  }

  picks.splice(from_index, 1)
  picks.splice(to_index, 0, from)
  App.history_picks = picks
  App.stor_save_history_picks()
  App.update_tab_box()
}