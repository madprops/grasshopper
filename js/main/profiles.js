App.setup_profile_editor = () => {
  App.create_window({id: `profile_editor`, setup: () => {
    DOM.ev(DOM.el(`#profile_editor_save`), `click`, () => {
      App.profile_editor_save()
    })

    DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
      App.remove_profile()
    })

    let full = DOM.el(`#profile_editor_refresh_url`)

    DOM.ev(full, `click`, () => {
      App.profile_editor_refresh_url()
    })

    DOM.ev(DOM.el(`#profile_editor_url`), `input`, () => {
      App.check_profile_editor()
    })

    DOM.ev(DOM.el(`#profile_editor_close`), `click`, () => {
      App.hide_window()
    })
  },
  colored_top: true})
}

App.show_profile_editor = (o_item) => {
  let item = App.soft_copy_item(o_item)
  App.profile_editor_item = item
  let profile = App.get_profile(item.url)
  let remove = DOM.el(`#profile_editor_remove`)
  let save = DOM.el(`#profile_editor_save`)

  if (profile) {
    save.textContent = `Update`
    DOM.el(`#profile_editor_url`).value = profile.url
    DOM.el(`#profile_editor_title`).value = profile.title
    DOM.el(`#profile_editor_tags`).value = profile.tags.join(`\n`)
    remove.classList.remove(`hidden`)
  }
  else {
    save.textContent = `Save`
    DOM.el(`#profile_editor_url`).value = item.url
    DOM.el(`#profile_editor_title`).value = ``
    DOM.el(`#profile_editor_tags`).value = ``
    remove.classList.add(`hidden`)
  }

  App.show_window(`profile_editor`)
  DOM.el(`#profile_editor_tags`).focus()
  App.check_profile_editor()
}

App.profile_editor_save = () => {
  let title = DOM.el(`#profile_editor_title`).value.trim()
  let url = DOM.el(`#profile_editor_url`).value.trim()
  let tags = App.single_linebreak(DOM.el(`#profile_editor_tags`).value.trim()).split(`\n`)

  if (!url) {
    return
  }

  let c_tags = []

  for (let tag of tags) {
    let t = tag.toLowerCase().trim()

    if (!c_tags.includes(t)) {
      c_tags.push(t)
    }
  }

  c_tags.sort()
  App.profiles = App.profiles.filter(x => !x.url.startsWith(url))
  App.profiles.unshift({url: url, title: title, tags: c_tags})

  if (App.profiles.length > App.max_profiles) {
    App.profiles = App.profiles.slice(0, App.max_profiles)
  }

  App.stor_save_profiles()
  App.apply_profiles(url)
  App.hide_window()
}

App.remove_profile = () => {
  App.show_confirm(`Remove this profile?`, () => {
    let url = DOM.el(`#profile_editor_url`).value.trim()

    if (url) {
      App.profiles = App.profiles.filter(x => !x.url.startsWith(url))
      App.stor_save_profiles()
      App.apply_profiles(url)
      App.refresh_filter(App.active_mode, `title`)
      App.hide_window()
    }
  }, undefined, !App.get_setting(`warn_on_remove_profile`))
}

App.profile_editor_refresh_url = () => {
  DOM.el(`#profile_editor_url`).value = App.profile_editor_item.url
  App.check_profile_editor()
}

App.apply_profiles = (url) => {
  for (let item of App.get_items(`tabs`)) {
    if (item.url.startsWith(url)) {
      App.refresh_tab(item.id)
    }
  }
}

App.get_profile = (item_url) => {
  for (let profile of App.profiles) {
    if (item_url.startsWith(profile.url)) {
      return profile
    }
  }
}

App.remove_all_profiles = () => {
  if (App.profiles.length === 0) {
    App.show_alert(`No tab profiles saved`)
    return
  }

  App.show_confirm(`Remove all tab profiles? (${App.profiles.length})`, () => {
    App.profiles = []
    App.stor_save_profiles()
    App.show_mode(`tabs`)
  })
}

App.get_profile_items = () => {
  let items = []

  items.push({
    text: `New`,
    action: () => {
      App.show_profile_editor({title: ``, url: ``})
    }
  })

  items.push({
    text: `Remove`,
    action: () => {
      App.remove_all_profiles()
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
    App.profiles = json
    App.check_profiles()
    App.stor_save_profiles()
    App.show_window(`tabs`)
  })
}

App.check_profile_editor = () => {
  let url = DOM.el(`#profile_editor_url`)
  let full = DOM.el(`#profile_editor_refresh_url`)

  if (url.value.trim() !== App.profile_editor_item.url) {
    full.classList.remove(`hidden`)
  }
  else {
    full.classList.add(`hidden`)
  }
}

App.check_profiles = () => {
  let changed = false

  for (let profile of App.profiles) {
    if (profile.url === undefined) {
      profile.url = `https://empty.profile`
      changed = true
    }

    if (profile.profile === undefined) {
      profile.profile = ``
      changed = true
    }

    if (profile.tags === undefined) {
      profile.tags = []
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
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    }
  }

  return tags.slice(0, App.max_tag_filters)
}

App.get_tag_items = (mode) => {
  let items = []

  for (let tag of App.get_tags()) {
    items.push({
      text: tag,
      action: () => {
        App.set_filter(mode, `tag: ${tag}`)
      }
    })
  }

  return items
}