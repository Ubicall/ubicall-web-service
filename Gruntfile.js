var settings = require('./settings');
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc: {
      docs: {
        dest: './docs/',
        src: ['./api/*.js'],
        options: {
          configure: "./jsdoc.conf"
        }
      }
    },
    apidoc: {
      myapp: {
        src: "./api/",
        dest: "./apidoc/",
        options:{
         includeFilters: [ ".*\\.js$" ],
         excludeFilters: [ "node_modules/" ]
        }
      }
    },
    copy: {
      docs: {
        expand : true,
        cwd : './docs/',
        src : ['**/*.*'],
        dest: settings.apiDeployFolder
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-apidoc');
//  grunt.registerTask('default', ['jsdoc:docs', 'copy:docs']);

  grunt.registerTask('default', ['apidoc:myapp']);

}
