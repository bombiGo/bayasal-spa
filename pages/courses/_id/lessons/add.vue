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
          <li class="breadcrumb-item">
            <nuxt-link :to="{ name: 'courses-id-show', params: { id: $route.params.id } }">
              {{ $route.query.title | truncate(40, "...") }}
            </nuxt-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Шинэ хичээл</li>
        </ol>
      </nav>

      <b-form @submit.prevent="onSubmit">
        <b-card bg-variant="light" text-variant="dark">
          <template #header>
            <h6 class="float-left">Хичээл нэмэх</h6>
            <div class="float-right">
              <b-button variant="primary" type="submit" v-if="!loading">
                Хадгалах
              </b-button>
          
              <b-button variant="primary" disabled v-if="loading">
                <b-spinner small></b-spinner>
                <span class="sr-only">Loading...</span>
              </b-button> 
            </div>
          </template>

          <b-form-group label="Өдөр сонгох">
            <b-form-select v-model="form.dayNumber" v-if="$route.query.dayMode === 'select'" required>
              <option value="">-- Сонгох --</option>
              <option v-for="(n, index) in courseDayNumber" :key="index" :value="n">
                {{ n }} өдөр
              </option>
            </b-form-select>

            <input type="date" v-model="form.dayCalendar" class="form-control" v-if="$route.query.dayMode === 'calendar'">
          </b-form-group>

          <b-form-group id="input-group-1" label="Хичээлийн гарчиг" label-for="input-1">
            <b-form-input
              id="input-1"
              v-model="form.title"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-radio-group
            v-model="contentSelected"
            :options="contentOptions"
            class="mb-3"
            value-field="item"
            text-field="name"
            disabled-field="notEnabled"
          ></b-form-radio-group>

          <b-form-group
            id="input-youtube"
            v-if="contentSelected === 'youtube'"
          >
            <b-form-input
              id="input-youtube"
              v-model="form.youtube"
              type="text"
              placeholder="Video"
            ></b-form-input>
          </b-form-group>

          <b-form-group v-if="contentSelected === 'file'">
            <b-form-file
              v-model="form.file"
              placeholder="Pdf, excel, image ..."
            ></b-form-file>
          </b-form-group>

          <b-form-group
            id="input-duration"
            label="Хугацаа/Хэмжээ"
          >
            <b-form-input
              id="input-youtube"
              v-model="form.duration"
              type="text"
              placeholder="Файл - 10 миниут, 3kb"
            ></b-form-input>
          </b-form-group>
          
          <b-form-checkbox
            id="checkbox-lesson"
            v-model="form.locked"
            value="locked"
            unchecked-value="unlocked"
          >
            Хичээл түгжих / нээх
          </b-form-checkbox>

          <div class="mt-3" :style="{'opacity': editorOpacity + ' !important', 'pointer-events': editorPointerEvents}">
            <div class="quill-editor"
               :content="form.content"
               v-quill:myQuillEditor="editorOption"
               @change="onEditorChange($event)"
               :style="{'height': editorHeight + 'px'}" style="background-color: white;">
            </div>
          </div>
        </b-card>
      </b-form>
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
        editorHeight: 0,
        editorOpacity: 0,
        editorPointerEvents: "none",
        loading: false,
        courseDayNumber: 0,
        courseDayCalendar: "",
        daySelected: 'select',
        contentSelected: 'youtube',
        contentOptions: [
          { item: 'youtube', name: 'Видео' },
          { item: 'file', name: 'Файл' },
          { item: 'editor', name: 'Текст зураг' }
        ],
        form: {
          title: "",
          dayNumber: "",
          dayCalendar: "",
          content: "",
          file: null,
          youtube: "",
          duration: "",
          locked: "locked"
        }
      }
    },
    created() {
      this.form.dayMode = this.$route.query.dayMode;
      
      if (this.$route.query.dayMode === "select") {
        // is number
        if (!isNaN(this.$route.query.dayNumber)) {
          this.courseDayNumber = parseInt(this.$route.query.dayNumber);  
        }
      }
    },
    filters: {
      truncate: function (text, length, suffix) {
        if (text.length > length) {
          return text.substring(0, length) + suffix;
        } else {
          return text;
        }
      }
    },
    methods: {
      onEditorChange({editor,html,text}) {
        this.form.content = html
      },
      async onSubmit() {
        this.loading = true;
        const headers = {
          "Content-Type": "multipart/form-data"
        };

        const uploadedFile = this.form.file ? "uploaded" : "no_upload";

        if (this.contentSelected !== "editor") {
          this.form.content = "";
        }

        let formData = new FormData();
        formData.append("courseId", this.$route.params.id);
        formData.append("title", this.form.title);
        formData.append("file", this.form.file);
        formData.append("fileUpload", uploadedFile);
        formData.append("content", this.form.content);
        formData.append("youtube", this.form.youtube);
        formData.append("contentMode", this.contentSelected);
        formData.append("content", this.form.content);
        formData.append("dayNumber", this.form.dayNumber);
        formData.append("dayCalendar", this.form.dayCalendar);
        formData.append("locked", this.form.locked);
        formData.append("duration", this.form.duration);

        try {
          let response = await this.$axios.post("/lessons", formData, headers);
          if (response.data.success) {
            this.$router.push({ name: 'courses-id-show', params: { id: this.$route.params.id }});
          }
          this.loading = false;
        } catch (err) {
          this.loading = false;
          console.log(err);
        }
      }
    },
    watch: {
      daySelected: function() {
        this.form.day = "";
      },
      contentSelected: function(val) {
        if (val === "editor") {
          this.editorOpacity = 1;
          this.editorHeight = 250;
          this.editorPointerEvents = "auto";
        } else {
          this.editorOpacity = 0;
          this.editorHeight = 0;
          this.editorPointerEvents = "none";
        }

        if (val !== "file") {
          this.form.file = null;
        }

        if (val !== "youtube") {
          this.form.youtube = "";
        }
      }
    }
	}
</script>