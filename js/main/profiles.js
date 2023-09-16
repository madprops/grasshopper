App.profile_props = {
  url: {value: ``, type: `text`, version: 1},
  exact: {value: false, type: `checkbox`, version: 1},
  tags: {value: [], type: `list`, version: 1},
  notes: {value: [], type: `list`, version: 1},
  title: {value: ``, type: `text`, version: 1},
  color: {value: `none`, type: `menu`, version: 1},
  icon: {value: ``, type: `text`, version: 1},
}

App.setup_profile_editor = () => {
  App.create_window({id: `profile_editor`, colored_top: true, setup: () => {
    DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
      App.profile_editor_remove()
    })

    let close_el = DOM.el(`#profile_editor_close`)
    close_el.textContent = App.close_text

    DOM.evs(close_el, [`click`, `auxclick`], () => {
      App.profile_editor_close()
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

    for (let key in App.profile_props) {
      let props = App.profile_props[key]

      if (props.type === `list`) {
        App[`profile_addlist_${key}`]()
      }
    }

    DOM.ev(DOM.el(`#profile_editor_tags_add`), `click`, (e) => {
      App.profile_tags_add(e)
    })

    App.profile_setup_labels()
  }})
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
  App.profile_urls = []

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
        App.profile_set_value(`tags`, profile.tags.value)
        App.profile_set_value(`notes`, profile.notes.value)
      }

      App.profile_set_value(`url`, profile.url.value)
      App.profile_set_value(`exact`, profile.exact.value)
      App.profile_set_value(`title`, profile.title.value)
      App.profile_set_value(`icon`, profile.icon.value)
      App.profile_set_value(`color`, profile.color.value)
    }
    else {
      App.profile_set_value(`url`, items[0].url)
    }
  }
  else {
    if (action === `edit`) {
      if (items.length === profiles.length) {
        for (let key in App.profile_props) {
          if (type === `all` || type === key) {
            let shared = App.profile_get_shared(key, profiles)

            if (shared !== undefined) {
              App.profile_set_value(key, shared)
            }

            if (type !== `all`) {
              break
            }
          }
        }
      }
    }

    App.profile_editor_header(`Editing ${items.length} Profiles`)
  }

  App.window_goto_top(`profile_editor`)
  App.profile_editor_focus()
  App.profile_editor_ready = true
  App.profile_addlist_counts()

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
  let profile = {}

  for (let key in App.profile_props) {
    let props = App.profile_props[key]
    profile[key] = {}
    profile[key].version = props.version

    if (key === `url`) {
      profile.url.value = url
      continue
    }

    profile[key].value = App.clone(props.value)
  }

  return profile
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

App.save_profile = () => {
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
  App.do_save_profile(args)
}

App.do_save_profile = (args) => {
  function add_url (url) {
    if (!App.profile_urls.includes(url)) {
      App.profile_urls.push(url)
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
    if (App.same_profile(profile, args)) {
      return
    }

    let og_url = profile.url.value
    profile.url.value = args.url || profile.url.value

    if (!profile.url.value) {
      return
    }

    profile.url.value = App.format_url(profile.url.value)

    if (args.type === `all`) {
      profile.exact.value = args.exact
    }

    if (args.type === `all` || args.type === `tags`) {
      let n_tags = []

      for (let tag of args.tags) {
        if (!has_tag(n_tags, tag)) {
          n_tags.push(tag)
        }
      }

      if (p_mode === `edit` && args.action === `add`) {
        for (let tag of profile.tags.value) {
          if (!has_tag(n_tags, tag)) {
            n_tags.push(tag)
          }
        }
      }

      profile.tags.value = n_tags
    }

    if (args.type === `all` || args.type === `notes`) {
      let n_notes

      if (p_mode === `edit` && args.action === `add`) {
        n_notes = [...args.notes, ...profile.notes.value]
      }
      else {
        n_notes = [...args.notes]
      }

      profile.notes.value = n_notes
    }

    if (args.type === `all` || args.type === `title`) {
      profile.title.value = args.title
    }

    if (args.type === `all` || args.type === `icon`) {
      profile.icon.value = args.icon
    }

    if (args.type === `all` || args.type === `color`) {
      profile.color.value = args.color
    }

    App.profiles = App.profiles.filter(x => x.url.value !== og_url)

    if (og_url !== profile.url.value) {
      App.profiles = App.profiles.filter(x => x.url.value !== profile.url.value)
    }

    if (App.used_profile(profile)) {
      App.profiles.unshift(profile)

      if (App.profiles.length > App.max_profiles) {
        App.profiles = App.profiles.slice(0, App.max_profiles)
      }
    }

    add_url(og_url)
    add_url(profile.url.value)
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
      App.profiles = App.profiles.filter(x => x.url.value !== profile.url.value)
    }

    App.apply_profiles(profiles.map(x => x.url.value))
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
  let profile

  function proc (pf) {
    if (!profile) {
      profile = pf
    }
    else if (pf.url.length > profile.url.value.length) {
      profile = pf
    }
  }

  for (let pf of App.profiles) {
    if (pf.exact.value) {
      if (url === pf.url.value) {
        proc(pf)
      }
    }
    else {
      if (url.startsWith(pf.url.value)) {
        proc(pf)
      }
    }
  }

  for (let key in profile) {
    let props = App.profile_props[key]

    if (profile[key].version !== props.version) {
      profile[key].value = App.clone(props.value)
      profile[key].version = props.version
    }
  }

  return profile
}

App.get_profiles = (items) => {
  let profiles = []
  let add = []

  for (let item of items) {
    let profile

    if (item.url) {
      if (item.is_item) {
        profile = App.get_profile(item.url)
      }
      else {
        profile = App.get_profile(item.url.value)
      }
    }

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
    if (profile.url.value === undefined) {
      profile.url.value = `https://empty.profile`
      changed = true
    }

    for (let key in App.profile_props) {
      if (profile[key].value === undefined) {
        profile[key].value = App.clone(App.profile_props[key].value)
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
    for (let tag of profile.tags.value) {
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

  if (count.colors) {
    items.push({
      text: `Colors`,
      get_items: () => {
        return App.get_color_items(App.active_mode, `remove`)
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

  if (count.icons) {
    items.push({
      text: `Icons`,
      action: () => {
        App.remove_all_icons()
      }
    })
  }

  return items
}

App.remove_color = (color) => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.color.value === color) {
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
      profile.color.value = App.profile_get_default(`color`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_colors = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.color.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all colors? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.color.value = App.profile_get_default(`color`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_notes = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.notes.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all notes? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.notes.value = App.profile_get_default(`notes`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_titles = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.title.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all titles? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.title.value = App.profile_get_default(`title`)
    }

    App.after_profile_remove()
  })
}

App.remove_all_icons = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.icon.value) {
      profiles.push(profile)
    }
  }

  if (!profiles.length) {
    return
  }

  App.show_confirm(`Remove all icons? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.icon.value = App.profile_get_default(`icon`)
    }

    App.after_profile_remove()
  })
}

App.remove_tag = (tag) => {
  App.show_confirm(`Remove tag? (${tag})`, () => {
    for (let profile of App.profiles) {
      profile.tags.value = profile.tags.value.filter(x => x.tag !== tag)
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
      profile.tags.value = App.profile_get_default(`tags`)
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

    if (App.str(profile[key].value) !== App.str(App.profile_props[key].value)) {
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

  for (let profile of App.profiles) {
    if (profile.tags.value.length) {
      count.tags += 1
    }

    if (profile.notes.value.length) {
      count.notes += 1
    }

    if (profile.color.value !== `none`) {
      if (!count[profile.color.value]) {
        count[profile.color.value] = 0
      }

      count[profile.color.value] += 1
      count.colors += 1
    }

    if (profile.title.value) {
      count.titles += 1
    }

    if (profile.icon.value) {
      count.icons += 1
    }
  }

  return count
}

App.refresh_profile_filters = () => {
  let mode = App.active_mode
  let filter_mode = App.filter_mode(mode)

  if (filter_mode === `edited` || filter_mode.startsWith(`tag_`) || filter_mode.startsWith(`color_`)) {
    App.filter(mode)
    return
  }
}

App.get_edit_items = (item) => {
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
      App.add_tags(item)
    }
  })

  items.push({
    text: `Add Notes`,
    action: () => {
      App.add_notes(item)
    }
  })

  items.push({separator: true})

  items.push({
    text: `Edit Title`,
    action: () => {
      App.show_profile_editor(item, `title`)
    }
  })

  items.push({
    text: `Edit Color`,
    get_items: () => {
      return App.show_color_menu(item)
    }
  })

  items.push({
    text: `Edit Tags`,
    action: () => {
      App.show_profile_editor(item, `tags`)
    }
  })

  items.push({
    text: `Edit Notes`,
    action: () => {
      App.show_profile_editor(item, `notes`)
    }
  })

  items.push({
    text: `Edit Icon`,
    action: () => {
      App.show_profile_editor(item, `icon`)
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
  App.profile_urls = []
  args.profiles = profiles
  args.added = added
  args.type = `color`
  let force
  let some = false

  if (toggle) {
    if (profiles.length) {
      if (profiles[0].color.value === color) {
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
    if (profile.color.value !== color) {
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
    App.do_save_profile(args)
    App.profile_editor_close(false)
  }, undefined, force)
}

App.profile_get_shared = (key, profiles) => {
  let props = App.profile_props[key]

  if (props.type === `list`) {
    let first = App.str(profiles[0][key].value)

    for (let profile of profiles) {
      if (App.str(profile[key].value) !== first) {
        return
      }
    }

    return App.obj(first)
  }
  else {
    let first = profiles[0][key].value

    for (let profile of profiles) {
      if (profile[key].value !== first) {
        return
      }
    }

    return first
  }
}

App.profile_make_menu = (key, opts,) => {
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
  let exact = profile && (profile.url.value === item.url)

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
      get_data: (id) => {
        return App.profile_editor_tags
      },
      set_data: (id, value) => {
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
      get_data: (id) => {
        return App.profile_editor_notes
      },
      set_data: (id, value) => {
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
          App.addlist_update_count(`profile_editor_tags`)
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

App.profile_addlist_counts = () => {
  for (let key in App.profile_props) {
    let props = App.profile_props[key]

    if (props.type === `list`) {
      App.addlist_update_count(`profile_editor_${key}`)
    }
  }
}

App.profile_tags_addlist = () => {
  App.addlist_edit({id: `profile_editor_tags`, items: {}})
}

App.profile_notes_addlist = () => {
  App.addlist_edit({id: `profile_editor_notes`, items: {}})
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
          App.profile_set_default(key, true)
        })
      },
    })

    DOM.evs(el, [`click`, `contextmenu`], (e) => {
      NeedContext.show(e.clientX, e.clientY, items)
      e.preventDefault()
    })
  }
}

App.profile_get_default = (key) => {
  let props = App.profile_props[key]
  return App.clone(props.value)
}

App.profile_set_default = (key, action = false) => {
  let def = App.profile_get_default(key)
  App.profile_set_value(key, def, action)
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

    if (props.type === `checkbox`) {
      return el.checked
    }
    else if (props.type === `text`) {
      return el.value.trim()
    }
  }
}

App.profile_set_value = (key, value, actions = false) => {
  let props = App.profile_props[key]

  if (props.type === `list`) {
    App[`profile_editor_${key}`] = App.clone(value)

    if (actions) {
      App.addlist_update_count(`profile_editor_${key}`)
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

    if (props.type === `checkbox`) {
      el.checked = value
    }
    else if (props.type === `text`) {
      el.value = value
    }
  }
}

App.profile_is_default = (key) => {
  let value = App.profile_get_value(key)
  let def_value = App.profile_props[key].value
  return App.str(value) === App.str(def_value)
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

App.profile_editor_focus = () => {
  let cc = DOM.el(`#profile_editor_color_container`)

  if (!cc.classList.contains(`hidden`)) {
    return
  }

  let c = DOM.el(`#profile_editor_container`)

  for (let input of DOM.els(`.editor_input`, c)) {
    if (input.type === `text`) {
      let container = input.closest(`.editor_container`)

      if (!container.classList.contains(`hidden`)) {
        input.focus()
        break
      }
    }
  }
}

App.profile_editor_close = (save = true) => {
  if (save) {
    App.save_profile()
  }

  if (App.profile_urls.length) {
    App.apply_profiles(App.profile_urls)
    App.refresh_profile_filters()
  }

  App.hide_window()
}

App.same_profile = (profile, args) => {
  for (let key in App.profile_props) {
    if (App.str(profile[key].value) !== App.str(args[key])) {
      return false
    }
  }

  return true
}

App.show_color_menu = (item) => {
  let items = []

  items.push({
    text: `Remove Color`,
    action: () => {
      App.change_color(item, `none`)
    }
  })

  for (let color of App.colors) {
    let icon = App.color_icon(color)
    let text = `Color ${App.capitalize(color)}`

    items.push({
      icon: icon,
      text: text,
      action: () => {
        App.change_color(item, color)
      }
    })
  }

  return items
}