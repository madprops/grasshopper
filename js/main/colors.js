App.check_text_color = (item) => {
  function text_enabled (type) {
    return App.get_setting(`text_color_${type}_enabled`)
  }

  function background_enabled (type) {
    return App.get_setting(`background_color_${type}_enabled`)
  }

  let types = [`active`, `pinned`, `normal`, `loaded`, `unloaded`, `playing`, `unread`]

  for (let type of types) {
    item.element.classList.remove(`${type}_tab`)

    if (text_enabled(type)) {
      item.element.classList.add(`colored_text_${type}`)
    }
    else {
      item.element.classList.remove(`colored_text_${type}`)
    }

    if (background_enabled(type)) {
      item.element.classList.add(`colored_background_${type}`)
    }
    else {
      item.element.classList.remove(`colored_background_${type}`)
    }
  }

  if (item.active) {
    item.element.classList.add(`active_tab`)
  }

  if (item.audible) {
    item.element.classList.add(`playing_tab`)
  }

  if (item.unread) {
    item.element.classList.add(`unread_tab`)
  }

  if (item.pinned) {
    item.element.classList.add(`pinned_tab`)
  }
  else {
    item.element.classList.add(`normal_tab`)
  }

  if (item.discarded) {
    item.element.classList.add(`unloaded_tab`)
  }
  else {
    item.element.classList.add(`loaded_tab`)
  }
}

App.apply_color_mode = (item) => {
  let color_mode = App.get_setting(`color_mode`)
  let color = App.get_color(item)

  if (color_mode.includes(`icon`)) {
    let el = DOM.el(`.item_info_color`, item.element)

    if (color) {
      el.innerHTML = ``
      el.append(App.color_icon(color))
      el.classList.remove(`hidden`)

      if (color_mode.includes(`icon_2`)) {
        item.element.classList.add(`color_only_icon`)
      }
      else {
        item.element.classList.remove(`color_only_icon`)
      }
    }
    else {
      el.textContent = ``
      el.classList.add(`hidden`)
    }
  }

  if (color_mode.includes(`border`)) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`border_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`border_${color}`)
    }
  }

  if (color_mode === `background`) {
    for (let color of App.colors) {
      item.element.classList.remove(`colored`)
      item.element.classList.remove(`colored_background`)
      item.element.classList.remove(`background_${color}`)
    }

    if (color) {
      item.element.classList.add(`colored`)
      item.element.classList.add(`colored_background`)
      item.element.classList.add(`background_${color}`)
    }
  }
}

App.color_icon = (color) => {
  return DOM.create(`div`, `color_icon background_${color}`)
}