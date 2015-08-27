module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc: {
      dist: {
        src: ['./api/**.js'],
        options: {
          configure : "./jsdoc.conf"
        }
      }
    },
    copy: {
      main: {
    files: [
      // includes files within path and its sub-directories
      {expand: true, src: ['./**'], dest: 'www/'},
    ]
  }
  }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['jsdoc']);

}
