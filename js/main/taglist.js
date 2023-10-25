App.check_taglist = (item) => {
  if (!App.get_setting(`show_taglist`)) {
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
      App.edit_prompt(`tags`, item)
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