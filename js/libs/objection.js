// Objection v1.0

// This is a simple library to add parsing for simple objects
// For example: let str = `name = Swordfish ; level = 5 ; equipped = true`
// You can do: let obj = Objection.parse(str)
// Will be parsed into {name: `Swordfish`, level: 5, equipped: true}
// It auto casts numbers and booleans
// It's meant to be used in single lines
// It uses = to assign values
// Properties are separated by semicolons
// These can be configured by changing the constants below

const Objection = {}
Objection.assigner = `=`
Objection.separator = `;`

// Parse an objection type string into a js object
Objection.parse = (str) => {
  let obj = {}

  for (let item of Objection.split(str, Objection.separator)) {
    let [key, value] = Objection.split(item, Objection.assigner)

    if (!key || !value) {
      continue
    }

    if (value === `true`) {
      value = true
    }
    else if (value === `false`) {
      value = false
    }
    else if (!isNaN(value)) {
      value = Number(value)
    }

    obj[key] = value
  }

  return obj
}

// Transform a js object into an objection type string
Objection.stringify = (obj) => {
  let items = []

  for (let key in obj) {
    items.push(`${key} = ${obj[key]}`)
  }

  let str = items.join(` ${Objection.separator} `)
  return str
}

// Split util
Objection.split = (str, char) => {
  return str.split(char).map(x => x.trim())
}