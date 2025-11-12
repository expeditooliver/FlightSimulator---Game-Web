param(
  [ValidateSet("DEV","PROD")]
  [string]$Mode = "DEV",
  [int]$Port = $(if ($env:PORT) { [int]$env:PORT } else { 5000 }),
  [string]$ServerHost = $(if ($env:HOST) { $env:HOST } else { "127.0.0.1" })
)

Write-Host "==============================================="
Write-Host "  ✈️  FlightSimulator --- Game Web (Windows)" -ForegroundColor Cyan
Write-Host "  Modo: $Mode | HOST=$ServerHost PORT=$Port"
Write-Host "==============================================="

# Verificar Node
try {
  $nodeVer = & node -v
} catch {
  Write-Host "[ERRO] Node.js não encontrado. Instale em: https://nodejs.org/" -ForegroundColor Red
  exit 1
}

# Verificar npm (usar npm.cmd para contornar ExecutionPolicy)
try {
  $npmVer = & npm.cmd -v
} catch {
  Write-Host "[ERRO] npm não encontrado. Verifique PATH ou reinstale Node.js." -ForegroundColor Red
  exit 1
}

# Instalar dependências se necessário
if (-not (Test-Path "node_modules")) {
  Write-Host "[INFO] Instalando dependências..." -ForegroundColor Yellow
  & npm.cmd install
  if ($LASTEXITCODE -ne 0) { Write-Host "[ERRO] Falha ao instalar dependências." -ForegroundColor Red; exit 1 }
}

$env:PORT = $Port.ToString()
$env:HOST = $ServerHost

if ($Mode -eq "DEV") {
  Write-Host "[DEV] Iniciando servidor de desenvolvimento em http://$ServerHost:$Port" -ForegroundColor Green
  Start-Process "$PSHOME\powershell.exe" -ArgumentList "-NoLogo -NoProfile -Command Start-Sleep -Seconds 3; Start 'http://$ServerHost:$Port'" | Out-Null
  & npm.cmd run dev
} else {
  Write-Host "[PROD] Gerando build de produção..." -ForegroundColor Green
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { Write-Host "[ERRO] Falha no build." -ForegroundColor Red; exit 1 }
  Write-Host "[PROD] Iniciando preview em http://$ServerHost:$Port" -ForegroundColor Green
  Start-Process "$PSHOME\powershell.exe" -ArgumentList "-NoLogo -NoProfile -Command Start-Sleep -Seconds 2; Start 'http://$ServerHost:$Port'" | Out-Null
  & npm.cmd run preview
}

Write-Host "[INFO] Execução finalizada. Para encerrar servidores, use Ctrl+C." -ForegroundColor DarkGray