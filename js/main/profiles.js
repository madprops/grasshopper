App.profile_props = {
  url: {
    type: `text`,
    value: ``,
    version: 1,
  },
  exact: {
    type: `checkbox`,
    value: false,
    version: 1,
  },
  tags: {
    type: `list`,
    value: [],
    label: `Tag`,
    title: `Tags`,
    version: 2,
  },
  notes: {
    type: `list`,
    value: [],
    label: `Note`,
    title: `Notes`,
    version: 2,
  },
  title: {
    type: `text`,
    value: ``,
    version: 1,
  },
  color: {
    type: `menu`,
    value: `none`,
    version: 1,
  },
  icon: {
    type: `text`,
    value: ``,
    version: 1,
  },
}

App.start_profile_editor = () => {
  if (App.check_ready(`profile_editor`)) {
    return
  }

  App.create_window({
    id: `profile_editor`,
    setup: () => {
      DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
        App.profile_editor_remove()
      })

      let close_el = DOM.el(`#profile_editor_close`)
      close_el.textContent = App.close_text

      DOM.evs(close_el, [`click`, `auxclick`], () => {
        App.profile_editor_close()
      })

      DOM.el(`#profile_editor_icon`).placeholder = App.icon_placeholder

      DOM.ev(DOM.el(`#profile_editor_url_root`), `click`, (e) => {
        App.profile_editor_root_url()
      })

      DOM.ev(DOM.el(`#profile_editor_url_full`), `click`, (e) => {
        App.profile_editor_full_url(e)
      })

      App.profile_editor_color_opts = [{text: `None`, value: `none`}]

      for (let color of App.colors) {
        let icon = App.color_icon(color)
        let name = App.capitalize(color)
        App.profile_editor_color_opts.push({text: name, value: color, icon: icon})
      }

      App.profile_make_menu(`color`, App.profile_editor_color_opts)

      DOM.ev(DOM.el(`#profile_editor_tags_add`), `click`, (e) => {
        App.profile_tags_add(e)
      })

      App.profile_setup_labels()
    },
    colored_top: true,
  })

  App.profile_start_addlists()
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

App.show_profile_editor = (item, action = `edit`) => {
  App.start_profile_editor()
  let new_edit = false
  App.profile_urls = []

  if (action === `new`) {
    new_edit = true
    action = `edit`
  }

  App.profile_editor_items = App.get_profile_items(item)
  let items = App.profile_editor_items
  let profiles = []
  let added = []

  if (!new_edit) {
    [profiles, added] = App.get_profiles(items)
  }
  else {
    added = [item]
  }

  App.profile_editor_profiles = profiles
  App.profile_editor_added = added
  App.profile_editor_action = action
  App.show_window(`profile_editor`)
  App.profile_default_all()
  let remove_el = DOM.el(`#profile_editor_remove`)

  if (profiles.length) {
    remove_el.classList.remove(`hidden`)
  }
  else {
    remove_el.classList.add(`hidden`)
  }

  if (profiles.length && !new_edit) {
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

  App.window_goto_top(`profile_editor`)
  App.profile_addlist_counts()

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

  args.profiles = App.profile_editor_profiles
  args.added = App.profile_editor_added
  args.action = App.profile_editor_action
  args.type = `all`
  App.do_save_profile(args)
}

App.do_save_profile = (args) => {
  function add_url (url) {
    if (!App.profile_urls.includes(url)) {
      App.profile_urls.push(url)
    }
  }

  function proc (profile, p_mode) {
    if (App.same_profile(profile, args)) {
      return
    }

    function item_in_list (list, item) {
      for (let it of list) {
        if (it.value === item.value) {
          return true
        }
      }

      return false
    }

    function add_to_list (key) {
      let n_list = []

      for (let item of args[key]) {
        if (!item_in_list(n_list, item)) {
          n_list.push(item)
        }
      }

      if (p_mode === `edit` && args.action === `add`) {
        for (let item of profile[key].value) {
          if (!item_in_list(n_list, item)) {
            n_list.push(item)
          }
        }
      }

      return n_list
    }

    let og_url = profile.url.value
    profile.url.value = args.url || profile.url.value

    if (!profile.url.value) {
      return
    }

    profile.url.value = App.format_url(profile.url.value)

    for (let key in App.profile_props) {
      if (key === `url`) {
        continue
      }

      if (args.type === `all` || args.type === key) {
        let props = App.profile_props[key]

        if (props.type === `list`) {
          profile[key].value = add_to_list(key)
        }
        else {
          profile[key].value = args[key]
        }
      }
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
    else if (pf.url.value.length > profile.url.value.length) {
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

  if (profile) {
    for (let key in profile) {
      let props = App.profile_props[key]

      if (!props) {
        continue
      }

      if (profile[key].version !== props.version) {
        profile[key].value = App.clone(props.value)
        profile[key].version = props.version
      }
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
      if (profile[key] && profile[key].value === undefined) {
        let props = App.profile_props[key]

        profile[key].value = App.clone(props.value)
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
      if (!tags.includes(tag.value)) {
        tags.push(tag.value)
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

  if (App.profiles.length) {
    items.push({
      text: `All`,
      action: () => {
        App.remove_all_profiles()
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
      profile.tags.value = profile.tags.value.filter(x => x.value !== tag)
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

  for (let key in App.profile_props) {
    count[key] = 0
  }

  count.colors = 0

  for (let profile of App.profiles) {
    if (profile.color.value !== `none`) {
      if (!count[profile.color.value]) {
        count[profile.color.value] = 0
      }

      count[profile.color.value] += 1
      count.colors += 1
    }

    for (let key in App.profile_props) {
      if (key === `url` || key === `exact`) {
        continue
      }

      let props = App.profile_props[key]

      if (App.str(profile[key]) !== App.str(props.value)) {
        count[key] += 1
      }
    }
  }

  return count
}

App.refresh_profile_filters = () => {
  let mode = App.active_mode
  let filter_mode = App.filter_mode(mode)

  if (filter_mode === `edited` || filter_mode.startsWith(`tag_`) || filter_mode.startsWith(`color_`)) {
    App.filter({mode: mode})
    return
  }
}

App.get_edit_items = (item) => {
  let items = []
  let its = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(its)

  if (its.length === 1) {
    let profile = profiles[0]
    let exact = false

    if (profile) {
      exact = profile.url.value === item.url
    }

    if (profile && !exact) {
      items.push({
        text: `This URL`,
        action: () => {
          App.show_profile_editor(item, `new`)
        }
      })
    }
  }

  items.push({
    icon: App.settings_icons.theme,
    text: `Color`,
    get_items: () => {
      return App.color_menu_items(item)
    }
  })

  items.push({
    icon: App.get_setting(`notes_icon`),
    text: `Note`,
    action: () => {
      App.add_note(item)
    }
  })

  items.push({
    icon: App.memo_icon,
    text: `Tag`,
    action: () => {
      App.add_tag(item)
    }
  })

  items.push({
    icon: App.memo_icon,
    text: `Title`,
    action: () => {
      App.profile_edit_text(`title`, `Title`, item)
    }
  })

  items.push({
    icon: App.memo_icon,
    text: `Icon`,
    action: () => {
      App.profile_edit_text(`icon`, `Icon`, item)
    }
  })

  App.sep(items)

  items.push({
    icon: App.memo_icon,
    text: `Profile`,
    action: () => {
      App.show_profile_editor(item)
    }
  })

  if (profiles.length) {
    App.sep(items)

    items.push({
      text: `Remove`,
      action: () => {
        App.profile_remove_menu(item)
      }
    })
  }

  return items
}

App.edit_profiles = (item) => {
  App.show_profile_editor(item)
}

App.add_tag = (item) => {
  App.profile_add_to_list(`tags`, item)
}

App.add_note = (item) => {
  App.profile_add_to_list(`notes`, item)
}

App.profile_addlist_on_set = (key, item, action) => {
  let args = App.profile_change_args(item, key, App.profile_get_value(key), action)
  App.do_save_profile(args)
  App.profile_editor_close(false)
}

App.profile_add_to_list = (key, item) => {
  App.start_profile_editor()
  App.profile_set_value(key, [])

  Addlist.edit({id: `profile_editor_${key}`, items: {}, on_set: () => {
    App.profile_addlist_on_set(key, item, `add`)
  }})
}

App.profile_edit_text = (key, title, item) => {
  let value = ``
  let items = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(items)

  if (profiles.length && !added.length) {
    value = App.profile_shared_value(profiles, key) || ``
  }

  App.show_prompt(value, title, (ans) => {
    let args = App.profile_change_args(item, key, ans)
    App.do_save_profile(args)
    App.profile_editor_close(false)
  })
}

App.profile_change_args = (item, type, value, action = `edit`) => {
  let args = {}
  let items = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(items)
  App.profile_urls = []
  args.profiles = profiles
  args.added = added
  args.type = type
  args[type] = value
  args.action = action
  return args
}

App.change_color = (item, color, toggle = false) => {
  let args = App.profile_change_args(item, `color`, color)

  if (toggle) {
    if (args.profiles.length) {
      if (args.profiles[0].color.value === color) {
        color = `none`
      }
    }
  }

  args.color = color
  let num_items = args.profiles.length + args.added.length
  let some = false

  if (args.added.length) {
    if (color !== `none`) {
      some = true
    }
  }

  for (let profile of args.profiles) {
    if (profile.color.value !== color) {
      some = true
      break
    }
  }

  if (!some) {
    return
  }

  let force

  if (color === `none`) {
    force = App.check_force(`warn_on_remove_color`, num_items, true)
  }
  else {
    force = App.check_force(`warn_on_color`, num_items, true)
  }

  let msg

  if (color === `none`) {
    msg = `Remove color?`
  }
  else {
    msg = `Color items ${color}?`
  }

  msg += ` (${num_items})`

  App.show_confirm(msg, () => {
    App.do_save_profile(args)
    App.profile_editor_close(false)
  }, undefined, force)
}

App.profile_make_menu = (key, opts,) => {
  App[`profile_menubutton_${key}`] = Menubutton.create({
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

App.profile_start_addlists = () => {
  for (let key in App.profile_props) {
    let props = App.profile_props[key]

    if (props.type === `list`) {
      App.profile_register_addlist(key, props.label, props.title)
    }
  }
}

App.profile_register_addlist = (key, label, title) => {
  let id = `profile_editor_${key}`
  let lowercase = false
  let widget

  if (key === `notes`) {
    widget = `textarea`
  }
  else if (key === `tags`) {
    widget = `text`
    lowercase = true
  }

  App.create_popup({
    id: `addlist_${id}`,
    element: Addlist.register({
      id: id,
      pk: `value`,
      widgets: [widget],
      labels: [label],
      keys: [`value`],
      list_text: (items) => {
        return items.value
      },
      title: title,
      lowercase: lowercase,
      get_data: (id) => {
        return App[id]
      },
      set_data: (id, value) => {
        App[id] = value
      },
    }),
    on_hide: () => {
      Addlist.hide()
    },
  })

  let el = DOM.el(`#${id}`)
  Addlist.add_buttons(id, el)
}

App.profile_tags_add = (e) => {
  let tags = App.get_tags()
  let tags_used = App.profile_editor_tags.map(x => x.value)
  let items = []

  for (let tag of tags) {
    if (!tags_used.includes(tag)) {
      items.push({
        text: tag,
        action: () => {
          App.profile_editor_tags.unshift({value: tag})
          Addlist.update_count(`profile_editor_tags`)
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
      Addlist.update_count(`profile_editor_${key}`)
    }
  }
}

App.profile_setup_labels = () => {
  for (let el of DOM.els(`.profile_editor_label`)) {
    let key = el.dataset.key

    if (key === `url`) {
      continue
    }

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

  if (props) {
    return App.clone(props.value)
  }
}

App.profile_set_default = (key, action = false) => {
  let def = App.profile_get_default(key)
  App.profile_set_value(key, def, action)
}

App.profile_get_value = (key) => {
  let props = App.profile_props[key]

  if (!props) {
    return
  }

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

  if (!props) {
    return
  }

  if (props.type === `list`) {
    App[`profile_editor_${key}`] = App.clone(value)

    if (actions) {
      Addlist.update_count(`profile_editor_${key}`)
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
  let props = App.profile_props[key]

  if (!props) {
    return
  }

  return App.str(value) === App.str(props.value)
}

App.profile_default_all = () => {
  for (let key in App.profile_props) {
    App.profile_set_default(key)
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

App.color_menu_items = (item) => {
  let items = []

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

  App.sep(items)

  items.push({
    text: `Remove Color`,
    action: () => {
      App.change_color(item, `none`)
    }
  })

  return items
}

App.show_color_menu = (item, e) => {
  let items = App.color_menu_items(item)
  App.show_center_context(items, e)
}

App.show_notes = (item) => {
  App.start_profile_editor()
  let profile = App.get_profile(item.url)

  if (profile) {
    if (profile.notes.value.length) {
      App.profile_set_value(`notes`, profile.notes.value)

      Addlist.view({id: `profile_editor_notes`, index: 0, on_set: () => {
        App.profile_addlist_on_set(`notes`, item, `edit`)
      }})
    }
  }
}

App.profile_shared_value = (profiles, key) => {
  if (profiles[0][key] === undefined) {
    return
  }

  let first = profiles[0][key].value

  for (let profile of profiles) {
    if (profile[key] !== undefined) {
      if (profile[key].value !== first) {
        return
      }
    }
  }

  return first
}