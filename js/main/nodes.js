App.add_tab_opener = (item) => {
  if (!item.opener) {
    return
  }

  if (App.tab_openers[item.opener] === undefined) {
    App.tab_openers[item.opener] = []
  }

  if (!App.tab_openers[item.opener].includes(item.id)) {
    App.tab_openers[item.opener].push(item.id)
    App.update_tab_opener(item.opener)
    App.update_tab_nodes(App.tab_openers[item.opener])
  }
}

App.remove_tab_opener = (item) => {
  if (App.tab_openers[item.opener]) {
    let openers = App.tab_openers[item.opener].filter(x => x !== item.id)
    openers = openers.filter(x => x)
    App.tab_openers[item.opener] = openers
    let nodes = App.tab_openers[item.opener]

    if (item.id in App.tab_openers) {
      delete App.tab_openers[item.id]
    }

    App.update_tab_opener(item.opener)
    App.update_tab_nodes(nodes)
  }
  else if (item.id in App.tab_openers) {
    let nodes = App.tab_openers[item.id]
    delete App.tab_openers[item.id]
    App.update_tab_nodes(nodes)
  }
}

App.update_tab_opener = (id, nodes = []) => {
  let opener = App.get_item_by_id(`tabs`, id)

  if (opener) {
    App.check_icons(opener)
  }
}

App.update_tab_nodes = (nodes) => {
  for (let node_id of nodes) {
    let node = App.get_item_by_id(`tabs`, node_id)

    if (node) {
      App.check_icons(node)
    }
  }
}

App.get_tab_nodes = (item) => {
  let node_ids = App.tab_openers[item.id]

  if (!node_ids) {
    return []
  }

  let items = []

  for (let it of App.get_items(`tabs`)) {
    if (node_ids.includes(it.id)) {
      items.push(it)
    }
  }

  return items
}

App.tab_has_nodes = (item) => {
  return App.get_tab_nodes(item).length > 0
}

App.tab_has_opener = (item) => {
  for (let id in App.tab_openers) {
    if (App.tab_openers[id].includes(item.id)) {
      return true
    }
  }

  return false
}

App.focus_opener_tab = (item) => {
  if (!item.opener) {
    return
  }

  let items = App.get_items(`tabs`)

  for (let it of items) {
    if (it.id === item.opener) {
      App.tabs_action({item: it})
      break
    }
  }
}

App.close_nodes = (item) => {
  let nodes = App.get_tab_nodes(item)
  App.close_tabs({selection: nodes, title: `nodes`})
}

App.get_opener_item = (item) => {
  for (let tab of App.get_items(`tabs`)) {
    if (tab.id === item.opener) {
      return tab
    }
  }
}

App.go_to_opener = (opener) => {
  let item = App.get_opener_item(opener)

  if (item) {
    App.tabs_action({item})
  }
}