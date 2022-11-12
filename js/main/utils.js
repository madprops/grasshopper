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
  return (function () {
    let timer

    return function (...args) {
      clearTimeout(timer)

      timer = setTimeout(function () {
        func(...args)
      }, delay)
    }
  })()
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
App.copy_to_clipboard = function (text) {
  navigator.clipboard.writeText(text)
}

// Get singular or plural
App.plural = function (n, singular, plural) {
  if (n === 1) {
    return `${n.toLocaleString()} ${singular}`
  } else {
    return `${n.toLocaleString()} ${plural}`
  }
}

// Get url hostname
App.get_hostname = function (url) {
  let url_obj

  try {
    url_obj = new URL(url)
  } catch (err) {
    return ""
  }

  return url_obj.hostname
}

// Wrap select for extra functionality
App.wrap_select = function (select, on_change, max = -1) {
  select.addEventListener("wheel", function(e) {
    e.preventDefault()

    if (this.hasFocus) {
      return
    }

    let index
    let max_length = max > -1 ? max : this.length
    
    if (e.deltaY < 0) {
      if (this.selectedIndex === 0) {
        return
      } else {
        index = this.selectedIndex - 1
      }
    } else if (e.deltaY > 0) {
      if (this.selectedIndex === max_length - 1) {
        return
      } else {
        index = this.selectedIndex + 1
      }
    }

    this.selectedIndex = index
    on_change(select)
  })
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