<template>
	<div class="container-fliud">
		<div class="content p-3">
			<nav aria-label="breadcrumb">
			  <ol class="breadcrumb">
			  	<li class="breadcrumb-item">
			    	<nuxt-link to="/home">Нүүр</nuxt-link>
			    </li>
			    <li class="breadcrumb-item">
			    	<nuxt-link to="/info-categories">Ангилалууд</nuxt-link>
			    </li>
			    <li class="breadcrumb-item active" aria-current="page">Нэмэх</li>
			  </ol>
			</nav>

			<b-card bg-variant="light" text-variant="dark">
				<template #header>
	        <h6 class="mb-0">Ангилал нэмэх</h6>
	      </template>

				<b-form @submit.prevent="onSubmit">
					<b-form-group id="input-type" label="Төрөл" label-for="input-type">
            <b-form-select v-model="form.infoType" :options="infoOptions"></b-form-select>
          </b-form-group>

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
        infoOptions: [
          { value: "category_news", text: "Мэдээлэл" },
          { value: "category_advice", text: "Зөвлөмж" },
          { value: "category_exercise", text: "Дасгал хөдөлгөөн" }
        ],
        loading: false,
        form: {
        	infoType: "category_news",
          title: "",
          subtitle: "",
          image: null,
        },
      }
    },
    methods: {
      async onSubmit() {
        this.loading = true;
        const headers = {
          'Content-Type': 'multipart/form-data'
        };

        const uploadedFile = this.form.image ? "uploaded" : "no_upload";

        let formData = new FormData();
        formData.append("infoType", this.form.infoType);
        formData.append("title", this.form.title);
        formData.append("uploadedFile", uploadedFile);
        formData.append("file", this.form.image);
        

        try {
          let response = await this.$axios.post("/info-categories", formData, headers);
          console.log(response);
          this.loading = false;

          if (response.data.success) {
            this.$router.push({ path: '/info-categories' });
          } else {
            alert("Info category delete error");
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      }
    }
  }
</script>