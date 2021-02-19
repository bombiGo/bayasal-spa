<template>
	<div class="container-fliud">
		<div class="content p-3">
			<nav aria-label="breadcrumb">
			  <ol class="breadcrumb" v-if="recipe">
			  	<li class="breadcrumb-item">
			    	<nuxt-link to="/home">Нүүр</nuxt-link>
			    </li>
          <li class="breadcrumb-item">
            <nuxt-link to="/recipes">Жорууд</nuxt-link>
          </li>
			    <li class="breadcrumb-item active" aria-current="page">
            {{ recipe.title.S }}
          </li>
			  </ol>
			</nav>
      <p v-if="loading">Уншиж байна</p>

      <b-row v-if="!loading">
        <b-col sm="6">
          <b-card class="shadow border-0">
            <ul class="list-unstyled" v-if="recipe">
              <li class="mb-3">
                <h5>{{ recipe.title.S }}</h5>
              </li>
              <li class="mb-3" v-if="recipe.image && recipe.image.S">
                <img :src="recipe.image.S" class="img-fluid" style="max-width: 300px;" />
              </li>
              <li class="mb-0">
                <p>
                  <span class="text-muted">Дэд гарчиг: </span> <br>
                  <span>{{ recipe.subtitle.S }}</span>
                </p>
              </li>
              <li class="mb-0">
                <p>
                  <span class="text-muted">Ангилалууд: </span> 
                  <div v-if="getCategoryNames(recipe.categories) && getCategoryNames(recipe.categories).length > 0">
                    <b-badge variant="info" v-for="(categoryName, index) in getCategoryNames(recipe.categories)" :key="index" class="mr-2">
                      <span>{{ categoryName }}</span>
                    </b-badge>
                  </div>
                </p>
              </li>
            </ul>
          </b-card>
        </b-col>
        <b-col m="6">
          <b-card class="shadow border-0">
            <div class="text-muted d-block">Үндсэн мэдээлэл: </div>
            <div v-html="recipe.content.S" class="p-3"></div>
          </b-card>
        </b-col>
      </b-row>
		</div>
	</div>
</template>

<script>
	export default {
    data() {
      return {
        loading: false,
        recipe: null
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          let response = await this.$axios.get("/recipes/edit?pk=" + this.$route.params.id);
          if (response.data) {
            this.recipe = response.data;
          } 
          console.log(response.data);

          this.loading = false;
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      getCategoryNames(categories) {
        let loop = true;
        let categoryNames = [];
         
        categories.forEach(recipeCategory => {
          let findCategoryName = this.$store.getters.recipeCategories.find(data => data.PK.S == recipeCategory.CategoryId.S);

          if (findCategoryName) {
            categoryNames.push(findCategoryName.title.S);
          }
        });

        return categoryNames;
      }
    }
  }
</script>
