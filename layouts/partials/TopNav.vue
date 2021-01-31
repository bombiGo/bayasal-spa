<template>
  <nav class="navbar navbar-expand-sm navbar-dark" style="background-color: #23b89b;">
  <div class="container-fluid">
    <a class="navbar-brand p-0" href="#">
			<img src="@/assets/img/child.png" width="40" class="navbar-logo">
    </a>
   
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav pt-0 pb-0 me-auto">
        <template  v-if="authenticated">
          <li class="nav-item">
            <NuxtLink class="nav-link active" to="/">Хөтөлбөр</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/recipes">Хоолны жор</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/users">Хэрэглэгчид</NuxtLink>
          </li>
        </template>
      </ul>

      <ul class="navbar-nav ml-auto" v-if="!authenticated">
        <li class="nav-item">
          <NuxtLink class="nav-link" to="/auth/login">Нэвтрэх</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script>
export default {}
</script>

<style scoped>
	.navbar-brand {
		width: 50px;
		min-height: 48px;
	}

	.navbar-logo {
		position: absolute;
		top: 0;
		margin-top: 4px;
	}

	.nav-link {
		font-size: 14px;
		font-weight: 400px;
	}

	.nav-link.active {
		font-weight: 500 !important;
	}
</style>