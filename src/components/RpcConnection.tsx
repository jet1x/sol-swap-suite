import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wifi, Shield, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RpcConnectionProps {
  onConnectionChange: (connected: boolean) => void;
  onFundingLoaded: (loaded: boolean) => void;
}

export const RpcConnection = ({ onConnectionChange, onFundingLoaded }: RpcConnectionProps) => {
  const [rpcUrl, setRpcUrl] = useState("https://api.mainnet-beta.solana.com");
  const [fundingSecret, setFundingSecret] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [fundingLoaded, setFundingLoadedState] = useState(false);
  const { toast } = useToast();

  const handleRpcConnect = () => {
    if (!rpcUrl.trim()) {
      toast({
        title: "Invalid RPC URL",
        description: "Please enter a valid RPC URL",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate connection
    setIsConnected(true);
    onConnectionChange(true);
    toast({
      title: "RPC Connected",
      description: "Successfully connected to Solana RPC",
    });
  };

  const handleFundingLoad = () => {
    if (!fundingSecret.trim()) {
      toast({
        title: "Missing Funding Secret",
        description: "Please paste your base58 secret key",
        variant: "destructive",
      });
      return;
    }

    // Validate base58 format (basic check)
    if (fundingSecret.length < 44 || fundingSecret.length > 88) {
      toast({
        title: "Invalid Secret Key",
        description: "Please enter a valid base58 secret key",
        variant: "destructive",
      });
      return;
    }

    setFundingLoadedState(true);
    onFundingLoaded(true);
    toast({
      title: "Funding Wallet Loaded",
      description: "Successfully loaded funding wallet",
    });
  };

  return (
    <div className="trading-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">RPC & Funding</h2>
      </div>

      <div className="space-y-6">
        {/* RPC Connection */}
        <div className="space-y-3">
          <Label htmlFor="rpc-url" className="text-sm font-medium text-foreground">
            RPC URL
          </Label>
          <div className="flex gap-3">
            <Input
              id="rpc-url"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              placeholder="Enter Solana RPC URL"
              className="flex-1 bg-secondary border-border focus:ring-primary"
            />
            <Button
              onClick={handleRpcConnect}
              disabled={isConnected}
              className="neon-button bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              <Wifi className="w-4 h-4 mr-2" />
              {isConnected ? "Connected" : "Connect RPC"}
            </Button>
          </div>
          {isConnected && (
            <div className="flex items-center gap-2 text-success text-sm">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Connected to RPC
            </div>
          )}
        </div>

        {/* Funding Wallet */}
        <div className="space-y-3">
          <Label htmlFor="funding-secret" className="text-sm font-medium text-foreground">
            Funding Secret (base58 seed/secret key)
          </Label>
          <div className="space-y-3">
            <Textarea
              id="funding-secret"
              value={fundingSecret}
              onChange={(e) => setFundingSecret(e.target.value)}
              placeholder="Paste your base58 secret..."
              className="min-h-[80px] bg-secondary border-border focus:ring-primary resize-none"
            />
            <Button
              onClick={handleFundingLoad}
              disabled={fundingLoaded}
              className="neon-button bg-accent hover:bg-accent/80 text-accent-foreground w-full"
            >
              {fundingLoaded ? "Funding Loaded" : "Load Funding"}
            </Button>
          </div>
          {fundingLoaded && (
            <div className="flex items-center gap-2 text-success text-sm">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Funding wallet ready
            </div>
          )}
        </div>

        {/* Fee Info */}
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
            <p className="text-sm text-warning-foreground">
              <strong>Fees:</strong> 2% to the platform. Default ≥ €1 per wallet (configurable) before each buy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};