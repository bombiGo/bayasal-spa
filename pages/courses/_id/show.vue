<template>
	<div class="container-fliud">
		<div class="content p-3">
			<nav aria-label="breadcrumb">
			  <ol class="breadcrumb" v-if="course">
			  	<li class="breadcrumb-item">
			    	<nuxt-link to="/home">Нүүр</nuxt-link>
			    </li>
          <li class="breadcrumb-item">
            <nuxt-link to="/courses">Хөтөлбөрүүд</nuxt-link>
          </li>
			    <li class="breadcrumb-item active" aria-current="page">
            {{ course.title.S }}
          </li>
			  </ol>
			</nav>
      <p v-if="loading">Уншиж байна</p>

      <b-row v-if="!loading">
        <b-col sm="6">
          <b-card class="shadow border-0">
            <ul class="list-unstyled" v-if="course">
              <li class="mb-3">
                <h5>{{ course.title.S }}</h5>
              </li>
              <li class="mb-3">
                <img :src="course.image.S" class="img-fluid" style="max-width: 200px;" />
              </li>
              <li class="mb-0">
                <p class="day m-0">
                  <span class="text-muted">Төлбөртэй: </span> 
                  <span v-if="course.paid"> Тийм</span>
                  <span v-if="!course.paid"> Үнэгүй</span>
                </p>
              </li>
              <li class="mb-0">
                <p class="price m-0">
                  <span class="text-muted">Үнэ: </span> 
                  {{ course.price.S | formatPrice }}
                </p>
              </li>
              <li class="mb-0">
                <p class="day m-0">
                  <span class="text-muted">Өдөр: </span>
                  {{ course.day1.S  }} өдөр
                </p>
              </li>
              <li class="mb-0">
                <p class="day m-0">
                  <span class="text-muted">Өдөр гарчиг: </span> 
                  {{ course.day2.S  }}
                </p>
              </li>

              <li class="mb-0">
                <p class="day m-0">
                  <div class="text-muted d-block">Үндсэн мэдээлэл: </div> 
                  <div v-html="course.content.S" class="p-3"></div>
                </p>
              </li>

            </ul>
          </b-card>
        </b-col>
        <b-col m="6">
          <b-card class="shadow border-0">
            <h5>Хөтөлбөрийн өдрүүд</h5>
            <b-button pill variant="success" size="sm" class="mt-1"
              :to="{ name: 'courses-id-lessons-add', params: { id: course.id.S }, query: { title: course.title.S, dayMode: course.dayMode.S, dayNumber: course.day1.S } }"
            >Хичээл нэмэх</b-button>

            <table class="table table-striped mt-3">
              <tr v-for="lesson in course.lessons" :key="lesson.id.S">
                <td>
                  <div>{{ lesson.title.S }}</div> 
                  <b-badge variant="primary">
                    <span v-if="course.dayMode.S === 'select'">
                      {{ lesson.dayNumber.S }} өдөр
                    </span>
                  </b-badge>
                </td>
              </tr>
            </table>
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
        course: null
      }
    },
    created() {
      this.fetchData();
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
          let response = await this.$axios.get("/courses/edit?id=" + this.$route.params.id);
          if (response.data) {
            this.course = response.data;
          } 
          console.log(response.data);

          this.loading = false;
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      }
    }
  }
</script>

<style lang="css" scoped>
  .price, .day {
    font-size: 15px;
  }
</style>