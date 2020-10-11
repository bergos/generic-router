import pathToRegexp from 'path-to-regexp'

class Router {
  constructor () {
    this.routes = []
  }

  add ({ path, callback, end }) {
    const rawVars = []
    const exp = pathToRegexp.pathToRegexp(path, rawVars, { end, sensitive: true, strict: true })
    const vars = rawVars.map(raw => raw.name)

    this.routes.push({ exp, vars, callback })
  }

  path (path, callback) {
    this.add({
      path,
      callback,
      end: false
    })
  }

  resource (path, callback) {
    this.add({
      path,
      callback,
      end: true
    })
  }

  async handle (path, context = {}) {
    for (const route of this.routes) {
      const match = route.exp.exec(path)

      if (!match) {
        continue
      }

      const params = match.slice(1).reduce((params, value, index) => {
        params[route.vars[index]] = value

        return params
      }, {})

      const result = await route.callback(path, params, context)

      if (result !== false) {
        return result
      }
    }
  }
}

export default Router
