import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  overflow: 'visible',
  width: '70vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: 'lavender',
  height: '90vh',
}));

const VideoCard = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
const handleVideoUpload = (event) => {
const file = event.target.files[0];
if (file && file.size > 5 * 1024 * 1024) {
setSnackBarMessage('Video size should be less than 5MB');
setOpenSnackbar(true);
} else {
setVideoFile(file);
setSnackBarMessage('Video Uploaded Successfully');
setOpenSnackbar(true);
}
};
const handleCloseSnackbar = () => {
setOpenSnackbar(false);
};
return (
<StyledCard>
<CardContent>
<div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
<Typography
variant="h5"
component="div"
textAlign="center"
sx={{ fontWeight: 'bold' }}
>
Video Player
</Typography>
<Box mt={2} display="flex" justifyContent="center">
<Button variant="contained" component="label">
Upload Video
<input
             type="file"
             accept="video/*"
             hidden
             onChange={handleVideoUpload}
           />
</Button>
</Box>
</div>
{videoFile && (
<Box mt={4} width="100%" height="70%">
<CardMedia
           component="video"
           controls
           src={URL.createObjectURL(videoFile)}
           width="100%"
           height="100%"
           autoPlay
           loop
         />
</Box>
)}
<Snackbar
open={openSnackbar}
autoHideDuration={3000}
onClose={handleCloseSnackbar}
message={snackBarMessage}
anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
/>
</CardContent>
</StyledCard>
);
};
export default VideoCard;