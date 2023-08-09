App.domain_color = (item) => {
  if (!item || !item.hostname) {
    return
  }

  for (let line of App.get_setting(`domain_colors`)) {
    if (line.includes(`=`)) {
      try {
        let split = line.split(`=`)
        let domain = split[0].trim()
        let color = split[1].trim().toLowerCase()

        if (!domain || !color) {
          continue
        }

        if ((domain === item.hostname) || (App.get_hostname(domain) === item.hostname)) {
          if (App.colors.includes(color)) {
            return color
          }
        }
      }
      catch (err) {
        continue
      }
    }
  }
}

App.domain_icon = (item) => {
  if (!item || !item.hostname) {
    return
  }

  for (let line of App.get_setting(`domain_icons`)) {
    if (line.includes(`=`)) {
      try {
        let split = line.split(`=`)
        let domain = split[0].trim()
        let icon = split[1].trim()

        if (!domain || !icon) {
          continue
        }

        if ((domain === item.hostname) || (App.get_hostname(domain) === item.hostname)) {
          return icon
        }
      }
      catch (err) {
        continue
      }
    }
  }
}