const App = {}

App.browser = () => {
  let api_type = typeof browser

  if (api_type !== `undefined`) {
    return browser
  }

  else {
    return chrome
  }
}

export {App}