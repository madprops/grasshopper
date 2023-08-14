App.profile_props = {
  tags: [],
  notes: ``,
  title: ``,
  color: ``,
  icon: ``,
  theme_enabled: false,
  background_color: ``,
  text_color: ``,
  background_image: ``
}

App.profile_props_theme = [`background_color`, `text_color`, `background_image`]

App.setup_profile_editor = () => {
  App.create_window({id: `profile_editor`, setup: () => {
    DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
      App.profile_editor_remove()
    })

    let close = DOM.el(`#profile_editor_close`)

    DOM.evs(close, [`click`, `auxclick`], () => {
      App.hide_window()
    })

    close.textContent = App.close_text

    DOM.ev(DOM.el(`#profile_editor_tags_add`), `click`, (e) => {
      App.show_tag_picker(e)
    })

    DOM.ev(DOM.el(`#profile_editor_header`), `click`, (e) => {
      App.show_profile_urls()
    })

    App.profile_editor_color_opts = [[`None`, ``]]

    for (let color of App.colors) {
      let icon = App.color_icons[color]
      let name = `${icon} ${App.capitalize(color)}`
      App.profile_editor_color_opts.push([name, color])
    }

    App.profile_make_menu(`color`, App.profile_editor_color_opts)

    DOM.ev(DOM.el(`#profile_editor_tags`), `input`, (e) => {
      App.profile_modified()
    })

    DOM.ev(DOM.el(`#profile_editor_notes`), `input`, (e) => {
      App.profile_modified()
    })

    DOM.ev(DOM.el(`#profile_editor_title`), `input`, (e) => {
      App.profile_modified()
    })

    DOM.ev(DOM.el(`#profile_editor_icon`), `input`, (e) => {
      App.profile_modified()
    })

    let bg = DOM.el(`#profile_editor_background_color`)

    App.profile_editor_background_color = AColorPicker.createPicker(bg, {
      showAlpha: false,
      showHSL: false,
      showHEX: false,
      showRGB: true,
      color: App.default_profile_background_color
    })

    App.profile_editor_background_color.on(`change`, (picker, color) => {
      App.profile_apply_theme()
      App.profile_modified()
    })

    let tc = DOM.el(`#profile_editor_text_color`)

    App.profile_editor_text_color = AColorPicker.createPicker(tc, {
      showAlpha: false,
      showHSL: false,
      showHEX: false,
      showRGB: true,
      color: App.default_profile_text_color
    })

    App.profile_editor_text_color.on(`change`, (picker, color) => {
      App.profile_apply_theme()
      App.profile_modified()
    })

    DOM.ev(DOM.el(`#profile_editor_background_image`), `blur`, (e) => {
      App.profile_apply_theme()
      App.profile_modified()
    })

    DOM.ev(DOM.el(`#profile_editor_theme_enabled`), `change`, (e) => {
      if (e.target.checked) {
        DOM.el(`#profile_editor_theme_inputs`).classList.remove(`hidden`)
      }
      else {
        DOM.el(`#profile_editor_theme_inputs`).classList.add(`hidden`)
      }

      App.profile_apply_theme()
      App.profile_modified()
    })
  },
  colored_top: true,
  on_hide: () => {
    if (App.profile_editor_modified) {
      App.show_confirm(`Save changes?`, () => {
        App.profile_editor_save()
      }, () => {
        App.hide_window(true)
        App.check_item_theme()
      })
    }
    else {
      App.hide_window(true)
      App.check_item_theme()
    }
  }})
}

App.profile_modified = () => {
  if (App.profile_ready) {
    App.profile_editor_modified = true
  }
}

App.get_profile_items = (item) => {
  let active = App.get_active_items(item.mode, item)
  active = App.remove_duplicates(active)

  if (active.length === 0) {
    return
  }

  let items = []

  for (let it of active) {
    items.push(App.soft_copy_item(it))
  }

  return items
}

App.show_profile_editor = (item, type, action = `edit`) => {
  App.profile_ready = false
  App.profile_editor_items = App.get_profile_items(item)
  let items = App.profile_editor_items
  let [profiles, added] = App.get_profiles(items)
  App.profile_editor_profiles = profiles
  App.profile_editor_added = added
  App.profile_editor_type = type
  App.profile_editor_action = action
  App.show_window(`profile_editor`)
  DOM.el(`#profile_editor_tags_container`).classList.add(`hidden`)
  DOM.el(`#profile_editor_notes_container`).classList.add(`hidden`)
  DOM.el(`#profile_editor_color_container`).classList.add(`hidden`)
  DOM.el(`#profile_editor_title_container`).classList.add(`hidden`)
  DOM.el(`#profile_editor_icon_container`).classList.add(`hidden`)
  DOM.el(`#profile_editor_theme_container`).classList.add(`hidden`)
  DOM.el(`#profile_editor_theme_inputs`).classList.add(`hidden`)
  App.profile_editor_modified = false

  if (type === `all` || type === `tags`) {
    DOM.el(`#profile_editor_tags_container`).classList.remove(`hidden`)
    DOM.el(`#profile_editor_tags`).focus()
  }

  if (type === `all` || type === `notes`) {
    DOM.el(`#profile_editor_notes_container`).classList.remove(`hidden`)
    DOM.el(`#profile_editor_notes`).focus()
  }

  if (type === `all` || type === `title`) {
    DOM.el(`#profile_editor_title_container`).classList.remove(`hidden`)
    DOM.el(`#profile_editor_title`).focus()
  }

  if (type === `all` || type === `color`) {
    DOM.el(`#profile_editor_color_container`).classList.remove(`hidden`)
    DOM.el(`#profile_editor_color`).focus()
  }

  if (type === `all` || type === `theme`) {
    DOM.el(`#profile_editor_theme_container`).classList.remove(`hidden`)
    DOM.el(`#profile_editor_theme_enabled`).focus()
  }

  if (type === `all` || type === `icon`) {
    DOM.el(`#profile_editor_icon_container`).classList.remove(`hidden`)
    DOM.el(`#profile_editor_icon`).focus()
  }

  if (type === `all`) {
    DOM.el(`#profile_editor_tags`).focus()
  }

  DOM.el(`#profile_editor_tags`).value = ``
  DOM.el(`#profile_editor_notes`).value = ``
  DOM.el(`#profile_editor_title`).value = ``
  DOM.el(`#profile_editor_icon`).value = ``
  DOM.el(`#profile_editor_theme_enabled`).checked = false
  App.profile_editor_background_color.setColor(App.default_profile_background_color)
  App.profile_editor_text_color.setColor(App.default_profile_text_color)
  DOM.el(`#profile_editor_background_image`).value = ``
  App.current_profile_editor_color = ``

  if (items.length === 1 && profiles.length === 1) {
    DOM.el(`#profile_editor_remove`).classList.remove(`hidden`)
  }
  else {
    DOM.el(`#profile_editor_remove`).classList.add(`hidden`)
  }

  if (items.length === 1) {
    DOM.el(`#profile_editor_header`).textContent = `Editing 1 Profile`

    if (profiles.length) {
      let profile = profiles[0]

      if (action === `edit`) {
        DOM.el(`#profile_editor_tags`).value = profile.tags.join(`\n`)
        DOM.el(`#profile_editor_notes`).value = profile.notes
      }

      DOM.el(`#profile_editor_title`).value = profile.title
      DOM.el(`#profile_editor_icon`).value = profile.icon
      App.current_profile_editor_color = profile.color

      if (profile.theme_enabled) {
        DOM.el(`#profile_editor_theme_enabled`).checked = true
        DOM.el(`#profile_editor_theme_inputs`).classList.remove(`hidden`)
      }

      if (profile.background_color) {
        App.profile_editor_background_color.setColor(profile.background_color)
      }

      if (profile.text_color) {
        App.profile_editor_text_color.setColor(profile.text_color)
      }
    }
  }
  else {
    if (action === `edit`) {
      if (items.length === profiles.length) {
        if (type === `tags`) {
          let shared = App.get_shared_tags(profiles)
          DOM.el(`#profile_editor_tags`).value = shared.join(`\n`)
        }
        else if (type === `notes`) {
          let shared = App.get_shared_notes(profiles)
          DOM.el(`#profile_editor_notes`).value = shared
        }
        else if (type === `title`) {
          let shared = App.get_shared_title(profiles)
          DOM.el(`#profile_editor_title`).value = shared
        }
        else if (type === `icon`) {
          let shared = App.get_shared_icon(profiles)
          DOM.el(`#profile_editor_icon`).value = shared
        }
        else if (type === `color`) {
          let shared = App.get_shared_color(profiles)
          App.current_profile_editor_color = shared
        }
        else if (type === `theme`) {
          let enabled = App.get_shared_theme_enabled(profiles)

          if (enabled) {
            let shared_bg = App.get_shared_background_color(profiles)
            let shared_tc = App.get_shared_text_color(profiles)
            let shared_bi = App.get_shared_background_image(profiles)

            if (shared_bg && shared_tc && shared_bi) {
              DOM.el(`#profile_editor_theme_enabled`).checked = true
              DOM.el(`#profile_editor_theme_inputs`).classList.remove(`hidden`)
              DOM.el(`#profile_editor_background_image`).value = shared_bi
              App.profile_editor_background_color.setColor(shared_bg)
              App.profile_editor_text_color.setColor(shared_tc)
            }
          }
        }
      }
    }

    DOM.el(`#profile_editor_header`).textContent = `Editing ${items.length} Profiles`
  }

  App.window_goto_top(`profile_editor`)
  App.profile_apply_theme()
  App.set_profile_color()
  App.profile_ready = true
}

App.get_empty_profile = (url) => {
  return {
    url: url,
    tags: [],
    notes: ``,
    title: ``,
    color: ``,
    icon: ``,
    theme_enabled: false,
    background_color: ``,
    text_color: ``,
    background_image: ``,
  }
}

App.copy_profile = (profile) => {
  let obj = {}
  obj.url = profile.url
  obj.tags = profile.tags.slice(0)
  obj.notes = profile.notes
  obj.title = profile.title
  obj.color = profile.color
  obj.theme_enabled = profile.theme_enabled
  obj.background_color = profile.background_color
  obj.text_color = profile.text_color
  obj.background_image = profile.background_image
  obj.icon = profile.icon
  return obj
}

App.get_clean_tag_input = () => {
  return App.single_linebreak(DOM.el(`#profile_editor_tags`).value)
}

App.get_input_tags = () => {
  let tags = App.get_clean_tag_input().split(`\n`)
  let c_tags = []

  for (let tag of tags) {
    if (!tag) {
      continue
    }

    let t = tag.toLowerCase().trim()

    if (!c_tags.includes(t)) {
      c_tags.push(t)
    }
  }

  return c_tags
}

App.profile_editor_save = () => {
  let items = App.profile_editor_items

  if (items.length === 0) {
    return
  }

  let force = App.check_force(undefined, items.length)

  App.show_confirm(`Save profiles? (${items.length})`, () => {
    let args = {}
    args.tags = App.get_input_tags()
    args.notes = App.double_linebreak(DOM.el(`#profile_editor_notes`).value)
    args.title = DOM.el(`#profile_editor_title`).value.trim()
    args.icon = DOM.el(`#profile_editor_icon`).value.trim()
    args.color = App.current_profile_editor_color
    args.theme_enabled = DOM.el(`#profile_editor_theme_enabled`).checked
    let hex = App.profile_editor_background_color.color
    args.background_color = App.colorlib.hex_to_rgb(hex)
    hex = App.profile_editor_text_color.color
    args.text_color = App.colorlib.hex_to_rgb(hex)
    args.background_image =  DOM.el(`#profile_editor_background_image`).value.trim()
    args.type = App.profile_editor_type
    args.profiles = App.profile_editor_profiles
    args.added = App.profile_editor_added
    args.action = App.profile_editor_action
    args.from = `editor`
    App.save_profile(args)
  }, undefined, force)
}

App.save_profile = (args) => {
  let urls = []

  function proc (profile, p_mode) {
    if (args.type === `all` || args.type === `tags`) {
      let n_tags = []

      if (p_mode === `edit` && args.action === `add`) {
        for (let tag of profile.tags) {
          if (!n_tags.includes(tag)) {
            n_tags.push(tag)
          }
        }
      }

      for (let tag of args.tags) {
        if (!n_tags.includes(tag)) {
          n_tags.push(tag)
        }
      }

      profile.tags = n_tags
    }

    if (args.type === `all` || args.type === `notes`) {
      let n_notes = args.notes

      if (p_mode === `edit` && args.action === `add`) {
        n_notes = `${profile.notes}\n${n_notes}`.trim()
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

    if (args.type === `all` || args.type === `theme`) {
      profile.theme_enabled = args.theme_enabled
      profile.background_color = args.background_color
      profile.text_color = args.text_color
      profile.background_image = args.background_image
    }

    App.profiles = App.profiles.filter(x => x.url !== profile.url)

    if (App.used_profile(profile)) {
      App.profiles.unshift(profile)

      if (App.profiles.length > App.max_profiles) {
        App.profiles = App.profiles.slice(0, App.max_profiles)
      }
    }

    urls.push(profile.url)
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

  for (let url of urls) {
    App.apply_profiles(url)
  }

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
  if (items.length === 0) {
    return
  }

  let [profiles, added] = App.get_profiles(items)

  if (profiles.length === 0) {
    return
  }

  let force = App.check_force(`warn_on_remove_profiles`, profiles.length)

  App.show_confirm(`Remove profiles? (${profiles.length})`, () => {
    for (let profile of profiles) {
      App.profiles = App.profiles.filter(x => x.url !== profile.url)
      App.apply_profiles(profile.url)
    }

    App.stor_save_profiles()
    App.refresh_profile_filters()

    if (App.window_mode === `profile_editor`) {
      App.hide_window(true)
    }
  }, undefined, force)
}

App.apply_profiles = (url) => {
  let items = []

  if (!App.persistent_modes.includes(App.active_mode)) {
    items.push(...App.get_items(App.active_mode))
  }

  items.push(...App.get_persistent_items())

  for (let item of items) {
    if (item.url === url) {
      App.update_item(item.mode, item.id, {})
    }
  }

  App.check_item_theme()
}

App.get_profile = (item_url) => {
  for (let profile of App.profiles) {
    if (item_url === profile.url) {
      return profile
    }
  }
}

App.get_profiles = (items) => {
  let profiles = []
  let add = []

  for (let item of items) {
    let has_profile = false

    for (let profile of App.profiles) {

      if (item.url === profile.url) {
        profiles.push(profile)
        has_profile = true
        break
      }
    }

    if (!has_profile) {
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
      App.clear_all_items()
      App.show_mode(App.active_mode)
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

    for (let prop in App.profile_props) {
      if (profile[prop] === undefined) {
        profile[prop] = App.profile_props[prop]
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
      if (tag && !tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  return tags
}

App.get_tag_items = (mode, action = `filter`) => {
  let items = []
  let tags = App.get_tags()

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
          App.set_custom_filter_mode(mode, `tag_${tag}`, tag)
          App.set_filter(mode, ``)
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
  let count = App.get_profile_count()

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

    let icon = App.color_icons[color]
    let name = `${icon} ${App.capitalize(color)}`

    items.push({
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

  if (count.tags) {
    items.push({
      text: `Remove Tags`,
      get_items: () => {
        return App.get_tag_items(App.active_mode, `remove`)
      }
    })
  }

  if (count.notes) {
    items.push({
      text: `Remove Notes`,
      action: () => {
        App.remove_all_notes()
      }
    })
  }

  if (count.titles) {
    items.push({
      text: `Remove Titles`,
      action: () => {
        App.remove_all_titles()
      }
    })
  }

  if (count.colors) {
    items.push({
      text: `Remove Color`,
      get_items: () => {
        return App.get_color_items(App.active_mode, `remove`)
      }
    })
  }

  if (count.icons) {
    items.push({
      text: `Remove Icons`,
      action: () => {
        App.remove_all_icons()
      }
    })
  }

  if (count.themes) {
    items.push({
      text: `Remove Themes`,
      action: () => {
        App.remove_all_themes()
      }
    })
  }

  if (App.profiles.length) {
    items.push({
      text: `Remove All`,
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
    if (profile.color === color) {
      profiles.push(profile)
    }
  }

  if (profiles.length === 0) {
    return
  }

  if (profiles.length === 0) {
    App.show_alert(`No profiles found`)
    return
  }

  App.show_confirm(`Remove ${color}? (${profiles.length})`, () => {
    for (let profile of profiles) {
      profile.color = ``
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

  if (profiles.length === 0) {
    return
  }

  App.show_confirm(`Remove all colors? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.color = ``
    }

    App.after_profile_remove()
  })
}

App.remove_all_themes = () => {
  let profiles = []

  for (let profile of App.profiles) {
    if (profile.theme_enabled) {
      profiles.push(profile)
    }
  }

  if (profiles.length === 0) {
    return
  }

  App.show_confirm(`Remove all themes? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.theme_enabled = false
      profile.background_color = ``
      profile.text_color = ``
      profile.background_image = ``
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

  if (profiles.length === 0) {
    return
  }

  App.show_confirm(`Remove all notes? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.notes = ``
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

  if (profiles.length === 0) {
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

  if (profiles.length === 0) {
    return
  }

  App.show_confirm(`Remove all icons? (${profiles.length})`, () => {
    for (let profile of App.profiles) {
      profile.icon = ``
    }

    App.after_profile_remove()
  })
}

App.remove_tag = (name) => {
  App.show_confirm(`Remove tag? (${name})`, () => {
    for (let profile of App.profiles) {
      if (profile.tags.includes(name)) {
        profile.tags = profile.tags.filter(tag => tag !== name)
      }
    }

    App.after_profile_remove()
  })
}

App.remove_all_tags = () => {
  let tags = App.get_tags()

  if (tags.length === 0) {
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
  if (App.profiles.length === 0) {
    return
  }

  App.show_confirm(`Remove all profiles? (${App.profiles.length})`, () => {
    App.profiles = []
    App.after_profile_remove()
  })
}

App.after_profile_remove = () => {
  App.stor_save_profiles()
  App.clear_all_items()
  App.show_mode(App.active_mode)
}

App.used_profile = (profile) => {
  for (let prop in App.profile_props) {
    if (App.profile_props_theme.includes(prop)) {
      continue
    }

    if (profile[prop].toString() !== App.profile_props[prop].toString()) {
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
  count.backgrounds = 0
  count.icons = 0
  count.themes = 0

  for (let profile of App.profiles) {
    if (profile.tags.length) {
      count.tags += 1
    }

    if (profile.notes) {
      count.notes += 1
    }

    if (profile.color) {
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

    if (profile.theme_enabled) {
      count.themes += 1
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

App.get_edit_items = (item, multiple) => {
  let items = []

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
    text: `Edit Title`,
    action: () => {
      return App.show_profile_editor(item, `title`)
    }
  })

  items.push({
    text: `Edit Color`,
    action: () => {
      return App.show_profile_editor(item, `color`)
    }
  })

  items.push({
    text: `Edit Theme`,
    action: () => {
      return App.show_profile_editor(item, `theme`)
    }
  })

  items.push({
    text: `Edit Icon`,
    action: () => {
      return App.show_profile_editor(item, `icon`)
    }
  })

  items.push({
    text: `Edit All`,
    action: () => {
      return App.show_profile_editor(item, `all`)
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

App.show_tag_picker = (e) => {
  let items = []
  let tags = App.get_tags()

  let input_tags = App.get_input_tags()

  for (let tag of tags) {
    if (input_tags.includes(tag)) {
      continue
    }

    items.push({
      text: tag,
      action: () => {
        App.insert_tag(tag)
      }
    })

    if (items.length >= App.max_tag_filters) {
      break
    }
  }

  if (items.length === 0) {
    items.push({
      text: `No tags to add`,
      action: () => {
        App.show_alert(`Add some tags manually`)
      }
    })
  }

  NeedContext.show(e.clientX, e.clientY, items)
}

App.insert_tag = (tag) => {
  let el = DOM.el(`#profile_editor_tags`)
  let value = App.get_clean_tag_input()
  el.value = `${value}\n${tag}`.trim()
  el.scrollTop = el.scrollHeight
  el.focus()
}

App.show_profile_urls = () => {
  let s = App.profile_editor_items.map(x => x.url).join(`\n\n`)
  App.show_alert_2(s)
}

App.change_color = (item, color) => {
  let items = App.get_profile_items(item)
  let [profiles, added] = App.get_profiles(items)
  let args = {}
  args.color = color
  args.profiles = profiles
  args.added = added
  args.type = `color`
  args.from = `color_items`
  let force = items.length === 1

  App.show_confirm(`Color items ${color}? (${items.length})`, () => {
    App.save_profile(args)
  }, undefined, force)
}

App.filter_color = (mode, color) => {
  App.set_custom_filter_mode(mode, `color_${color}`, App.capitalize(color))
  App.set_filter(mode, ``)
}

App.get_shared_tags = (profiles) => {
  let arrays = profiles.map(obj => obj.tags)

  let shared = arrays.reduce((common, current) => {
    return common.filter(value => current.includes(value))
  })

  return shared
}

App.get_shared_notes = (profiles) => {
  let first = profiles[0].notes

  for (let profile of profiles) {
    if (profile.notes !== first) {
      return ``
    }
  }

  return first
}

App.get_shared_title = (profiles) => {
  let first = profiles[0].title

  for (let profile of profiles) {
    if (profile.title !== first) {
      return ``
    }
  }

  return first
}

App.get_shared_icon = (profiles) => {
  let first = profiles[0].icon

  for (let profile of profiles) {
    if (profile.icon !== first) {
      return ``
    }
  }

  return first
}

App.get_shared_color = (profiles) => {
  let first = profiles[0].color

  for (let profile of profiles) {
    if (profile.color !== first) {
      return ``
    }
  }

  return first
}

App.get_shared_theme_enabled = (profiles) => {
  let first = profiles[0].theme_enabled

  for (let profile of profiles) {
    if (profile.theme_enabled !== first) {
      return ``
    }
  }

  return first
}

App.get_shared_background_color = (profiles) => {
  let first = profiles[0].background_color

  for (let profile of profiles) {
    if (profile.background_color !== first) {
      return ``
    }
  }

  return first
}

App.get_shared_text_color = (profiles) => {
  let first = profiles[0].text_color

  for (let profile of profiles) {
    if (profile.text_color !== first) {
      return ``
    }
  }

  return first
}

App.get_shared_background_image = (profiles) => {
  let first = profiles[0].background_image

  for (let profile of profiles) {
    if (profile.background_image !== first) {
      return ``
    }
  }

  return first
}

App.profile_apply_theme = () => {
  if (DOM.el(`#profile_editor_theme_enabled`).checked) {
    let c1 = App.colorlib.hex_to_rgb(App.profile_editor_background_color.color)
    let c2 = App.colorlib.hex_to_rgb(App.profile_editor_text_color.color)
    let bi =  DOM.el(`#profile_editor_background_image`).value.trim()
    App.apply_theme({background_color: c1, text_color: c2, background_image: bi, check: true})
  }
  else {
    App.set_default_theme()
  }
}

App.profile_make_menu = (prop, opts) => {
  let el = DOM.el(`#profile_editor_${prop}`)

  DOM.ev(el, `click`, () => {
    let items = []

    for (let o of opts) {
      items.push({
        text: o[0],
        action: () => {
          App.profile_editor_set_menu(el, prop, o)
        },
      })
    }

    NeedContext.show_on_element(el, items, true, el.clientHeight)
  })

  let buttons = DOM.create(`div`, `flex_row_center gap_1`)
  let prev = DOM.create(`div`, `button`)
  prev.textContent = `<`
  let next = DOM.create(`div`, `button`)
  next.textContent = `>`

  function prev_fn () {
    App.profile_menu_cycle(el, prop, `prev`, opts)
  }

  function next_fn () {
    App.profile_menu_cycle(el, prop, `next`, opts)
  }

  DOM.ev(prev, `click`, prev_fn)
  DOM.ev(next, `click`, next_fn)

  buttons.append(prev)
  buttons.append(next)
  el.after(buttons)
  prev.after(el)
}

App.profile_menu_cycle = (el, prop, dir, o_items) => {
  let cycle = true
  let waypoint = false
  let items = o_items.slice(0)

  if (dir === `prev`) {
    items.reverse()
  }

  let s_item

  if (cycle) {
    s_item = items[0]
  }

  for (let item of items) {
    if (item[0] === App.separator_string) {
      continue
    }

    if (waypoint) {
      s_item = item
      break
    }

    if (item[1] === App.current_profile_editor_color) {
      waypoint = true
    }
  }

  if (s_item) {
    App.profile_editor_set_menu(el, prop, s_item)
  }
}

App.profile_editor_set_menu = (el, prop, item) => {
  el.textContent = item[0]
  App[`current_profile_editor_${prop}`] = item[1]
  App.profile_modified()
}

App.get_profile_editor_menu_item = (value, opts) => {
  for (let opt of opts) {
    if (opt[1] === value) {
      return opt
    }
  }
}

App.set_profile_color = () => {
  let color = App.current_profile_editor_color
  let item = App.get_profile_editor_menu_item(color, App.profile_editor_color_opts)
  App.profile_editor_set_menu(DOM.el(`#profile_editor_color`), `color`, item)
}

App.profile_editor_left = () => {
  let el = DOM.el(`#profile_editor_color_container`)

  if (!el.classList.contains(`hidden`)) {
    App.profile_menu_cycle(DOM.el(`#profile_editor_color`), `color`, `prev`, App.profile_editor_color_opts)
  }
}

App.profile_editor_right = () => {
  let el = DOM.el(`#profile_editor_color_container`)

  if (!el.classList.contains(`hidden`)) {
    App.profile_menu_cycle(DOM.el(`#profile_editor_color`), `color`, `next`, App.profile_editor_color_opts)
  }
}