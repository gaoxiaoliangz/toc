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
        sourceMap: false,
        mangle: false
      },
      target: {
        files: {
          'dist/js/outline.min.js': ['src/js/outline.js']
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'none',
        },
        files: {
          "dist/css/outline.min.css": "src/scss/outline.scss",
        }
      },
      example: {
        options: {
          style: 'expened',
          sourcemap: 'none'
        },
        files: {
          "example/style.css": "src/scss/style.scss"
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
          "example/index.html": "src/jade/index.jade"
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
        files: ['src/jade/*.jade'],
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
