module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'js/src/core.js',
                    'js/src/utility.js',
                    'js/src/yoga.js',
                    'js/src/media.js',
                    'js/src/app.js'
                ],
                dest: 'js/dest/<%= pkg.name %>.js'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            my_target: {
                files: {
                    'js/dest/<%= pkg.name %>.min.js': ['js/dest/<%= pkg.name %>.js']
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['concat', 'uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('min', ['uglify']);
    grunt.registerTask('default', ['concat', 'watch']);

};
