<template>
	<div class="container-fliud">
		<div class="content p-3">
      <h5>Хөтөлбөрүүд ({{ courses.length }})</h5>

      <b-button pill variant="success" class="mt-3" to="/courses/add">Хөтөлбөр нэмэх</b-button>

      <div class="table-responsive mt-3">
  			<table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">Зураг</th>
              <th scope="col">Нэр</th>
              <th scope="col">Үнэ</th>
              <th scope="col">Өдөр</th>
              <th scope="col">Бүртгэгдсэн</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="course in courses" :key="course.id.S">
                <td>
                  <img :src="course.image.S" width="100" class="img-fluid"/>
                </td>
                <td>
                  <nuxt-link :to="{ name: 'courses-id-show', params: { id: course.id.S } }">{{ course.title.S }}</nuxt-link>
                </td>
                <td>
                  <strong>{{ course.price.S | formatPrice }}</strong>
                </td>
                <td>
                  <b-badge pill variant="info" class="p-2">{{ course.day1.S }} өдөр</b-badge>
                </td>
                <td>
                  {{ course.createdAt.S }}
                </td>
                <td>
                  <b-button variant="primary" size="sm" class="mb-2" :to="{ name: 'courses-id-edit', params: { id: course.id.S } }">Засах</b-button>
                  <b-button variant="danger" size="sm" class="mb-2" @click="remove(course.title.S, course.id.S)">Устгах</b-button>
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
        title="Хөтөлбөрийг устгах уу"
        
      >
        <input type="text" v-model="deleteCourse.confirmMessage" placeholder="permanently delete" class="form-control">
        <template #modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="deleteOk"
              :disabled="deleteCourse.disabled"
            >
              <b-spinner small v-if="deleteCourse.isBusy"></b-spinner>
              <span class="sr-only" v-if="deleteCourse.isBusy">Loading...</span>
              <span v-if="!deleteCourse.isBusy">Устгах</span>
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
        courses: [],
        deleteCourse: {
          confirmMessage: "",
          isBusy: false,
          id: "",
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
          let response = await this.$axios.get("/courses");
          this.loading = false;
          this.courses = response.data;
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      remove(title, id) {
        this.deleteCourse.id = id;
        this.$refs["delete-modal"].show();
      },
      async deleteOk(bvModalEvt) {
        bvModalEvt.preventDefault();

        if (this.deleteCourse.id) {
          this.deleteCourse.isBusy = true;
          try {
            let response = await this.$axios.delete("/courses/single-delete?id=" + this.deleteCourse.id);
            this.deleteCourse.isBusy = false;
            
            if (response.data.success) {
              this.$refs["delete-modal"].hide();
              this.fetchData();
            } else {
              alert("Course delete error");
            }
            console.log(response);

          } catch (err) {
            this.deleteCourse.isBusy = false;
            console.log(err);
          }
        } else {
          alert("Delete action error");
        }
      }
    },
    watch: {
      "deleteCourse.confirmMessage": function(value) {
        if (value === "permanently delete") {
          this.deleteCourse.disabled = false;
        } else {
          this.deleteCourse.disabled = true;
        }
      }
    }
	}
</script>