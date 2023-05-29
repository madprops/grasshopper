App.setup_title_editor = () => {
  App.create_window({id: `title_editor`, setup: () => {
    DOM.ev(DOM.el(`#title_editor_save`), `click`, () => {
      App.title_editor_save()
    })

    DOM.ev(DOM.el(`#title_editor_remove`), `click`, () => {
      App.remove_title()
    })

    let full = DOM.el(`#title_editor_refresh_url`)

    DOM.ev(full, `click`, () => {
      App.title_editor_refresh_url()
    })

    DOM.ev(DOM.el(`#title_editor_url`), `input`, () => {
      App.check_title_editor()
    })

    DOM.ev(DOM.el(`#title_editor_close`), `click`, () => {
      App.hide_current_window()
    })
  },
  colored_top: true,
  on_hide: () => {
    App.show_last_window()
  }})
}

App.show_title_editor = (item) => {
  App.title_editor_item = item
  let title = item.title
  let title_match = App.get_title(item.url)
  let remove = DOM.el(`#title_editor_remove`)
  let save = DOM.el(`#title_editor_save`)
  let url = item.url

  if (title_match) {
    remove.classList.remove(`hidden`)
    save.textContent = `Update`
    title = title_match.title
    url = title_match.url
  }
  else {
    remove.classList.add(`hidden`)
    save.textContent = `Save`
  }

  DOM.el(`#title_editor_url`).value = url
  DOM.el(`#title_editor_title`).value = title
  App.show_window(`title_editor`)
  DOM.el(`#title_editor_title`).focus()
  App.check_title_editor()
}

App.title_editor_save = () => {
  let title = DOM.el(`#title_editor_title`).value.trim()
  let url = DOM.el(`#title_editor_url`).value.trim()

  if (!title || !url) {
    return
  }

  App.titles = App.titles.filter(x => !x.url.startsWith(url))
  App.titles.unshift({url: url, title: title})

  if (App.titles.length > App.max_titles) {
    App.titles = App.titles.slice(0, App.max_titles)
  }

  App.stor_save_titles()
  App.apply_titles(url)
  App.show_last_window()
}

App.remove_title = () => {
  App.show_confirm(`Remove this title?`, () => {
    let url = DOM.el(`#title_editor_url`).value.trim()

    if (url) {
      App.titles = App.titles.filter(x => !x.url.startsWith(url))
      App.stor_save_titles()
      App.apply_titles(url)
      App.refresh_filter(App.last_window_mode, `title`)
      App.show_last_window()
    }
  }, undefined, !App.get_setting(`warn_on_untitle`))
}

App.title_editor_refresh_url = () => {
  DOM.el(`#title_editor_url`).value = App.title_editor_item.url
  App.check_title_editor()
}

App.apply_titles = (url) => {
  for (let item of App.get_items(`tabs`)) {
    if (item.url.startsWith(url)) {
      App.refresh_tab(item.id)
    }
  }
}

App.get_title = (item_url) => {
  for (let title of App.titles) {
    if (item_url.startsWith(title.url)) {
      return title
    }
  }
}

App.remove_all_titles = () => {
  if (App.titles.length === 0) {
    App.show_alert(`No titles saved`)
    return
  }

  App.show_confirm(`Remove all titles? (${App.titles.length})`, () => {
    App.titles = []
    App.stor_save_titles()
    App.show_item_window(`tabs`)
  })
}

App.get_title_items = () => {
  let items = []

  items.push({
    text: `Remove`,
    action: () => {
      App.remove_all_titles()
    }
  })

  items.push({
    text: `Export`,
    action: () => {
      App.export_titles()
    }
  })

  items.push({
    text: `Import`,
    action: () => {
      App.import_titles()
    }
  })

  return items
}

App.export_titles = () => {
  App.show_textarea(App.export_string, JSON.stringify(App.titles, null, 2))
}

App.import_titles = () => {
  App.show_input(App.import_string, `Import`, (text) => {
    if (!text) {
      return
    }

    let json

    try {
      json = JSON.parse(text)
    }
    catch (err) {
      App.show_alert(`Invalid JSON`)
      return
    }

    if (json) {
      App.show_confirm(`Use this data?`, () => {
        App.titles = json
        App.check_titles()
        App.stor_save_titles()
        App.show_window(`tabs`)
      })
    }
  })
}

App.check_title_editor = () => {
  let url = DOM.el(`#title_editor_url`)
  let full = DOM.el(`#title_editor_refresh_url`)

  if (url.value.trim() !== App.title_editor_item.url) {
    full.classList.remove(`hidden`)
  }
  else {
    full.classList.add(`hidden`)
  }
}

App.check_titles = () => {
  let changed = false

  for (let title of App.titles) {
    if (title.url === undefined) {
      title.url = `https://empty.title`
      changed = true
    }

    if (title.title === undefined) {
      title.title = `Empty`
      changed = true
    }
  }

  if (changed) {
    App.stor_save_titles()
  }
}