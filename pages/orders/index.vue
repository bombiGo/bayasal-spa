<template>
	<div class="container-fliud">
		<div class="content p-3">
      <h5>Нийт хэрэглэгчид ({{ users.length }})</h5>

      <div class="table-responsive mt-3">
  			<table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">Зураг</th>
              <th scope="col">Мэйл хаяг</th>
              <th scope="col">Нэр</th>
              <th scope="col">Нэвтрэх төлөв</th>
              <th scope="col">Бүртгэгдсэн</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="user in users" :key="user.email.S">
                <td>
                  <img :src="user.image.S" style="max-width: 100px;" class="img-fluid" v-if="user.image && user.image.S"/>
                </td>
                <td>
                  <nuxt-link :to="{ name: 'users-id-show', params: { id: user.id.S } }">
                    {{ user.email.S }}
                  </nuxt-link>
                </td>
                <td>
                  <span v-if="user.username && user.username.S">{{ user.username.S }}</span>
                </td>
                <td>
                  <span v-if="user.provider && user.provider.S">
                  	<span v-if="user.provider.S == 'jwt'" class="badge badge-info">Мэйл, нууц үг</span>
                  	<span v-if="user.provider.S == 'facebook'" class="badge badge-warning">Фэйсбүүк</span>
                  </span>
                </td>
                <td>
                  <span>{{ user.createdAt.S }}</span>
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
        <input type="text" v-model="deleteUser.confirmMessage" placeholder="permanently delete" class="form-control">
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="deleteOk"
              :disabled="deleteUser.disabled"
            >
              <b-spinner small v-if="deleteUser.isBusy"></b-spinner>
              <span class="sr-only" v-if="deleteUser.isBusy">Loading...</span>
              <span v-if="!deleteUser.isBusy">Устгах</span>
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
        users: [],
        deleteUser: {
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
          let response = await this.$axios.get("/users");
          this.loading = false;

          if (response.data.success) {
            this.users = response.data.users;
          }
          
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      remove(pk) {
        this.deleteUser.pk = pk;
        this.$refs["delete-modal"].show();
      },
      async deleteOk(bvModalEvt) {
        bvModalEvt.preventDefault();

        if (this.deleteUser.pk) {
          this.deleteUser.confirmMessage = "";
          this.deleteUser.isBusy = true;
          try {
            let response = await this.$axios.delete("/users?pk=" + this.deleteUser.pk);
            this.deleteUser.isBusy = false;
            
            if (response.data.success) {
              this.$refs["delete-modal"].hide();
              this.fetchData();
            } else {
              alert("user delete error");
            }
            console.log(response);

          } catch (err) {
            this.deleteUser.isBusy = false;
            console.log(err);
          }
        } else {
          alert("user delete error");
        }
      }
    },
    watch: {
      "deleteUser.confirmMessage": function(value) {
        if (value === "permanently delete") {
          this.deleteUser.disabled = false;
        } else {
          this.deleteUser.disabled = true;
        }
      }
    }
	};
</script>