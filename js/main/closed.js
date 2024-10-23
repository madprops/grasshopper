App.setup_closed = () => {
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
      maxResults: App.max_closed,
    })
  }
  catch (err) {
    App.error(err)
    return []
  }

  results = results.filter(x => x.tab)
  let tabs = results.map(x => x.tab)
  return tabs
}

App.closed_action = (args = {}) => {
  let def_args = {
    on_action: true,
    soft: false,
  }

  App.def_args(def_args, args)
  App.select_item({item: args.item, scroll: `nearest_smooth`})

  if (args.on_action) {
    App.on_action(`closed`)
  }

  App.focus_or_open_item(args.item, args.soft)
}

App.reopen_tab = async () => {
  let closed = await App.get_closed()

  if (closed && closed.length) {
    browser.sessions.restore(closed[0].sessionId)
  }
}

App.forget_closed = () => {
  let items = App.get_items(`closed`)

  App.show_confirm({
    message: `Forget closed tabs? (${items.length})`,
    confirm_action: async () => {
      for (let item of items) {
        await browser.sessions.forgetClosedTab(item.window_id, item.session_id)
      }

      App.after_forget()
    },
  })
}

App.forget_closed_item = (item) => {
  let active = App.get_active_items({mode: `closed`, item})

  App.show_confirm({
    message: `Forget closed tabs? (${active.length})`,
    confirm_action: async () => {
      for (let item of active) {
        await browser.sessions.forgetClosedTab(item.window_id, item.session_id)
      }

      App.after_forget()
    },
    force: active.length <= 1,
  })
}

App.after_forget = () => {
  App.show_mode({mode: `closed`, force: true})
}