App.setup_profile_editor = () => {
  App.create_window({id: `profile_editor`, setup: () => {
    DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
      App.profile_editor_remove()
    })

    DOM.ev(DOM.el(`#profile_editor_save`), `click`, () => {
      App.profile_editor_save()
    })

    DOM.ev(DOM.el(`#profile_editor_info`), `click`, () => {
      App.profiles_info()
    })

    DOM.ev(DOM.el(`#profile_editor_close`), `click`, () => {
      App.hide_window()
    })

    DOM.ev(DOM.el(`#profile_editor_tags_add`), `click`, (e) => {
      App.show_tag_picker(e)
    })

    DOM.ev(DOM.el(`#profile_editor_tags_clear`), `click`, (e) => {
      App.profile_editor_clear(`tags`)
    })

    DOM.ev(DOM.el(`#profile_editor_notes_clear`), `click`, (e) => {
      App.profile_editor_clear(`notes`)
    })

    DOM.ev(DOM.el(`#profile_editor_title_clear`), `click`, (e) => {
      App.profile_editor_clear(`title`)
    })

    DOM.ev(DOM.el(`#profile_editor_color_clear`), `click`, (e) => {
      App.profile_editor_clear(`color`)
    })

    let color_select = DOM.el(`#profile_editor_color`)
    let colors = [`none`, ...Object.keys(App.colors)]

    for (let color of colors) {
      let option = DOM.create(`option`)
      option.value = color
      option.textContent = App.capitalize(color)
      color_select.append(option)
    }
  },
  colored_top: true})
}

App.show_profile_editor = (item, type, action = `edit`) => {
  let active = App.get_active_items(item.mode, item)
  active = App.remove_duplicates(active)

  if (active.length === 0) {
    return
  }

  App.profile_editor_items = []

  for (let it of active) {
    App.profile_editor_items.push(App.soft_copy_item(it))
  }

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

  if (type === `all`) {
    DOM.el(`#profile_editor_tags`).focus()
  }

  DOM.el(`#profile_editor_tags`).value = ``
  DOM.el(`#profile_editor_notes`).value = ``
  DOM.el(`#profile_editor_title`).value = ``
  DOM.el(`#profile_editor_color`).value = `none`

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
        console.log(profile.tags)
        DOM.el(`#profile_editor_tags`).value = profile.tags.join(`\n`)
        DOM.el(`#profile_editor_notes`).value = profile.notes
      }

      DOM.el(`#profile_editor_title`).value = profile.title
      DOM.el(`#profile_editor_color`).value = profile.color || `none`
    }
  }
  else {
    DOM.el(`#profile_editor_header`).textContent = `Editing ${items.length} Profiles`
  }
}

App.profile_editor_save = () => {
  let items = App.profile_editor_items

  if (items.length === 0) {
    return
  }

  let force = App.check_force(undefined, items.length)

  App.show_confirm(`Save profiles? (${items.length})`, () => {
    App.do_profile_editor_save()
  }, undefined, force)
}

App.get_empty_profile = (url) => {
  return {
    url: url,
    tags: [],
    notes: ``,
    title: ``,
    color: ``,
  }
}

App.copy_profile_obj = (profile) => {
  let obj = {}
  obj.url = profile.url
  obj.tags = profile.tags.slice(0)
  obj.notes = profile.notes
  obj.title = profile.title
  obj.color = profile.color
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

App.do_profile_editor_save = () => {
  let tags = App.get_input_tags()
  let notes = App.double_linebreak(DOM.el(`#profile_editor_notes`).value)
  let title = DOM.el(`#profile_editor_title`).value.trim()
  let color = DOM.el(`#profile_editor_color`).value

  if (color === `none`) {
    color = ``
  }

  let urls = []

  function proc (profile, p_mode) {
    let type = App.profile_editor_type

    if (type === `all` || type === `tags`) {
      let n_tags = []

      if (p_mode === `edit` && App.profile_editor_action === `add`) {
        for (let tag of profile.tags) {
          if (!n_tags.includes(tag)) {
            n_tags.push(tag)
          }
        }
      }

      for (let tag of tags) {
        if (!n_tags.includes(tag)) {
          n_tags.push(tag)
        }
      }

      profile.tags = n_tags
    }

    if (type === `all` || type === `notes`) {
      let n_notes = notes

      if (p_mode === `edit` && App.profile_editor_action === `add`) {
        n_notes = `${profile.notes}\n${n_notes}`.trim()
      }

      profile.notes = n_notes
    }

    if (type === `all` || type === `title`) {
      profile.title = title
    }

    if (type === `all` || type === `color`) {
      profile.color = color
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
  if (App.profile_editor_added.length) {
    for (let item of App.profile_editor_added) {
      proc(App.get_empty_profile(item.url), `add`)
    }
  }

  // Edited
  if (App.profile_editor_profiles.length) {
    for (let profile of App.profile_editor_profiles) {
      proc(App.copy_profile_obj(profile), `edit`)
    }
  }

  App.clean_profiles()
  App.stor_save_profiles()
  App.hide_window()

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
      App.hide_window()
    }
  }, undefined, force)
}

App.apply_profiles = (url) => {
  for (let item of App.get_items(App.active_mode)) {
    if (item.url === url) {
      App.update_item(App.active_mode, item.id, {})
    }
  }
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

App.get_profile_items = () => {
  let items = []

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

  items.push({
    text: `Remove`,
    get_items: () => {
      return App.clear_profiles_items()
    }
  })

  return items
}

App.export_profiles = () => {
  App.export_data(App.profiles)
}

App.import_profiles = () => {
  App.import_data((json) => {
    App.profiles = json
    App.check_profiles()
    App.stor_save_profiles()
    App.show_mode(App.active_mode)
  })
}

App.check_profiles = () => {
  let changed = false

  for (let profile of App.profiles) {
    if (profile.url === undefined) {
      profile.url = `https://empty.profile`
      changed = true
    }

    if (profile.tags === undefined) {
      profile.tags = []
      changed = true
    }

    if (profile.notes === undefined) {
      profile.notes = ``
      changed = true
    }

    if (profile.title === undefined) {
      profile.title = ``
      changed = true
    }

    if (profile.color === undefined) {
      profile.color = ``
      changed = true
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

  if (tags.length === 0) {
    items.push({
      text: `No tags yet`,
      action: () => {
        App.show_alert(`Add tags by right clicking items (Edit)`)
      }
    })
  }
  else {
    for (let tag of tags) {
      items.push({
        text: tag,
        action: () => {
          if (action === `filter`) {
            App.set_custom_filter_mode(mode, `tag_${tag}`, tag)
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
  }

  return items
}

App.get_color_items = (mode, action = `filter`) => {
  let items = []
  let count = App.get_profile_count()

  if (!count.colors) {
    items.push({
      text: `No colors yet`,
      action: () => {
        App.show_alert(`Add colors by right clicking items (Edit)`)
      }
    })

    return items
  }

  for (let color in App.colors) {
    if (!count[color]) {
      continue
    }

    items.push({
      text: App.capitalize(color),
      action: () => {
        if (action === `filter`) {
          App.set_custom_filter_mode(mode, `color_${color}`, App.capitalize(color))
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

  if (!App.profiles.length) {
    items.push({
      text: `No profiles yet`,
      action: () => {
        App.show_alert(`Edit profiles by right clicking items`)
      }
    })

    return items
  }

  let count = App.get_profile_count()

  if (count.tags) {
    items.push({
      text: `Remove Tag`,
      get_items: () => {
        return App.get_tag_items(App.active_mode, `remove`)
      }
    })

    items.push({
      text: `Remove All Tags`,
      action: () => {
        App.remove_all_tags()
      }
    })
  }

  if (count.notes) {
    items.push({
      text: `Remove All Notes`,
      action: () => {
        App.remove_all_notes()
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

    items.push({
      text: `Remove All Colors`,
      action: () => {
        App.remove_all_colors()
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
  App.clean_profiles()
  App.stor_save_profiles()
  App.show_mode(App.active_mode)
}

App.used_profile = (profile) => {
  if (profile.tags.length || profile.notes || profile.title || profile.color) {
    return true
  }

  return false
}

App.clean_profiles = () => {
  let c_profiles = []

  for (let profile of App.profiles) {
    if (App.used_profile(profile)) {
      c_profiles.push(profile)
    }
  }

  App.profiles = c_profiles
}

App.get_profile_count = () => {
  let count = {}
  count.tags = 0
  count.notes = 0
  count.colors = 0

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

App.is_edited = (item) => {
  return item.tags.length || item.custom_title || item.color
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

App.profiles_info = () => {
  let s = `This is data related to specific URLs.`
  s += ` The input of this data is always manual and not automatic.`
  s += ` The idea is to help you organize tabs to find them easily later.`
  s += ` You can use the filter menu to find tabs by tag or color.`
  s += ` You can give a tab a fixed title to replace its real one.`
  s += ` This is saved locally and is not synced.`
  s += ` To backup or move this data use the Profiles Export/Import feature in the main menu.`
  App.show_alert_2(s)
}

App.show_tag_picker = (e) => {
  let tags = App.get_tags()
  let input_tags = App.get_input_tags()
  let items = []

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

  NeedContext.show(e.clientX, e.clientY, items)
}

App.insert_tag = (tag) => {
  let el = DOM.el(`#profile_editor_tags`)
  let value = App.get_clean_tag_input()
  el.value = `${value}\n${tag}`.trim()
  el.scrollTop = el.scrollHeight
  el.focus()
}

App.profile_editor_clear = (what) => {
  if (what === `color`) {
    DOM.el(`#profile_editor_${what}`).value = `none`
  }
  else {
    DOM.el(`#profile_editor_${what}`).value = ``
  }
}