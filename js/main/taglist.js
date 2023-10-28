App.create_taglist = () => {
  return DOM.create(`div`, `taglist hidden`)
}

App.check_taglist = (item) => {
  if (App.get_setting(`taglist`) === `none`) {
    return
  }

  let taglist = DOM.el(`.taglist`, item.element)
  let mode = App.get_setting(`taglist_mode`)

  if (!App.tab_has_tags(item)) {
    taglist.classList.add(`hidden`)
  }
  else {
    taglist.innerHTML = ``
    let item_cls = `taglist_item`

    if (mode !== `none`) {
      item_cls += ` action`
    }

    console.log(App.get_tags(item))
    for (let tag of App.get_tags(item)) {
      let item = DOM.create(`div`, item_cls)
      item.textContent = tag
      taglist.append(item)
    }

    if (mode !== `none`) {
      let plus = DOM.create(`div`, `taglist_add action`)
      plus.textContent = `+`
      plus.title = `Add Tag`
      taglist.append(plus)
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