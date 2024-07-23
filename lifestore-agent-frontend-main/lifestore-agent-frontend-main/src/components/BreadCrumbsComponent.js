import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function BreadcrumbsComponent({ lastBreadcrumb }) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link color="inherit" href="/dashboard/app">
        Home
      </Link>
      {lastBreadcrumb && (
        <Typography color="textPrimary">{lastBreadcrumb}</Typography>
      )}
    </Breadcrumbs>
  );
}

export default BreadcrumbsComponent;
