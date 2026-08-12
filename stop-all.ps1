$ports = 8000, 8001, 8002, 8003, 5173, 5174, 5175, 5176

foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue

    foreach ($conn in $conns) {
        $procId = $conn.OwningProcess
        $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue

        if ($proc -and ($proc.ProcessName -eq 'python' -or $proc.ProcessName -eq 'node')) {
            Stop-Process -Id $procId -Force
            Write-Host "Stopped $($proc.ProcessName) on port $port (PID $procId)"
        } elseif ($proc) {
            Write-Host "Skipped $($proc.ProcessName) on port $port (PID $procId) - not a dev server process"
        }
    }
}

Write-Host 'Done.'