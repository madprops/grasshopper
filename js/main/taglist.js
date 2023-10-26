App.create_taglist = () => {
  return DOM.create(`div`, `taglist hidden`)
}

App.check_taglist = (item) => {
  if (App.get_setting(`taglist`) === `none`) {
    return
  }

  let taglist = DOM.el(`.taglist`, item.element)

  if (!item.custom_tags || !item.custom_tags.length) {
    taglist.classList.add(`hidden`)
  }
  else {
    taglist.innerHTML = ``

    for (let tag of item.custom_tags) {
      let item = DOM.create(`div`, `taglist_item`)
      item.textContent = tag
      taglist.append(item)
    }

    let plus = DOM.create(`div`, `taglist_add`)
    plus.textContent = `+`
    plus.title = `Add Tag`
    taglist.append(plus)
    taglist.classList.remove(`hidden`)
  }
}

App.taglist_filter = (item, tag) => {
  App.set_filter({mode: item.mode, text: `tag: ${tag}`})
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
      App.set_filter({mode: item.mode, text: `tag: ${tag}`})
    },
  })

  items.push({
    text: `Remove`,
    action: () => {
      App.remove_tag(item, tag)
    },
  })

  App.show_center_context(items, e)
}

App.taglist_remove = (e, item) => {
  let tag = e.target.textContent
  App.remove_tag(item, tag)
}