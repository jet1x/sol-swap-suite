import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Terminal, 
  Download, 
  Play, 
  Square,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: 'success' | 'error' | 'warning' | 'info';
  wallet: number;
  message: string;
  amount?: number;
}

interface TradingLogsProps {
  isTrading: boolean;
  onTradingStart: () => void;
  onTradingStop: () => void;
  isEnabled: boolean;
}

export const TradingLogs = ({ 
  isTrading, 
  onTradingStart, 
  onTradingStop, 
  isEnabled 
}: TradingLogsProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const logIdCounter = useRef(0);

  // Mock log messages
  const mockLogs = [
    "RPC connection established successfully",
    "Funding wallet loaded and verified",
    "Wallet #1 attempting buy order for €5.50",
    "Jupiter route found for token swap",
    "Buy order executed successfully - €5.50",
    "Wallet #2 attempting buy order for €3.20",
    "Slippage tolerance exceeded, retrying with backup route",
    "Buy order executed successfully - €3.20",
    "Wallet #3 rate limited, waiting 30 seconds",
    "Platform fee (2%) deducted: €0.11",
    "Daily limit check passed for wallet #1",
  ];

  // Add new log entry
  const addLog = (type: LogEntry['type'], wallet: number, message: string, amount?: number) => {
    const newLog: LogEntry = {
      id: ++logIdCounter.current,
      timestamp: new Date().toLocaleTimeString(),
      type,
      wallet,
      message,
      amount,
    };
    
    setLogs(prev => [...prev.slice(-49), newLog]); // Keep only last 50 logs
  };

  // Simulate trading logs
  useEffect(() => {
    if (!isTrading) return;

    const interval = setInterval(() => {
      const walletId = Math.floor(Math.random() * 10) + 1;
      const success = Math.random() > 0.3; // 70% success rate
      const amount = Math.random() * 8 + 2; // €2-10
      
      if (success) {
        const randomMessage = mockLogs[Math.floor(Math.random() * mockLogs.length)];
        addLog('success', walletId, randomMessage.replace('#1', `#${walletId}`), amount);
      } else {
        const errorMessages = [
          "Transaction failed: insufficient SOL for fees",
          "Route not found, switching to fallback DEX",
          "Slippage exceeded maximum tolerance",
          "Network congestion, retrying in 10s",
        ];
        const errorMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        addLog('error', walletId, errorMsg);
      }
    }, Math.random() * 3000 + 1000); // 1-4 second intervals

    return () => clearInterval(interval);
  }, [isTrading]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const exportLogs = () => {
    const csv = logs.map(log => 
      `${log.timestamp},${log.type},Wallet #${log.wallet},"${log.message}",${log.amount || ''}`
    ).join('\n');
    
    const blob = new Blob([`Timestamp,Type,Wallet,Message,Amount\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-3 h-3 text-success" />;
      case 'error': return <XCircle className="w-3 h-3 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-warning" />;
      default: return <Clock className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const stats = {
    total: logs.length,
    success: logs.filter(l => l.type === 'success').length,
    errors: logs.filter(l => l.type === 'error').length,
    totalAmount: logs.filter(l => l.amount).reduce((sum, l) => sum + (l.amount || 0), 0),
  };

  return (
    <div className="trading-card h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Terminal className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Logs</h2>
        {isTrading && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-success">Live Trading</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-lg font-bold text-foreground">{stats.total}</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="text-xs text-muted-foreground">Success</div>
          <div className="text-lg font-bold text-success">{stats.success}</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="text-xs text-muted-foreground">Errors</div>
          <div className="text-lg font-bold text-destructive">{stats.errors}</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="text-xs text-muted-foreground">Volume</div>
          <div className="text-lg font-bold text-accent">€{stats.totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <Button
          onClick={isTrading ? onTradingStop : onTradingStart}
          disabled={!isEnabled}
          className={`neon-button flex-1 ${
            isTrading 
              ? 'bg-destructive hover:bg-destructive/80 text-destructive-foreground' 
              : 'bg-success hover:bg-success/80 text-success-foreground'
          }`}
        >
          {isTrading ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Stop Trading
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Trading
            </>
          )}
        </Button>
        
        <Button
          onClick={exportLogs}
          variant="outline"
          disabled={logs.length === 0}
          className="neon-button border-accent text-accent hover:bg-accent/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Log Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full rounded-lg border border-border bg-secondary/30">
          <div ref={scrollAreaRef} className="p-4 space-y-2">
            {logs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No logs yet. Start trading to see activity.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div 
                  key={log.id}
                  className="flex items-start gap-3 p-2 rounded border border-border/50 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {log.timestamp}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Wallet #{log.wallet}
                      </Badge>
                      {log.amount && (
                        <Badge variant="secondary" className="text-xs">
                          €{log.amount.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${getLogColor(log.type)}`}>
                      {log.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Step-by-step guide */}
      <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Quick Start Guide
        </h4>
        <ol className="text-xs text-muted-foreground space-y-1">
          <li>1. Connect RPC and load funding wallet</li>
          <li>2. Create or import wallets</li>
          <li>3. Configure token and trading settings</li>
          <li>4. Auto-fund wallets with budget</li>
          <li>5. Start trading and monitor logs</li>
        </ol>
      </div>
    </div>
  );
};