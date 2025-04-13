"use client";
import { ReactNode } from "react";
import { Box, styled } from "@mui/material";
import DrawerAppBar from "@/principal/components/navbar";

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
      overflow: auto;
      background: ${theme.palette.common.white};
      flex: 1;
      overflow-x: hidden;
  `
);

type Props = {
    children: ReactNode;
};

export default function GlobalBgProvider({ children }: Props) {
    return (
        <OverviewWrapper>
            <DrawerAppBar />
            {children}
        </OverviewWrapper>
    );
}
