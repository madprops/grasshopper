App.get_tab_clusters = (remove_first = false) => {
  let items = App.get_items(`tabs`)

  let grouped = items
    .reduce((acc, item) => {
      let hostname = item.hostname || `unknown`
      let existing = acc.find(group => (group.length > 0) && (group[0].hostname === hostname))

      if (existing) {
        existing.push(item)
      }
      else {
        acc.push([item])
      }

      return acc
    }, [])
    .filter(group => group.length >= App.get_setting(`min_cluster_size`))

  if (remove_first) {
    grouped = grouped.map(group => {
      if (group.length > 1) {
        return group.slice(1)
      }

      return []
    }).filter(group => group.length > 0)
  }

  let tabs = grouped.flat()
  return App.remove_headers(tabs)
}

App.show_tab_clusters = (e) => {
  App.show_tab_list(`clusters`, e)
}