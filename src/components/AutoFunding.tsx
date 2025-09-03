import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Banknote, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutoFundingProps {
  walletCount: number;
  isEnabled: boolean;
}

export const AutoFunding = ({ walletCount, isEnabled }: AutoFundingProps) => {
  const [totalBudget, setTotalBudget] = useState(100);
  const [isAutoFunding, setIsAutoFunding] = useState(false);
  const [fundingProgress, setFundingProgress] = useState(0);
  const { toast } = useToast();

  const minBudgetRequired = Math.max(walletCount * 1.2, 10); // €1 + fees per wallet, min €10

  const handleAutoFund = async () => {
    if (!isEnabled) {
      toast({
        title: "Prerequisites Not Met",
        description: "Please create wallets and configure settings first",
        variant: "destructive",
      });
      return;
    }

    if (totalBudget < minBudgetRequired) {
      toast({
        title: "Insufficient Budget",
        description: `Minimum budget required: €${minBudgetRequired.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    setIsAutoFunding(true);
    setFundingProgress(0);

    // Simulate funding progress
    const progressInterval = setInterval(() => {
      setFundingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAutoFunding(false);
          toast({
            title: "Auto-Funding Complete",
            description: `Successfully funded ${walletCount} wallets with €${totalBudget}`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const perWalletAmount = walletCount > 0 ? (totalBudget / walletCount).toFixed(2) : "0.00";

  return (
    <div className="trading-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Banknote className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Auto-Fund Wallets</h2>
        {fundingProgress === 100 && (
          <div className="ml-auto flex items-center gap-2 text-success text-sm">
            <TrendingUp className="w-4 h-4" />
            Funding complete
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Budget Input */}
        <div className="space-y-3">
          <Label htmlFor="total-budget" className="text-sm font-medium text-foreground">
            Total budget (€)
          </Label>
          <Input
            id="total-budget"
            type="number"
            step="0.01"
            value={totalBudget}
            onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
            min="1"
            className="bg-secondary border-border focus:ring-primary"
            disabled={isAutoFunding}
          />
        </div>

        {/* Budget Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="text-sm text-muted-foreground">Total Wallets</div>
            <div className="text-2xl font-bold text-foreground">{walletCount}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="text-sm text-muted-foreground">Per Wallet</div>
            <div className="text-2xl font-bold text-accent">€{perWalletAmount}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="text-sm text-muted-foreground">Min Required</div>
            <div className="text-2xl font-bold text-warning">€{minBudgetRequired.toFixed(2)}</div>
          </div>
        </div>

        {/* Warning */}
        {totalBudget < minBudgetRequired && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive-foreground">
                Budget too low. Will allocate ≥ €1 per wallet by default (+ small fee reserve).
              </p>
            </div>
          </div>
        )}

        {/* Progress */}
        {isAutoFunding && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Funding Progress</span>
              <span>{fundingProgress}%</span>
            </div>
            <Progress value={fundingProgress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleAutoFund}
          disabled={!isEnabled || isAutoFunding || totalBudget < 1}
          className="neon-button bg-primary hover:bg-primary/80 text-primary-foreground w-full"
        >
          {isAutoFunding ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Auto-Funding...
            </div>
          ) : (
            "Auto-Fund"
          )}
        </Button>

        {/* Info */}
        <p className="text-xs text-muted-foreground text-center">
          Will allocate ≥ €1 per wallet by default (+ small fee reserve). You can change it above.
        </p>
      </div>
    </div>
  );
};