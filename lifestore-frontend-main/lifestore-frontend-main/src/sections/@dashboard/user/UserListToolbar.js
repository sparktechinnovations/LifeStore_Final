import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Typography, OutlinedInput, InputAdornment, Grid,TextField, Autocomplete, } from '@mui/material';
import { useState } from 'react';
import Iconify from '../../../components/iconify';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  flexDirection: 'column', // Display items vertically on smaller screens
  alignItems: 'stretch', // Stretch items to full width
  justifyContent: 'center', // Center items vertically on smaller screens
  padding: theme.spacing(1, 2), // Adjust padding for smaller screens
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row', // Display items horizontally on larger screens
    alignItems: 'center', // Center items horizontally on larger screens
    justifyContent: 'space-between', // Add space between items on larger screens
    padding: theme.spacing(0, 1, 0, 3), // Reset padding for larger screens
  },
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: '100%', // Make the search input full width on smaller screens
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('sm')]: {
    width: 240, // Restore width for larger screens
  },
  '&.Mui-focused': {
    width: '100%', // Keep the width full when focused on smaller screens
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onDateRangeChange: PropTypes.func,
  showDatePicker: PropTypes.bool,
  showAutocomplete: PropTypes.bool,
};

export default function UserListToolbar({
  numSelected,
  filterName,
  onFilterName,
  onDateRangeChange,
  showDatePicker,
  showAutocomplete,
}) {
  const [formData, setFormData] = useState({
    start: "",
    end: "",
  });

  const storeCategoryOptions = ["Store1", "Store2", "Store3"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <div>
          <StyledSearch
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />

       { showAutocomplete &&  <Autocomplete
            options={storeCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Store Category"
                style={{ width: '230px' }}
              />
            )}
            onChange={(event, newValue) => {
              
            }}
          />
}
          {showDatePicker && (
            <Grid style={{ display: 'flex', justifyContent: "space-between" }}>
              <TextField
                fullWidth
                sx={{ marginRight: "20px" }}
                label="Start date"
                name="start"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="End date"
                name="end"
                type="date"
                value={formData.end}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          )}
        </div>
      )}
    </StyledRoot>
  );
}
