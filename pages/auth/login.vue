<template>
  <div class="container mt-3">
    <form @submit.prevent="userLogin" class="form-login">
      
      <div class="alert alert-danger" role="alert" v-if="hasErrors">
        Нэвтрэх оролдлого амжилтгүй
      </div>

      <div class="mb-3">
        <label for="emailInput" class="form-label">Email address</label>
        <input type="email" class="form-control" id="emailInput" v-model="login.email" required>
      </div>
      
      <div class="mb-3">
        <label for="passwordInput" class="form-label">Password</label>
        <input type="password" class="form-control" id="passwordInput" v-model="login.password" required>
      </div>

      <button class="btn btn-primary" type="submit" v-if="!loading">Нэвтрэх</button>
      
      <b-button variant="primary" disabled v-if="loading">
        <b-spinner small></b-spinner>
        <span class="sr-only">Loading...</span>
      </b-button>

    </form>
  </div>
</template>

<script>
export default {
  middleware: ['guest'],
  data() {
    return {
      loading : false,
      hasErrors: false,
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      this.loading = true;
      this.hasErrors = false;
      if (this.username == '' || this.password == '') {
        this.hasErrors = true;
      } else {
        try {
          let response = await this.$auth.loginWith('local', { data: this.login })
          if (response.data.success) {
            this.$router.push({ path: '/' });
            console.log(response);  
          } else {
            this.hasErrors = true;
          }
          this.loading = false;
        } catch (err) {
          this.loading = false;
          this.hasErrors = true;
          console.log(err.response);
        }  
      }
    }
  }
}
</script>

<style>
  .form-login {
    max-width: 300px;
    margin: 0 auto;
  }
</style>