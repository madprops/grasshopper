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
    force: false,
    reuse_filter: false,
    filter: ``,
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

  if (!args.force && !args.filter) {
    if ((App.active_mode === args.mode) &&
    App[`${args.mode}_items`].length &&
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

  if (!args.filter) {
    args.filter = App.get_last_filter_value(args.reuse_filter)
  }

  App.active_mode = args.mode
  App.empty_footer_info()
  App.cancel_filter()
  App.set_filter({mode: args.mode, text: args.filter, filter: false})
  App.set_filter_mode({mode: args.mode, cmd: `all`, filter: false})
  App[`last_${args.mode}_query`] = undefined
  let persistent = App.persistent_modes.includes(args.mode)
  let search = App.search_modes.includes(args.mode)
  let items_ready = false
  let items

  // Mode vars
  App.mode_vars[args.mode] = {}

  // Tooltips info
  let rclick = App.get_cmd_name(`show_item_menu`)
  let it_obj = {title: `Right Click: ${rclick}`}
  App.trigger_title(it_obj, `middle_click_item_${args.mode}`)
  App.trigger_title(it_obj, `click_press_item_${args.mode}`)
  App.trigger_title(it_obj, `middle_click_press_item_${args.mode}`)
  App.mode_vars[args.mode].item_info = it_obj.title

  let cb_obj = {title: ``}
  App.trigger_title(cb_obj, `click_close_button`)
  App.trigger_title(cb_obj, `double_click_close_button`)
  App.trigger_title(cb_obj, `ctrl_click_close_button`)
  App.trigger_title(cb_obj, `shift_click_close_button`)
  App.trigger_title(cb_obj, `ctrl_shift_click_close_button`)
  App.trigger_title(cb_obj, `ctrl_middle_click_close_button`)
  App.trigger_title(cb_obj, `shift_middle_click_close_button`)
  App.trigger_title(cb_obj, `ctrl_shift_middle_click_close_button`)
  App.trigger_title(cb_obj, `middle_click_close_button`)
  App.trigger_title(cb_obj, `click_press_close_button`)
  App.trigger_title(cb_obj, `middle_click_press_close_button`)
  App.mode_vars[args.mode].close_button_info = cb_obj.title

  let hov_obj = {title: `Click: Show Menu`}
  App.trigger_title(hov_obj, `middle_click_hover_button`)
  App.trigger_title(hov_obj, `click_press_hover_button`)
  App.trigger_title(hov_obj, `middle_click_press_hover_button`)
  App.mode_vars[args.mode].hover_button_info = hov_obj.title

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
    App.clear_selected(m)
  }

  if (args.mode === `bookmarks`) {
    App.set_bookmarks_title()
  }
  else {
    App.reset_bookmarks()
  }

  if (search && args.filter) {
    items = []
  }
  else if (!items_ready) {
    items = await App[`get_${args.mode}`]()
    was_filtered = false
  }

  if (search && !args.filter) {
    App.show_search_no_value(args.mode)
  }

  if (!persistent) {
    if (args.mode !== App.active_mode) {
      return
    }
  }

  if (search && args.filter) {
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

  if (args.filter || was_filtered) {
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
  App.init_footer()
  App.refresh_footer()
  App.check_footer_mode(args.mode)
  App.do_filter()

  if (args.mode === `tabs`) {
    App.check_pinline()
  }

  App.tab_box_auto_mode(args.mode)
  App.refresh_tab_box_special(args.mode)
}

App.get_mode_index = (mode) => {
  for (let [i, m] of App.modes) {
    if (m === mode) {
      return i
    }
  }
}

App.get_mode_name = (mode, shorten = false) => {
  if ((mode === `bookmarks`) && shorten) {
    return App.bkmarks
  }

  return App.capitalize(mode)
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

  let index = modes.indexOf(App.active_mode)
  let new_mode

  if (index === -1) {
    return
  }

  if (reverse) {
    if (index === 0) {
      new_mode = modes.at(-1)
    }
    else {
      new_mode = modes[index - 1]
    }
  }
  else if (index === modes.length - 1) {
    new_mode = modes[0]
  }
  else {
    new_mode = modes[index + 1]
  }

  App.show_mode({mode: new_mode, reuse_filter})
}

App.show_main_mode = (allow_same = true, force = false) => {
  let mode

  if (App.init_mode) {
    mode = App.init_mode
    App.init_mode = undefined
  }
  else {
    mode = App.main_mode()
  }

  if (!allow_same) {
    if (App.active_mode === mode) {
      return
    }
  }

  for (let m of App.persistent_modes) {
    if (mode !== m) {
      if (!App[`${m}_items`].length) {
        App.do_show_mode({mode: m})
      }
    }
  }

  App.check_tab_box_auto(mode)
  App.do_show_mode({mode, force})
}

App.getting = (mode, force = false) => {
  let icon = App.mode_icon(mode)
  let name = App.capitalize(mode)
  App.debug(`${icon} Getting ${name}`, force)
}

App.on_action = (mode) => {
  App.update_filter_history(mode)
  return App.check_restore()
}

App.main_mode = () => {
  return App.get_setting(`main_mode`)
}

App.check_init_mode = async () => {
  let init_mode = localStorage.getItem(`init_mode`) || `nothing`
  localStorage.setItem(`init_mode`, `nothing`)

  if (App.modes.includes(init_mode)) {
    if (init_mode === `history`) {
      let perm = await browser.permissions.contains({permissions: [`history`]})

      if (!perm) {
        return
      }
    }
    else if (init_mode === `bookmarks`) {
      let perm = await browser.permissions.contains({permissions: [`bookmarks`]})

      if (!perm) {
        return
      }
    }

    App.init_mode = init_mode
  }
}

App.mode_icon = (mode) => {
  return App.get_setting_icon(`${mode}_mode`)
}