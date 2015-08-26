
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
      //  src: 'src/<%=api/v1/ivr%>.js',

        //src: 'src/<%= pkg.name %>.js',
        src: 'api/v1/ivr.js',
        dest: 'dest/js'
        //dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jsdoc : {
        dist : {
            src: ['api/v1/ivr.js','api/v1/ivr.js','api/v1/ivr.js' ],
            dest: 'doc/doc1'
        }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-jsdoc');
  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
