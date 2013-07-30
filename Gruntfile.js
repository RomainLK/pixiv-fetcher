module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify : {
    	main:{
    		files: {
    			'build/output.min.user.js' : ['src/*']
    		}
    	}
    }
  });
  
grunt.loadNpmTasks('grunt-contrib-uglify');