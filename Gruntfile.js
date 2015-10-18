module.exports = function(grunt) {

  var appConfig = {
    nginx: 'conf/nginx'
  };

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
        expand: true,
        cwd: './docs/',
        src: ['**/*.*'],
        dest: "/var/www/html/docs/"
      },
      nginx: {
        expand: true,
        cwd: appConfig.nginx,
        src:  ['**/*.conf'],
        dest: '/etc/nginx/conf.d/'
      },
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-nginx');

  grunt.registerTask('preserve', 'connect resources for development mode deployment', [
    'jsdoc:docs', 'copy:docs', 'copy:nginx', 'nginx:restart'
  ]);

  grunt.registerTask('prebuild', 'connect resources for production mode deployment', [
    'jsdoc:docs', 'copy:docs', 'copy:nginx', 'nginx:restart'
  ]);

  grunt.registerTask('default', ['jsdoc:docs', 'copy:docs', 'copy:nginx', 'nginx:restart']);

};
