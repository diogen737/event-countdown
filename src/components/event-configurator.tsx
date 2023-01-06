import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import {
  Alert,
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

import {
  EventConfig,
  EventType,
  EVENT_COLORS,
  EVENT_TYPES,
} from '@/model/event-config';
import { LS_EVENT } from '@/model/const/keys';

export default function EventConfigurator({
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
  const cycleColor = () => {
    const currentEntryIndex = EVENT_COLORS.findIndex((e) => e === config.color);
    const nextEntryIndex = (currentEntryIndex + 1) % EVENT_COLORS.length;
    setState(config.setColor(EVENT_COLORS[nextEntryIndex]));
  };

  // Modal handlers
  const dialogOpen = () => setOpen(true);
  const dialogClose = () => setOpen(false);
  const handleSubmit = () => {
    const newConfig = config
      .setName(eventName)
      .setDate(eventDate)
      .setType(eventType);
    setState(newConfig);
    // persist config
    localStorage.setItem(LS_EVENT, newConfig.toJSON());
    dialogClose();
  };

  // Form handlers
  const dateChange = (e: Dayjs | null) => {
    const date = e || dayjs();
    setEventDate(date);
    // setType(config.getType(date));
  };
  const nameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value.trim() || '');
  };
  const typeChange = (e: SelectChangeEvent) => {
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

  const typeItems = Object.entries(EVENT_TYPES).map(([_, v]) => (
    <MenuItem value={v} key={v}>
      {v}
    </MenuItem>
  ));

  const defaultTheme = createTheme();
  const theme = createTheme({
    palette: {
      mode: 'dark',
      secondary: {
        main: '#ccc',
      },
    },
    components: {
      MuiAlert: {
        styleOverrides: {
          icon: {
            alignItems: 'center',
            padding: 0,
          },
          message: {
            padding: '4px 0 2px 0',
            fontSize: 10,
            [defaultTheme.breakpoints.up('sm')]: {
              fontSize: 12,
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ p: 1.5, position: 'absolute', right: 0, bottom: 0, zIndex: 2 }}
      >
        <IconButton
          sx={{ p: 2 }}
          size="large"
          color="secondary"
          title="Change neon color"
          onClick={cycleColor}
        >
          <ColorizeIcon />
        </IconButton>

        <IconButton
          sx={{ p: 2 }}
          size="large"
          color="secondary"
          title="Choose another event"
          onClick={dialogOpen}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      <Dialog
        open={open}
        onClose={dialogClose}
        maxWidth={'xs'}
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, px: 3, py: 1 }}>
          Configure your event
        </DialogTitle>
        <DialogContent dividers>
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
              onChange={nameChange}
              margin="none"
              variant="outlined"
              error={eventNameValidator().error}
              helperText={eventNameValidator().text}
            />

            <DatePicker
              label="Date"
              inputFormat="DD.MM.YYYY"
              value={eventDate}
              onChange={dateChange}
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
                onChange={typeChange}
              >
                {typeItems}
              </Select>
            </FormControl>

            <Alert variant="outlined" severity="info">
              Event will be saved permanently on this device
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1 }}>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
