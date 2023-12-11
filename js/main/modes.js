App.setup_modes = () => {
  for (let mode of App.modes) {
    App[`${mode}_changed`] = false
    App[`${mode}_ready`] = false
  }

  App.show_mode_debouncer = App.create_debouncer((args) => {
    App.do_show_mode(args)
  }, App.show_mode_delay)
}

App.show_mode = (args) => {
  App.show_mode_debouncer.call(args)
}

App.do_show_mode = async (args = {}) => {
  App.show_mode_debouncer.cancel()

  let def_args = {
    reuse_filter: false,
    force: false,
  }

  App.def_args(def_args, args)

  if (args.mode === `history`) {
    let perm = await App.ask_permission(`history`)

    if (!perm) {
      App.permission_msg(`History`)
      return
    }
  }
  else if (args.mode === `bookmarks`) {
    let perm = await App.ask_permission(`bookmarks`)

    if (!perm) {
      App.permission_msg(`Bookmarks`)
      return
    }
  }

  if (!App.get_setting(`reuse_filter`)) {
    args.reuse_filter = false
  }

  App.setup_item_window(args.mode)
  let pre_show = App[`pre_show_${args.mode}`]

  if (pre_show) {
    pre_show()
  }

  App.windows[args.mode].show()
  let was_filtered = App.was_filtered(args.mode)
  App.prev_filter_mode = undefined
  App.prev_filter_text = undefined

  if (!args.force) {
    if ((App.active_mode === args.mode) &&
    (App[`${args.mode}_items`].length) &&
    !was_filtered && !App[`${args.mode}_changed`]) {
      App.select_first_item(args.mode, true)

      if (args.mode === `tabs`) {
        App.check_pinline()
        App.check_filtered(args.mode)
      }

      return
    }
  }

  App[`filter_items_${args.mode}`] = {}
  let value = App.get_last_filter_value(args.reuse_filter)
  App.active_mode = args.mode
  App.empty_footer_info()
  App.cancel_filter()
  App.set_filter({mode: args.mode, text: value, filter: false})
  App.set_filter_mode({mode: args.mode, cmd: `all`, filter: false})
  App[`last_${args.mode}_query`] = undefined
  let persistent = App.persistent_modes.includes(args.mode)
  let search = App.search_modes.includes(args.mode)
  let items_ready = false
  let items

  if (persistent) {
    if (App[`${args.mode}_items`].length) {
      items = App[`${args.mode}_items`]
      items_ready = true
    }
  }

  // Clear inactive items
  for (let m of App.modes) {
    if (App.persistent_modes.includes(m)) {
      if (App[`${m}_items`].length) {
        continue
      }
    }

    App.clear_items(m)
  }

  if (search && value) {
    items = []
  }
  else if (!items_ready) {
    items = await App[`get_${args.mode}`]()
    was_filtered = false
  }

  if (!persistent) {
    if (args.mode !== App.active_mode) {
      return
    }
  }

  if (search && value) {
    // Filter will search
  }
  else if (!items_ready) {
    if (items.length) {
      App.process_info_list(args.mode, items)
    }
    else {
      App.do_check_scroller(args.mode)
    }
  }
  else {
    App.update_footer_info(App.get_selected(args.mode))
  }

  if (value || was_filtered) {
    App.do_filter({mode: args.mode, force: true})
  }
  else {
    App.select_first_item(args.mode, true, `center`)
  }

  App[`${args.mode}_changed`] = false
  App.do_check_playing(args.mode, App.playing)
  App.check_filtered(args.mode)
  App.init_favorites(args.mode)
  App.init_taglist()

  if (args.mode === `tabs`) {
    App.check_pinline()
    App.init_tab_box()
  }
}

App.get_mode_index = (mode) => {
  for (let [i, m] of App.modes) {
    if (m === mode) {
      return i
    }
  }
}

App.get_mode_name = (mode) => {
  return App.capitalize(mode)
}

App.show_primary_mode = () => {
  App.do_show_mode({mode: App.primary_mode})
}

App.cycle_modes = async (reverse, reuse_filter = true) => {
  let modes = App.modes
  let history_perm = await browser.permissions.contains({permissions: [`history`]})

  if (!history_perm) {
    modes = modes.filter((x) => {
      return x !== `history`
    })
  }

  let bookmarks_perm = await browser.permissions.contains({permissions: [`bookmarks`]})

  if (!bookmarks_perm) {
    modes = modes.filter((x) => {
      return x !== `bookmarks`
    })
  }

  let index = modes.indexOf(App.window_mode)
  let new_mode

  if (index === -1) {
    return
  }

  if (reverse) {
    if (index === 0) {
      new_mode = modes.slice(-1)[0]
    }
    else {
      new_mode = modes[index - 1]
    }
  }
  else {
    if (index === modes.length - 1) {
      new_mode = modes[0]
    }
    else {
      new_mode = modes[index + 1]
    }
  }

  App.show_mode({mode: new_mode, reuse_filter: reuse_filter})
}

App.show_primary_mode = (allow_same = true) => {
  let mode = App.primary_mode

  if (!allow_same) {
    if (App.active_mode === mode) {
      return
    }
  }

  App.do_show_mode({mode: mode})
}

App.getting = (mode, force = false) => {
  let icon = App.mode_icons[mode]
  let name = App.capitalize(mode)
  App.debug(`${icon} Getting ${name}`, force)
}

App.on_action = (mode) => {
  App.update_filter_history(mode)
}