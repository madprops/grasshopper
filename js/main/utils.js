// Select a single element
App.el = function (query, root = document) {
  return root.querySelector(query)
}

// Select an array of elements
App.els = function (query, root = document) {
  return Array.from(root.querySelectorAll(query))
}

// Centralized function to create debouncers
App.create_debouncer = function (func, delay) {
  let timer
  let obj = {}

  function clear () {
    clearTimeout(timer)
  }

  function run (...args) {
    func(...args)
  }

  obj.call = function (...args) {
    clear()

    timer = setTimeout(function () {
      run(...args)
    }, delay)
  }

  obj.now = function (...args) {
    clear()
    run(...args)
  }

  obj.cancel = function () {
    clear()
  }

  return obj
}

// Create an html element
App.create = function (type, classes = "", id = "") {
  let el = document.createElement(type)

  if (classes) {
    let classlist = classes.split(" ").filter(x => x != "")

    for (let cls of classlist) {
      el.classList.add(cls)
    }
  }

  if (id) {
    el.id = id
  }

  return el
}

// Add an event listener
App.ev = function (element, action, callback, extra) {
  element.addEventListener(action, callback, extra)
}

// Remove protocol like https://
App.remove_protocol = function (url) {
  return url.replace(/^https?:\/\//, "")
}

// Copy text to the clipboard
App.copy_to_clipboard = function (text, feedback = false) {
  navigator.clipboard.writeText(text)

  if (feedback) {
    App.show_feedback("Copied to clipboard")
  }
}

// Get singular or plural
App.plural = function (n, singular, plural) {
  if (n === 1) {
    return `${n.toLocaleString()} ${singular}`
  }
  else {
    return `${n.toLocaleString()} ${plural}`
  }
}

// Get singular or plural without the number
App.plural_2 = function (n, singular, plural) {
  if (n === 1) {
    return singular
  }
  else {
    return plural
  }
}

// Get url hostname
App.get_hostname = function (url) {
  let url_obj

  try {
    url_obj = new URL(url)
  }
  catch (err) {
    return ""
  }

  return url_obj.hostname
}

// Check if urls match
App.urls_equal = function (u1, u2) {
  return App.remove_slashes_end(u1) === App.remove_slashes_end(u2)
}

// Remove slashes from ending
App.remove_slashes_end = function (s) {
  return s.replace(/\/+$/g, "")
}

// Remove hash from url
App.remove_hash = function (url) {
  return url.split("#")[0]
}

// The way to format urls
App.format_url = function (url) {
  return App.remove_slashes_end(App.remove_hash(url))
}

// Capitalize first letter of a string
App.capitalize = function (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Check if item's protocol is http
App.is_http = function (item) {
  return item.protocol === "http:" || item.protocol === "https:"
}

// Get a nice date string
App.nice_date = function (date = Date.now()) {
  return dateFormat(date, "dd/mmm/yy | h:MM:ss tt")
}

// Get item coords
App.get_coords = function (el) {
  let rect = el.getBoundingClientRect()
  return {x: rect.left, y: rect.top}
}

// Get a random int from min to max. Optional exclude a number
App.get_random_int = function (min, max, exclude = undefined) {
  let num = Math.floor(Math.random() * (max - min + 1) + min)

  if (exclude !== undefined) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      }
      else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

// Check if file name is from an image source
App.is_image = function (src) {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.image_extensions.includes(extension)
}

// Check if file name is from a video source
App.is_video = function (src) {
  let extension = App.get_extension(src).toLowerCase()
  return extension && App.video_extensions.includes(extension)
}

// Extract extension from a string
App.get_extension = function (s) {
  if (s.startsWith("http://") || s.startsWith("https://")) {
    let u = new URL(s)
    let url = u.origin + u.pathname
    let url_2 = url.split("//").slice(1).join("//")
    let matches = url_2.match(/\/.*\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }
  else {
    let matches = s.match(/\.(\w+)(?=$|[#?])/)

    if (matches) {
      return matches[1]
    }
  }

  return ""
}

// Get a template
App.get_template = function (id) {
  let template = App.el(`#template_${id}`)

  if (template) {
    return template.innerHTML.trim()
  }
}

// Fill from the left with c character to get to n ammount
App.fillpad = function (s, n, c) {
  let olen = s.length

  for (let i=0; i<(n - olen); i++) {
    s = c + s
  }

  return s
}

App.close_window = function () {
  window.close()

  // Sidebar doesn't close so return to tabs
  if (App.window_mode !== "tabs") {
    App.show_item_window("tabs")
  }
  else {
    if (App.get_filter("tabs")) {
      App.clear_filter("tabs")
    }
  }
}

App.image_extensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"]
App.video_extensions = ["mp4", "webm"]