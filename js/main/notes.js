App.edit_notes = (item) => {
  App.show_input({
    title: `Tab Notes`,
    title_icon: App.notepad_icon,
    button: `Save`,
    action: (text) => {
      let notes = App.single_linebreak(text)
      let active = App.get_active_items({mode: item.mode, item})

      for (let it of active) {
        if (it.rule_notes) {
          if (it.rule_notes === notes) {
            continue
          }
        }

        App.set_notes(it, notes)
      }

      return true
    },
    value: App.get_notes(item),
    autosave: true,
    left: true,
    bottom: true,
    wrap: true,
    readonly: item.mode !== `tabs`,
  })
}

App.remove_item_notes = (item, single = false) => {
  let active

  if (single) {
    active = [item]
  }
  else {
    active = App.get_active_items({mode: item.mode, item})
  }

  if (active.length === 1) {
    let it = active[0]

    if (it.rule_notes && !it.custom_notes) {
      App.domain_rule_message()
      return
    }
  }

  App.remove_edits({
    what: [`notes`],
    items: active,
    text: `notes`,
    force_ask: true,
  })
}

App.remove_notes = (item) => {
  App.remove_item_notes(item, true)
}

App.edit_global_notes = () => {
  App.show_input({
    title: `Global Notes`,
    title_icon: App.notepad_icon,
    button: `Save`,
    action: (text) => {
      App.notes = App.single_linebreak(text)
      App.stor_save_notes()
      return true
    },
    value: App.notes,
    autosave: true,
    left: true,
    bottom: true,
    wrap: true,
  })
}

App.get_noted_items = (mode) => {
  let items = []

  for (let item of App.get_items(mode)) {
    if (App.get_notes(item)) {
      items.push(item)
    }
  }

  return items
}

App.add_note = (item, note) => {
  let current_notes = App.get_notes(item)
  let new_notes = current_notes ? `${current_notes}\n${note}` : note
  App.set_notes(item, new_notes)
}

App.set_notes = (item, notes) => {
  App.apply_edit({
    what: `notes`,
    item,
    value: notes,
    on_change: (value) => {
      App.custom_save(item.id, `notes`, value)
    },
  })
}