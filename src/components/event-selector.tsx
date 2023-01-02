import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import {
  createTheme,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ThemeProvider,
} from '@mui/material';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import ColorizeIcon from '@mui/icons-material/Colorize';
import { DatePicker } from '@mui/x-date-pickers';

import { EventConfig, EventType, EVENT_COLORS, EVENT_TYPES } from '@/model/event-config';
import { LS_EVENT } from '@/model/const/keys';

import styles from '@/styles/DateSelector.module.css';

export default function EventSelector({
  config,
  setState,
}: {
  config: EventConfig;
  setState: Dispatch<SetStateAction<EventConfig | undefined>>;
}) {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState(config.name);
  const [eventDate, setEventDate] = useState(config.date);
  const [eventType, setType] = useState(config.type!);

  // Colorizer handler
  const handleClickColorizer = () => {
    const currentEntryIndex = EVENT_COLORS.findIndex(
      (e) => e === config.color
    );
    const nextEntryIndex = (currentEntryIndex + 1) % EVENT_COLORS.length;
    setState(config.setColor(EVENT_COLORS[nextEntryIndex]));
  };

  // Modal handlers
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    setState(config.setName(eventName).setDate(eventDate).setType(eventType));
    // persist config
    localStorage.setItem(LS_EVENT, config.toJSON());
    handleClose();
  };

  // Form handlers
  const handleDateChange = (e: Dayjs | null) => {
    const date = e || dayjs();
    setEventDate(date);
    setType(config.getType(date));
  };
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value.trim() || '');
  };
  const handleTypeChange = (e: SelectChangeEvent) => {
    setType(e.target.value as EventType);
  };
  const eventNameValidator = () => {
    if (!eventName?.trim().length) {
      return { error: true, text: 'Must not be empty' };
    }
    if (eventName.length > 25) {
      return { error: true, text: 'Max 25 symbols' };
    }
    return { error: false };
  };

  // UI configs
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      secondary: {
        main: '#ccc',
      },
    },
  });

  const typeItems = Object.entries(EVENT_TYPES).map(([_, v]) => (
    <MenuItem value={v} key={v}>{v}</MenuItem>
  ));

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.cog}>
        <Box sx={{ p: 1.5 }}>
          <IconButton
            sx={{ p: 2 }}
            size="large"
            color="secondary"
            title="Change neon color"
            onClick={handleClickColorizer}
          >
            <ColorizeIcon></ColorizeIcon>
          </IconButton>

          <IconButton
            sx={{ p: 2 }}
            size="large"
            color="secondary"
            title="Choose anoter event"
            onClick={handleClickOpen}
          >
            <SettingsIcon></SettingsIcon>
          </IconButton>
        </Box>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'xs'}
        fullWidth={true}
      >
        <DialogTitle>Choose event&apos;s date</DialogTitle>
        <DialogContent>
          <Stack
            spacing={4}
            component="form"
            autoComplete="off"
            noValidate
            sx={{
              my: 2,
              '& .MuiFormControl-root': {
                maxWidth: 400,
              },
            }}
          >
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
              inputFormat="DD.MM.YYYY"
              value={eventDate}
              onChange={handleDateChange}
              disablePast
              renderInput={(params) => <TextField {...params} />}
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={eventType}
                label="Type"
                onChange={handleTypeChange}
              >
                {typeItems}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Done</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
