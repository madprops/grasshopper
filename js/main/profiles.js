App.setup_profile_editor = () => {
  App.create_window({id: `profile_editor`, setup: () => {
    DOM.ev(DOM.el(`#profile_editor_save`), `click`, () => {
      App.profile_editor_save()
    })

    DOM.ev(DOM.el(`#profile_editor_remove`), `click`, () => {
      App.remove_profile()
    })

    DOM.ev(DOM.el(`#profile_editor_close`), `click`, () => {
      App.hide_window()
    })
  },
  colored_top: true})
}

App.show_profile_editor = (item) => {
  let items = App.get_active_items(item.mode, item)

  if (items.length === 0) {
    return
  }

  App.profile_editor_items = []

  for (let it of items) {
    App.profile_editor_items.push(App.soft_copy_item(it))
  }

  let remove = DOM.el(`#profile_editor_remove`)
  let save = DOM.el(`#profile_editor_save`)
  let profile, single

  if (items.length === 1) {
    profile = App.get_profile(item.url)
    DOM.el(`#profile_editor_title_container`).classList.remove(`hidden`)
    single = true
  }
  else {
    DOM.el(`#profile_editor_title_container`).classList.add(`hidden`)
    single = false
  }

  if (single) {
    if (profile) {
      save.textContent = `Update`
      DOM.el(`#profile_editor_title`).value = profile.title
      DOM.el(`#profile_editor_tags`).value = profile.tags.join(`\n`)
      remove.classList.remove(`hidden`)
    }
    else {
      save.textContent = `Save`
      DOM.el(`#profile_editor_title`).value = ``
      DOM.el(`#profile_editor_tags`).value = ``
      remove.classList.add(`hidden`)
    }
  }
  else {
    save.textContent = `Save`
    DOM.el(`#profile_editor_tags`).value = ``
    remove.classList.remove(`hidden`)
  }

  App.show_window(`profile_editor`)
  DOM.el(`#profile_editor_tags`).focus()
}

App.profile_editor_save = () => {
  if (App.profile_editor_items.length === 0) {
    return
  }

  let title = DOM.el(`#profile_editor_title`).value.trim()
  let tags = App.single_linebreak(DOM.el(`#profile_editor_tags`).value.trim()).split(`\n`)
  let c_tags = []

  for (let tag of tags) {
    let t = tag.toLowerCase().trim()

    if (!c_tags.includes(t)) {
      c_tags.push(t)
    }
  }

  c_tags.sort()
  let single = App.profile_editor_items.length === 1
  let urls = []

  if (single) {
    let item = App.profile_editor_items[0]
    App.profiles = App.profiles.filter(x => x.url !== item.url)
    App.profiles.unshift({url: item.url, title: title, tags: c_tags.slice(0)})
    urls.push(item.url)
  }
  else {
    for (let item of App.profile_editor_items) {
      let profile = App.get_profile(item.url)

      if (profile) {
        App.profiles = App.profiles.filter(x => x.url !== profile.url)
        let n_tags = []

        for (let tag of c_tags) {
          if (!n_tags.includes(tag)) {
            n_tags.push(tag)
          }
        }

        for (let tag of profile.tags) {
          if (!n_tags.includes(tag)) {
            n_tags.push(tag)
          }
        }

        App.profiles.unshift({url: profile.url, title: profile.title, tags: n_tags.slice(0)})
        urls.push(profile.url)
      }
      else {
        App.profiles = App.profiles.filter(x => x.url !== item.url)
        App.profiles.unshift({url: item.url, title: item.title, tags: c_tags.slice(0)})
        urls.push(item.url)
      }
    }
  }

  if (App.profiles.length > App.max_profiles) {
    App.profiles = App.profiles.slice(0, App.max_profiles)
  }

  App.stor_save_profiles()
  App.hide_window()

  for (let url of urls) {
    App.apply_profiles(url)
  }
}

App.remove_profile = () => {
  let items = App.profile_editor_items

  App.show_confirm(`Remove profiles? (${items.length})`, () => {
    for (let item of items) {
      App.profiles = App.profiles.filter(x => x.url !== item.url)
      App.apply_profiles(item.url)
    }

    App.stor_save_profiles()
    App.refresh_filter(App.active_mode, `title`)
    App.hide_window()
  }, undefined, !App.get_setting(`warn_on_remove_profiles`))
}

App.apply_profiles = (url) => {
  for (let item of App.get_items(`tabs`)) {
    if (item.url === url) {
      App.refresh_tab(item.id)
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

App.remove_all_profiles = () => {
  if (App.profiles.length === 0) {
    App.show_alert(`No profiles saved`)
    return
  }

  App.show_confirm(`Remove all profiles? (${App.profiles.length})`, () => {
    App.profiles = []
    App.stor_save_profiles()
    App.show_mode(`tabs`)
  })
}

App.get_profile_items = () => {
  let items = []

  items.push({
    text: `Clear`,
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