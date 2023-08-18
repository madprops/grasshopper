App.setup_closed = () => {
  App.closed_actions = [
    {text: `Forget All`, action: () => {
      App.forget_all_closed_tabs()
    }},
  ]

  App.setup_item_window(`closed`)

  browser.sessions.onChanged.addListener(() => {
    if (App.active_mode === `closed`) {
      App.closed_changed = true
    }
  })
}

App.get_closed = async () => {
  App.getting(`closed`)
  let results

  try {
    results = await browser.sessions.getRecentlyClosed({
      maxResults: App.max_closed
    })
  }
  catch (err) {
    App.error(err)
    return []
  }

  return results.map(x => x.tab)
}

App.closed_action = (item) => {
  App.focus_or_open_item(item)
  App.after_action(`closed`)
}

App.closed_action_alt = (item) => {
  App.open_items(item, true, false)
}

App.undo_close_tab = async () => {
  let closed = await App.get_closed()

  if (closed && closed.length > 0) {
    browser.sessions.restore(closed[0].sessionId)
  }
}

App.forget_all_closed_tabs = () => {
  let items = App.get_items(`closed`)

  App.show_confirm(`Forget all closed tabs? (${items.length})`, async () => {
    for (let item of items) {
      await browser.sessions.forgetClosedTab(item.window_id, item.session_id)
    }

    App.after_forget()
  })
}

App.forget_closed_tabs = (item) => {
  let active = App.get_active_items(`closed`, item)

  App.show_confirm(`Forget closed tabs? (${active.length})`, async () => {
    for (let item of active) {
      await browser.sessions.forgetClosedTab(item.window_id, item.session_id)
    }

    App.after_forget()
  }, undefined, active.length <= 1)
}

App.after_forget = () => {
  App.show_mode(`closed`, undefined, true)
}