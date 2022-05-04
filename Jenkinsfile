pipeline {
    agent any
    stages {
        stage('Example') {
            steps {
                sh '''
                 ./make_build.sh local
                '''
                
            }
        }
    }
}