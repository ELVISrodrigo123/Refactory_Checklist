"use client";

import { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/config/theme";
import { Geist, Geist_Mono } from "next/font/google";
import GlobalBgProvider from "./GlobaBgProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

type Props = {
    children: ReactNode;
};

export default function AppProviders({ children }: Props) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalBgProvider>
                    {children}
                </GlobalBgProvider>
            </ThemeProvider>
        </div>
    );
}
