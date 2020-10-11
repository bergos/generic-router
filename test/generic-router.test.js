import { deepStrictEqual, strictEqual } from 'assert'
import mocha from 'mocha'
import Router from '../index.js'

const { describe, it } = mocha

describe('generic-router', () => {
  it('should be a constructor', () => {
    strictEqual(typeof Router, 'function')
  })

  it('should have an array of routes', () => {
    const router = new Router()

    strictEqual(Array.isArray(router.routes), true)
  })

  describe('path', () => {
    it('should be a method', () => {
      const router = new Router()

      strictEqual(typeof router.path, 'function')
    })

    it('should add a route to routes', () => {
      const router = new Router()

      router.path('/test', () => {})

      strictEqual(router.routes.length, 1)
    })

    it('should add a route with the given callback', () => {
      const callback = () => {}
      const router = new Router()

      router.path('/test', callback)

      strictEqual(router.routes[0].callback, callback)
    })

    it('should add a route with a RegExp that matches any resource in the given path', () => {
      const router = new Router()

      router.path('/test', () => {})

      strictEqual(router.routes[0].exp.source, '^\\/test(?=[\\/#\\?]|[]|$)')
    })

    it('should add a route with the given variables', () => {
      const router = new Router()

      router.path('/test/:id/:group', () => {})

      deepStrictEqual(router.routes[0].vars, ['id', 'group'])
    })
  })

  describe('resource', () => {
    it('should be a method', () => {
      const router = new Router()

      strictEqual(typeof router.resource, 'function')
    })

    it('should add a route to routes', () => {
      const router = new Router()

      router.resource('/test', () => {})

      strictEqual(router.routes.length, 1)
    })

    it('should add a route with the given callback', () => {
      const callback = () => {}
      const router = new Router()

      router.resource('/test', callback)

      strictEqual(router.routes[0].callback, callback)
    })

    it('should add a route with a RegExp that matches only the given resource', () => {
      const router = new Router()

      router.resource('/test', () => {})

      strictEqual(router.routes[0].exp.source, '^\\/test$')
    })

    it('should add a route with the given variables', () => {
      const router = new Router()

      router.resource('/test/:id/:group')

      deepStrictEqual(router.routes[0].vars, ['id', 'group'])
    })
  })

  describe('handle', () => {
    it('should be a method', () => {
      const router = new Router()

      strictEqual(typeof router.handle, 'function')
    })

    it('should call the callback of a matching route', async () => {
      let called = false
      const path = '/test'
      const router = new Router()

      router.resource(path, () => {
        called = true
      })

      await router.handle(path)

      strictEqual(called, true)
    })

    it('should handle matching routes while the callbacks return false', async () => {
      let count = 0
      const path = '/test'
      const router = new Router()

      router.resource(path, () => {
        count++

        return false
      })

      router.resource(path, () => {
        count++

        return false
      })

      router.resource(path, () => {
        count++
      })

      await router.handle(path)

      strictEqual(count, 3)
    })

    it('should ignore routes that don\'t match', async () => {
      let called = false
      const path = '/test'
      const router = new Router()

      router.resource(`${path}/1`, () => {
        called = true
      })

      router.path(`${path}/1`, () => {
        called = true
      })

      await router.handle(path)

      strictEqual(called, false)
    })

    it('should call the callback with the handled path', async () => {
      let called = false
      const path = '/test'
      const calledWith = `${path}/1`
      const router = new Router()

      router.path(path, path => {
        called = path
      })

      await router.handle(calledWith)

      strictEqual(called, calledWith)
    })

    it('should call the callback with extracted variables', async () => {
      let called = false
      const path = '/test/:id/:group'
      const router = new Router()

      router.path(path, (path, params) => {
        called = params
      })

      await router.handle('/test/123/abc')

      deepStrictEqual(called, { id: '123', group: 'abc' })
    })

    it('should forward the given context', async () => {
      let called = false
      const path = '/test'
      const context = {}
      const router = new Router()

      router.resource(path, (path, params, context) => {
        called = context
      })

      await router.handle(path, context)

      strictEqual(called, context)
    })
  })
})
