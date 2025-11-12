@echo off
setlocal enableextensions
title FlightSimulator --- Runner

echo ================================================
echo   ✈️  FlightSimulator --- Game Web (Windows)
echo   Selecione o modo de execução
echo ================================================
echo.

REM Verificar Node e npm
node --version >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERRO] Node.js nao encontrado. Instale em: https://nodejs.org/
  goto :end
)

npm --version >nul 2>&1
IF ERRORLEVEL 1 (
  echo [ERRO] npm nao encontrado. Instale Node.js (inclui npm).
  goto :end
)

REM Instalar dependencias se node_modules nao existir
IF NOT EXIST "node_modules" (
  echo [INFO] Dependencias nao encontradas. Instalando com npm install...
  call npm install
  IF ERRORLEVEL 1 (
    echo [ERRO] Falha ao instalar dependencias.
    goto :end
  )
)

echo [D] Desenvolvimento (Vite + Express em http://localhost:5000)
echo [P] Producao     (build + start em http://localhost:5000)
CHOICE /C DP /N /M "Escolha o modo [D/P]: "
IF ERRORLEVEL 2 goto prod
IF ERRORLEVEL 1 goto dev

:dev
echo.
echo [DEV] Iniciando servidor de desenvolvimento (porta 5000)...
REM Abrir navegador apos breve atraso em uma nova janela
start "" cmd /c "timeout /t 3 >nul & start http://localhost:5000"
call npm run dev
goto :end

:prod
echo.
echo [PROD] Gerando build de producao...
call npm run build
IF ERRORLEVEL 1 (
  echo [ERRO] Falha no build.
  goto :end
)
echo [PROD] Iniciando servidor Express (porta 5000)...
start "" cmd /c "timeout /t 2 >nul & start http://localhost:5000"
call npm start
goto :end

:end
echo.
echo [INFO] Execucao finalizada. Para encerrar servidores, use Ctrl+C.
endlocal