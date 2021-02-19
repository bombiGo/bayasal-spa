<template>
	<div class="container-fliud">
		<div class="content p-3">
			<nav aria-label="breadcrumb">
			  <ol class="breadcrumb" v-if="info">
			  	<li class="breadcrumb-item">
			    	<nuxt-link to="/home">Нүүр</nuxt-link>
			    </li>
          <li class="breadcrumb-item">
            <nuxt-link to="/infos">Мэдээлэлүүд</nuxt-link>
          </li>
			    <li class="breadcrumb-item active" aria-current="page">
            {{ info.title.S }}
          </li>
			  </ol>
			</nav>
      <p v-if="loading">Уншиж байна</p>

      <b-row v-if="!loading">
        <b-col sm="6">
          <b-card class="shadow border-0">
            <ul class="list-unstyled" v-if="info">
              <li class="mb-3">
                <h5>{{ info.title.S }}</h5>
              </li>
              <li class="mb-3" v-if="info.image && info.image.S">
                <img :src="info.image.S" class="img-fluid" style="max-width: 300px;" />
              </li>
              <li class="mb-0">
                <p>
                  <span class="text-muted">Төрөл: </span> &nbsp;
                  <b-badge variant="info" v-if="info.type.S == 'category_news'">
                    Мэдээлэл
                  </b-badge>
                  <b-badge variant="secondary" v-if="info.type.S == 'category_advice'">
                    Зөвлөмж
                  </b-badge>
                  <b-badge variant="warning" v-if="info.type.S == 'category_exercise'">
                    Дасгал
                  </b-badge>                
                </p>
              </li>
              <li class="mb-0">
                <p>
                  <span class="text-muted">Ангилалууд: </span> 
                  <div v-if="getCategoryNames(info.categories) && getCategoryNames(info.categories).length > 0">
                    <b-badge variant="warning" v-for="(categoryName, index) in getCategoryNames(info.categories)" :key="index" class="mr-2">
                      <span>{{ categoryName }}</span>
                    </b-badge>
                  </div>
                </p>
              </li>
              <li class="mb-0">
                <p>
                  <span class="text-muted">Онцлох: </span> 
                  <span v-if="info.featured"> Тийм</span>
                  <span v-else> Үгүй</span>
                </p>
              </li>
              <li class="mb-0">
                <p>
                  <span class="text-muted">Дэд тайлбар: </span> <br>
                  {{ info.subtitle.S  }}
                </p>
              </li>
            </ul>
          </b-card>
        </b-col>
        <b-col m="6">
          <b-card class="shadow border-0">
            <div class="text-muted d-block">Үндсэн мэдээлэл: </div>
            <div v-html="info.content.S" class="p-3" v-if="info.content && info.content.S"></div>
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
        info: null
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.loading = true;

        try {
          let response = await this.$axios.get("/infos/edit?pk=" + this.$route.params.id);
          if (response.data) {
            this.info = response.data;
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
         
        categories.forEach(infoCategory => {
          let findCategoryName = this.$store.getters.infoCategories.find(data => data.PK.S == infoCategory.CategoryId.S);

          if (findCategoryName) {
            categoryNames.push(findCategoryName.title.S);
          }
        });

        return categoryNames;
      }
    }
  }
</script>
