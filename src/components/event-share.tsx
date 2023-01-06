import { useState } from 'react';

import {
  Alert,
  createTheme,
  IconButton,
  Slide,
  SlideProps,
  Snackbar,
  ThemeProvider,
} from '@mui/material';
import { Box } from '@mui/system';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { EventConfig } from '@/model/event-config';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

export default function EventShare({ config }: { config: EventConfig }) {
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    await copyConfigUrl();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const copyConfigUrl = async () => {
    const host = window.location.host;
    const url = host + '?' + config.toQuery();
    await navigator.clipboard.writeText(url);
  };

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#ccc',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 1.5, position: 'absolute', left: 0, bottom: 0, zIndex: 2 }}>
        <IconButton
          sx={{ p: 2 }}
          size="large"
          color="secondary"
          title="Copy URL to clipboard"
          onClick={handleOpen}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>

      <Snackbar
        open={open}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        autoHideDuration={4_000_000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
      >
        <Alert variant="filled" severity="info">
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
