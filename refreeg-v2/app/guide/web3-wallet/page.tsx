"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function Web3WalletGuide() {
  const router = useRouter();
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Web3 Wallet Guide</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What is a Web3 Wallet?</CardTitle>
            <CardDescription>
              A Web3 wallet is a digital wallet that allows you to store, send,
              and receive cryptocurrencies and interact with blockchain
              applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Popular Web3 Wallets</h2>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <img
                        src="/metamask.svg"
                        alt="MetaMask"
                        className="w-6 h-6"
                      />
                      MetaMask
                    </CardTitle>
                    <CardDescription>
                      The most popular Web3 wallet browser extension
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>Steps to install MetaMask:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Visit the official MetaMask website</li>
                        <li>Click "Download" and select your browser</li>
                        <li>Add the extension to your browser</li>
                        <li>Create a new wallet or import an existing one</li>
                        <li>Follow the setup instructions</li>
                      </ol>
                      <Button asChild>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Install MetaMask{" "}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <img
                        src="/walletconnect-logo.svg"
                        alt="WalletConnect"
                        className="w-6 h-6"
                      />
                      WalletConnect
                    </CardTitle>
                    <CardDescription>
                      Connect your mobile wallet to desktop applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>Steps to use WalletConnect:</p>
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Install a compatible mobile wallet (e.g., Trust
                          Wallet)
                        </li>
                        <li>Scan the QR code when prompted</li>
                        <li>Approve the connection in your mobile wallet</li>
                      </ol>
                      <Button asChild>
                        <a
                          href="https://walletconnect.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Learn More <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Security Tips</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Never share your private keys or seed phrase with anyone
                </li>
                <li>
                  Always verify the website URL before connecting your wallet
                </li>
                <li>Use hardware wallets for large amounts</li>
                <li>Keep your wallet software updated</li>
                <li>
                  Enable additional security features like 2FA when available
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Need Help?</h2>
              <p>
                If you encounter any issues while setting up your Web3 wallet,
                please contact our support team.
              </p>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
