<template>
	<div class="container-fliud">
		<div class="content p-3">
      <h5>Мэдээлэлийн ангилалууд ({{ categories.length }})</h5>

      <b-button pill variant="success" class="mt-3" to="/info-categories/add">Ангилал нэмэх</b-button>

      <div class="table-responsive mt-3">
  			<table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">Зураг</th>
              <th scope="col">Нэр</th>
              <th scope="col">Төрөл</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="category in categories" :key="category.PK.S">
                <td>
                  <img :src="category.image.S" width="50" class="img-fluid" v-if="category.image && category.image.S" />
                </td>
                <td>
                  {{ category.title.S }}
                </td>
                <td>
                  <b-badge variant="info" v-if="category.type.S == 'category_news'">
                    Мэдээлэл
                  </b-badge>
                  <b-badge variant="secondary" v-if="category.type.S == 'category_advice'">
                    Зөвлөмж
                  </b-badge>
                  <b-badge variant="warning" v-if="category.type.S == 'category_exercise'">
                    Дасгал
                  </b-badge>
                </td>
                <td>
                  <b-button variant="primary" size="sm" class="mb-2" :to="{ name: 'info-categories-id-edit', params: { id: category.PK.S } }">Засах</b-button>
                  <b-button variant="danger" size="sm" class="mb-2" @click="remove(category.title.S, category.PK.S)">Устгах</b-button>
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
        title="Ангилал устгах уу"
        
      >
        <input type="text" v-model="deleteCategory.confirmMessage" placeholder="permanently delete" class="form-control">
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="deleteOk"
              :disabled="deleteCategory.disabled"
            >
              <b-spinner small v-if="deleteCategory.isBusy"></b-spinner>
              <span class="sr-only" v-if="deleteCategory.isBusy">Loading...</span>
              <span v-if="!deleteCategory.isBusy">Устгах</span>
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
        categories: [],
        deleteCategory: {
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
          let response = await this.$axios.get("/info-categories");
          this.loading = false;
          this.categories = response.data;
          console.log(response);
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      remove(title, pk) {
        this.deleteCategory.pk = pk;
        this.$refs["delete-modal"].show();
      },
      async deleteOk(bvModalEvt) {
        bvModalEvt.preventDefault();

        if (this.deleteCategory.pk) {
          this.deleteCategory.confirmMessage = "";
          this.deleteCategory.isBusy = true;
          try {
            let response = await this.$axios.delete("/info-categories?pk=" + this.deleteCategory.pk);
            this.deleteCategory.isBusy = false;
            
            if (response.data.success) {
              this.$refs["delete-modal"].hide();
              this.fetchData();
            } else {
              alert("Course delete error");
            }
            console.log(response);

          } catch (err) {
            this.deleteCategory.isBusy = false;
            console.log(err);
          }
        } else {
          alert("Delete action error");
        }
      }
    },
    watch: {
      "deleteCategory.confirmMessage": function(value) {
        if (value === "permanently delete") {
          this.deleteCategory.disabled = false;
        } else {
          this.deleteCategory.disabled = true;
        }
      }
    }
	}
</script>