// Setup tab count
App.setup_tab_count = () => {
  App.update_tab_count_debouncer = App.create_debouncer((item) => {
    App.do_update_tab_count(item)
  }, App.update_tab_count_delay)
}

App.update_tab_count = (item) => {
  App.update_tab_count_debouncer.call(item)
}

// Show the number of tabs from the same domain
App.do_update_tab_count = (item) => {
  App.update_tab_count_debouncer.cancel()

  if (!App.get_setting(`tab_count`)) {
    return
  }

  let hostname = App.get_hostname(item.url)
  let items = App.hostname_items(hostname)

  if (!items.length) {
    return
  }

  let num = items.length

  for (let item of items) {
    let count = DOM.el(`.tab_count`, item.element)
    DOM.show(count)
    count.textContent = num
  }
}

// Get the number of tabs for a given hostname
App.hostname_items = (hostname) => {
  let items = []

  for (let item of App.get_items(`tabs`)) {
    if (App.get_hostname(item.url) === hostname) {
      items.push(item)
    }
  }

  return items
}

App.create_tab_count = () => {
  return DOM.create(`div`, `tab_count item_node hidden`)
}