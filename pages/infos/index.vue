<template>
	<div class="container-fliud">
		<div class="content p-3">
      <h5>Нийт мэдээлэлүүд ({{ infos.length }})</h5>

      <b-button pill variant="success" class="mt-3" to="/infos/add" v-if="!loading">Мэдээлэл нэмэх</b-button>

      <div class="table-responsive mt-3">
  			<table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">Зураг</th>
              <th scope="col">Нэр</th>
              <th scope="col">Төрөл</th>
              <th scope="col">Ангилал</th>
              <th scope="col">Онцлох</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="info in infos" :key="info.PK.S">
                <td>
                  <img :src="info.image.S" style="max-width: 100px;" class="img-fluid"/>
                </td>
                <td>
                  <nuxt-link :to="{ name: 'infos-id-show', params: { id: info.PK.S } }">
                    {{ info.title.S }}
                  </nuxt-link>
                </td>
                <td>
                  <b-badge variant="info" v-if="info.type.S == 'category_news'">
                    Мэдээлэл
                  </b-badge>
                  <b-badge variant="secondary" v-if="info.type.S == 'category_advice'">
                    Зөвлөмж
                  </b-badge>
                  <b-badge variant="warning" v-if="info.type.S == 'category_exercise'">
                    Дасгал
                  </b-badge>
                </td>
                <td>
                  <div v-if="getCategoryNames(info.PK.S) && getCategoryNames(info.PK.S).length > 0">
                    <b-badge variant="warning" v-for="(categoryName, index) in getCategoryNames(info.PK.S)" :key="index" class="mr-2">
                      <span>{{ categoryName }}</span>
                    </b-badge>
                  </div>
                </td>
                <td>
                  <span v-if="info.featured && info.featured.BOOL">Тийм</span>
                  <span v-else>Үгүй</span>
                </td>
                <td>
                  <b-button variant="primary" size="sm" class="mb-2" :to="{ name: 'infos-id-edit', params: { id: info.PK.S } }">Засах</b-button>
                  <b-button variant="danger" size="sm" class="mb-2" @click="remove(info.PK.S)">Устгах</b-button>
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
        <input type="text" v-model="deleteInfo.confirmMessage" placeholder="permanently delete" class="form-control">
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="deleteOk"
              :disabled="deleteInfo.disabled"
            >
              <b-spinner small v-if="deleteInfo.isBusy"></b-spinner>
              <span class="sr-only" v-if="deleteInfo.isBusy">Loading...</span>
              <span v-if="!deleteInfo.isBusy">Устгах</span>
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
        infos: [],
        infoCategories: [],
        deleteInfo: {
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
          let response = await this.$axios.get("/infos");
          this.loading = false;

          if (response.data.success) {
            this.infoCategories = response.data.info_categories;

            this.infos = response.data.infos.filter(data => {
              return data.SK.S === "info"; 
            });

            const categories = response.data.infos.filter(data => {
              return data.SK.S === "category"; 
            });
            
            this.$store.commit('setInfoCategories', categories);
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      remove(pk) {
        this.deleteInfo.pk = pk;
        this.$refs["delete-modal"].show();
      },
      getCategoryNames(infoId) {
        let loop = true;
        let categoryNames = [];
         
        this.infoCategories.forEach(infoCategory => {
          if (infoId == infoCategory.InfoId.S) {
            let findCategoryName = this.$store.getters.infoCategories.find(data => data.PK.S == infoCategory.CategoryId.S);

            if (findCategoryName) {
              categoryNames.push(findCategoryName.title.S);
            }
          }
        });

        return categoryNames;
      },
      async deleteOk(bvModalEvt) {
        bvModalEvt.preventDefault();

        if (this.deleteInfo.pk) {
          this.deleteInfo.confirmMessage = "";
          this.deleteInfo.isBusy = true;
          try {
            let response = await this.$axios.delete("/infos?pk=" + this.deleteInfo.pk);
            this.deleteInfo.isBusy = false;
            
            if (response.data.success) {
              this.$refs["delete-modal"].hide();
              this.fetchData();
            } else {
              alert("Info delete error");
            }
            console.log(response);

          } catch (err) {
            this.deleteInfo.isBusy = false;
            console.log(err);
          }
        } else {
          alert("Info delete error");
        }
      }
    },
    watch: {
      "deleteInfo.confirmMessage": function(value) {
        if (value === "permanently delete") {
          this.deleteInfo.disabled = false;
        } else {
          this.deleteInfo.disabled = true;
        }
      }
    }
	}
</script>