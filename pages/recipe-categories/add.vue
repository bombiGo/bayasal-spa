<template>
	<div class="container-fliud">
		<div class="content p-3">
			<nav aria-label="breadcrumb">
			  <ol class="breadcrumb">
			  	<li class="breadcrumb-item">
			    	<nuxt-link to="/home">Нүүр</nuxt-link>
			    </li>
			    <li class="breadcrumb-item">
			    	<nuxt-link to="/recipe-categories">Ангилалууд</nuxt-link>
			    </li>
			    <li class="breadcrumb-item active" aria-current="page">Нэмэх</li>
			  </ol>
			</nav>

			<b-card bg-variant="light" text-variant="dark">
				<template #header>
	        <h6 class="mb-0">Ангилал нэмэх</h6>
	      </template>

				<b-form @submit.prevent="onSubmit">
		      <b-form-group id="input-group-1" label="Ангилалын нэр" label-for="input-1">
		        <b-form-input
		          id="input-1"
		          v-model="form.title"
		          required
		        ></b-form-input>
		      </b-form-group>

		      <b-form-group id="input-group-2" label="Зураг оруулах" label-for="input-2">
			      <b-form-file
			      	id="input-2"
				      v-model="form.image"
				    >
				    </b-form-file>
			    </b-form-group>

          <b-button variant="primary" type="submit" class="mt-3" v-if="!loading">
            Хадгалах
          </b-button>
      
          <b-button variant="primary" disabled class="mt-3" v-if="loading">
            <b-spinner small></b-spinner>
            <span class="sr-only">Loading...</span>
          </b-button>
		    </b-form>
		  </b-card>
		</div>
	</div>
</template>

<script>
	export default {
		middleware: ['auth'],
    data() {
      return {
        loading: false,
        form: {
          title: "",
          image: null,
        }
      }
    },
    methods: {
      async onSubmit() {
        this.loading = true;

        const headers = {
          "Content-Type": "multipart/form-data"
        };

        const uploadedFile = this.form.image ? "uploaded" : "no_upload";

        let formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("uploadedFile", uploadedFile);
        formData.append("file", this.form.image);
        
        try {
          let response = await this.$axios.post("/recipe-categories", formData, headers);
          console.log(response);
          this.loading = false;

          if (response.data.success) {
            this.$router.push({ path: "/recipe-categories" });
          } else {
            alert("Recipe category delete error");
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      }
    }
  }
</script>