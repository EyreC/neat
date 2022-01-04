<template>
  <div>
    <h1 style="color:rgb(52, 235, 225)">Neat</h1>
    <base-button @click="open_source_dialog">Set Source Folder</base-button>
    <preview :img_display_tag="img_display_tag"></preview>
    <base-button @click="open_target_dialog">Add Destination Folder</base-button>
    <destination-container :destinations="display_target_dirs" 
                            v-on:remove-destination="remove_destination"
                            v-on:move-file="move_file">
                            </destination-container>
  </div>
</template>

<script>
import DestinationContainer from './DestinationContainer.vue'
import BaseButton from './BaseButton.vue'
import Preview from './Preview.vue'
export default {

  name: 'MainUI',
  components: {
    DestinationContainer,
    BaseButton,
    Preview
  },
  data() {
    return {
      trash_path: '',
      target_dirs: [],
      source_dir: '',
      img_display_tag: '',
      files_in_source: [],
      file_idx: 0
    }
  },
  mounted(){
    document.addEventListener('keydown', function (event) {
    const allowed_keys = ['0','1','2','3','4','5','6','7','8','9'];
    if (event.ctrlKey && allowed_keys.includes(event.key)) {
      window.api.trigger_shortcut('myChannel',event.key);
    }
   
    });
        window.api.save_target_dir('myChannel', this.save_target_dir)
        window.api.save_source_dir('myChannel', this.save_source_dir, this.update_source_files)
        window.api.set_base64_img('myChannel', this.set_base64_img)
        window.api.trigger_shortcut_reply('myChannel', this.next_file)
        window.api.get_trash_location_reply('myChannel', this.set_trash_location)
  },
  computed: {
    current_file_path: function() {
      const file_path = `${this.source_dir}/${this.current_file_name}`
      return file_path;
    },
   current_file_name: function() {
     if (this.files_in_source.length === 0){
       return null;
     }
     return this.files_in_source[this.file_idx]
   },
   display_target_dirs: function() {
     let arr = []
     if (this.trash_path !== ''){
       arr.push({directory_path: this.trash_path, label: 'Move to Trash' })
     }
     for (const dir of this.target_dirs){
       arr.push(dir)
     }
     return arr;
   }
   
  },
  methods: {
    set_trash_location(path){
      this.trash_path = path;
    },
    remove_destination(dir_path){
      // remove from list
      const directory_idx = this.target_dirs.indexOf(dir_path)
      this.target_dirs.splice(directory_idx, 1);

      window.api.remove_target_dir('myChannel', dir_path);

      // update shortcuts
      
    },
    update_source_files(files){
      this.files_in_source = files;
    },
    next_file() {
      const next_idx = this.file_idx + 1;
      const max_idx = this.files_in_source.length - 1;
      if (next_idx > max_idx){
        // reached end of folder
        // clear existing img
        this.img_display_tag = ''
        
        return;
      }
      this.file_idx = next_idx
      const file_path = this.source_dir + '/' + this.files_in_source[this.file_idx]
      this.get_base64_img(file_path)
      console.log('file id ' + next_idx)
      window.api.set_current_file_path('myChannel', file_path)
    },
    get_base64_img(path){
      window.api.get_base64_img('myChannel', path);
    },
    set_base64_img(img_str){
      this.img_display_tag = `data:image/png;base64,${img_str}`
    },
    move_file(target_directory_path) {
      const dest = target_directory_path + '/' + this.current_file_name
      console.log('current file path ' + this.current_file_path)
      window.api.move_file('myChannel', this.current_file_path, dest)
      this.next_file()
    },
    save_target_dir(selectedDir) {
      const dir_obg = {directory_path: selectedDir}
      this.target_dirs.push(dir_obg);
    },
    save_source_dir(selected_dir){
      this.source_dir = selected_dir
    },
    open_source_dialog() {
      window.api.open_source_dialog('myChannel')
    },
    open_target_dialog() {
      window.api.open_target_dialog('myChannel')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
