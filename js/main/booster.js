App.booster_shot = async () => {
  let permissions_to_request = {
    origins: [
      `<all_urls>`,
    ],
  }

  // Directly request the permission.
  // If already granted, it resolves to true without a prompt.
  let granted = await browser.permissions.request(permissions_to_request)

  if (granted) {
    // eslint-disable-next-line no-console
    console.info(`Permission granted.`)
  }
  else {
    // eslint-disable-next-line no-console
    console.info(`Permission denied.`)
  }

  App.speech(`Booster activated`)
}