import { Card, Container, Typography } from '@mui/material';


interface IProps {
    title?: string;
    subtitle?: string;
}

export function PageHeader({ title, subtitle }: IProps) {

    return (
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            <Card sx={{ display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                <Typography variant="h2" component="h1">
                    {title || 'User Settings'}
                </Typography>
                <Typography variant="subtitle2">
                    {subtitle || `Manage your account settings and set e-mail preferences`}
                </Typography>
            </Card>
        </Container>
    );
}