<template>
	<div class="container-fliud">
		<div class="content p-3">
			<nav aria-label="breadcrumb">
			  <ol class="breadcrumb">
			  	<li class="breadcrumb-item">
			    	<nuxt-link to="/home">Нүүр</nuxt-link>
			    </li>
			    <li class="breadcrumb-item">
			    	<nuxt-link to="/recipes">Жорууд</nuxt-link>
			    </li>
			    <li class="breadcrumb-item active" aria-current="page">Нэмэх</li>
			  </ol>
			</nav>

			<b-card bg-variant="light" text-variant="dark">
				<template #header>
	        <h6 class="mb-0">Жор нэмэх</h6>
	      </template>

				<b-form @submit.prevent="onSubmit">
          <b-form-group label="Ангилал сонгох">
            <multiselect 
              v-model="form.categoryValues" 
              label="text" 
              track-by="value"
              :options="categoryOptions" 
              :multiple="true" 
              :taggable="true"
            ></multiselect>
          </b-form-group>

		      <b-form-group id="input-group-1" label="Жорын нэр" label-for="input-1">
		        <b-form-input
		          id="input-1"
		          v-model="form.title"
		          required
		        ></b-form-input>
		      </b-form-group>

          <b-form-group id="subtitle" label="Жорын тайлбар" label-for="subtitle">
            <b-form-input
              id="subtitle"
              v-model="form.subtitle"
              rows="3"
              max-rows="6"
            ></b-form-input>
          </b-form-group>

		      <b-form-group id="input-group-2" label="Зураг оруулах" label-for="input-2">
			      <b-form-file
			      	id="input-2"
				      v-model="form.image"
				      required
				    >
				    </b-form-file>
			    </b-form-group>
			   
          <div class="mt-3">
            <label>Дэлгэрэнгүй</label>
  		      <div class="quill-editor"
               :content="form.content"
               v-quill:myQuillEditor="editorOption"
               @change="onEditorChange($event)"
               style="height: 250px; background-color: white;">
            </div>
          </div>

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
  import Multiselect from 'vue-multiselect';

	export default {
    components: {
      Multiselect
    },
    data() {
      return {
        editorOption: {
          bounds: 'app',
          placeholder: '',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['image']
              ]
            }
          }
        },
        categoryOptions: [],
        loading: false,
        form: {
          title: "",
          subtitle: "",
          image: null,
          categoryValues: [],
          content: ""
        }
      }
    },
    created() {
      this.$store.getters.recipeCategories.forEach(category => {
        this.categoryOptions.push({
          text: category.title.S,
          value: category.PK.S
        })
      });
    },
    methods: {
      async onSubmit() {

        this.loading = true;
        
        const headers = {
          'Content-Type': 'multipart/form-data',
        };

        const uploadedFile = this.form.image ? "uploaded" : "no_upload";

        let formData = new FormData();
        formData.append("categoryValues", JSON.stringify(this.form.categoryValues));
        formData.append("title", this.form.title);
        formData.append("subtitle", this.form.subtitle);
        formData.append("content", this.form.content);
        formData.append("uploadedFile", uploadedFile);
        formData.append("file", this.form.image);
        
        try {
          let response = await this.$axios.post("/recipes", formData, headers);
          console.log(response);
          this.loading = false;

          if (response.data.success) {
            this.$router.push({ path: '/recipes' });
          } else {
            alert("Recipe create delete error");
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      onEditorChange({editor,html,text}){
        this.form.content = html
      }
    }
  }
</script>