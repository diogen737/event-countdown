import { useState } from 'react';
import Image from 'next/image';

import dayjs, { Dayjs } from 'dayjs';
import { createTheme, TextField, ThemeProvider } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { MobileDatePicker } from '@mui/lab';
import { Box } from '@mui/system';

import styles from '../../styles/DateSelector.module.css'


const EventSelector = ({ nxModel }) => {
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
  const handleDateChange = (e: Dayjs|null) => {
    setEventDate(e || dayjs());
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value || '');
  }

  const darkTheme = createTheme({
    palette: { mode: 'dark' },
  });

  return (
    <div className={styles.cog}>
      <Image
        src="/cog.svg"
        layout="fixed"
        width="30"
        height="30"
        alt="Choose anoter event"
        onClick={handleClickOpen}>
      </Image>
      <ThemeProvider theme={darkTheme}>
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <DialogTitle>Choose event's date</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}>

              <div className="">
                <TextField
                  type="text"
                  label="Name"
                  defaultValue={eventName}
                  onChange={handleNameChange}
                  margin="normal"
                  variant="standard"
                  autoFocus
                  fullWidth
                />

                <MobileDatePicker
                  label="Date"
                  inputFormat="DD/MM/YYYY"
                  value={eventDate}
                  onChange={handleDateChange}
                  disablePast
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>

            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Subscribe</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div >
  );
}

export default EventSelector;