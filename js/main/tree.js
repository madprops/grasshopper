App.add_tab_parent = (item) => {
  if (!item.parent) {
    return
  }

  if (App.tab_tree[item.parent] === undefined) {
    let parent = App.get_item_by_id(`tabs`, item.parent)

    if (!parent) {
      return
    }

    App.tab_tree[item.parent] = {}
    App.tab_tree[item.parent].parent = parent
    App.tab_tree[item.parent].nodes = []
  }

  if (!App.node_tab_already_in(item.parent, item)) {
    App.tab_tree[item.parent].nodes.push(item)
    App.update_tab_parent(item.parent)
    App.update_tab_nodes(App.tab_tree[item.parent].nodes)
  }
}

App.remove_tab_parent = (item) => {
  if (App.tab_tree[item.parent]) {
    let nodes = App.tab_tree[item.parent].nodes.filter(it => it !== item)
    nodes = nodes.filter(it => it)
    App.tab_tree[item.parent].nodes = nodes

    if (item.id in App.tab_tree) {
      delete App.tab_tree[item.id]
    }

    App.update_tab_parent(item.parent)
    App.update_tab_nodes(nodes)
  }
  else if (item.id in App.tab_tree) {
    let nodes = App.tab_tree[item.id].nodes
    delete App.tab_tree[item.id]
    App.update_tab_nodes(nodes)
  }
}

App.update_tab_parent = (id) => {
  let tree = App.tab_tree[id]
  App.check_icons(tree.parent)
}

App.update_tab_nodes = (nodes) => {
  for (let node of nodes) {
    App.check_icons(node)
  }
}

App.get_tab_nodes = (item) => {
  let tree = App.tab_tree[item.id]

  if (tree) {
    return tree.nodes
  }

  return []
}

App.tab_has_nodes = (item) => {
  return App.get_tab_nodes(item).length > 0
}

App.tab_has_parent = (item) => {
  for (let id in App.tab_tree) {
    if (App.node_tab_already_in(id, item)) {
      return true
    }
  }

  return false
}

App.focus_parent_tab = (item) => {
  if (!item.parent) {
    return
  }

  let tree = App.tab_tree[item.parent]

  if (tree) {
    App.tabs_action({item: tree.parent})
  }
}

App.close_node_tabs = (item) => {
  let nodes = App.get_tab_nodes(item)
  App.close_tabs({selection: nodes, title: `nodes`})
}

App.get_parent_item = (item) => {
  let tree = App.tab_tree[item.parent]

  if (tree) {
    return tree.parent
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

App.node_tab_already_in = (id, item) => {
  let tree = App.tab_tree[id]

  for (let node of tree.nodes) {
    if (node.id === item.id) {
      return true
    }
  }

  return false
}