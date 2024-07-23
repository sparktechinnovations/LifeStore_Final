import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import { Box, List, ListItemText, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledNavItem, StyledNavItemIcon } from './styles';

// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

function NavItem({ item }) {
  const { title, path, icon, children } = item;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  if (children) {
    return (
      <div>
        <StyledNavItem
          onClick={handleClick}
          sx={{
            color: { xs: 'black', md: 'white' }, // Default text color for desktop
          }}
        >
          <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
          <ListItemText disableTypography primary={title} />
          {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </StyledNavItem>
        <Collapse in={open}>
          <List>
            {children.map((child, index) => (
              <NavItem key={index} item={child} />
            ))}
          </List>
        </Collapse>
      </div>
    );
  }

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        color: { xs: 'black', md: 'white' }, // Default text color for desktop
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText primary={title} />
    </StyledNavItem>
  );
}
