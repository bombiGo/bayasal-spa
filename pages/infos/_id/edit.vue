<template>
  <div class="container-fliud">
    <div class="content p-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <nuxt-link to="/home">Нүүр</nuxt-link>
          </li>
          <li class="breadcrumb-item">
            <nuxt-link to="/infos">Мэдээлэлүүд</nuxt-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Засах</li>
        </ol>
      </nav>

      <b-card bg-variant="light" text-variant="dark" v-if="!isBusy">
        <template #header>
          <h6 class="mb-0">{{ form.title }}</h6>
        </template>

        <b-form @submit.prevent="onSubmit">
          <b-row>
            <b-col sm="6">
              <b-form-group id="info-type" label="Төрөл сонгох" label-for="info-type">
                <b-form-select v-model="form.infoType" :options="infoOptions"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="6">
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
            </b-col>
          </b-row>

          <b-form-group id="input-group-1" label="Мэдээлэлийн нэр" label-for="input-1">
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
          
          <b-form-checkbox 
            v-model="form.featured" 
            switch
            value="accepted"
            unchecked-value="not_accepted"
          >
            Онцлох болгох
          </b-form-checkbox>

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
        infoOptions: [
          { value: "category_news", text: "Мэдээлэл" },
          { value: "category_advice", text: "Зөвлөмж" },
          { value: "category_exercise", text: "Дасгал хөдөлгөөн" }
        ],
        categoryOptions: [],
        selectedCategories: [],
        isBusy: false,
        loading: false,
        form: {
          title: "",
          subtitle: "",
          image: null,
          infoType: "",
          categoryValues: [],
          content: "",
          featured: "not_accepted"
        },
        imageSrc: '' 
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isBusy = true;

        try {
          let response = await this.$axios.get("/infos/edit?pk=" + this.$route.params.id);
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
        formData.append("infoType", this.form.infoType);
        formData.append("title", this.form.title);
        formData.append("subtitle", this.form.subtitle);
        formData.append("content", this.form.content);
        formData.append("featured", this.form.featured);
        formData.append("uploadedFile", uploadedFile);
        formData.append("file", this.form.image);
        formData.append("oldFile", this.imageSrc);
        
        try {
          let response = await this.$axios.post("/infos/edit", formData, headers);
          console.log(response);
          this.loading = false;

          if (response.data.success) {
            this.$router.push({ path: '/infos' });
          } else {
            alert("Info update error");
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
        this.form.infoType = data.type ? data.type.S : "";
        this.form.title = data.title ? data.title.S : "";
        this.form.subtitle = data.subtitle ? data.subtitle.S : "";
        this.form.content = data.content ? data.content.S : "";
        this.imageSrc = data.image ? data.image.S : "";

        if (data.featured && data.featured.BOOL) {
          this.form.featured = "accepted";
        }

        this.selectedCategories = data.categories;
        this.updateSelectedCategories();

        console.log(data);
      },
      updateCategories(categoryType) {
        this.$store.getters.infoCategories.forEach(category => {
          if (category.type.S == categoryType) {
            this.categoryOptions.push({
              value: category.PK.S,
              text: category.title.S
            });  
          }
        });

        this.updateSelectedCategories(categoryType);
      },
      updateSelectedCategories(categoryType) {
        this.selectedCategories.forEach(category => {
          if (category.CategoryMode && category.CategoryMode.S ) {
            if (categoryType == category.CategoryMode.S) {
              this.form.categoryValues.push({
                text: this.getCategoryName(category.CategoryId.S),
                value: category.CategoryId.S,
              });  
            }  
          }
        });
      },
      getCategoryName(categoryId) {
        let find = this.$store.getters.infoCategories.find(data => data.PK.S == categoryId);
        if (find) {
          return find.title.S;
        } else {
          return categoryId;
        }
      }
    },
    watch: {
      "form.infoType": function(value) {
        this.categoryOptions = [];
        this.form.categoryValues = [];
        this.updateCategories(value);
      }
    }
  }
</script>