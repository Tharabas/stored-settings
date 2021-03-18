var StoredSettings = (function (Vue) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

  const StorageTypes = [{
    type: String,
    default: '',
    parse: value => value,
    serialize: value => value,
  }, {
    type: Number,
    default: null,
    parse: value => parseInt(value, 10),
    serialize: value => value + ''
  }, {
    type: Boolean,
    default: false,
    parse: value => value === '1',
    serialize: value => value + 0 + ''
  }, {
    type: Array,
    default: () => [],
    parse: value => (value && value[0] === '[' && JSON.parse(value)) || [],
    serialize: value => JSON.stringify(value)
  }, {
    type: Object,
    default: () => {},
    parse: value => (value && value[0] === '{' && JSON.parse(value)) || {},
    serialize: value => JSON.stringify(value),
    deep: true,
  }, {
    type: Date,
    default: () => null,
    parse: value => value.trim().length === 0 ? null : Date.parse(value),
    serialize: value => value == null ? '' : value.toISOString()
  }];

  function enrichType (setting) {
    let type;
    if ((type = StorageTypes.find(t => t.type === setting)) != null) {
      return type
    }
    if ((type = StorageTypes.find(t => t.type === setting.type)) != null) {
      return Object.assign({}, type, setting)
    }
    return setting
  }

  const bus = new Vue__default['default']({});

  /**
   * Provides automatically watched data from the local storage
   *
   * @param {String} prefix
   * @param {Object} settings
   * @param {Storage} storage
   * @return {{data(): *, created(): void}}
   */
  function StoredSettings(prefix, settings, storage = localStorage) {
    if (Array.isArray(settings)) {
      settings = settings.reduce((o, setting) => {
        return Object.assign(o, {
          [setting]: {
            default: null
          }
        })
      }, {});
    }

    const keys = Object.keys(settings);
    keys.forEach((key) => {
      const setting = settings[key];
      settings[key] = enrichType(setting);
    });

    const getStorageKey = function (key) {
      return (prefix ? prefix + '.' : '') + (settings[key].as || key)
    };
    const read = function (key) {
      const setting = settings[key];
      const storageKey = getStorageKey(key);
      let value = storage.getItem(storageKey);
      if (value == null) {
        value = typeof setting.default === 'function' ? settings.default() : settings.default;
      }
      return setting.parse ? setting.parse(value) : value
    };
    const write = function (key) {
      const setting = settings[key];
      const storageKey = getStorageKey(key);
      return function (value) {
        if (value == null) {
          return
        }
        const serialized = setting.serialize ? setting.serialize(value) : value;
        storage.setItem(storageKey, serialized);
        bus.$emit(storageKey, value);
      }
    };

    const listeners = {};
    const remoteListeners = {};
    let remoteStorageChanged = null;

    return {
      data () {
        const data = {};
        for (const key of keys) {
          data[key] = read(key);
        }
        return data
      },
      created () {
        for (const key of keys) {
          const setting = settings[key];
          const sKey = getStorageKey(key);
          const update = setting.type === Array
            ? value => this[key].splice(0, this[key].length, ...value)
            : value => this[key] = value;
          if (setting.readonly !== false) {
            this.$watch(key, {
              handler: write(key),
              deep: setting.deep || false
            });
          }
          listeners[key] = value => {
            if (this[key] !== value) update(value);
          };
          remoteListeners[sKey] = e => {
            const value = setting.parse(e.newValue);
            if (this[key] !== value) update(value);
          };
          bus.$on(sKey, listeners[key]);
        }
        remoteStorageChanged = e => {
          if (remoteListeners[e.key]) {
            remoteListeners[e.key](e);
          }
        };
        window.addEventListener('storage', remoteStorageChanged);
      },
      destroyed () {
        if (remoteStorageChanged) window.removeEventListener('storage', remoteStorageChanged);

        for (const key of keys) {
          bus.$off(getStorageKey(key), listeners[key]);
        }
      }
    }
  }

  return StoredSettings;

}(Vue));
