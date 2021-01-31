// const routerBase = process.env.DEPLOY_ENV === 'GEN' ? '/bayasal-spa/' : '/';

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  router: {
    base: "/bayasal-spa/"
  },
  
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'bayasal_spa',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Nunito&display=swap'
      },
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    './plugins/mixins/user'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'bootstrap-vue/nuxt'
  ],

  auth: {
    strategies: {
      local: {
        token: {
          property: 'access_token',
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/login', method: 'post' },
          logout: { url: '/logout', method: 'post' },
          user: { url: '/me', method: 'get' }
        }
      }
    },
    redirect: {
      login: '/login',
      home: '/'
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: 'https://v269mh6ua4.execute-api.ap-southeast-1.amazonaws.com/v1',
    // proxy: true
  },

  vue: {
    config: {
      productionTip: false,
      // devtools: false
    }
  },

  // proxy: {
  //   '/v1': {
  //     target: 'https://v269mh6ua4.execute-api.ap-southeast-1.amazonaws.com',
  //     pathRewrite: { '^/v1' : '/' }
  //   }
  // },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
