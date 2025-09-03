import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, Download, Upload, Plus, FileJson } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletManagerProps {
  onWalletsChange: (count: number) => void;
}

export const WalletManager = ({ onWalletsChange }: WalletManagerProps) => {
  const [walletCount, setWalletCount] = useState(10);
  const [walletsCreated, setWalletsCreated] = useState(false);
  const [walletJson, setWalletJson] = useState("");
  const { toast } = useToast();

  const handleCreateWallets = () => {
    if (walletCount < 1 || walletCount > 1000) {
      toast({
        title: "Invalid Wallet Count",
        description: "Please enter a number between 1 and 1000",
        variant: "destructive",
      });
      return;
    }

    // Simulate wallet creation
    const mockWallets = Array.from({ length: walletCount }, (_, i) => ({
      id: i + 1,
      publicKey: `${Math.random().toString(36).substring(2, 15)}...`,
      secretKey: `${Math.random().toString(36).substring(2, 15)}...`,
    }));

    setWalletsCreated(true);
    onWalletsChange(walletCount);
    
    toast({
      title: "Wallets Created",
      description: `Successfully created ${walletCount} wallets`,
    });

    // Set mock JSON for export
    setWalletJson(JSON.stringify({
      wallets: mockWallets.map(w => ({
        secret_b58: w.secretKey,
        pubkey: w.publicKey
      }))
    }, null, 2));
  };

  const handleExportJson = () => {
    if (!walletsCreated) {
      toast({
        title: "No Wallets to Export",
        description: "Create wallets first before exporting",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([walletJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solana-wallets.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Wallets Exported",
      description: "Wallet JSON file downloaded successfully",
    });
  };

  const handleImportJson = () => {
    if (!walletJson.trim()) {
      toast({
        title: "No JSON Data",
        description: "Please paste wallet JSON data first",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsed = JSON.parse(walletJson);
      if (!parsed.wallets || !Array.isArray(parsed.wallets)) {
        throw new Error("Invalid wallet format");
      }

      setWalletsCreated(true);
      onWalletsChange(parsed.wallets.length);
      
      toast({
        title: "Wallets Imported",
        description: `Successfully imported ${parsed.wallets.length} wallets`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid JSON format. Please check your data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="trading-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Wallets</h2>
        {walletsCreated && (
          <div className="ml-auto flex items-center gap-2 text-success text-sm">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            {walletCount} wallets active
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Create Wallets */}
        <div className="space-y-3">
          <Label htmlFor="wallet-count" className="text-sm font-medium text-foreground">
            Number of wallets to create
          </Label>
          <div className="flex gap-3">
            <Input
              id="wallet-count"
              type="number"
              value={walletCount}
              onChange={(e) => setWalletCount(parseInt(e.target.value) || 0)}
              min="1"
              max="1000"
              className="flex-1 bg-secondary border-border focus:ring-primary"
            />
            <Button
              onClick={handleCreateWallets}
              className="neon-button bg-primary hover:bg-primary/80 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Export/Import Controls */}
        <div className="flex gap-3">
          <Button
            onClick={handleExportJson}
            variant="outline"
            disabled={!walletsCreated}
            className="flex-1 neon-button border-accent text-accent hover:bg-accent/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <Button
            onClick={() => document.getElementById("file-input")?.click()}
            variant="outline"
            className="flex-1 neon-button border-cyber text-cyber hover:bg-cyber/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
          </Button>
        </div>

        {/* JSON Text Area */}
        <div className="space-y-3">
          <Label htmlFor="wallet-json" className="text-sm font-medium text-foreground">
            Or paste JSON
          </Label>
          <Textarea
            id="wallet-json"
            value={walletJson}
            onChange={(e) => setWalletJson(e.target.value)}
            placeholder='{"wallets":[{"secret_b58":"...","pubkey":"..."}]}'
            className="min-h-[120px] bg-secondary border-border focus:ring-primary resize-none font-mono text-sm"
          />
          <Button
            onClick={handleImportJson}
            className="neon-button bg-cyber hover:bg-cyber/80 text-cyber-foreground w-full"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>

        {/* Hidden file input for future file upload functionality */}
        <input
          id="file-input"
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => setWalletJson(e.target?.result as string || "");
              reader.readAsText(file);
            }
          }}
        />
      </div>
    </div>
  );
};