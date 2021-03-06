import config from 'veui/managers/config'

config.defaults(
  {
    ui: {
      size: {
        values: ['s', 'm'],
        default: 'm',
        inherit: true
      }
    },
    parts: {
      button: 'basic'
    },
    icons: {
      check: null
    }
  },
  'checkbuttongroup'
)
