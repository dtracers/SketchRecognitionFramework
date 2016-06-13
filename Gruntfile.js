//jscs:disable jsDoc

var pbjs = require('protobufjs/cli/pbjs.js');
var exec = require('child_process').exec;

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-regex-check');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-exec');


    var gruntOptions = {
        skipTests: (process.env.GRUNT_SKIP_TESTS || false) === 'true'
    };

    console.log(gruntOptions);

    /******************************************
     * GRUNT INIT
     ******************************************/

    grunt.initConfig({
        fileConfigOptions: {
            prodHtml: [ 'target/website/index.html', 'target/website/src/**/*.html', '!target/website/src/main/web/utilities/libraries/**/*.html' ],
            prodFiles: [ 'target/website/index.html', 'target/website/src/**/*.html', 'target/website/src/**/*.js',
                '!target/website/src/main/web/utilities/libraries/**/*.js', '!target/website/src/main/web/utilities/libraries/**/*.html' ]
        },
        /**
         * CHECKSTYLE
         */
        jshint: {
            options: {
                jshintrc: 'config/.jshintrc',
                ignores: [ 'src/main/js/utilities/libraries/**/*.js', 'src/test/js/testUtilities/**/*.js', 'src/main/js/generated_proto/**/*.js' ],
                globals: {
                    module: true
                },
                reporter:'jslint',
                reporterOutput: 'target/jshint.xml'
            },
            files: [ 'Gruntfile.js', 'src/main/js/**/*.js', 'src/test/js/**/*.js',
                '!src/main/js/utilities/libraries/**/*.js', '!src/test/js/**/*.js', '!src/main/js/generated_proto/**/*.js' ]
        },
        jscs: {
            src: '<%= jshint.files %>',
            options: {
                config: 'config/jscs.conf.jscsrc',
                reporterOutput: 'target/jscsReport.txt',
                maxErrors: 1000
            }
        },
        /**
         * JSDOC
         */
        jsdoc: {
            dist: {
                src: '<%= jshint.files %>',
                options: {
                    destination: 'doc'
                }
            }
        },
        /**
         * Directory Creation
         */
        mkdir: {
            all: {
                options: {
                    create: [ 'target/unitTest', 'target/screenshots', 'target/website/proto', 'src/main/js/generated_proto' ]
                }
            }
        },

        /**
         * BUILDERS
         */
        exec: {
            build_proto: {
                cmd: function() {
                    var inputFiles = [ 'src/**/proto/**/*.proto' ];
                    var protoFiles = grunt.file.expand(inputFiles);
                    var jsFiles = grunt.file.expandMapping(protoFiles, 'src/main/js/generated_proto', { flatten: true, ext: '.js' });
                    var command = '';
                    for (var i = 0; i < protoFiles.length; i++) {
                        grunt.log.write('cimpiling protofile ' + protoFiles[i]);
                        grunt.log.write('');
                        var jsFile = jsFiles[i].dest;
                        command+= '"./node_modules/.bin/pbjs" ' + protoFiles[i] + ' --source=proto' +
                                ' --dependency="protobufjs"' +
                            ' --target=amd --path=src/main/proto > ' + jsFile + ' & ';
                    }
                    console.log(command);
                    return command + 'echo "completed compile"';
                }
            }
        },
        babel: {
            options: {
                sourceMap: true
            },
            all: {
                files: [
                    {
                        expand: true,
                        src: [ 'target/website/src/main/web/**/*.js', '!target/website/src/main/web/utilities/libraries/**/*.js' ],
                        dest: '.'
                    }
                ]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        // copies the website files used in production for prod use
                        expand: true,
                        src: [ '**' ],
                        dest: 'target/website/',
                        cwd: 'src/main/js'
                    },
                    {
                        // copies the bower components to target
                        expand: true,
                        src: [ '**/*.js' ],
                        dest: 'target/website/',
                        cwd: 'bower_components'
                    }
                ]
            },
            /**
             * copies the babel polyfill into the bower_components folder
             */
            babel: {
                files: [
                    {
                        expand: false,
                        src: [ 'node_modules/babel-core/browser-polyfill.js' ],
                        dest: 'bower_components/babel-polyfill/browser-polyfill.js',
                        filter: 'isFile'
                    },
                    {
                        expand: false,
                        src: [ 'bower_components/babel-polyfill/.bower.json' ],
                        dest: 'bower_components/babel-polyfill/bower.json',
                        filter: 'isFile'
                    }
                ]
            }
        },
        replace: {
            isUndefined: {
                src: '<%= fileConfigOptions.prodFiles %>',
                overwrite: true,
                replacements: [
                    {
                        // looks for isUndefined(word).
                        from: /isUndefined\((\w+\b)\)/g,
                        to: '(typeof $1 === \'undefined\')'
                    },
                    {
                        from: 'function (typeof object === \'undefined\')',
                        to: 'function isUndefined(object)'
                    }
                ]
            }
        }
    });

    /******************************************
     * UTILITIES
     ******************************************/

    function printTaskGroup() {
        grunt.log.write('\n===========\n=========== Running task group ' + grunt.task.current.name + ' ===========\n===========\n');
    }

    /******************************************
     * TASK WORKFLOW SETUP
     ******************************************/

    // sets up tasks related to creating documentation
    grunt.registerTask('documentation', function() {
        printTaskGroup();
        grunt.task.run([
            'jsdoc'
        ]);
    });

    //jscs:disable
    grunt.registerTask('buildProto', function() {
        printTaskGroup();
        grunt.task.run([
            'exec:build_proto'
        ]);
    });

    // Sets up tasks related to setting the system for the rest of the tasks.
    grunt.registerTask('setup', function() {
        printTaskGroup();
        grunt.task.run([
            'mkdir'
        ]);
    });

    // sets up tasks related to checkstyle
    grunt.registerTask('checkstyle', function() {
        printTaskGroup();
        grunt.task.run([
            'jscs',
            'jshint',
            'regex-check'
        ]);
    });

    // sets up tasks related to building the production website
    grunt.registerTask('build', function() {
        printTaskGroup();
        grunt.task.run([
            'buildProto',
            'setupProd',
            'polyfill'
        ]);
    });

    // Sets up tasks related to setting up the production website.
    grunt.registerTask('setupProd', function() {
        printTaskGroup();
        grunt.task.run([
            'copy:main'
        ]);
    });

    // sets up tasks related to supporting older version of browsers
    grunt.registerTask('polyfill', function() {
        printTaskGroup();
        grunt.task.run([
            'replace:isUndefined'
            // babel is turned off because it is breaking things.
            //'babel'
        ]);
    });

    /******************************************
     * TASK WORKFLOW RUNNING
     ******************************************/

    // 'test'  wait till browsers are better supported
    grunt.registerTask('default', [ 'checkstyle', 'documentation', 'setup', 'build' ]);
};
