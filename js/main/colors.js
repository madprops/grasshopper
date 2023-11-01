App.check_text_color = (item) => {
  function text_enabled (type) {
    return App.get_setting(`text_color_${type}_enabled`)
  }

  function background_enabled (type) {
    return App.get_setting(`background_color_${type}_enabled`)
  }

  function proc (type) {
    if (text_enabled(type)) {
      item.element.style.color = App.get_setting(`text_color_${type}`)
    }

    if (background_enabled(type)) {
      item.element.style.backgroundColor = App.get_setting(`background_color_${type}`)
    }
  }

  item.element.style.color = ``
  item.element.style.backgroundColor = ``

  if (false) {
    // Top = Higher Priority
  }
  else if (item.active) {
    proc(`active`)
  }
  else if (item.audible) {
    proc(`playing`)
  }
  else if (item.unread) {
    proc(`unread`)
  }
  else if (item.pinned) {
    proc(`pinned`)
  }
  else if (!item.pinned) {
    proc(`normal`)
  }
  else if (item.discarded) {
    proc(`unloaded`)
  }
  else if (!item.discarded) {
    proc(`loaded`)
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