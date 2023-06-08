// Centralized function to create debouncers
App.create_debouncer = (func, delay) => {
  return (() => {
    let timer

    return (...args) => {
      clearTimeout(timer)

      timer = setTimeout(() => {
        func(...args)
      }, delay)
    }
  })()
}

// Get local storage object
App.get_local_storage = (ls_name) => {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = JSON.parse(localStorage.getItem(ls_name))
    }
    catch (err) {
      localStorage.removeItem(ls_name)
      obj = null
    }
  }
  else {
    obj = null
  }

  return obj
}

// Save local storage object
App.save_local_storage = (ls_name, obj) => {
  localStorage.setItem(ls_name, JSON.stringify(obj))
}

// Get a nice date string
App.nice_date = (date = Date.now()) => {
  return dateFormat(date, `ddd - dd/mmm/yy - h:MM tt`)
}