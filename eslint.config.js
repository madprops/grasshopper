module.exports = [
  {
    rules: {
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "backtick"],
      "no-console": "error",
    },
    languageOptions: {
      globals: {
        App: "writable",
        DOM: "writable",
        Addlist: "writable",
        NiceGesture: "writable",
        NeedContext: "writable",
        Menubutton: "writable",
        ColorLib: "writable",
        AColorPicker: "writable",
        dateFormat: "writable",
        jdenticon: "writable",
        browser: "writable",
      }
    }
  }
]