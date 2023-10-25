App.check_taglist = (item) => {
  if (App.get_setting(`taglist`) === `none`) {
    return
  }

  let taglist = DOM.el(`.item_taglist`, item.element)

  if (!item.custom_tags.value || !item.custom_tags.value.length) {
    taglist.classList.add(`hidden`)
  }
  else {
    taglist.innerHTML = ``

    for (let tag of item.custom_tags.value) {
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
    text: `Remove`,
    action: () => {
      App.remove_tag(item, tag)
    },
  })

  App.show_center_context(items, e)
}