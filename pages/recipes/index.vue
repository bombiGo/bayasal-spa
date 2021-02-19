<template>
	<div class="container-fliud">
		<div class="content p-3">
      <h5>Нийт мэдээлэлүүд ({{ recipes.length }})</h5>

      <b-button pill variant="success" class="mt-3" to="/recipes/add" v-if="!loading">Мэдээлэл нэмэх</b-button>

      <div class="table-responsive mt-3">
  			<table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">Зураг</th>
              <th scope="col">Нэр</th>
              <th scope="col">Ангилал</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="recipe in recipes" :key="recipe.PK.S">
                <td>
                  <img :src="recipe.image.S" style="max-width: 100px;" class="img-fluid"/>
                </td>
                <td>
                  <nuxt-link :to="{ name: 'recipes-id-show', params: { id: recipe.PK.S } }">
                    {{ recipe.title.S }}
                  </nuxt-link>
                </td>
                <td>
                  <div v-if="getCategoryNames(recipe.PK.S) && getCategoryNames(recipe.PK.S).length > 0">
                    <b-badge variant="info" v-for="(categoryName, index) in getCategoryNames(recipe.PK.S)" :key="index" class="mr-2">
                      <span>{{ categoryName }}</span>
                    </b-badge>
                  </div>
                </td>
                <td>
                  <b-button variant="primary" size="sm" class="mb-2" :to="{ name: 'recipes-id-edit', params: { id: recipe.PK.S } }">Засах</b-button>
                  <b-button variant="danger" size="sm" class="mb-2" @click="remove(recipe.PK.S)">Устгах</b-button>
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
        <input type="text" v-model="deleteRecipe.confirmMessage" placeholder="permanently delete" class="form-control">
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="deleteOk"
              :disabled="deleteRecipe.disabled"
            >
              <b-spinner small v-if="deleteRecipe.isBusy"></b-spinner>
              <span class="sr-only" v-if="deleteRecipe.isBusy">Loading...</span>
              <span v-if="!deleteRecipe.isBusy">Устгах</span>
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
        recipes: [],
        recipeCategories: [],
        deleteRecipe: {
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
    filters: {
      formatPrice(value) {
        let val = (value/1).toFixed(0).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
    },
    methods: {
      async fetchData() {
        this.loading = true;
        try {
          let response = await this.$axios.get("/recipes");
          this.loading = false;

          if (response.data.success) {
            this.recipeCategories = response.data.recipe_categories;

            this.recipes = response.data.recipes.filter(data => {
              return data.SK.S === "recipe"; 
            });

            const categories = response.data.recipes.filter(data => {
              return data.SK.S === "category"; 
            });
            
            this.$store.commit('setRecipeCategories', categories);  
          }
          
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      remove(pk) {
        this.deleteRecipe.pk = pk;
        this.$refs["delete-modal"].show();
      },
      getCategoryNames(recipeId) {
        let loop = true;
        let categoryNames = [];
         
        this.recipeCategories.forEach(recipeCategory => {
          if (recipeId == recipeCategory.RecipeId.S) {
            let findCategoryName = this.$store.getters.recipeCategories.find(data => data.PK.S == recipeCategory.CategoryId.S);

            if (findCategoryName) {
              categoryNames.push(findCategoryName.title.S);
            }
          }
        });

        return categoryNames;
      },
      async deleteOk(bvModalEvt) {
        bvModalEvt.preventDefault();

        if (this.deleteRecipe.pk) {
          this.deleteRecipe.confirmMessage = "";
          this.deleteRecipe.isBusy = true;
          try {
            let response = await this.$axios.delete("/recipes?pk=" + this.deleteRecipe.pk);
            this.deleteRecipe.isBusy = false;
            
            if (response.data.success) {
              this.$refs["delete-modal"].hide();
              this.fetchData();
            } else {
              alert("recipe delete error");
            }
            console.log(response);

          } catch (err) {
            this.deleteRecipe.isBusy = false;
            console.log(err);
          }
        } else {
          alert("recipe delete error");
        }
      }
    },
    watch: {
      "deleteRecipe.confirmMessage": function(value) {
        if (value === "permanently delete") {
          this.deleteRecipe.disabled = false;
        } else {
          this.deleteRecipe.disabled = true;
        }
      }
    }
	}
</script>