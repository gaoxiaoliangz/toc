module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    babel: {
      es2015: {
        options: {
          sourceMap: true,
          presets: ['es2015']
        },
        files: {
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        mangle: {
        }
      },
      target: {
        files: {
          'dist/js/outliner.min.js': ['src/js/outliner.js','src/js/animateicon.js']
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          "dist/css/outliner.min.css": "src/scss/outliner.scss",
          "example/style.min.css": "example/style.scss"
        }
      }
    },

    jade: {
      compile: {
        options: {
          data: {
            debug: true
          }
        },
        files: {
          "example/index.html": "example/index.jade"
        }
      }
    },

    image: {
      static: {
        options: {
          pngquant: true,
          optipng: false,
          zopflipng: true,
          advpng: true,
          jpegRecompress: false,
          jpegoptim: true,
          mozjpeg: true,
          gifsicle: true,
          svgo: true
        }
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,gif,svg}'],
          dest: 'dist/'
        }]
      }
    },

    watch: {
      css: {
        files: ['*/*.scss','src/scss/*.scss'],
        tasks: ['sass'],
        options: {
            spawn: false
        },
      },
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['babel',"uglify"],
        options: {
          spawn: false,
        }
      },
      html: {
        files: ['example/*.jade'],
        tasks: ['jade'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.registerTask("default", ["babel","sass","uglify","jade"]);
  grunt.registerTask('w',['watch']);

};
