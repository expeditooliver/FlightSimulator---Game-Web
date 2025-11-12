@echo off
setlocal enableextensions
title FlightSimulator --- Runner

echo ================================================
echo   ✈️  FlightSimulator --- Game Web (Windows)
echo   Selecione o modo de execução
echo ================================================
echo.

REM Se um argumento foi passado, usar para selecionar modo
REM Suporta: D, DEV, --dev, P, PROD, --prod
IF NOT "%~1"=="" (
  IF /I "%~1"=="D"      goto dev
  IF /I "%~1"=="DEV"    goto dev
  IF /I "%~1"=="--DEV"  goto dev
  IF /I "%~1"=="P"      goto prod
  IF /I "%~1"=="PROD"   goto prod
  IF /I "%~1"=="--PROD" goto prod
)

REM Definir porta/host padrao (pode ser sobreposto via ambiente)
IF NOT DEFINED PORT SET PORT=5000
IF NOT DEFINED HOST SET HOST=127.0.0.1
echo [INFO] HOST=%HOST% PORT=%PORT%

REM Verificar Node e npm
node --version >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERRO] Node.js nao encontrado. Instale em: https://nodejs.org/
  goto :end
)

call npm.cmd -v >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERRO] npm nao encontrado. Instale Node.js (inclui npm).
  goto :end
)

REM Instalar dependencias se node_modules nao existir
IF NOT EXIST "node_modules" (
  echo [INFO] Dependencias nao encontradas. Instalando com npm install...
  call npm.cmd install
  IF ERRORLEVEL 1 (
    echo [ERRO] Falha ao instalar dependencias.
    goto :end
  )
)

REM Sem argumentos, por padrao inicia em DEV
goto dev

:dev
echo.
echo [DEV] Iniciando servidor de desenvolvimento (porta %PORT%)...
REM Abrir navegador apos breve atraso em uma nova janela
start "" cmd /c "timeout /t 3 >nul & start http://%HOST%:%PORT%"
call npm.cmd run dev
goto :end

:prod
echo.
echo [PROD] Gerando build de producao...
call npm.cmd run build
IF ERRORLEVEL 1 (
  echo [ERRO] Falha no build.
  goto :end
)
echo [PROD] Iniciando servidor Express (porta %PORT%)...
start "" cmd /c "timeout /t 2 >nul & start http://%HOST%:%PORT%"
call npm.cmd start
goto :end

:end
echo.
echo [INFO] Execucao finalizada. Para encerrar servidores, use Ctrl+C.
endlocal