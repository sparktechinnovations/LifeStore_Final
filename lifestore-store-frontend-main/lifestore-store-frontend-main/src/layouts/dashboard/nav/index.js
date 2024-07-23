import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';

import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import navConfig from './config';

const NAV_WIDTH = 280;

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOnClick = () => {
    navigate('/dashboard/app');
  };

  const renderContent = (
    <div style={{ height: '100%' }}>
      <Scrollbar
        sx={{
          height: 1,
          '& .simplebar-content': {
            height: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: { md: 'black', xs: 'white' },
          },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 3,
            display: 'inline-flex',
            justifyContent: 'center',
            color: { lg: 'whitesmoke', xs: 'black' }, // Conditionally set text color
          }}
        >
          <Typography
            sx={{ fontSize: '35px', fontFamily: 'cursive', cursor: 'pointer' }}
            onClick={handleOnClick}
            color={{ md: 'whitesmoke', xs: 'black' }}
          >
            Life Store
          </Typography>
        </Box>
        <NavSection data={navConfig} />
        <Box sx={{ flexGrow: 1 }} />
      </Scrollbar>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'black',
              color: 'white',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH, backgroundColor: { md: 'black' } },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
