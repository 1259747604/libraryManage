import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  },
  {
    path: "/register",
    component: () => import("@/views/register"),
    hidden: true
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/testPage/index"),
        name: "analyse",
        meta: {
          title: "数据分析",
          icon: "el-icon-s-data",
          affix: true,
          roles: ["admin"]
        }
      }
    ]
  },
  {
    path: "/bookmanage",
    component: Layout,
    redirect: "/bookmanage/index",
    meta: {
      title: "书籍管理",
      icon: "el-icon-s-management",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/bookManage"),
        name: "bookmanage",
        meta: { title: "图书管理", icon: "el-icon-reading" }
      },
      {
        path: "add",
        hidden: true,
        component: () => import("@/views/bookManage/add"),
        name: "bookAdd",
        meta: {
          title: "图书管理",
          icon: "el-icon-reading",
          activeMenu: "/bookmanage/index"
        }
      },
      {
        path: "booktype",
        component: () => import("@/views/booktype"),
        name: "booktype",
        meta: { title: "图书分类管理", icon: "el-icon-folder-opened" }
      }
    ]
  },
  {
    path: "/userManage",
    component: Layout,
    redirect: "/userManage/index",
    meta: {
      title: "用户管理",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/testPage/index"),
        name: "usermanage",
        meta: { title: "用户管理", icon: "el-icon-user" }
      }
    ]
  },
  {
    path: "/borrowManage",
    component: Layout,
    redirect: "/borrowManage/index",
    meta: {
      title: "借阅信息管理",
      roles: ["admin"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/testPage/index"),
        name: "borrowManage",
        meta: { title: "借阅信息管理", icon: "dashboard" }
      }
    ]
  },
  {
    path: "/borrow",
    component: Layout,
    redirect: "/borrow/index",
    meta: {
      title: "借阅图书",
      roles: ["admin", "borrower"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/testPage/index"),
        name: "borrow",
        meta: { title: "借阅图书", icon: "el-icon-paperclip" }
      }
    ]
  },
  {
    path: "/myborrow",
    component: Layout,
    redirect: "/myborrow/index",
    meta: {
      title: "我的借阅信息",
      roles: ["admin", "borrower"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/testPage/index"),
        name: "myborrow",
        meta: { title: "我的借阅信息", icon: "el-icon-notebook-1" }
      }
    ]
  },
  {
    path: "/editpwd",
    component: Layout,
    redirect: "/editpwd/index",
    meta: {
      title: "密码修改",
      roles: ["admin", "borrower"]
    },
    hidden: true,
    children: [
      {
        path: "index",
        component: () => import("@/views/testPage/index"),
        name: "editpwd",
        meta: { title: "密码修改" }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
