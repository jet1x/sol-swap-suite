import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  TrendingDown, 
  ArrowUp, 
  BarChart3, 
  DollarSign,
  Wallet,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TradingUtilitiesProps {
  walletCount: number;
  isEnabled: boolean;
}

interface WalletBalance {
  id: number;
  solBalance: number;
  tokenBalance: number;
  value: number;
}

export const TradingUtilities = ({ walletCount, isEnabled }: TradingUtilitiesProps) => {
  const [isCheckingBalances, setIsCheckingBalances] = useState(false);
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [isSellingAll, setIsSellingAll] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  const { toast } = useToast();

  const handleCheckBalances = async () => {
    if (!isEnabled) {
      toast({
        title: "Prerequisites Not Met",
        description: "Please create and fund wallets first",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingBalances(true);
    
    // Simulate balance checking
    setTimeout(() => {
      const mockBalances: WalletBalance[] = Array.from({ length: walletCount }, (_, i) => ({
        id: i + 1,
        solBalance: Math.random() * 0.5 + 0.1,
        tokenBalance: Math.random() * 1000 + 100,
        value: Math.random() * 50 + 10,
      }));
      
      setBalances(mockBalances);
      setIsCheckingBalances(false);
      
      toast({
        title: "Balances Updated",
        description: `Checked balances for ${walletCount} wallets`,
      });
    }, 2000);
  };

  const handleSellAll = async () => {
    if (!isEnabled || balances.length === 0) {
      toast({
        title: "No Tokens to Sell",
        description: "Check balances first or ensure wallets have tokens",
        variant: "destructive",
      });
      return;
    }

    setIsSellingAll(true);
    
    // Simulate selling
    setTimeout(() => {
      setIsSellingAll(false);
      toast({
        title: "Sell Orders Complete",
        description: "All tokens sold across wallets",
      });
    }, 3000);
  };

  const handleSweepAll = async () => {
    if (!isEnabled || balances.length === 0) {
      toast({
        title: "No Funds to Sweep",
        description: "Check balances first or ensure wallets have SOL",
        variant: "destructive",
      });
      return;
    }

    setIsSweeping(true);
    
    // Simulate sweeping
    setTimeout(() => {
      setIsSweeping(false);
      toast({
        title: "Sweep Complete",
        description: "All SOL swept back to funding wallet",
      });
    }, 2500);
  };

  const totalSolBalance = balances.reduce((sum, b) => sum + b.solBalance, 0);
  const totalTokens = balances.reduce((sum, b) => sum + b.tokenBalance, 0);
  const totalValue = balances.reduce((sum, b) => sum + b.value, 0);

  return (
    <div className="trading-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Utilities</h2>
        {balances.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {balances.length} wallets tracked
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Balance Summary */}
        {balances.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Wallet className="w-4 h-4" />
                Total SOL
              </div>
              <div className="text-2xl font-bold text-foreground">
                {totalSolBalance.toFixed(3)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Coins className="w-4 h-4" />
                Total Tokens
              </div>
              <div className="text-2xl font-bold text-accent">
                {totalTokens.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4" />
                Total Value
              </div>
              <div className="text-2xl font-bold text-success">
                €{totalValue.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleCheckBalances}
            disabled={!isEnabled || isCheckingBalances}
            className="neon-button bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            {isCheckingBalances ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Checking...
              </div>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Check Balances
              </>
            )}
          </Button>

          <Button
            onClick={handleCheckBalances}
            disabled={!isEnabled || isCheckingBalances}
            variant="outline"
            className="neon-button border-accent text-accent hover:bg-accent/10"
          >
            <Coins className="w-4 h-4 mr-2" />
            Token Balances
          </Button>

          <Button
            onClick={handleSellAll}
            disabled={!isEnabled || isSellingAll || balances.length === 0}
            className="neon-button bg-destructive hover:bg-destructive/80 text-destructive-foreground"
          >
            {isSellingAll ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Selling...
              </div>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 mr-2" />
                Sell All
              </>
            )}
          </Button>

          <Button
            onClick={handleSweepAll}
            disabled={!isEnabled || isSweeping || balances.length === 0}
            className="neon-button bg-cyber hover:bg-cyber/80 text-cyber-foreground"
          >
            {isSweeping ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sweeping...
              </div>
            ) : (
              <>
                <ArrowUp className="w-4 h-4 mr-2" />
                Sweep All
              </>
            )}
          </Button>
        </div>

        {/* Balance List */}
        {balances.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Wallet Balances</h4>
            {balances.slice(0, 10).map((balance) => (
              <div 
                key={balance.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    #{balance.id}
                  </Badge>
                  <div className="text-sm">
                    <span className="text-muted-foreground">SOL:</span>
                    <span className="ml-1 text-foreground">{balance.solBalance.toFixed(3)}</span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-accent">{balance.tokenBalance.toFixed(0)} tokens</div>
                  <div className="text-success">€{balance.value.toFixed(2)}</div>
                </div>
              </div>
            ))}
            {balances.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                ... and {balances.length - 10} more wallets
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};