// Objection v1.0
const Objection = {}
Objection.assigner = `=`
Objection.separator = `;`
Objection.spacing = true
Objection.cast_bool = true
Objection.cast_number = true

// Parse an objection type string into a js object
Objection.parse = (str, args = {}) => {
  args = Objection.def_args(args)
  let obj = {}

  for (let item of Objection.split(str, args.separator)) {
    let [key, value] = Objection.split(item, args.assigner)

    if (!key || !value) {
      continue
    }

    let regex = new RegExp(`\\\\${args.assigner}`)
    value = value.replace(regex, args.assigner)
    regex = new RegExp(`\\\\${args.separator}`)
    value = value.replace(regex, args.separator)

    if (args.cast_bool) {
      if (value === `true`) {
        value = true
      }
      else if (value === `false`) {
        value = false
      }
    }

    if (typeof value === `string`) {
      if (args.cast_number) {
        if (!isNaN(value)) {
          value = Number(value)
        }
      }
    }

    obj[key] = value
  }

  return obj
}

// Transform a js object into an objection type string
Objection.stringify = (obj, args = {}) => {
  args = Objection.def_args(args)
  let items = []

  for (let key in obj) {
    let value = obj[key]
    let escaped = ``

    for (let c of value) {
      if (c === args.assigner) {
        escaped += `\\${c}`
      }
      else if (c === args.separator) {
        escaped += `\\${c}`
      }
      else {
        escaped += c
      }
    }

    let s = args.spacing ? ` ` : ``
    let property = `${key}${s}${args.assigner}${s}${escaped}`
    items.push(property)
  }

  let sep = args.spacing ? ` ${args.separator} ` : args.separator
  return items.join(sep)
}

// Split util
Objection.split = (str, char) => {
  let regstring = `(^|[^\\\\])\\${char}`
  let regex = new RegExp(regstring)
  return str.split(regex).map(x => x.trim()).filter(x => x !== ``)
}

// Fill args object
Objection.def_args = (args) => {
  let def_args = {
    assigner: Objection.assigner,
    separator: Objection.separator,
    spacing: Objection.spacing,
    cast_bool: Objection.cast_bool,
    cast_number: Objection.cast_number,
  }

  return Object.assign(def_args, args)
}