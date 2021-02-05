<template>
  <b-navbar toggleable="sm" type="dark" variant="dark">
    <b-navbar-brand to="/">Баясал</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="authenticated">
        <b-nav-item to="/courses">Хөтөлбөрүүд</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right v-if="authenticated">
          <template #button-content>
            <em>{{ user.email }}</em>
          </template>
          <b-dropdown-item @click="logout">Гарах</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item to="/auth/login" v-if="!authenticated" right>Нэвтрэх</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  methods: {
    async logout() {
      try {
        await this.$auth.logout();  
      } catch (err) {
        console.log(err);
      }
    }
  }
}
</script>
