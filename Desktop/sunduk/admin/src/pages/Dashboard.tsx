import React from 'react';
import { Grid, Paper, Typography, Box, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../services/api';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => {
  const theme = useTheme();
  return (
    <Paper sx={{ p: 3, textAlign: 'center' }}>
      <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>{icon}</Box>
    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Paper>
  );
};

const Dashboard = () => {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => adminAPI.getUsers().then((res) => res.data),
  });

  const { data: levels } = useQuery({
    queryKey: ['levels'],
    queryFn: () => adminAPI.getLevels().then((res) => res.data),
  });

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Kullanıcı"
            value={users?.length || 0}
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Seviyeler"
            value={levels?.length || 0}
            icon={<SchoolIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Dersler"
            value="0"
            icon={<BookIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aktif Abonelikler"
            value="0"
            icon={<DashboardIcon sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

