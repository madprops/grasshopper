App.booster_permissions = {
  origins: [
    `<all_urls>`,
  ],
}

App.check_boosted = async () => {
  App.boosted = await browser.permissions.contains(App.booster_permissions)
}

App.booster_shot = async () => {
  if (App.boosted) {
    console.info(`Permissions already granted.`)
    App.alert(`Already boosted!`)
    return
  }

  // Directly request the permission.
  // If already granted, it resolves to true without a prompt.
  let granted = await browser.permissions.request(App.booster_permissions)

  if (granted) {
    // eslint-disable-next-line no-console
    console.info(`Permission granted.`)
    App.alert(`Booster activated 🚀`)
  }
  else {
    // eslint-disable-next-line no-console
    console.info(`Permission denied.`)
    App.alert(`Permission denied 🤯`)
  }

  App.boosted = granted
}