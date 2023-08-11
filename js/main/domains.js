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
        let prop_2, prop_3

        if (prop_1.includes(`;`)) {
          let split_2 = prop_1.split(`;`)
          prop_1 = split_2[0].trim()
          prop_2 = split_2[1].trim()

          if (split_2.length > 2) {
            prop_3 = split_2[2].trim()
          }
        }

        if (!domain || !prop_1) {
          continue
        }

        let clean = App.format_url(domain)
        clean = App.remove_protocol(clean)

        if (item.path.startsWith(clean)) {
          return {
            prop_1: prop_1,
            prop_2: prop_2,
            prop_3: prop_3,
          }
        }
      }
      catch (err) {
        continue
      }
    }
  }
}

App.domain_color = (item) => {
  let color = App.get_domain_props(`domain_colors`, item)

  if (color && App.colors.includes(color.prop_1.toLowerCase())) {
    return color.prop_1
  }
}

App.domain_icon = (item) => {
  let icon = App.get_domain_props(`domain_icons`, item)

  if (icon) {
    return icon.prop_1
  }
}