App.check_text_color = (item) => {
  function enabled (type) {
    return App.get_setting(`color_${type}_enabled`)
  }

  item.element.classList.remove(`active_tab`)
  item.element.classList.remove(`pinned_tab`)
  item.element.classList.remove(`normal_tab`)
  item.element.classList.remove(`loaded_tab`)
  item.element.classList.remove(`unloaded_tab`)
  item.element.classList.remove(`playing_tab`)
  item.element.classList.remove(`unread_tab`)

  if (false) {
    // Easy ordering
  }
  else if (enabled(`active`) && item.active) {
    item.element.classList.add(`active_tab`)
  }
  else if (enabled(`playing`) && item.audible) {
    item.element.classList.add(`playing_tab`)
  }
  else if (enabled(`unloaded`) && item.discarded) {
    item.element.classList.add(`unloaded_tab`)
  }
  else if (enabled(`unread`) && item.unread) {
    item.element.classList.add(`unread_tab`)
  }
  else if (enabled(`pins`) && item.pinned) {
    item.element.classList.add(`pinned_tab`)
  }
  else if (enabled(`normal`) && !item.pinned) {
    item.element.classList.add(`normal_tab`)
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