var settings = require('./settings');
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc: {
      docs: {
        dest:'./docs/',
        src:['./api/*.js'],
        options: {
          configure : "./jsdoc.conf"
        }
      }
    },
    copy:{
      docs:{expand: true, src: ['./docs/**/**.*'], dest: settings.apiDeployFolder}
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-copy');


  grunt.registerTask('default', ['jsdoc:docs','copy:docs']);

}
