pipeline{
    agent any
    environment{
        DOCKER_CRED = credentials("docker-cred")
    }
    stages{
        stage("update docker image"){
            steps{
                sh "docker build . -t ithro/pdf-gpt:${BUILD_NUMBER}"
            }
        }
    }
}