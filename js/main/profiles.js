App.setup_profiles = () => {
  App.start_auto_reload()
}

App.profile_props = {
  url: {value: ``, type: `string`},
  exact: {value: false, type: `boolean`},
  tags: {value: [], type: `list`},
  notes: {value: [], type: `list`},
  title: {value: ``, type: `string`},
  color: {value: `none`, type: `menu`},
  icon: {value: ``, type: `string`},
  auto_reload: {value: 0, type: `number`},
}

App.setup_profile_editor = () => {
  App.create_window({id: `profile_editor`, setup: () => {
    DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
      App.profile_editor_remove()
    })

    DOM.evs(DOM.el(`#profile_editor_save`), [`click`, `auxclick`], () => {
      App.profile_editor_save()
    })

    DOM.evs(DOM.el(`#profile_editor_cancel`), [`click`, `auxclick`], () => {
      App.hide_window()
    })

    DOM.el(`#profile_editor_icon`).placeholder = App.smile_icon

    DOM.ev(DOM.el(`#profile_editor_url_root`), `click`, (e) => {
      App.profile_editor_root_url()
    })

    DOM.ev(DOM.el(`#profile_editor_url_full`), `click`, (e) => {
      App.profile_editor_full_url(e)
    })

    DOM.ev(DOM.el(`#profile_editor_header`), `click`, (e) => {
      App.show_profile_urls()
    })

    App.profile_editor_color_opts = [{text: `None`, value: `none`}]

    for (let color of App.colors) {
      let icon = App.color_icon(color)
      let name = App.capitalize(color)
      App.profile_editor_color_opts.push({text: name, value: color, icon: icon})
    }

    App.profile_make_menu(`color`, App.profile_editor_color_opts)
    App.profile_addlist_tags()
    App.profile_addlist_notes()

    DOM.ev(DOM.el(`#profile_editor_tags_add`), `click`, (e) => {
      App.profile_tags_add(e)
    })

    DOM.ev(DOM.el(`#profile_editor_auto_reload`), `change`, (e) => {
      let value = parseInt(e.target.value)
      e.target.value = value

      if (e.target.value.trim() === `` || isNaN(value)) {
        e.target.value = e.target.min
      }

      if (value < e.target.min) {
        e.target.value = e.target.min
      }
    })

    App.profile_setup_labels()
  },
  colored_top: true})
}

App.get_profile_items = (item) => {
  let active = App.get_active_items(item.mode, item)
  active = App.remove_duplicates(active)

  if (!active.length) {
    return
  }

  let items = []

  for (let it of active) {
    items.push(App.soft_copy_item(it))
  }

  return items
}

App.show_profile_editor = (item, type, action = `edit`) => {
  App.profile_editor_ready = false
  App.profile_editor_new = false

  if (action === `new`) {
    App.profile_editor_new = true
    action = `edit`
  }

  App.profile_editor_items = App.get_profile_items(item)
  let items = App.profile_editor_items
  let profiles = []
  let added = []

  if (!App.profile_editor_new) {
    [profiles, added] = App.get_profiles(items)
  }
  else {
    added = [item]
  }

  App.profile_editor_profiles = profiles
  App.profile_editor_added = added
  App.profile_editor_type = type
  App.profile_editor_action = action
  App.show_window(`profile_editor`)
  App.profile_hide_containers()

  if (type === `all` || type === `tags`) {
    App.profile_editor_container(`tags`, true)
  }

  if (type === `all` || type === `notes`) {
    App.profile_editor_container(`notes`, true)
  }

  if (type === `all` || type === `title`) {
    App.profile_editor_container(`title`, true)
  }

  if (type === `all` || type === `color`) {
    App.profile_editor_container(`color`, true)
  }

  if (type === `all` || type === `icon`) {
    App.profile_editor_container(`icon`, true)
  }

  if (type === `all` || type === `auto_reload`) {
    App.profile_editor_container(`auto_reload`, true)
  }

  App.profile_default_all()

  if (profiles.length) {
    DOM.el(`#profile_editor_remove`).classList.remove(`hidden`)
  }
  else {
    DOM.el(`#profile_editor_remove`).classList.add(`hidden`)
  }

  if (items.length === 1) {
    App.profile_editor_header(`Editing 1 Profile`)

    if (type === `all`) {
      App.profile_editor_container(`url`, true)
      App.profile_editor_container(`exact`, true)
    }

    if (profiles.length && !App.profile_editor_new) {
      let profile = profiles[0]

      if (action === `edit`) {
        App.profile_set_value(`tags`, profile.tags)
        App.profile_set_value(`notes`, profile.notes)
      }

      App.profile_set_value(`url`, profile.url)
      App.profile_set_value(`exact`, profile.exact)
      App.profile_set_value(`title`, profile.title)
      App.profile_set_value(`icon`, profile.icon)
      App.profile_set_value(`auto_reload`, profile.auto_reload)
      App.profile_set_value(`color`, profile.color)
    }
    else {
      App.profile_set_value(`url`, items[0].url)
    }
  }
  else {
    if (action === `edit`) {
      if (items.length === profiles.length) {
        for (let key in App.profile_props) {
          if (type === key) {
            let shared = App.profile_get_shared(key, profiles)

            if (shared !== undefined) {
              App.profile_set_value(key, shared)
            }

            break
          }
        }
      }
    }

    App.profile_editor_header(`Editing ${items.length} Profiles`)
  }

  App.window_goto_top(`profile_editor`)
  App.profile_editor_ready = true
  App.profile_addlist_count()

  if (type === `tags` && action === `add`) {
    App.profile_tags_addlist()
  }
  else if (type === `notes` && action === `add`) {
    App.profile_notes_addlist()
  }

  requestAnimationFrame(() => {
    App.scroll_to_right(DOM.el(`#profile_editor_url`))
  })
}

App.get_empty_profile = (url) => {
  let obj = {}

  for (let key in App.profile_props) {
    let props = App.profile_props[key]

    if (props.type === `list`) {
      obj[key] = App.clone(props.value)
    }
    else {
      obj[key] = props.value
    }
  }

  obj.url = url
  return obj
}

App.copy_profile = (profile) => {
  let obj = {}

  for (let key in App.profile_props) {
    if (profile[key] !== undefined) {
      obj[key] = App.clone(profile[key])
    }
  }

  return obj
}

App.profile_editor_save = () => {
  let items = App.profile_editor_items

  if (!items.length) {
    return
  }

  let args = {}

  for (let key in App.profile_props) {
    args[key] = App.profile_get_value(key)
  }

  args.type = App.profile_editor_type
  args.profiles = App.profile_editor_profiles
  args.added = App.profile_editor_added
  args.action = App.profile_editor_action
  args.from = `editor`
  App.save_profile(args)
}

App.save_profile = (args) => {
  let urls = []

  function add_url (url) {
    if (!urls.includes(url)) {
      urls.push(url)
    }
  }

  function has_tag (list, tag) {
    for (let item of list) {
      if (item.tag === tag.tag) {
        return true
      }
    }

    return false
  }

  function proc (profile, p_mode) {
    let og_url = profile.url
    profile.url = args.url || profile.url

    if (!profile.url) {
      return
    }

    profile.url = App.format_url(profile.url)

    if (args.type === `all`) {
      profile.exact = args.exact
    }

    if (args.type === `all` || args.type === `tags`) {
      let n_tags = []

      for (let tag of args.tags) {
        if (!has_tag(n_tags, tag)) {
          n_tags.push(tag)
        }
      }

      if (p_mode === `edit` && args.action === `add`) {
        for (let tag of profile.tags) {
          if (!has_tag(n_tags, tag)) {
            n_tags.push(tag)
          }
        }
      }

      profile.tags = n_tags
    }

    if (args.type === `all` || args.type === `notes`) {
      let n_notes = args.notes

      if (p_mode === `edit` && args.action === `add`) {
        n_notes = [...args.notes, ...profile.notes]
      }

      profile.notes = n_notes
    }

    if (args.type === `all` || args.type === `title`) {
      profile.title = args.title
    }

    if (args.type === `all` || args.type === `icon`) {
      profile.icon = args.icon
    }

    if (args.type === `all` || args.type === `color`) {
      profile.color = args.color
    }

    if (args.type === `all` || args.type === `auto_reload`) {
      profile.auto_reload = args.auto_reload
    }

    App.profiles = App.profiles.filter(x => x.url !== og_url)

    if (og_url !== profile.url) {
      App.profiles = App.profiles.filter(x => x.url !== profile.url)
    }

    if (App.used_profile(profile)) {
      App.profiles.unshift(profile)

      if (App.profiles.length > App.max_profiles) {
        App.profiles = App.profiles.slice(0, App.max_profiles)
      }
    }

    add_url(og_url)
    add_url(profile.url)
  }

  // Added
  if (args.added.length) {
    for (let item of args.added) {
      proc(App.get_empty_profile(item.url), `add`)
    }
  }

  // Edited
  if (args.profiles.length) {
    for (let profile of args.profiles) {
      proc(App.copy_profile(profile), `edit`)
    }
  }

  App.stor_save_profiles()

  if (args.from === `editor`) {
    App.hide_window(true)
  }

  App.apply_profiles(urls)
  App.refresh_profile_filters()
}

App.profile_remove_menu = (item) => {
  let items = App.get_active_items(item.mode, item)
  return App.remove_profiles(items)
}

App.profile_editor_remove = () => {
  App.remove_profiles(App.profile_editor_profiles)
}

App.remove_profiles = (items) => {
  if (!items.length) {
    return
  }

  let [profiles, added] = App.get_profiles(items)

  if (!profiles.length) {
    return
  }

  let force = App.check_force(`warn_on_remove_profiles`, profiles.length)

  App.show_confirm(`Remove profiles? (${profiles.length})`, () => {
    for (let profile of profiles) {
      App.profiles = App.profiles.filter(x => x.url !== profile.url)
    }

    App.apply_profiles(profiles.map(x => x.url))
    App.stor_save_profiles()
    App.refresh_profile_filters()

    if (App.window_mode === `profile_editor`) {
      App.hide_window(true)
    }
  }, undefined, force)
}

App.apply_profiles = (urls) => {
  let items = []

  if (!App.persistent_modes.includes(App.active_mode)) {
    items.push(...App.get_items(App.active_mode))
  }

  items.push(...App.get_persistent_items())

  for (let item of items) {
    for (let url of urls) {
      if (item.url.startsWith(url)) {
        App.update_item(item.mode, item.id, {})
      }
    }
  }
}

App.get_profile = (url) => {
  let current

  function proc (profile) {
    if (!current) {
      current = profile
    }
    else if (profile.url.length > current.url.length) {
      current = profile
    }
  }

  for (let profile of App.profiles) {
    if (profile.exact) {
      if (url === profile.url) {
        proc(profile)
      }
    }
    else {
      if (url.startsWith(profile.url)) {
        proc(profile)
      }
    }
  }

  return current
}

App.get_profiles = (items) => {
  let profiles = []
  let add = []

  for (let item of items) {
    let profile = App.get_profile(item.url)

    if (profile) {
      profiles.push(profile)
    }
    else {
      add.push(item)
    }
  }

  return [profiles, add]
}

App.get_profile_menu_items = () => {
  let items = []

  items.push({
    text: `Remove`,
    get_items: () => {
      return App.clear_profiles_items()
    }
  })

  items.push({
    text: `Export`,
    action: () => {
      App.export_profiles()
    }
  })

  items.push({
    text: `Import`,
    action: () => {
      App.import_profiles()
    }
  })

  return items
}

App.export_profiles = () => {
  App.export_data(App.profiles)
}

App.import_profiles = () => {
  App.import_data((json) => {
    if (App.is_array(json)) {
      App.profiles = json
      App.check_profiles()
      App.stor_save_profiles()
      App.clear_show()
    }
  })
}

App.check_profiles = () => {
  let changed = false

  for (let profile of App.profiles) {
    if (profile.url === undefined) {
      profile.url = `https://empty.profile`
      changed = true
    }

    for (let key in App.profile_props) {
      if (profile[key] === undefined) {
        profile[key] = App.clone(App.profile_props[key].value)
        changed = true
      }
    }
  }

  if (changed) {
    App.stor_save_profiles()
  }
}

App.get_tags = () => {
  let tags = []

  for (let profile of App.profiles) {
    for (let tag of profile.tags) {
      if (!tags.includes(tag.tag || tag)) {
        tags.push(tag.tag || tag)
      }
    }
  }

  return tags
}

App.get_tag_items = (mode, action = `filter`) => {
  let items = []
  let tags

  if (action === `remove`) {
    tags = App.get_tags()
  }
  else if (action === `filter`) {
    tags = App.get_active_tags(mode)
  }

  if (action === `remove`) {
    items.push({
      text: `All`,
      action: () => {
        App.remove_all_tags()
      }
    })
  }

  for (let tag of tags) {
    items.push({
      text: tag,
      action: () => {
        if (action === `filter`) {
          App.filter_tag(mode, tag)
        }
        else if (action === `remove`) {
          App.remove_tag(tag)
        }
      }
    })

    if (items.length >= App.max_tag_filters) {
      break
    }
  }

  return items
}

App.get_color_items = (mode, action = `filter`) => {
  let items = []
  let count

  if (action === `remove`) {
    count = App.get_profile_count()
  }
  else if (action === `filter`) {
    count = App.get_active_colors(mode)
  }

  if (action === `remove`) {
    items.push({
      text: `All`,
      action: () => {
        App.remove_all_colors()
      }
    })
  }

  for (let color of App.colors) {
    if (!count[color]) {
      continue
    }

    let icon = App.color_icon(color)
    let name = App.capitalize(color)

    items.push({
      icon: icon,
      text: name,
      action: () => {
        if (action === `filter`) {
          App.filter_color(mode, color)
        }
        else {
          App.remove_color(color)
        }
      }
    })
  }

  return items
}

App.clear_profiles_items = () => {
  let items = []
  let count = App.get_profile_count()

  if (App.profiles.length) {
    items.push({
      text: `All`,
      action: () => {
        App.remove_all_profiles()
      }
    })
  }

  if (count.titles) {
    items.push({
      text: `Titles`,
      action: () => {
        App.remove_all_titles()
      }
    })
  }

  if (count.tags) {
    items.push({
      text: `Tags`,
      get_items: () => {
        return App.get_tag_items(App.active_mode, `remove`)
      }
    })
  }

  if (count.notes) {
    items.push({
      text: `Notes`,
      action: () => {
        App.remove_all_notes()
      }
    })
  }

  if (count.colors) {
    items.push({
      text: `Colors`,
      get_items: () => {
        return App.get_color_items(App.active_mode, `remove`)
      }
    })
  }

  if (count.icons) {
    items.push({
      text: `Icons`,
      action: () => {
        App.remove_all_icons()
      }
    })
  }

  if (count.auto_reloads) {
    items.push({
      text: `Reload`,
      action: () => {
        App.remove_all_auto_reload()
      }
    })
  }

  return items
}

App.remove_color = (color) => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.color === color) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  if (!profiles.length) {
    App.show_alert(`No profiles found`)
    return
  }

  App.show_confirm(`Remove ${color}? (${profiles.length})`, () => {
    for (let profile of profiles) {
      profile.color = `none`
    }

    App.after_profile_remove()
  })
}

App.remove_all_colors = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.color) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all colors? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.color = `none`
    }

    App.after_profile_remove()
  })
}

App.remove_all_notes = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.notes) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all notes? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.notes = []
    }

    App.after_profile_remove()
  })
}

App.remove_all_titles = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.title) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all titles? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.title = ``
    }

    App.after_profile_remove()
  })
}

App.remove_all_icons = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.icon) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all icons? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.icon = ``
    }

    App.after_profile_remove()
  })
}

App.remove_all_auto_reload = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.auto_reload !== 0) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all auto reload? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.auto_reload = 0
    }

    App.after_profile_remove()
  })
}

App.remove_tag = (tag) => {
  App.show_confirm(`Remove tag? (${tag})`, () => {
    for (let profile of App.profiles) {
      profile.tags = profile.tags.filter(x => x.tag !== tag)
    }

    App.after_profile_remove()
  })
}

App.remove_all_tags = () => {
  let tags = App.get_tags()

  if (!tags.length) {
    return
  }

  App.show_confirm(`Remove all tags? (${tags.length})`, () => {
    for (let profile of App.profiles) {
      profile.tags = []
    }

    App.after_profile_remove()
  })
}

App.remove_all_profiles = () => {
  if (!App.profiles.length) {
    return
  }

  App.show_confirm(`Remove all profiles? (${App.profiles.length})`, () => {
    App.profiles = []
    App.after_profile_remove()
  })
}

App.remove_empty_profiles = () => {
  for (let profile of App.profiles) {
    if (!App.used_profile(profile)) {
      App.profiles = App.profiles.filter(p => p !== profile)
    }
  }

  App.stor_save_profiles()
}

App.after_profile_remove = () => {
  App.remove_empty_profiles()
  App.clear_show()
}

App.used_profile = (profile) => {
  for (let key in App.profile_props) {
    if (key === `url` || key === `exact`) {
      continue
    }

    if (profile[key].toString() !== App.profile_props[key].value.toString()) {
      return true
    }
  }

  return false
}

App.get_profile_count = () => {
  let count = {}
  count.tags = 0
  count.notes = 0
  count.colors = 0
  count.titles = 0
  count.icons = 0
  count.auto_reloads = 0

  for (let profile of App.profiles) {
    if (profile.tags.length) {
      count.tags += 1
    }

    if (profile.notes) {
      count.notes += 1
    }

    if (profile.color && profile.color !== `none`) {
      if (!count[profile.color]) {
        count[profile.color] = 0
      }

      count[profile.color] += 1
      count.colors += 1
    }

    if (profile.title) {
      count.titles += 1
    }

    if (profile.icon) {
      count.icons += 1
    }

    if (profile.auto_reloads !== 0) {
      count.auto_reloads += 1
    }
  }

  return count
}

App.refresh_profile_filters = () => {
  let mode = App.active_mode
  let filter_mode = App.filter_mode(mode)

  if (filter_mode === `edited` || filter_mode.startsWith(`tag_`) ||
  filter_mode.startsWith(`color_`) || filter_mode === `autoreload`) {
    App.filter(mode)
    return
  }
}

App.get_edit_items = (item, multiple) => {
  let items = []

  items.push({
    text: `Edit All`,
    action: () => {
      return App.show_profile_editor(item, `all`)
    }
  })

  items.push({separator: true})

  items.push({
    text: `Add Tags`,
    action: () => {
      return App.add_tags(item)
    }
  })

  items.push({
    text: `Add Notes`,
    action: () => {
      return App.add_notes(item)
    }
  })

  items.push({separator: true})

  items.push({
    text: `Edit Title`,
    action: () => {
      return App.show_profile_editor(item, `title`)
    }
  })

  items.push({
    text: `Edit Tags`,
    action: () => {
      return App.show_profile_editor(item, `tags`)
    }
  })

  items.push({
    text: `Edit Notes`,
    action: () => {
      return App.show_profile_editor(item, `notes`)
    }
  })

  items.push({
    text: `Edit Color`,
    action: () => {
      return App.show_profile_editor(item, `color`)
    }
  })

  items.push({
    text: `Edit Icon`,
    action: () => {
      return App.show_profile_editor(item, `icon`)
    }
  })

  items.push({
    text: `Edit Reload`,
    action: () => {
      return App.show_profile_editor(item, `auto_reload`)
    }
  })

  items.push({separator: true})

  items.push({
    text: `Remove`,
    action: () => {
      App.profile_remove_menu(item)
    }
  })

  return items
}

App.edit_profiles = (item) => {
  App.show_profile_editor(item, `all`)
}

App.add_tags = (item) => {
  App.show_profile_editor(item, `tags`, `add`)
}

App.add_notes = (item) => {
  App.show_profile_editor(item, `notes`, `add`)
}

App.show_profile_urls = () => {
  let s = App.profile_editor_items.map(x => x.url).join(`\n\n`)
  App.show_alert_2(s)
}

App.change_color = (item, color, toggle = false) => {
  let items = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(items)
  let args = {}
  args.profiles = profiles
  args.added = added
  args.type = `color`
  args.from = `color_items`
  let force
  let some = false

  if (toggle) {
    if (profiles.length) {
      if (profiles[0].color === color) {
        color = `none`
      }
    }
  }

  if (added.length) {
    if (color !== `none`) {
      some = true
    }
  }

  for (let profile of profiles) {
    if (profile.color !== color) {
      some = true
      break
    }
  }

  if (!some) {
    return
  }

  if (color === `none`) {
    force = App.check_force(`warn_on_remove_color`, items.length, true)
  }
  else {
    force = App.check_force(`warn_on_color`, items.length, true)
  }

  let msg

  if (color === `none`) {
    msg = `Remove color?`
  }
  else {
    msg = `Color items ${color}?`
  }

  msg += ` (${items.length})`

  App.show_confirm(msg, () => {
    args.color = color
    App.save_profile(args)
  }, undefined, force)
}

App.profile_get_shared = (key, profiles) => {
  let props = App.profile_props[key]

  if (props.type === `list`) {
    let first = App.str(profiles[0][key])

    for (let profile of profiles) {
      if (App.str(profile[key]) !== first) {
        return
      }
    }

    return App.obj(first)
  }
  else {
    let first = profiles[0][key]

    for (let profile of profiles) {
      if (profile[key] !== first) {
        return
      }
    }

    return first
  }
}

App.profile_make_menu = (key, opts) => {
  App[`profile_menubutton_${key}`] = App.create_menubutton({
    button: DOM.el(`#profile_editor_${key}`),
    opts: opts,
  })
}

App.profile_editor_left = () => {
  let el = DOM.el(`#profile_editor_color_container`)

  if (!el.classList.contains(`hidden`)) {
    App.profile_menubutton_color.prev()
  }
}

App.profile_editor_right = () => {
  let el = DOM.el(`#profile_editor_color_container`)

  if (!el.classList.contains(`hidden`)) {
    App.profile_menubutton_color.next()
  }
}

App.get_item_tag_items = (item) => {
  let items = []

  for (let tag of item.tags) {
    items.push({
      text: tag,
      action: () => {
        App.filter_tag(item.mode, tag)
      }
    })
  }

  return items
}

App.get_active_colors = (mode) => {
  let count = {colors: 0}

  for (let item of App.get_items(mode)) {
    if (item.color) {
      if (!count[item.color]) {
        count[item.color] = 0
      }

      count[item.color] += 1
      count.colors += 1
    }
  }

  return count
}

App.get_active_tags = (mode) => {
  let tags = []

  for (let item of App.get_items(mode)) {
    for (let tag of item.tags) {
      if (tag && !tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  return tags
}

App.profile_editor_root_url = () => {
  let el = DOM.el(`#profile_editor_url`)
  let item = App.profile_editor_items[0]
  el.value = item.protocol + `//` + item.hostname
  App.scroll_to_right(el)
  el.focus()
}

App.profile_editor_full_url = () => {
  let el = DOM.el(`#profile_editor_url`)
  el.value = App.profile_editor_items[0].url
  App.scroll_to_right(el)
  el.focus()
}

App.get_edit_options = (item) => {
  let items = []
  let profile = App.get_profile(item.url)
  let exact = profile && (profile.url === item.url)

  if (profile) {
    items.push({
      text: `Edit`,
      action: () => {
        App.show_profile_editor(item, `all`)
      }
    })
  }

  if (!exact) {
    items.push({
      text: `New`,
      action: () => {
        App.show_profile_editor(item, `all`, `new`)
      }
    })
  }

  return items
}

App.start_auto_reload = () => {
  clearInterval(App.auto_reload_interval)

  if (!App.auto_reload_delay || isNaN(App.auto_reload_delay)) {
    App.error(`Wrong auto reload delay`)
    return
  }

  App.auto_reload_interval = setInterval(() => {
    App.debug(`Auto reloading tabs`)

    for (let item of App.get_items(`tabs`)) {
      if (item.auto_reload >= 1) {
        let mins = Math.round((App.now() - item.last_auto_reload) / 1000 / 60)

        if (mins >= item.auto_reload) {
          App.browser_reload(item.id)
          item.last_auto_reload = App.now()
        }
      }
    }
  }, App.auto_reload_delay)

  App.debug(`Started auto reload interval`)
}

App.profile_addlist_tags = () => {
  let id = `profile_editor_tags`

  App.create_popup({
    id: `addlist_${id}`,
    element: App.addlist_register({
      id: id,
      pk: `tag`,
      widgets: [`text`],
      labels: [`Tag`],
      keys: [`tag`],
      list_text: (items) => {
        return items.tag
      },
      title: `Tags`,
      lowercase: true,
      get_value: (id) => {
        return App.profile_editor_tags
      },
      set_value: (id, value) => {
        App.profile_editor_tags = value
      },
    })
  })

  let el = DOM.el(`#${id}`)
  App.addlist_add_buttons(id, el)
}

App.profile_addlist_notes = () => {
  let id = `profile_editor_notes`

  App.create_popup({
    id: `addlist_${id}`,
    element: App.addlist_register({
      id: id,
      pk: `note`,
      widgets: [`text`],
      labels: [`Note`],
      keys: [`note`],
      list_text: (items) => {
        return items.note
      },
      title: `Notes`,
      get_value: (id) => {
        return App.profile_editor_notes
      },
      set_value: (id, value) => {
        App.profile_editor_notes = value
      },
    })
  })

  let el = DOM.el(`#${id}`)
  App.addlist_add_buttons(id, el)
}

App.profile_tags_add = (e) => {
  let tags = App.get_tags()
  let tags_used = App.profile_editor_tags.map(x => x.tag)
  let items = []

  for (let tag of tags) {
    if (!tags_used.includes(tag)) {
      items.push({
        text: tag,
        action: () => {
          App.profile_editor_tags.unshift({tag: tag})
          App.profile_addlist_count()
        }
      })

      if (items.length >= App.max_tag_filters) {
        break
      }
    }
  }

  if (!items.length) {
    items.push({
      text: `No more tags`,
      action: () => {
        App.show_feedback(`Add some tags manually`)
      }
    })
  }

  NeedContext.show(e.clientX, e.clientY, items)
}

App.profile_addlist_count = () => {
  App.addlist_update_count(`profile_editor_tags`)
  App.addlist_update_count(`profile_editor_notes`)
}

App.profile_tags_addlist = () => {
  App.addlist({id: `profile_editor_tags`, items: {}})
}

App.profile_notes_addlist = () => {
  App.addlist({id: `profile_editor_notes`, items: {}})
}

App.profile_fix_tags = (tags) => {
  let fixed = []

  for (let tag of tags) {
    let t = tag.tag || tag
    fixed.push({tag: t})
  }

  return fixed
}

App.profile_fix_notes = (notes) => {
  let fixed = []

  for (let note of notes) {
    let t = note.note || note
    fixed.push({note: t})
  }

  return fixed
}

App.profile_setup_labels = () => {
  for (let el of DOM.els(`.profile_editor_label`)) {
    let key = el.dataset.key
    let items = []

    items.push({
      text: `Reset`,
      action: () => {
        if (App.profile_is_default(key)) {
          return
        }

        App.show_confirm(`Reset this?`, () => {
          App.profile_set_default(key)
        })
      },
    })

    DOM.evs(el, [`click`, `contextmenu`], (e) => {
      NeedContext.show(e.clientX, e.clientY, items)
      e.preventDefault()
    })
  }
}

App.profile_set_default = (key) => {
  let props = App.profile_props[key]
  App.profile_set_value(key, props.value, true)
}

App.profile_get_value = (key) => {
  let props = App.profile_props[key]

  if (props.type === `list`) {
    return App[`profile_editor_${key}`]
  }
  else if (props.type === `menu`) {
    return App[`profile_menubutton_${key}`].value
  }
  else if (props.type === `color`) {
    let hex = App[`profile_editor_${key}`].color
    return App.colorlib.hex_to_rgb(hex)
  }
  else {
    let el = DOM.el(`#profile_editor_${key}`)

    if (props.type === `boolean`) {
      return el.checked
    }
    else if (props.type === `string`) {
      return el.value.trim()
    }
    else if (props.type === `number`) {
      return parseInt(el.value)
    }
  }
}

App.profile_set_value = (key, value, actions = false) => {
  let props = App.profile_props[key]

  if (props.type === `list`) {
    value = App[`profile_fix_${key}`](value)
    App[`profile_editor_${key}`] = App.clone(value)

    if (actions) {
      App.profile_addlist_count()
    }
  }
  else if (props.type === `menu`) {
    App[`profile_menubutton_${key}`].set(value || `none`)
  }
  else if (props.type === `color`) {
    App[`profile_editor_${key}`].setColor(value)
  }
  else {
    let el = DOM.el(`#profile_editor_${key}`)

    if (props.type === `boolean`) {
      el.checked = value
    }
    else if (props.type === `string`) {
      el.value = value
    }
    else if (props.type === `number`) {
      el.value = value
    }
  }
}

App.profile_is_default = (key) => {
  let value = App.profile_get_value(key)
  let def_value = App.profile_props[key].value
  return value.toString() === def_value.toString()
}

App.profile_default_all = () => {
  for (let key in App.profile_props) {
    App.profile_set_default(key)
  }
}

App.profile_hide_containers = () => {
  for (let key in App.profile_props) {
    App.profile_editor_container(key, false)
  }
}

App.profile_editor_header = (s) => {
  DOM.el(`#profile_editor_header`).textContent = s
}

App.profile_editor_container = (c, show) => {
  let el = DOM.el(`#profile_editor_${c}_container`)

  if (el) {
    if (show) {
      el.classList.remove(`hidden`)
    }
    else {
      el.classList.add(`hidden`)
    }
  }
}