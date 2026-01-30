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
  App.upload_image({
    key_name: `storedPhoto`,
    command: `show_photo`,
    set_function: () => {
      App.show_photo()
    },
  })
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