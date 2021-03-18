# StoredSettings

## What are stored Settings?

They are a [Vue mixin](https://vuejs.org/v2/guide/mixins.html#Basics) for component settings, that should be stored in the localStorage.

## What can I do with it?

You can use this to ease storing and retrieving `data` properties of your Vue Components.

Take a look at a bit further down to see how to integrate them.

## Getting Started

### Installation

```sh
# with npm
npm install --save stored-settings
```

```sh
# with yarn
yarn add stored-settings
```

### Integration to a Vue Component

Assuming you want to use [Vue SFCs](https://vuejs.org/v2/guide/single-file-components.html),
you can integrate stored settings

```js
import StoredSettings from 'stored-settings'

export default {
  /* ... */
  mixins: [
    StoredSettings(/* key-prefix */ 'my-settings', {
      /* define similar to props */
      showHelp: {
        type: Boolean
      },
    })
  ]
}
```

This will set up a `data` Element containing `showHelp`.
When changing `showHelp`, the value will be written to the `localStorage` at `my-settings.showHelp`.

## Configuration

### Supported Data Types

Basically any Data with a JSON representation can be stored/retrieved from the store.
The Limits of the used store still apply though.

As basic supported types you can use:

| Type      | default |
|-----------|---------|
| `Boolean` | `false` |
| `Number`  |     `0` |
| `String`  |    `''` |
| `Array`   |    `[]` |
| `Object`  |    `{}` | 
| `Date`    |  `null` |

### Fine grained (de-)serialization

You can provide your own functions to (de-)serialize the stored values.
* `serialize(value: T): String` will be used to serialize a `T` value before storing it as `String`
* `parse(value: String): T` will be used to deserialize the `String` back to the locally used `T`

Beside that you can also overwrite the `toJSON` if you provide your own class.

## F.A.Q.

### What is it good for?

It's meant to be a small helper to move information form `data` to the `localStorage`.

### How does it compare to other libraries?

How should I know, I'm just using this one.
