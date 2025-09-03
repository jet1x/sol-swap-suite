import { useState } from "react";
import { RpcConnection } from "./RpcConnection";
import { WalletManager } from "./WalletManager";
import { TradingSettings } from "./TradingSettings";
import { AutoFunding } from "./AutoFunding";
import { TradingUtilities } from "./TradingUtilities";
import { TradingLogs } from "./TradingLogs";

export const SolanaTrader = () => {
  const [isRpcConnected, setIsRpcConnected] = useState(false);
  const [isFundingLoaded, setIsFundingLoaded] = useState(false);
  const [walletCount, setWalletCount] = useState(0);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [isTrading, setIsTrading] = useState(false);

  const isSetupComplete = isRpcConnected && isFundingLoaded && walletCount > 0 && settingsSaved;

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Solana Multi-Wallet Trader
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Professional trading platform for Solana tokens
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isSetupComplete ? 'bg-success animate-pulse' : 'bg-muted'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {isSetupComplete ? 'Ready to Trade' : 'Setup Required'}
                </span>
              </div>
              
              {isTrading && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 border border-success/30">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm text-success font-medium">Trading Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
          
          {/* Left Column - Setup & Configuration */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* RPC & Funding */}
            <RpcConnection 
              onConnectionChange={setIsRpcConnected}
              onFundingLoaded={setIsFundingLoaded}
            />
            
            {/* Two column sub-grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Wallet Management */}
              <WalletManager onWalletsChange={setWalletCount} />
              
              {/* Auto Funding */}
              <AutoFunding 
                walletCount={walletCount}
                isEnabled={isRpcConnected && isFundingLoaded && walletCount > 0}
              />
              
            </div>
            
            {/* Trading Settings */}
            <TradingSettings onSettingsSaved={setSettingsSaved} />
            
            {/* Trading Utilities */}
            <TradingUtilities 
              walletCount={walletCount}
              isEnabled={isSetupComplete}
            />
            
          </div>
          
          {/* Right Column - Logs & Controls */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <TradingLogs 
                isTrading={isTrading}
                onTradingStart={() => setIsTrading(true)}
                onTradingStop={() => setIsTrading(false)}
                isEnabled={isSetupComplete}
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>
                <strong>Fees:</strong> 2% platform fee per trade | 
                <strong className="ml-2">Min per wallet:</strong> €1 (configurable)
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Built with Solana Web3.js</span>
              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>Powered by Jupiter Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};