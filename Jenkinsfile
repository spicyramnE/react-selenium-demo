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
                    powershell -NoProfile -Command "$ready=$false; for($i=0;$i -lt 60;$i++){try{$c=New-Object System.Net.Sockets.TcpClient; $iar=$c.BeginConnect('127.0.0.1',3000,$null,$null); $ok=$iar.AsyncWaitHandle.WaitOne(1000,$false); if($ok -and $c.Connected){$ready=$true; $c.Close(); break}; $c.Close()}catch{}; Write-Host \\"Waiting for dev server (port check)... attempt $i\\"; Start-Sleep -Seconds 3}; if(-not $ready){Write-Host 'Dev server did not become ready in time'; exit 1} else {Write-Host 'Dev server port is open'}"
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
