/*global grunt: true*/
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				comments: true
			},
			main: {
				options: {
					preserveComments: 'all'
					},
				files: {
					'build/pixiv-fetcher.min.user.js': ['src/pixiv-fetcher.user.js'],
					'build/reverse-pixiv.min.user.js': ['src/reverse-pixiv.user.js']
				},
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
};
