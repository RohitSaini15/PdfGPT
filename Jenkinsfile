pipeline{
    agent any
    environment{
        DOCKER_CRED = credentials("docker-cred")
    }
    stages{
        stage("update docker image"){
            step{
                sh "docker build . -t ithro/pdf-gpt"
            }
        }
    }
}