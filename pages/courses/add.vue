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
			    <li class="breadcrumb-item active" aria-current="page">Нэмэх</li>
			  </ol>
			</nav>

			<b-card bg-variant="light" text-variant="dark">
				<template #header>
	        <h6 class="mb-0">Хөтөлбөр нэмэх</h6>
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
				      required
				    >
				    </b-form-file>
			    </b-form-group>
			    
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
        loading: false,
        form: {
          title: '',
          price: '',
          image: null,
          paid: false,
          content: '',
          dayMode: 'select',
          day1: '',
          day2: ''
        },
      }
    },
    methods: {
      async onSubmit() {
        this.loading = true;
        const headers = {
          'Content-Type': 'multipart/form-data',
        };
        const paid = this.form.paid ? "paid" : "free";

        let formData = new FormData();
        formData.append("title", this.form.title);
        formData.append("image", this.form.image);
        formData.append("price", this.form.price);
        formData.append("paid", paid);
        formData.append("content", this.form.content);
        formData.append("dayMode", this.form.dayMode);
        formData.append("day1", this.form.day1);
        formData.append("day2", this.form.day2);

        try {
          let response = await this.$axios.post("/courses", formData, headers);
          console.log(response);
          this.loading = false;

          if (response.data.success) {
            this.$router.push({ path: '/courses' });
          } else {
            alert("Course delete error");
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