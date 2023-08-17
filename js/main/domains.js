App.get_domain_props = (setting, item) => {
  if (!item || !item.path) {
    return
  }

  for (let line of App.get_setting(setting)) {
    if (!line.includes(`=`)) {
      return
    }

    try {
      let split = line.split(`=`)
      let domain = split[0].trim()
      let value = split[1].trim()

      if (!domain || !value) {
        continue
      }

      let props = [value]
      let clean = App.format_url(domain)
      clean = App.remove_protocol(clean)

      if (item.path.startsWith(clean)) {
        if (value.includes(`;`)) {
          props = value.split(`;`).map((p) => p.trim())
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

App.domain_theme = (item) => {
  let theme = App.get_domain_props(`domain_themes`, item)

  if (theme) {
    return theme
  }
}