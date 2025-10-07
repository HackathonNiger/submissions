import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../components/providers/ReduxProvider";
import ToastContainer from "../components/ui/ToastContainer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "GestPay",
  description: "Limitless, Next-gen payments with biometrics!",
  keywords: [
    "WhatsApp Payments",
    "Telegram Payments",
    "GestPay",
    "Face Pay",
    "Voice Pay",
    "Adegbola Abdulbaqee",
    "Kunle-Ajayi Oluwasetemi",
    "fintech",
    "Nigerian-fintech"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-space antialiased bg-primary text-soft-white`}
      >
        <ReduxProvider>
          {children}
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
