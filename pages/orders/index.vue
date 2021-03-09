<template>
	<div class="container-fliud">
		<div class="content p-3">
      <h5>Нийт захиалгууд ({{ orders.length }})</h5>

      <div class="table-responsive mt-3">
  			<table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">Хэрэглэгч</th>
              <th scope="col">Хөтөлбөр</th>
              <th scope="col">Үнэ</th>
              <th scope="col">Төлөв</th>
              <th scope="col">Төлсөн өдөр</th>
              <th scope="col">Бүртгэгдсэн</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="order in orders" :key="order.PK.S">
                <td>
                  {{ order.userEmail.S }}
                </td>
                <td>
                  {{ order.courseName.S }}
                </td>
                <td>
                  {{ order.coursePrice.S }} төг
                </td>
                <td>
                  <h6 v-if="order.orderStatus.S == 'paid'">
                  	<b-badge variant="success">Төлбөр төлсөн</b-badge>
                  </h6>
                  <h6 v-else-if="order.orderStatus.S == 'pending'">
                  	<b-badge variant="warning">Хүлээгдэж буй</b-badge>
                  </h6>
                  <h6 v-else>
                  	<b-badge variant="secondary">Төлбөрийн систем ажиллаагүй</b-badge>
                  </h6>
                </td>
                <td>
                  {{ order.orderPaidDate.S }}
                </td>
                <td>
                  <span>{{ order.createdAt.S }}</span>
                </td>
                <td>
                  <!-- <b-button variant="primary" size="sm" class="mb-2" :to="{ name: 'users-id-edit', params: { id: user.email.S } }">Засах</b-button>
                  <b-button variant="danger" size="sm" class="mb-2" @click="remove(user.email.S)">Устгах</b-button> -->
                </td>
              </tr>  
            </template>
            <template v-if="loading">
              <p class="p-3">Уншиж байна ...</p>
            </template>
          </tbody>
        </table>
      </div>

      <b-modal 
        ref="delete-modal"
        size="sm" 
        title="Мэдээлэл устгах уу"
        
      >
        <input type="text" v-model="deleteOrder.confirmMessage" placeholder="permanently delete" class="form-control">
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="deleteOk"
              :disabled="deleteOrder.disabled"
            >
              <b-spinner small v-if="deleteOrder.isBusy"></b-spinner>
              <span class="sr-only" v-if="deleteOrder.isBusy">Loading...</span>
              <span v-if="!deleteOrder.isBusy">Устгах</span>
            </b-button>
          </div>
        </template>
      </b-modal>
		</div>
	</div>
</template>

<script>
	export default {
    middleware: ['auth'],
    data() {
      return {
        loading: false,
        orders: [],
        deleteOrder: {
          confirmMessage: "",
          isBusy: false,
          pk: "",
          disabled: true
        }
      }
    },
    created() {      
      const token = this.$store.getters.user.token;
      if (token) {
        this.fetchData();  
      } else {
        this.$router.push("/home"); 
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;
        try {
          let response = await this.$axios.get("/orders");
          this.loading = false;

          if (response.data.success) {
            this.orders = response.data.orders;
          }
          
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      remove(pk) {
        this.deleteOrder.pk = pk;
        this.$refs["delete-modal"].show();
      },
      async deleteOk(bvModalEvt) {
        bvModalEvt.preventDefault();

        if (this.deleteOrder.pk) {
          this.deleteOrder.confirmMessage = "";
          this.deleteOrder.isBusy = true;
          try {
            let response = await this.$axios.delete("/orders?pk=" + this.deleteOrder.pk);
            this.deleteOrder.isBusy = false;
            
            if (response.data.success) {
              this.$refs["delete-modal"].hide();
              this.fetchData();
            } else {
              alert("order delete error");
            }
            console.log(response);

          } catch (err) {
            this.deleteOrder.isBusy = false;
            console.log(err);
          }
        } else {
          alert("order delete error");
        }
      }
    },
    watch: {
      "deleteOrder.confirmMessage": function(value) {
        if (value === "permanently delete") {
          this.deleteOrder.disabled = false;
        } else {
          this.deleteOrder.disabled = true;
        }
      }
    }
	};
</script>