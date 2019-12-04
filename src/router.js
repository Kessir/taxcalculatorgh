import Vue from "vue";
import Router from "vue-router";
import IncomeTax from "./views/IncomeTax.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: IncomeTax
    },
    {
      path: "/vat-calculator",
      name: "vat",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/SalesTax.vue")
    },
    { path: "*", redirect: "/" }
  ]
});
