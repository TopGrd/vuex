export default function (Vue) {
  // 获取版本
  const version = Number(Vue.version.split('.')[0])
  
  // 根据版本不同，在不同的生命周期安装
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   * Vuex 初始化钩子，在每个实例的初始化钩子中注入
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // 如果store是function，则执行并返回store
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
