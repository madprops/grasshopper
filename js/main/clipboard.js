App.copy_to_clipboard = (text, what = ``) => {
  if (!text) {
    return
  }

  navigator.clipboard.writeText(text)
  let msg

  if (what) {
    msg = `${what} Copied`
  }
  else {
    msg = `Copied to clipboard`
  }

  App.footer_message(msg)
}

App.read_clipboard = async () => {
  let perm = await App.ask_permission(`clipboardRead`)

  if (!perm) {
    return
  }

  try {
    return await navigator.clipboard.readText()
  }
  catch (err) {
    App.error(`Failed to read clipboard: ${err.message}`)
    return
  }
}