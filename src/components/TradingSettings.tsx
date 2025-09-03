import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, CheckCircle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TradingSettingsProps {
  onSettingsSaved: (saved: boolean) => void;
}

export const TradingSettings = ({ onSettingsSaved }: TradingSettingsProps) => {
  const [tokenMint, setTokenMint] = useState("");
  const [slippage, setSlippage] = useState(100);
  const [minTrade, setMinTrade] = useState(1.0);
  const [maxTrade, setMaxTrade] = useState(10.0);
  const [interval, setInterval] = useState(30);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [perWallet, setPerWallet] = useState(5.0);
  const [sweepResidue, setSweepResidue] = useState(0.002);
  const [mintValidated, setMintValidated] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const { toast } = useToast();

  const validateMint = () => {
    if (!tokenMint.trim()) {
      toast({
        title: "Token Mint Required",
        description: "Please enter a token mint address",
        variant: "destructive",
      });
      return;
    }

    // Basic validation for Solana address format
    if (tokenMint.length < 32 || tokenMint.length > 44) {
      toast({
        title: "Invalid Mint Address",
        description: "Please enter a valid Solana token mint address",
        variant: "destructive",
      });
      return;
    }

    setMintValidated(true);
    toast({
      title: "Mint Validated",
      description: "Token mint address is valid",
    });
  };

  const saveSettings = () => {
    if (!mintValidated) {
      toast({
        title: "Validate Mint First",
        description: "Please validate the token mint address first",
        variant: "destructive",
      });
      return;
    }

    if (minTrade >= maxTrade) {
      toast({
        title: "Invalid Trade Range",
        description: "Min trade must be less than max trade",
        variant: "destructive",
      });
      return;
    }

    setSettingsSaved(true);
    onSettingsSaved(true);
    
    toast({
      title: "Settings Saved",
      description: "Trading configuration saved successfully",
    });
  };

  return (
    <div className="trading-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Token & Buying Settings</h2>
        {settingsSaved && (
          <div className="ml-auto flex items-center gap-2 text-success text-sm">
            <CheckCircle className="w-4 h-4" />
            Settings saved
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Token Mint */}
        <div className="md:col-span-2 space-y-3">
          <Label htmlFor="token-mint" className="text-sm font-medium text-foreground">
            Token Mint
          </Label>
          <div className="flex gap-3">
            <Input
              id="token-mint"
              value={tokenMint}
              onChange={(e) => {
                setTokenMint(e.target.value);
                setMintValidated(false);
              }}
              placeholder="Base58 or pasted JSON:URL containing it"
              className="flex-1 bg-secondary border-border focus:ring-primary"
            />
            <Button
              onClick={validateMint}
              disabled={mintValidated && tokenMint.trim() !== ""}
              className="neon-button bg-accent hover:bg-accent/80 text-accent-foreground"
            >
              <Zap className="w-4 h-4 mr-2" />
              {mintValidated ? "Validated" : "Validate Mint"}
            </Button>
          </div>
        </div>

        {/* Slippage */}
        <div className="space-y-3">
          <Label htmlFor="slippage" className="text-sm font-medium text-foreground">
            Slippage (bps)
          </Label>
          <Input
            id="slippage"
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(parseInt(e.target.value) || 0)}
            min="1"
            max="10000"
            className="bg-secondary border-border focus:ring-primary"
          />
        </div>

        {/* Min Trade */}
        <div className="space-y-3">
          <Label htmlFor="min-trade" className="text-sm font-medium text-foreground">
            Min per trade (€)
          </Label>
          <Input
            id="min-trade"
            type="number"
            step="0.1"
            value={minTrade}
            onChange={(e) => setMinTrade(parseFloat(e.target.value) || 0)}
            min="0.1"
            className="bg-secondary border-border focus:ring-primary"
          />
        </div>

        {/* Max Trade */}
        <div className="space-y-3">
          <Label htmlFor="max-trade" className="text-sm font-medium text-foreground">
            Max per trade (€)
          </Label>
          <Input
            id="max-trade"
            type="number"
            step="0.1"
            value={maxTrade}
            onChange={(e) => setMaxTrade(parseFloat(e.target.value) || 0)}
            min="0.1"
            className="bg-secondary border-border focus:ring-primary"
          />
        </div>

        {/* Interval */}
        <div className="space-y-3">
          <Label htmlFor="interval" className="text-sm font-medium text-foreground">
            Interval (sec)
          </Label>
          <Input
            id="interval"
            type="number"
            value={interval}
            onChange={(e) => setInterval(parseInt(e.target.value) || 0)}
            min="1"
            className="bg-secondary border-border focus:ring-primary"
          />
        </div>

        {/* Daily Limit */}
        <div className="space-y-3">
          <Label htmlFor="daily-limit" className="text-sm font-medium text-foreground">
            Daily limit (€) per wallet (0 = no limit)
          </Label>
          <Input
            id="daily-limit"
            type="number"
            step="0.1"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(parseFloat(e.target.value) || 0)}
            min="0"
            className="bg-secondary border-border focus:ring-primary"
          />
        </div>

        {/* Per Wallet */}
        <div className="space-y-3">
          <Label htmlFor="per-wallet" className="text-sm font-medium text-foreground">
            Per wallet (€)
          </Label>
          <Input
            id="per-wallet"
            type="number"
            step="0.1"
            value={perWallet}
            onChange={(e) => setPerWallet(parseFloat(e.target.value) || 0)}
            min="0.1"
            className="bg-secondary border-border focus:ring-primary"
          />
        </div>

        {/* Sweep Residue */}
        <div className="space-y-3">
          <Label htmlFor="sweep-residue" className="text-sm font-medium text-foreground">
            Sweep residue (SOL)
          </Label>
          <Input
            id="sweep-residue"
            type="number"
            step="0.001"
            value={sweepResidue}
            onChange={(e) => setSweepResidue(parseFloat(e.target.value) || 0)}
            min="0"
            className="bg-secondary border-border focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Leave 0.002 SOL in each wallet when sweeping back to funding wallet
          </p>
        </div>

        {/* Save Button */}
        <div className="md:col-span-2">
          <Button
            onClick={saveSettings}
            className="neon-button bg-primary hover:bg-primary/80 text-primary-foreground w-full"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};