pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
                sh '''#!/bin/bash
                    npm install
                    npm rebuild node-sass
                    npm run build:local
                    ls -la
                    
                '''
                
            }
        }
    }
}