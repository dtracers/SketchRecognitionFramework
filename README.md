# SketchRecognitionFramework
Contains an interface for sketch recognition and data types

## Installation
Currently this needs to be included as a meven repo because the node installation script currently does not work.

You need the maven package plugin:

Here is an example use, you can use any path you want for the output
```
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>2.10</version>
    <executions>
        <execution>
            <id>unpack libraries</id>
            <phase>initialize</phase>
            <goals>
                <goal>unpack</goal>
            </goals>
            <configuration>
                <artifactItems>
                    <artifactItem>
                        <groupId>com.github.dtracers</groupId>
                        <artifactId>SketchRecognitionFramework</artifactId>
                        <version>${sketchFrameworkVersion}</version>
                        <type>jar</type>
                        <overWrite>true</overWrite>
                        <outputDirectory>${basedir}/target/temp</outputDirectory>
                        <includes>website/**/*.js</includes>
                    </artifactItem>
                    <artifactItem>
                        <groupId>com.github.dtracers</groupId>
                        <artifactId>SketchRecognitionFramework</artifactId>
                        <version>${sketchFrameworkVersion}</version>
                        <type>jar</type>
                        <overWrite>true</overWrite>
                        <outputDirectory>${basedir}/src/main/resources/protobuf</outputDirectory>
                        <includes>*.proto</includes>
                    </artifactItem>
                </artifactItems>
            </configuration>
        </execution>
    </executions>
</plugin>
```


There is currently a bug where the js versions of the protofiles do not get built so you need to have this dependency in your package.json:
```
protobufjs
grunt-exec
```

and in your grunt file you need this:

```
exec: {
    build_proto: {
        cmd: function() {
            var protoPath = 'src/main/resources/protobuf';
            var inputFiles = [ protoPath + '/**/*.proto' ];
            var protoFiles = grunt.file.expand(inputFiles);
            var jsFiles = grunt.file.expandMapping(protoFiles, 'bower_components/generated_proto', { flatten: true, ext: '.js' });
            var command = '';
            console.log('protofiles: ', protoFiles);
            for (var i = 0; i < protoFiles.length; i++) {
                grunt.log.write('cimpiling protofile ' + protoFiles[i]);
                grunt.log.write('');
                var jsFile = jsFiles[i].dest;
                command+= '"./node_modules/.bin/pbjs" ' + protoFiles[i] + ' --source=proto' +
                    ' --dependency="protobufjs"' +
                    ' --target=amd --path=' + protoPath + ' > ' + jsFile + ' & ';
            }
            console.log(command);
            return command + 'echo "' + command + '"';
        }
    }
},
```

you made need to copy the files from where ever you unpackage them.  Here is how you do it in maven:
```
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <version>3.0.0</version>
    <executions>
        <execution>
            <id>copy-resources</id>
            <!-- here the phase you need -->
            <phase>initialize</phase>
            <goals>
                <goal>copy-resources</goal>
            </goals>
            <configuration>
                <outputDirectory>${basedir}/bower_components</outputDirectory>
                <resources>
                    <resource>
                        <directory>${basedir}/target/temp/website</directory>
                        <filtering>true</filtering>
                    </resource>
                </resources>
            </configuration>
        </execution>
    </executions>
</plugin>
```

you must also specify dependencies in maven:

```
<dependencies>
    <dependency>
        <groupId>com.github.dtracers</groupId>
        <artifactId>SketchRecognitionFramework</artifactId>
        <version>${sketchFrameworkVersion}</version>
    </dependency>
</dependencies>
```

##Node
if you are running this in node there may be path problems... up to you to fix them bc requirejs and node are finicky

##online
if you are running this in the browser here are the dependencies you need:
```
stacktrace-js,
protobufjs,
bytebuffer,
long,
requirejs
```
