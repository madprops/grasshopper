App.create_taglist = () => {
  let setting = App.get_setting(`taglist`)
  let taglist = DOM.create(`div`, `taglist hidden`)

  if (setting === `left` || setting === `right`) {
    taglist.classList.add(`hover`)
    taglist.classList.add(setting)
  }
  else {
    taglist.classList.add(`normal`)
  }

  return taglist
}

App.check_taglist = (item) => {
  if (item.mode !== `tabs`) {
    return
  }

  let setting = App.get_setting(`taglist`)

  if (setting === `none`) {
    return
  }

  let taglist = DOM.el(`.taglist`, item.element)
  let mode = App.get_setting(`taglist_mode`)

  if (!App.tagged(item)) {
    taglist.classList.add(`hidden`)
  }
  else {
    taglist.innerHTML = ``
    let tags = App.get_tags(item).slice(0)

    if (App.get_setting(`sort_taglist`)) {
      App.sort_alpha(tags)
    }

    let cls = ``

    if (mode !== `none`) {
      if (setting === `left` || setting === `right`) {
        cls += ` linkbutton`
      }
      else if (setting === `above` || setting === `below`) {
        cls += ` doubleline`
      }
    }

    for (let tag of tags) {
      let item = DOM.create(`div`, `taglist_item${cls}`)
      item.textContent = tag
      taglist.append(item)
    }

    if (App.get_setting(`taglist_add`)) {
      let add = DOM.create(`div`, `taglist_add action`)
      add.textContent = `+`
      add.title = `Add Tag`
      taglist.append(add)
    }

    taglist.classList.remove(`hidden`)
  }
}

App.taglist_filter = (item, tag) => {
  App.filter_tag(item.mode, tag)
}

App.taglist_action = (e, item) => {
  let mode = App.get_setting(`taglist_mode`)
  let tag = e.target.textContent

  if (mode === `none`) {
    return
  }
  else if (mode === `menu`) {
    App.show_taglist_menu(e, item)
  }
  else if (mode === `edit`) {
    App.edit_tag(item, tag)
  }
  else if (mode === `filter`) {
    App.taglist_filter(item, tag)
  }
  else if (mode === `remove`) {
    App.remove_tag(item, tag)
  }
}

App.show_taglist_menu = (e, item) => {
  let items = []
  let tag = e.target.textContent

  items.push({
    text: `Edit`,
    action: () => {
      App.edit_tag(item, tag)
    },
  })

  items.push({
    text: `Filter`,
    action: () => {
      App.filter_tag(item.mode, tag)
    },
  })

  items.push({
    text: `Remove`,
    action: () => {
      App.remove_tag(item, tag)
    },
  })

  App.show_context({items: items, e: e})
}

App.taglist_remove = (e, item) => {
  let tag = e.target.textContent
  App.remove_tag(item, tag)
}

App.taglist_active = () => {
  if (App.get_setting(`taglist`) === `none`) {
    return false
  }

  if (App.get_setting(`taglist_mode`) === `none`) {
    return false
  }

  return true
}

App.taglist_add_active = () => {
  if (App.get_setting(`taglist`) === `none`) {
    return false
  }

  if (!App.get_setting(`taglist_add`)) {
    return false
  }

  return true
}