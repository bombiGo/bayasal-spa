(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{305:function(t,e,n){"use strict";n.r(e);n(57);var r=n(19),c={middleware:["auth"],data:function(){return{loading:!1,payments:[]}},created:function(){this.$store.getters.user.token?this.fetchData():this.$router.push("/home")},methods:{fetchData:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.loading=!0,e.prev=1,e.next=4,t.$axios.get("/payments/list");case 4:n=e.sent,t.loading=!1,n.data.success&&(t.payments=n.data.payments),e.next=13;break;case 9:e.prev=9,e.t0=e.catch(1),t.loading=!1,console.log(e.t0);case 13:case"end":return e.stop()}}),e,null,[[1,9]])})))()}}},o=n(48),component=Object(o.a)(c,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container-fliud"},[n("div",{staticClass:"content p-3"},[n("h5",[t._v("Төлбөрийн жагсаалт ("+t._s(t.payments.length)+")")]),t._v(" "),n("div",{staticClass:"table-responsive mt-3"},[n("table",{staticClass:"table"},[t._m(0),t._v(" "),n("tbody",[t.loading?t._e():t._l(t.payments,(function(e){return n("tr",[n("td",[t._v(t._s(e))])])})),t._v(" "),t.loading?[n("p",{staticClass:"p-3"},[t._v("Уншиж байна ...")])]:t._e()],2)])])])])}),[function(){var t=this.$createElement,e=this._self._c||t;return e("thead",{staticClass:"thead-light"},[e("tr",[e("th",{attrs:{scope:"col"}},[this._v("Column 1")])])])}],!1,null,null,null);e.default=component.exports}}]);