<template>
  <b-navbar toggleable="sm" type="dark" variant="dark">
    <b-navbar-brand to="/">Баясал</b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav v-if="authenticated">
        <b-nav-item to="/courses">Хөтөлбөрүүд</b-nav-item>
        <b-nav-item-dropdown text="Мэдээлэл">
          <b-dropdown-item to="/info-categories">Ангилалууд</b-dropdown-item>
          <b-dropdown-item to="/infos">Бүх мэдээлэлүүд</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown text="Жор">
          <b-dropdown-item to="/recipe-categories">Ангилалууд</b-dropdown-item>
          <b-dropdown-item to="/recipes">Бүх жорууд</b-dropdown-item>
        </b-nav-item-dropdown>
         <b-nav-item-dropdown text="Бусад">
          <b-dropdown-item to="/users">Хэрэглэгчид</b-dropdown-item>
          <b-dropdown-item to="/orders">Захиалгууд</b-dropdown-item>
          <!-- <b-dropdown-item to="/payments">Qpay төлбөрийн жагсаалт</b-dropdown-item> -->
        </b-nav-item-dropdown>
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

<style>
  #nav-collapse .nav-link.nuxt-link-active {
    color: #fff !important;
  }

  #nav-collapse .dropdown-item.nuxt-link-active {
    font-weight: bold !important;
  }
</style>
