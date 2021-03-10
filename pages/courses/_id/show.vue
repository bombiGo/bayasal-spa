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
                <img :src="course.image.S" class="img-fluid" style="max-width: 300px;" />
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
            <h5>Хөтөлбөрийн хичээлүүд</h5>
            <b-button pill variant="success" size="sm" class="mt-1"
              :to="{ name: 'courses-id-lessons-add', params: { id: course.id.S }, query: { title: course.title.S, dayMode: course.dayMode.S, dayNumber: course.day1.S } }"
            >Хичээл нэмэх</b-button>

            <table class="table table-striped mt-3">
              <tr v-for="lesson in course.lessons" :key="lesson.id.S">
                <td>
                  <div>{{ lesson.title.S }}</div> 
                  <h6 class="mt-3 mb-3">
                    <b-badge variant="warning" v-if="course.dayMode.S === 'select'">
                      <span >
                        {{ lesson.dayNumber.S }} өдөр
                      </span>
                    </b-badge>
                    <div v-else> {{ lesson.dayNumber.S }}</div>
                  </h6>

                  <p v-if="lesson.locked.BOOL" class="text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
                      <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
                      <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    Түгжээтэй
                  </p>
                  <p v-else class="text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg> 
                    Түгжээгүй
                  </p>

                  <b-button variant="primary" size="sm" class="mr-2" :to="{ name: 'courses-id-lessons-id2-edit', params: { id: course.id.S, id2: lesson.id.S }, query: { title: course.title.S, dayMode: course.dayMode.S, dayNumber: course.day1.S } }">Засах</b-button>
                  <b-button variant="danger" size="sm">Устгах</b-button>
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