import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" noWrap component="div">
        Admin Panel
      </Typography>
      {user && (
        <Typography variant="body2" sx={{ mr: 2 }}>
          {user.username} ({user.email})
        </Typography>
      )}
    </Box>
  );
};

export default Header;

