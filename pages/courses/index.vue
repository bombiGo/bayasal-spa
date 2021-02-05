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
              <th scope="col">Өдөр</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="course in courses">
                <td>
                  <img :src="course.image.S" width="100" class="img-fluid"/>
                </td>
                <td>{{ course.title.S }}</td>
                <td>
                  <b-badge pill variant="info" class="p-2">{{ course.day.S }}</b-badge>
                </td>
                <td>
                  <b-button variant="primary" size="sm" class="mb-2">Засах</b-button>
                  <b-button variant="danger" size="sm" class="mb-2">Устгах</b-button>
                </td>
              </tr>  
            </template>
            <template v-if="loading">
              <p class="p-3">Уншиж байна ...</p>
            </template>
          </tbody>
        </table>
      </div>
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
          let response = await this.$axios.get("/courses");
          this.loading = false;
          this.courses = response.data;
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      }
    }
	}
</script>