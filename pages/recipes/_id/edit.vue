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
          <li class="breadcrumb-item active" aria-current="page">Засах</li>
        </ol>
      </nav>

      <b-card bg-variant="light" text-variant="dark" v-if="!isBusy">
        <template #header>
          <h6 class="mb-0">{{ form.title }}</h6>
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

          <b-form-group id="subtitle" label="Дэд тайлбар" label-for="subtitle">
            <b-form-textarea
              id="subtitle"
              v-model="form.subtitle"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group id="input-group-2" label="Зураг оруулах" label-for="input-2">
            <b-form-file
              id="input-2"
              v-model="form.image"
            >
            </b-form-file>
          </b-form-group>

          <div class="m-3" v-if="imageSrc">
            <img :src="imageSrc" class="img-fluid" style="max-width:200px;" />
          </div>
          

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
      <p v-if="isBusy">Уншиж байна</p>
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
        isBusy: false,
        loading: false,
        form: {
          title: "",
          subtitle: "",
          image: null,
          categoryValues: [],
          content: "",
        },
        imageSrc: '' 
      }
    },
    created() {
      this.fetchData();
      this.updateCategories();
    },
    methods: {
      updateCategories() {
        this.$store.getters.recipeCategories.forEach(category => {
          this.categoryOptions.push({
            text: category.title.S,
            value: category.PK.S
          })
        });
      },
      async fetchData() {
        this.isBusy = true;

        try {
          let response = await this.$axios.get("/recipes/edit?pk=" + this.$route.params.id);
          if (response.data) {
            this.setFormData(response.data);
          } 
          this.isBusy = false;
        } catch (err) {
          this.isBusy = false;
          console.log(err);
        }
      },
      async onSubmit() {
        this.loading = true;
        
        const headers = {
          'Content-Type': 'multipart/form-data',
        };

        const uploadedFile = this.form.image ? "uploaded" : "no_upload";

        let formData = new FormData();
        formData.append("pk", this.$route.params.id);
        formData.append("categoryValues", JSON.stringify(this.form.categoryValues));
        formData.append("title", this.form.title);
        formData.append("subtitle", this.form.subtitle);
        formData.append("content", this.form.content);
        formData.append("uploadedFile", uploadedFile);
        formData.append("file", this.form.image);
        formData.append("oldFile", this.imageSrc);
        
        try {
          let response = await this.$axios.post("/recipes/edit", formData, headers);
          console.log(response);
          this.loading = false;

          if (response.data.success) {
            this.$router.push({ path: '/recipes' });
          } else {
            alert("Recipe update error");
          }
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      },
      onEditorChange({editor,html,text}){
        this.form.content = html
      },
      setFormData(data) {
        this.form.title = data.title ? data.title.S : "";
        this.form.subtitle = data.subtitle ? data.subtitle.S : "";
        this.form.content = data.content ? data.content.S : "";
        this.imageSrc = data.image ? data.image.S : "";

        if (data.categoryValues && data.categoryValues.L) {
          data.categoryValues.L.forEach(categoryValue => {
            this.form.categoryValues.push({
              text: categoryValue.M.text.S,
              value: categoryValue.M.value.S,
            })
          });
        }
        console.log(data);
      },
      updateCategories() {
        this.$store.getters.recipeCategories.forEach(category => {
          this.categoryOptions.push({
            text: category.title.S,
            value: category.PK.S
          });
        });
      }
    },
    watch: {
      "form.infoType": function(value) {
        this.categories = [];
        this.updateCategories(value);
      }
    }
  }
</script>