import { useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { createTheme, IconButton, Stack, TextField, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import { DatePicker } from '@mui/lab';

import { EventControl } from '../model/event-control';
import styles from '../../styles/DateSelector.module.css'


const EventSelector = ({ nxModel }: { nxModel: EventControl }) => {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState(nxModel.eventName);
  const [eventDate, setEventDate] = useState(nxModel.eventDate)

  // Modal handlers
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    nxModel.setEventName(eventName);
    nxModel.setEventDate(eventDate);
    setOpen(false);
  };

  // Form handlers
  const handleDateChange = (e: Dayjs | null) => {
    setEventDate(e || dayjs());
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value.trim() || '');
  }
  const eventNameValidator = () => {
    if (!eventName?.trim().length) {
      return { error: true, text: 'Must not be empty' };
    }
    if (eventName.length > 25) {
      return { error: true, text: 'Max 25 symbols' };
    }
    return { error: false }
  }

  // UI configs
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      secondary: {
        main: '#ccc'
      }
    },

  });

  return (
    <ThemeProvider theme={darkTheme}>

      <div className={styles.cog}>
        <IconButton
          size="large"
          color="secondary"
          title="Choose anoter event"
          onClick={handleClickOpen}>
          <SettingsIcon></SettingsIcon>
        </IconButton>
        <Dialog open={open} onClose={handleClose} maxWidth={'xs'} fullWidth={true}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <DialogTitle>Choose event's date</DialogTitle>
          <DialogContent>
            <Stack
              spacing={4}
              component="form"
              autoComplete="off"
              noValidate
              sx={{
                my: 2,
                '& .MuiFormControl-root': {
                  maxWidth: 400
                }
              }}>

              <TextField
                type="text"
                label="Name"
                defaultValue={eventName}
                onChange={handleNameChange}
                margin="none"
                variant="outlined"
                error={eventNameValidator().error}
                helperText={eventNameValidator().text}
              />

              <DatePicker
                label="Date"
                inputFormat="DD/MM/YYYY"
                value={eventDate}
                onChange={handleDateChange}
                disablePast
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Done</Button>
          </DialogActions>
        </Dialog>
      </div >
    </ThemeProvider>
  );
}

export default EventSelector;