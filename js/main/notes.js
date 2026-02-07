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
      App.set_global_notes(text)
      return true
    },
    value: App.notes,
    autosave: true,
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

App.apply_notes = (item, notes) => {
  let items = App.get_active_items(item)

  for (let it of items) {
    App.set_notes(it, notes)
  }
}

App.set_global_notes = (notes) => {
  App.notes = App.single_linebreak(notes)
  App.stor_save_notes()
}

App.apply_global_notes = (notes) => {
  App.set_global_notes(notes)
  App.footer_message(`Notes set`)
  App.action_sound()
}

App.add_note = (type, item, note = ``) => {
  function action(note) {
    if (!note) {
      return
    }

    let items = App.get_active_items(item)

    for (let it of items) {
      let current

      if (type.includes(`global`)) {
        current = App.notes
      }
      else {
        current = App.get_notes(it)
      }

      let new_notes

      if (type.startsWith(`append`)) {
        new_notes = current ? `${current}\n${note}` : note
      }
      else if (type.startsWith(`prepend`)) {
        new_notes = current ? `${note}\n${current}` : note
      }

      if (type.includes(`global`)) {
        App.set_global_notes(new_notes)
      }
      else {
        App.set_notes(it, new_notes)
      }

      App.footer_message(`Note added`)
      App.action_sound()
    }
  }

  if (note) {
    action(note)
  }
  else {
    App.show_prompt({
      placeholder: `Note`,
      on_submit: (text) => {
        action(text)
      },
    })
  }
}

App.append_note = (item, note = ``) => {
  App.add_note(`append`, item, note)
}

App.prepend_note = (item, note = ``) => {
  App.add_note(`prepend`, item, note)
}

App.append_global_note = (note = ``) => {
  App.add_note(`append_global`, undefined, note)
}

App.prepend_global_note = (note = ``) => {
  App.add_note(`prepend_global`, undefined, note)
}

App.clear_global_notes = () => {
  if (!App.notes) {
    App.alert(`Global Notes are empty`)
    return
  }

  App.show_confirm({
    message: `Clear Global Notes?`,
    confirm_action: () => {
      App.set_global_notes(``)
    },
  })
}