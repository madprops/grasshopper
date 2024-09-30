App.add_tab_parent = (item) => {
  if (!item.parent) {
    return
  }

  if (App.tab_tree[item.parent] === undefined) {
    App.tab_tree[item.parent] = []
  }

  if (!App.tab_tree[item.parent].includes(item.id)) {
    App.tab_tree[item.parent].push(item.id)
    App.update_tab_parent(item.parent)
    App.update_tab_nodes(App.tab_tree[item.parent])
  }
}

App.remove_tab_parent = (item) => {
  if (App.tab_tree[item.parent]) {
    let parents = App.tab_tree[item.parent].filter(x => x !== item.id)
    parents = parents.filter(x => x)
    App.tab_tree[item.parent] = parents
    let nodes = App.tab_tree[item.parent]

    if (item.id in App.tab_tree) {
      delete App.tab_tree[item.id]
    }

    App.update_tab_parent(item.parent)
    App.update_tab_nodes(nodes)
  }
  else if (item.id in App.tab_tree) {
    let nodes = App.tab_tree[item.id]
    delete App.tab_tree[item.id]
    App.update_tab_nodes(nodes)
  }
}

App.update_tab_parent = (id, nodes = []) => {
  let parent = App.get_item_by_id(`tabs`, id)

  if (parent) {
    App.check_icons(parent)
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
  let node_ids = App.tab_tree[item.id]

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

App.tab_has_parent = (item) => {
  for (let id in App.tab_tree) {
    if (App.tab_tree[id].includes(item.id)) {
      return true
    }
  }

  return false
}

App.focus_parent_tab = (item) => {
  if (!item.parent) {
    return
  }

  let items = App.get_items(`tabs`)

  for (let it of items) {
    if (it.id === item.parent) {
      App.tabs_action({item: it})
      break
    }
  }
}

App.close_node_tabs = (item) => {
  let nodes = App.get_tab_nodes(item)
  App.close_tabs({selection: nodes, title: `nodes`})
}

App.get_parent_item = (item) => {
  for (let tab of App.get_items(`tabs`)) {
    if (tab.id === item.parent) {
      return tab
    }
  }
}

App.go_to_parent = (parent) => {
  let item = App.get_parent_item(parent)

  if (item) {
    App.tabs_action({item})
  }
}

App.close_parent_tab = (item) => {
  let parent = App.get_parent_item(item)

  if (parent) {
    App.close_tabs({selection: [parent], title: `parent`})
  }
}