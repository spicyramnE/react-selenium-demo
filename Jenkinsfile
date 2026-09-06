pipeline {
    agent any

    environment {
        BROWSER = 'none'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Dependency Installation') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm install'
            }
        }

        stage('App Startup') {
            steps {
                echo 'Starting the React development server in the background...'
                bat '''
                    set BUILD_ID=dontKillMe
                    start /B npm start
                    powershell -NoProfile -Command "$ready=$false; for($i=0;$i -lt 60;$i++){try{$r=Invoke-WebRequest -Uri http://localhost:3000 -UseBasicParsing -TimeoutSec 2; if($r.StatusCode -eq 200){$ready=$true; break}}catch{}; Write-Host \\"Waiting for dev server... attempt $i\\"; Start-Sleep -Seconds 3}; if(-not $ready){Write-Host 'Dev server did not become ready in time'; exit 1} else {Write-Host 'Dev server is ready'}"
                '''
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium WebDriverJS + Mocha/Chai UI tests...'
                bat 'npm run test:selenium'
            }
        }
    }

    post {
        always {
            echo 'Stopping the React development server...'
            bat 'taskkill /F /IM node.exe /T || exit /b 0'
        }
        success {
            echo 'All React UI tests passed!'
        }
        failure {
            echo 'One or more tests failed.'
        }
    }
}
