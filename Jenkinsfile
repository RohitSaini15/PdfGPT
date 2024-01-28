pipeline{
    agent any
    environment{
        DOCKER_CRED = credentials("docker-cred")
    }
    stages{
        stage("Build Image"){
            steps{
                sh "docker build . -t ithro/pdf-gpt:${BUILD_NUMBER}"
            }
        }

        stage("Push Image"){
            steps{
                sh "docker login -u ${DOCKER_CRED_USR} -p ${DOCKER_CRED_PSW}"
                sh "docker push ithro/pdf-gpt:${BUILD_NUMBER}"
            }
        }

        stage("Delete Local Image"){
            steps{
                sh "docker rmi ithro/pdf-gpt:${BUILD_NUMBER}"
            }
        }
    }
}