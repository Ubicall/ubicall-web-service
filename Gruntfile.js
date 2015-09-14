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
    copy: {
      docs: {
        expand : true,
        cwd : './docs/',
        src : ['**/*.*'],
        dest: "/var/www/html/docs/"
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-copy');


  grunt.registerTask('default', ['jsdoc:docs', 'copy:docs']);

}
