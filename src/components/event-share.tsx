import { useState } from 'react';

import { Alert, IconButton, Slide, SlideProps, Snackbar } from '@mui/material';
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

  return (
    <>
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
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
      >
        <Alert variant="outlined" severity="success" sx={{ width: '100%' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
