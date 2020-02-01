module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      options: {
        livereload: true
      },
    },
    connect: {
      debug: {
        options: {
          port: 3000,
          hostname: 'localhost',
          middleware: function (connect) {
            return [
              connect.static('app'),
              require('./database/do')
            ];
          }
        }
      }
    },
    mock2easy: {
      dev:{
        options: {
          port:4000,
          lazyLoadTime:1500,
          database:'database',
          doc:'doc',
          keepAlive:false,
          ignoreField:['__preventCache'],
          interfaceSuffix:'.json',
          preferredLanguage:'cn'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mock2easy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['mock2easy','connect','watch']);

};
