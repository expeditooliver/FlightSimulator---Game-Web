param(
  [ValidateSet("DEV","PROD")]
  [string]$Mode = "DEV",
  [int]$Port = $(if ($env:PORT) { [int]$env:PORT } else { 5000 }),
  [string]$ServerHost = $(if ($env:HOST) { $env:HOST } else { "127.0.0.1" })
)

Write-Host "==============================================="
Write-Host "  FlightSimulator --- Game Web (Windows)" -ForegroundColor Cyan
Write-Host "  Modo: $Mode | HOST=$ServerHost PORT=$Port"
Write-Host "==============================================="

try {
  $nodeVer = & node -v
} catch {
  Write-Host "[ERRO] Node.js nao encontrado. Instale em: https://nodejs.org/" -ForegroundColor Red
  exit 1
}

try {
  $npmVer = & npm.cmd -v
} catch {
  Write-Host "[ERRO] npm nao encontrado. Verifique o PATH ou reinstale Node.js." -ForegroundColor Red
  exit 1
}

if (-not (Test-Path "node_modules")) {
  Write-Host "[INFO] Dependencias nao encontradas. Instalando..." -ForegroundColor Yellow
  & npm.cmd install
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Falha ao instalar dependencias." -ForegroundColor Red
    exit 1
  }
}

$env:PORT = $Port.ToString()
$env:HOST = $ServerHost
$previousNodeEnv = $env:NODE_ENV

function Set-NodeEnv([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) {
    Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
  } else {
    $env:NODE_ENV = $value
  }
}

function Restore-NodeEnv {
  if ($null -eq $previousNodeEnv) {
    Remove-Item Env:NODE_ENV -ErrorAction SilentlyContinue
  } else {
    $env:NODE_ENV = $previousNodeEnv
  }
}

function Open-BrowserDelayed([string]$url, [int]$delaySeconds) {
  Start-Process "$PSHOME\powershell.exe" -ArgumentList "-NoLogo -NoProfile -Command Start-Sleep -Seconds $delaySeconds; Start '$url'" | Out-Null
}

try {
  if ($Mode -eq "DEV") {
    Set-NodeEnv "development"
    Write-Host "[DEV] Iniciando servidor de desenvolvimento em http://${ServerHost}:${Port}" -ForegroundColor Green
    Open-BrowserDelayed "http://${ServerHost}:${Port}" 3
    & npm.cmd run dev
  } else {
    Set-NodeEnv "production"
    Write-Host "[PROD] Gerando build de producao..." -ForegroundColor Green
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) {
      Write-Host "[ERRO] Falha no build." -ForegroundColor Red
      exit 1
    }

    if (-not (Test-Path "dist/index.js")) {
      Write-Host "[ERRO] Arquivo dist/index.js nao encontrado. Confirme se o build foi concluido." -ForegroundColor Red
      exit 1
    }

    Write-Host "[PROD] Iniciando servidor Express em http://${ServerHost}:${Port}" -ForegroundColor Green
    Open-BrowserDelayed "http://${ServerHost}:${Port}" 2
    & node "dist/index.js"
  }
} finally {
  Restore-NodeEnv
}

Write-Host "[INFO] Execucao finalizada. Para encerrar os servidores, use Ctrl+C." -ForegroundColor DarkGray
