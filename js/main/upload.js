App.upload_image = (args = {}) => {
  let def_args = {
    key_name: `storedImage`,
    category: ``,
    filter: ``,
    command: ``,
    set_function: () => {
      App.set_uploaded_image()
    },
  }

  App.def_args(def_args, args)

  if (App.is_popup()) {
    if (args.category) {
      App.open_settings(args.category, args.filter)
    }
    else if (args.command) {
      App.open_command(args.command)
    }

    return
  }

  let input = document.createElement(`input`)
  input.type = `file`
  input.accept = `image/*`

  input.onchange = async (e) => {
    let file = e.target.files[0]

    if (!file) {
      return
    }

    if (file.size > (100 * 1024 * 1024)) {
      return
    }

    let reader = new FileReader()

    reader.onload = async (event) => {
      let data = event.target.result
      let obj = {}
      obj[args.key_name] = data
      await browser.storage.local.set(obj)
      args.set_function()
    }

    reader.readAsDataURL(file)
  }

  input.click()
}