import store from '../store/index'
import { RouteLocationNormalized } from 'vue-router'

export default (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) => {
    if (store.getters.user) {
        next()
    } else {
        next('/authentication')
    }
}
