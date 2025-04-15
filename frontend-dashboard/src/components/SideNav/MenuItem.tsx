import Link from "next/link"
import { Box, Typography, Badge, styled } from "@mui/material"
import type { SvgIconComponent } from "@mui/icons-material"

// Custom styled components
const MenuItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
  transition: "all 0.2s ease",
  margin: "4px 0",
  textDecoration: "none",
  color: theme.palette.text.secondary,
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: theme.palette.primary.main + "15",
    color: theme.palette.primary.main,
  },
  "&.active": {
    backgroundColor: theme.palette.primary.main + "20",
    color: theme.palette.primary.main,
    fontWeight: 500,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 3,
    height: "60%",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0 4px 4px 0",
    opacity: 0,
    transition: "opacity 0.2s ease",
  },
  "&.active::before": {
    opacity: 1,
  },
}))

const IconWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
  color: "inherit",
})

const BadgeWrapper = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
    fontSize: 10,
    minWidth: 20,
    height: 20,
  },
}))

interface ModernMenuItemProps {
  icon: SvgIconComponent
  label: string
  path: string
  isActive?: boolean
  badge?: number
}

export function ModernMenuItem({ icon: Icon, label, path, isActive = false, badge }: ModernMenuItemProps) {
  return (
    <MenuItemContainer component={Link} href={path} className={isActive ? "active" : ""}>
      <IconWrapper>
        <Icon fontSize="small" />
      </IconWrapper>
      <Typography
        variant="body2"
        sx={{
          flexGrow: 1,
          fontWeight: isActive ? 500 : 400,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </Typography>
      {badge && <BadgeWrapper badgeContent={badge} color="primary" />}
    </MenuItemContainer>
  )
}
