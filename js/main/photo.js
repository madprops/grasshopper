App.show_photo = async () => {
  let image = await App.get_photo()

  App.show_textarea({
    title: `Photo`,
    title_icon: App.photo_icon,
    image,
    only_image: true,
    image_size: `big`,
    buttons: [
      {
        text: `Change`,
        action: () => {
          App.upload_photo()
          App.close_textarea()
        },
      },
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
    ],
  })
}

App.upload_photo = () => {
  let input = document.createElement(`input`)
  input.type = `file`
  input.accept = `image/*`

  input.onchange = async (e) => {
    let file = e.target.files[0]

    if (!file) {
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      return
    }

    let reader = new FileReader()

    reader.onload = async (event) => {
      let data = event.target.result
      await browser.storage.local.set({storedPhoto: data})
      App.show_photo()
    }

    reader.readAsDataURL(file)
  }

  input.click()
}

App.get_photo = async () => {
  try {
    let result = await browser.storage.local.get(`storedPhoto`)

    if (result.storedPhoto) {
      return result.storedPhoto
    }

    return null
  }
  catch (error) {
    return null
  }
}