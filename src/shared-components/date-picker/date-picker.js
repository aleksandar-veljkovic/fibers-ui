import React, { createRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export const DatePicker = ({ label, isMaterial, onChange, defaultValue, width, required, disabled, inputRef }) => {
    const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue) => {
    setValue(newValue);
    onChange && onChange(newValue);
  };
    return(
        <div className={`date-picker ${isMaterial ? 'material' : ''}`}>
             <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    label={label}
                    disabled={disabled}
                    inputFormat="yyyy-MM-dd"
                    value={value}
                    inputRef={inputRef}
                    onChange={handleChange}
                    sx={{ flex: 1 }}
                    renderInput={(params) => <TextField required={required} width={width} {...params} sx={{ flex: 1 }} variant={ isMaterial ? "standard" : "outlined" } />}
                />
             </LocalizationProvider>
      </div>
    )
}