<template>
  <div class="container mt-3">
    <form @submit.prevent="userLogin" class="form-login">
      
      <div class="alert alert-danger" role="alert" v-if="hasErrors">
        Нэвтрэх оролдлого амжилтгүй
      </div>

      <div class="mb-3">
        <label for="emailInput" class="form-label">Email address</label>
        <input type="email" class="form-control" id="emailInput" v-model="login.email">
      </div>
      <div class="mb-3">
        <label for="passwordInput" class="form-label">Password</label>
        <input type="password" class="form-control" id="passwordInput" v-model="login.password">
      </div>
      <button class="btn btn-primary" type="submit">Нэвтрэх</button>
    </form>
  </div>
</template>

<script>
export default {
  middleware: ['guest'],
  data() {
    return {
      hasErrors: false,
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      this.hasErrors = false;
      if (this.username == '' || this.username == '') {

      } else {
        try {
          let response = await this.$auth.loginWith('local', { data: this.login })
          if (response.data.status) {
            this.$router.push({ path: '/' });
            console.log(response);  
          }
        } catch (err) {
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