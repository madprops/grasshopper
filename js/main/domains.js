App.get_domain_props = (setting, item) => {
  if (!item || !item.path) {
    return
  }

  for (let line of App.get_setting(setting)) {
    if (line.includes(`=`)) {
      try {
        let split = line.split(`=`)
        let domain = split[0].trim()
        let prop_1 = split[1].trim()
        let props = [prop_1]

        if (!domain) {
          continue
        }

        let clean = App.format_url(domain)
        clean = App.remove_protocol(clean)

        if (item.path.startsWith(clean)) {
          if (prop_1.includes(`;`)) {
            props = prop_1.split(`;`).map((p) => p.trim())
          }

          return props
        }
      }
      catch (err) {
        App.log(err, `error`)
        continue
      }
    }
  }
}

App.domain_tags = (item) => {
  let props = App.get_domain_props(`domain_tags`, item)

  if (props) {
    return props
  }
}

App.domain_color = (item) => {
  let props = App.get_domain_props(`domain_colors`, item)

  if (props && App.colors.includes(props[0].toLowerCase())) {
    return props[0]
  }
}

App.domain_icon = (item) => {
  let props = App.get_domain_props(`domain_icons`, item)

  if (props) {
    return props[0]
  }
}

App.domain_title = (item) => {
  let props = App.get_domain_props(`domain_titles`, item)

  if (props) {
    return props[0]
  }
}