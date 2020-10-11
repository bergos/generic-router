# generic-router

A very basic generic router.

## Usage

The package exports a `Router` class that can be imported like this:

```javascript
import Router from 'generic-router'
```

### Router()

Creates a new `Router` instance.
It handles routes defined by a `path` string that can contain parameter variables.
Variables must be prefixed with a colon like this: `:variable`.
The callback function of a route is processed async.
If a callback returns `false`, further matching routes will be processed.

A callback will be called like:

```javascript
await callback(path, params, context)
```

Where `path` and `context` are forwarded from the arguments given to the `handle()` method.
`params` is an object with key-value pairs of the parameters extracted from the `path`.  

### path(path, callback)

Adds a route with the given `callback` for the resource matching the `path` and deeper structures.

### resource(path, callback)  

Adds a route with the given `callback` for the resource matching exactly the `path`.

### async handle(path, context)

Calls callbacks for routes matching the `path` as defined by the `path()` and `resource()` method.
The callbacks will be called in the order they were added to the router.
The return value of the last callback will be forwarded. 
