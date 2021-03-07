<template>
	<div class="container-fliud">
		<div class="content p-3">
      <h5>Төлбөрийн жагсаалт ({{ payments.length }})</h5>

      <div class="table-responsive mt-3">
  			<table class="table">
          <thead class="thead-light">
            <tr>
              <th scope="col">Column 1</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="!loading">
              <tr v-for="payment in payments">
                <td>{{ payment }}</td>
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
        payments: [],
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
          let response = await this.$axios.get("/payments/list");
          this.loading = false;

          if (response.data.success) {
            this.payments = response.data.payments;
          }
          
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      }
    }
	};
</script>