App.check_taglist = (item) => {
  if (App.get_setting(`taglist`) === `none`) {
    return
  }

  let taglist = DOM.el(`.item_taglist`, item.element)

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
  else if (mode === `filter`) {
    App.taglist_filter(item, tag)
  }
  else if (mode === `edit`) {
    App.edit_tags(item)
  }
  else if (mode === `add`) {
    App.add_tags(item)
  }
  else if (mode === `remove`) {
    App.remove_tag(item, tag)
  }
}

App.show_taglist_menu = (e, item) => {
  let items = []
  let tag = e.target.textContent

  items.push({
    text: `Filter Tag`,
    action: () => {
      App.set_filter({mode: item.mode, text: `tag: ${tag}`})
    },
  })

  items.push({
    text: `Edit Tags`,
    action: () => {
      App.edit_tags(item)
    },
  })

  items.push({
    text: `Add Tag`,
    action: () => {
      App.add_tags(item)
    },
  })

  items.push({
    text: `Remove`,
    action: () => {
      App.remove_tag(item, tag)
    },
  })

  items.push({
    text: `Remove All`,
    action: () => {
      App.remove_item_tags(item)
    },
  })

  App.show_center_context(items, e)
}

App.taglist_remove = (e, item) => {
  let tag = e.target.textContent
  App.remove_tag(item, tag)
}