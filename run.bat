@echo off
setlocal enableextensions
title FlightSimulator --- Runner
set "SCRIPT_DIR=%~dp0"
set "LOG_FILE=%SCRIPT_DIR%run.log"

call :log "=== Inicio da execucao do runner ==="
echo ================================================
echo   FlightSimulator --- Game Web (Windows)
echo   Selecione o modo de execucao
echo ================================================
echo.

REM Definir porta/host padrao (aceita sobreposicao via ambiente)
IF NOT DEFINED PORT SET "PORT=5000"
IF NOT DEFINED HOST SET "HOST=127.0.0.1"
echo [INFO] HOST=%HOST% PORT=%PORT%
call :log "[INFO] HOST=%HOST% PORT=%PORT%"

REM Verificar Node e npm
node --version >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERRO] Node.js nao encontrado. Instale em: https://nodejs.org/
  call :log "[ERRO] Node.js nao encontrado."
  GOTO end
)
call :log "[OK] Node detectado."

call npm.cmd -v >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERRO] npm nao encontrado. Instale Node.js (inclui npm).
  call :log "[ERRO] npm nao encontrado."
  GOTO end
)
call :log "[OK] npm detectado."

REM Instalar dependencias se node_modules nao existir
IF NOT EXIST "node_modules" (
  echo [INFO] Dependencias nao encontradas. Instalando com npm install...
  call :log "[INFO] Executando npm install."
  call npm.cmd install
  IF ERRORLEVEL 1 (
    echo [ERRO] Falha ao instalar dependencias.
    call :log "[ERRO] npm install retornou erro."
    GOTO end
  )
  call :log "[OK] npm install concluido."
)

set "MODE_CHOICE="
IF "%~1"=="" GOTO choosePrompt
GOTO handleArg

:choosePrompt
call :log "[DEBUG] Nenhum argumento informado; solicitando modo."
call :chooseMode
GOTO modeSelected

:handleArg
call :mapArgument "%~1"
IF ERRORLEVEL 1 (
  echo [ERRO] Argumento invalido: %~1
  echo        Use D/DEV ou P/PROD.
  call :log "[ERRO] Argumento invalido recebido: %~1"
  GOTO end
)

:modeSelected
call :log "[INFO] Modo final selecionado: %MODE_CHOICE%"
IF /I "%MODE_CHOICE%"=="PROD" GOTO prod
GOTO dev

:mapArgument
setlocal
set "ARG=%~1"
set "ARG=%ARG:"=%"
IF /I "%ARG%"=="D"      set "RES=DEV"
IF /I "%ARG%"=="DEV"    set "RES=DEV"
IF /I "%ARG%"=="--DEV"  set "RES=DEV"
IF /I "%ARG%"=="P"      set "RES=PROD"
IF /I "%ARG%"=="PROD"   set "RES=PROD"
IF /I "%ARG%"=="--PROD" set "RES=PROD"
IF NOT DEFINED RES (
  endlocal
  exit /b 1
)
endlocal & set "MODE_CHOICE=%RES%"
call :log "[INFO] Modo selecionado via argumento: %MODE_CHOICE%"
exit /b 0

:chooseMode
set "MODE_CHOICE=DEV"
where choice >nul 2>&1
IF ERRORLEVEL 1 GOTO legacyPrompt

CHOICE /C DP /M "Selecione o modo [D]esenvolvimento ou [P]roducao:"
IF ERRORLEVEL 2 (
  set "MODE_CHOICE=PROD"
) ELSE (
  set "MODE_CHOICE=DEV"
)
call :log "[INFO] Modo selecionado via prompt: %MODE_CHOICE%"
GOTO :EOF

:legacyPrompt
echo Digite D para desenvolvimento ou P para producao:
set /p "USER_INPUT=> "
IF /I "%USER_INPUT%"=="P" (
  set "MODE_CHOICE=PROD"
) ELSE (
  set "MODE_CHOICE=DEV"
)
call :log "[INFO] Modo selecionado via prompt legado: %MODE_CHOICE%"
GOTO :EOF

:dev
echo.
echo [DEV] Iniciando servidor de desenvolvimento (porta %PORT%)...
REM Abrir navegador apos breve atraso
start "" cmd /c "timeout /t 3 >nul & start http://%HOST%:%PORT%"
set "NODE_ENV=development"
call :log "[INFO] NODE_ENV=development"
call npm.cmd run dev
call :log "[INFO] npm run dev finalizado com codigo %ERRORLEVEL%"
GOTO end

:prod
echo.
echo [PROD] Gerando build de producao...
set "NODE_ENV=production"
call :log "[INFO] NODE_ENV=production"
call npm.cmd run build
IF ERRORLEVEL 1 (
  echo [ERRO] Falha no build.
  call :log "[ERRO] npm run build retornou erro."
  GOTO end
)

IF NOT EXIST "dist\index.js" (
  echo [ERRO] Arquivo dist\index.js nao encontrado. Rode npm run build manualmente.
  call :log "[ERRO] dist\\index.js nao encontrado."
  GOTO end
)

echo [PROD] Iniciando servidor Express (porta %PORT%)...
start "" cmd /c "timeout /t 2 >nul & start http://%HOST%:%PORT%"
node dist\index.js
call :log "[INFO] node dist\\index.js finalizado com codigo %ERRORLEVEL%"
GOTO end

:end
echo.
echo [INFO] Execucao finalizada. Para encerrar servidores, use Ctrl+C.
call :log "[INFO] Runner finalizado."
endlocal
exit /b %ERRORLEVEL%

:log
setlocal ENABLEDELAYEDEXPANSION
set "MSG=%~1"
if not defined MSG set "MSG=(mensagem vazia)"
set "STAMP=%date% %time%"
>>"%LOG_FILE%" echo [!STAMP!] !MSG!
endlocal & exit /b
