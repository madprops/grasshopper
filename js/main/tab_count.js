App.setup_tab_count = () => {
  App.update_tab_count_debouncer = App.create_debouncer(() => {
    App.do_update_tab_count()
  }, App.update_tab_count_delay)
}

App.update_tab_count = () => {
  App.update_tab_count_debouncer.call()
}

App.do_update_tab_count = () => {
  App.update_tab_count_debouncer.cancel()

  if (!App.get_setting(`tab_count`)) {
    return
  }

  let domains = App.group_tabs_by_domain()

  for (let domain in domains) {
    let items = domains[domain]

    if (!items.length) {
      return
    }

    let num = items.length

    for (let item of items) {
      if (!item.element) {
        continue
      }

      if (item.header) {
        continue
      }

      let count = DOM.el(`.tab_count`, item.element)

      if (count) {
        if (num > 1) {
          count.textContent = num
          DOM.show(count)
        }
        else {
          DOM.hide(count)
        }
      }
    }
  }
}

App.create_tab_count = () => {
  return DOM.create(`div`, `tab_count item_node hidden`)
}