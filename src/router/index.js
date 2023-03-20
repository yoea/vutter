import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '控制台', icon: 'dashboard'}
    }]
  },
  // 书籍目录
  {
    path: '/book',
    component: Layout,
    redirect: '/book/list',
    name: 'Book',
    meta: {title: '图书管理', icon: 'el-icon-notebook-1'},
    children: [
      {
        path: 'list',
        name: 'BookList',
        component: () => import('@/views/book/index'),
        meta: {title: '图书列表', icon: 'el-icon-notebook-2'}
      },
      {
        path: 'review',
        name: 'Review',
        component: () => import('@/views/book/review'),
        meta: {title: '书评管理', icon: 'el-icon-s-comment'}
      }
    ]
  },
  // 用户
  {
    path: '/user',
    component: Layout,
    redirect: '/user/userList',
    name: 'User',
    meta: {title: '用户管理', icon: 'el-icon-s-custom'},
    children: [
      {
        path: 'userList',
        name: 'UserList',
        component: () => import('@/views/user/index'),
        meta: {title: '用户列表', icon: 'el-icon-user-solid' }
      },
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/user/info'),
        meta: { title: '个人中心', icon: 'el-icon-brush'}
      } ]
  },

  {
    path: '/setting',
    component: Layout,
    alwaysShow: true,
    redirect: '/setting/system',
    meta: {
      title: '设置',
      icon: 'el-icon-setting',
      roles: ['admin']
    },
    children: [
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/setting/system'),
        meta: {title: '系统设置', icon: 'el-icon-s-tools'}
      },
      {
        path: 'custom',
        name: 'Custom',
        component: () => import('@/views/setting/custom'),
        meta: {title: '系统设置', icon: 'el-icon-s-tools'}
      }
    ]
  },
  {
    path: '尤恩主页',
    component: Layout,
    hidden: false,
    meta: {roles: ['admin']},
    children: [
      {
        path: 'https://www.ewing.top',
        meta: {title: '尤恩主页', icon: 'link'}
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
