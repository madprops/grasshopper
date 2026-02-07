App.talk_to_cael = async () => {
  App.show_textarea({
    title: `Cael`,
    title_icon: App.cael_icon,
    buttons: [
      {
        text: `Close`,
        action: () => {
          App.close_textarea()
        },
      },
      {
        text: `Copy`,
        action: () => {
          // copy whole conversation
          App.close_textarea()
        },
      },
      {
        text: `Send`,
        action: () => {
          //
        },
      },
    ],
  })
}