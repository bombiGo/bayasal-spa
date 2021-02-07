<template>
	<div class="container-fliud">
		<div class="content p-3">
			<nav aria-label="breadcrumb">
			  <ol class="breadcrumb">
			  	<li class="breadcrumb-item">
			    	<nuxt-link to="/home">Нүүр</nuxt-link>
			    </li>
			    <li class="breadcrumb-item">
			    	<nuxt-link to="/courses">Хөтөлбөрүүд</nuxt-link>
			    </li>
			    <li class="breadcrumb-item active" aria-current="page">Засах</li>
			  </ol>
			</nav>

			<b-card bg-variant="light" text-variant="dark" v-if="!isBusy">
				<template #header>
	        <h6 class="mb-0">Хөтөлбөр засах</h6>
	      </template>

				<b-form @submit.prevent="onSubmit">
		      <b-form-group id="input-group-1" label="Хөтөлбөрийн нэр" label-for="input-1">
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

          <div class="m-3" v-if="imageSrc">
            <img :src="imageSrc" class="img-fluid" width="200" />
          </div>
			    
		      <b-form-group id="input-group-3" label="Үнэ" label-for="input-3">
		        <b-form-input
		        	type="number"
		          id="input-3"
		          v-model="form.price"
		          required
		        ></b-form-input>
		      </b-form-group>

		      <b-form-checkbox class="mb-2 mr-sm-2 mb-sm-0" v-model="form.paid">
		      	Төлбөртэй
		      </b-form-checkbox>

          <b-row class="mt-3">
            <b-col sm="4">
              <b-form-group id="input-group-5" label="Өдөр сонгох" label-for="input-5">
                <b-form-select v-model="form.dayMode" :options="dayOptions"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group id="input-group-4" label="Өдөр" label-for="input-4">
                <b-form-input
                  type="number"
                  id="input-4"
                  v-model="form.day1"
                  required
                  placeholder="7 өдөр"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col sm="4">
              <b-form-group id="input-group-4" label="Өдөр гарчиг" label-for="input-4">
                <b-form-input
                  id="input-4"
                  v-model="form.day2"
                  required
                  placeholder="7 өдрийн хөтөлбөр"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>

          <div class="mt-0">
            <label>Дэлгэрэнгүй</label>
  		      <div class="quill-editor"
               :content="form.content"
               v-quill:myQuillEditor="editorOption"
               @change="onEditorChange($event)"
               style="height: 250px;">
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
	export default {
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
        dayOptions: [
          { value: 'select', text: 'Жагсаалт' },
          { value: 'calendar', text: 'Календарь' }
        ],
        isBusy: false,
        loading: false,
        form: {
          title: '',
          price: '',
          image: null,
          paid: false,
          content: '',
          dayMode: '',
          day1: '',
          day2: ''
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
          let response = await this.$axios.get("/courses/edit?id=" + this.$route.params.id);
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
        const paid = this.form.paid ? "paid" : "free";
        const uploadedImage = this.form.image ? "uploaded" : "no_upload";

        let formData = new FormData();
        formData.append("id", this.$route.params.id);
        formData.append("title", this.form.title);
        formData.append("image", this.form.image);
        formData.append("image_upload", uploadedImage);
        formData.append("old_image", this.imageSrc);
        formData.append("price", this.form.price);
        formData.append("paid", paid);
        formData.append("content", this.form.content);
        formData.append("dayMode", this.form.dayMode);
        formData.append("day1", this.form.day1);
        formData.append("day2", this.form.day2);

        try {
          let response = await this.$axios.post("/courses/edit", formData, headers);
          
          if (response.data.success) {
            this.$router.push({ path: '/courses' });
          } else {
            alert("Course update error");
          }
          this.loading = false;
          console.log(response);
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
        this.form.price = data.price ? data.price.S : "";
        this.form.paid = data.paid ? data.paid.BOOL : false;
        this.form.content = data.content ? data.content.S : "";
        this.form.dayMode = data.dayMode ? data.dayMode.S : "select";
        this.form.day1 = data.day1 ? data.day1.S : "";
        this.form.day2 = data.day2 ? data.day2.S : "";
        this.imageSrc = data.image ? data.image.S : "";
       
        console.log(data);
      }
    }
  }
</script>