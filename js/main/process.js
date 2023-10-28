App.process_info_list = (mode, info_list) => {
  let container = DOM.el(`#${mode}_container`)
  App[`${mode}_idx`] = 0

  if (!App.persistent_modes.includes(mode)) {
    App.clear_items(mode)
  }

  let items = App.get_items(mode)
  let exclude = []

  for (let info of info_list) {
    let item = App.process_info({mode: mode, info: info, exclude: exclude, list: true})

    if (!item) {
      continue
    }

    if (mode !== `tabs`) {
      exclude.push(item.url)
    }

    items.push(item)
    container.append(item.element)
  }

  App.check_playing(mode)
  App.update_footer_count(mode)
  App.do_check_pinline()
  App.check_new_tabs()

  if (mode === `tabs`) {
    App.check_tab_session()
  }
}

App.process_info = (args = {}) => {
  let def_args = {
    exclude: [],
    list: false,
  }

  App.def_args(def_args, args)

  if (!args.info) {
    return false
  }

  if (args.o_item) {
    args.info = Object.assign({}, args.o_item.original_data, args.info)
    args.o_item.original_data = args.info
  }

  if (args.info.url) {
    try {
      // Check if valid URL
      decodeURI(args.info.url)
    }
    catch (err) {
      return false
    }
  }

  let url = App.format_url(args.info.url || ``)

  if (args.exclude.includes(url)) {
    return false
  }

  let path = App.remove_protocol(url)
  let protocol = App.get_protocol(url)
  let hostname = App.get_hostname(url)
  let title = args.info.title || ``
  let image = App.is_image(url)
  let video = App.is_video(url)
  let audio = App.is_audio(url)

  let item = {
    title: title,
    url: url,
    path: path,
    protocol: protocol,
    hostname: hostname,
    favicon: args.info.favIconUrl,
    mode: args.mode,
    window_id: args.info.windowId,
    session_id: args.info.sessionId,
    image: image,
    video: video,
    audio: audio,
    is_item: true,
  }

  if (args.mode === `tabs`) {
    item.active = args.info.active
    item.pinned = args.info.pinned
    item.audible = args.info.audible
    item.muted = args.info.mutedInfo.muted
    item.discarded = args.info.discarded
    item.last_accessed = args.info.lastAccessed

    if (item.active && !App.active_history.length) {
      App.update_active_history(undefined, item)
    }
  }
  else if (args.mode === `history`) {
    item.last_visit = args.info.lastVisitTime
  }
  else if (args.mode === `bookmarks`) {
    item.parent_id = args.info.parentId
    item.date_added = args.info.dateAdded
  }

  if (args.o_item) {
    args.o_item = Object.assign(args.o_item, item)
    App.refresh_item_element(args.o_item)

    if (App.get_selected(args.mode) === args.o_item) {
      App.update_footer_info(args.o_item)
    }
  }
  else {
    if (!args.list) {
      if ((args.mode === `tabs`) && !item.active) {
        item.unread = true
      }
    }

    let rules = App.get_setting(`domain_rules`)

    for (let rule of rules) {
      if (item.path.startsWith(rule.domain)) {
        if (rule.color && rule.color !== `none`) {
          item.rule_color = rule.color
        }

        if (rule.title) {
          item.rule_title = rule.title
        }

        if (rule.tags) {
          item.rule_tags = App.taglist(rule.tags)
        }
      }
    }

    item.original_data = args.info
    item.id = args.info.id || App[`${args.mode}_idx`]
    item.visible = true
    item.selected = false
    item.last_scroll = 0
    App.create_item_element(item)
    App[`${args.mode}_idx`] += 1
    return item
  }
}