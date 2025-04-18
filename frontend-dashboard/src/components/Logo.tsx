import {
    Badge,
    Box,
    styled,
    useTheme
} from '@mui/material';
const LogoWrapper = styled(Box)(
    ({ theme }) => `
          color: ${theme.palette.text.primary};
          display: flex;
          text-decoration: none;
          width: 53px;
          margin: 0 auto;
          font-weight: ${theme.typography.fontWeightBold};
  `
);

export function Logo() {
    const theme = useTheme();

    return (
        <LogoWrapper>
            <Badge
                sx={{
                    '.MuiBadge-badge': {
                        fontSize: theme.typography.pxToRem(11),
                        right: -2,
                        top: 8
                    },
                }}
                overlap="circular"
                color="success"
            >
                {/* <LogoSignWrapper> */}
                {/* <LogoSign> */}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="64px"
                    height="64px"
                >
                    <linearGradient
                        id="_r_aP5JxeTUbgl5L40n7Ca"
                        x1={32}
                        x2={32}
                        y1={22.915}
                        y2={39.482}
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset={0} stopColor="#6dc7ff" />
                        <stop offset={1} stopColor="#e6abff" />
                    </linearGradient>
                    <polygon
                        fill="url(#_r_aP5JxeTUbgl5L40n7Ca)"
                        points="32,24 16,31 32,40 48,31"
                    />
                    <linearGradient
                        id="_r_aP5JxeTUbgl5L40n7Cb"
                        x1={32}
                        x2={32}
                        y1={4.319}
                        y2={56.536}
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset={0} stopColor="#1a6dff" />
                        <stop offset={1} stopColor="#c822ff" />
                    </linearGradient>
                    <path
                        fill="url(#_r_aP5JxeTUbgl5L40n7Cb)"
                        d="M15.979,32.214l15.029,8.588c0.306,0.174,0.648,0.261,0.991,0.261s0.686-0.087,0.992-0.262 l15.028-8.588c0.473-0.271,0.819-0.729,0.949-1.257c0.131-0.528,0.038-1.094-0.254-1.553L33.687,5.789 c-0.369-0.58-1-0.926-1.687-0.926c-0.688,0-1.318,0.346-1.688,0.926L15.284,29.404c-0.292,0.459-0.385,1.024-0.254,1.553 C15.16,31.486,15.507,31.944,15.979,32.214z M17.598,30.838L31,25.477v13.017L17.598,30.838z M33,25.477l13.4,5.36L33,38.495 V25.477z M45.71,28.407L33,23.323V8.434L45.71,28.407z M31,8.434v14.889l-12.71,5.084L31,8.434z"
                    />
                    <linearGradient
                        id="_r_aP5JxeTUbgl5L40n7Cc"
                        x1={32}
                        x2={32}
                        y1={4.319}
                        y2={56.536}
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset={0} stopColor="#1a6dff" />
                        <stop offset={1} stopColor="#c822ff" />
                    </linearGradient>
                    <path
                        fill="url(#_r_aP5JxeTUbgl5L40n7Cc)"
                        d="M50.178,35.027c-0.319-0.354-0.846-0.434-1.255-0.19L32,44.923L15.077,34.837 c-0.409-0.245-0.935-0.166-1.255,0.19c-0.319,0.355-0.344,0.886-0.058,1.268L30.39,58.5c0.381,0.518,0.968,0.814,1.61,0.814 s1.229-0.296,1.605-0.808l16.63-22.211C50.521,35.913,50.497,35.382,50.178,35.027z M18.396,39.143L31,46.655v9.323L18.396,39.143z M33,55.968v-9.313l12.602-7.511L33,55.968z"
                    />
                </svg>
                {/* </LogoSign> */}
                {/* </LogoSignWrapper> */}
            </Badge>
        </LogoWrapper>
    );
};