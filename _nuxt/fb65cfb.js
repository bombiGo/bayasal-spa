(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{317:function(t,e,r){"use strict";r.r(e);r(57);var n=r(19),o={middleware:["auth"],data:function(){return{infoOptions:[{value:"category_news",text:"Мэдээлэл"},{value:"category_advice",text:"Зөвлөмж"},{value:"category_exercise",text:"Дасгал хөдөлгөөн"}],isBusy:!1,loading:!1,form:{infoType:"category_news",title:"",subtitle:"",image:null},imageSrc:""}},created:function(){this.fetchData()},methods:{fetchData:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.isBusy=!0,e.prev=1,e.next=4,t.$axios.get("/info-categories/edit?pk="+t.$route.params.id);case 4:(r=e.sent).data&&t.setFormData(r.data),t.isBusy=!1,e.next=13;break;case 9:e.prev=9,e.t0=e.catch(1),t.isBusy=!1,console.log(e.t0);case 13:case"end":return e.stop()}}),e,null,[[1,9]])})))()},setFormData:function(data){this.form.title=data.title?data.title.S:"",this.form.infoType=data.type?data.type.S:"category_news",this.imageSrc=data.image?data.image.S:"",console.log(data)},onSubmit:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){var r,n,o,l;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.loading=!0,r={"Content-Type":"multipart/form-data"},n=t.form.image?"uploaded":"no_upload",(o=new FormData).append("pk",t.$route.params.id),o.append("infoType",t.form.infoType),o.append("title",t.form.title),o.append("uploadedFile",n),o.append("file",t.form.image),o.append("oldFile",t.imageSrc),e.prev=10,e.next=13,t.$axios.post("/info-categories/edit",o,r);case 13:l=e.sent,console.log(l),t.loading=!1,l.data.success?t.$router.push({path:"/info-categories"}):alert("Info category update error"),e.next=23;break;case 19:e.prev=19,e.t0=e.catch(10),t.loading=!1,console.log(e.t0);case 23:case"end":return e.stop()}}),e,null,[[10,19]])})))()}}},l=r(48),component=Object(l.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container-fliud"},[r("div",{staticClass:"content p-3"},[r("nav",{attrs:{"aria-label":"breadcrumb"}},[r("ol",{staticClass:"breadcrumb"},[r("li",{staticClass:"breadcrumb-item"},[r("nuxt-link",{attrs:{to:"/home"}},[t._v("Нүүр")])],1),t._v(" "),r("li",{staticClass:"breadcrumb-item"},[r("nuxt-link",{attrs:{to:"/info-categories"}},[t._v("Ангилалууд")])],1),t._v(" "),r("li",{staticClass:"breadcrumb-item active",attrs:{"aria-current":"page"}},[t._v("Засах")])])]),t._v(" "),t.isBusy?t._e():r("b-card",{attrs:{"bg-variant":"light","text-variant":"dark"},scopedSlots:t._u([{key:"header",fn:function(){return[t.form.title?r("h6",{staticClass:"mb-0"},[t._v("# "+t._s(t.form.title))]):t._e()]},proxy:!0}],null,!1,2310338981)},[t._v(" "),r("b-form",{on:{submit:function(e){return e.preventDefault(),t.onSubmit(e)}}},[r("b-form-group",{attrs:{id:"input-type",label:"Төрөл","label-for":"input-type"}},[r("b-form-select",{attrs:{options:t.infoOptions},model:{value:t.form.infoType,callback:function(e){t.$set(t.form,"infoType",e)},expression:"form.infoType"}})],1),t._v(" "),r("b-form-group",{attrs:{id:"input-group-1",label:"Ангилалын нэр","label-for":"input-1"}},[r("b-form-input",{attrs:{id:"input-1",required:""},model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),t._v(" "),r("b-form-group",{attrs:{id:"input-group-2",label:"Зураг оруулах","label-for":"input-2"}},[r("b-form-file",{attrs:{id:"input-2"},model:{value:t.form.image,callback:function(e){t.$set(t.form,"image",e)},expression:"form.image"}})],1),t._v(" "),t.imageSrc?r("div",{staticClass:"m-3"},[r("img",{staticClass:"img-fluid",staticStyle:{"max-width":"100px"},attrs:{src:t.imageSrc}})]):t._e(),t._v(" "),t.loading?t._e():r("b-button",{staticClass:"mt-3",attrs:{variant:"primary",type:"submit"}},[t._v("\n            Хадгалах\n          ")]),t._v(" "),t.loading?r("b-button",{staticClass:"mt-3",attrs:{variant:"primary",disabled:""}},[r("b-spinner",{attrs:{small:""}}),t._v(" "),r("span",{staticClass:"sr-only"},[t._v("Loading...")])],1):t._e()],1)],1),t._v(" "),t.isBusy?r("p",[t._v("Уншиж байна")]):t._e()],1)])}),[],!1,null,null,null);e.default=component.exports}}]);