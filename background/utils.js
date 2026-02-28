const App = {}

App.browser = () => {
  let api_type = typeof browser

  if (api_type !== `undefined`) {
    return browser
  }

  // eslint-disable-no-undef
  return chrome
}

App.print = (msg) => {
  // eslint-disable-next-line no-console
  console.info(msg)
}

App.debouncer = (func, delay) => {
  if (typeof func !== `function`) {
    App.error(`Invalid debouncer function`)
    return
  }

  if (!delay) {
    App.error(`Invalid debouncer delay`)
    return
  }

  let timer
  let obj = {}

  function clear() {
    clearTimeout(timer)
  }

  function run(...args) {
    func(...args)
  }

  obj.call = (...args) => {
    clear()

    timer = setTimeout(() => {
      run(...args)
    }, delay)
  }

  obj.now = (...args) => {
    clear()
    run(...args)
  }

  obj.cancel = () => {
    clear()
  }

  return obj
}

export {App}