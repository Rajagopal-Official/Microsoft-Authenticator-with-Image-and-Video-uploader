import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Snackbar,
  Modal,
  IconButton,
  makeStyles,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from "axios";
import Swal from 'sweetalert2'; 

const StyledCard = styled(Card)(({ theme }) => ({
  //Card for uploaders
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  overflow: "visible",
  width: "70vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(3),
  backgroundColor: "lavender",
  height: "90vh",
}));

const ImageCarouselCard = () => {
  const [images, setImages] = useState([]); //state to display current Image
  const [openSnackbar, setOpenSnackbar] = useState(false); //state to display toastmessage stuff
  const [currentIndex, setCurrentIndex] = useState(0); // Added state for current image index
  const [snackBarMessage, setSnackBarMessage] = useState(""); //State for Showing Snackbar Message
  const [openModal, setOpenModal] = useState(false); //state for opening and closing modal
  const [userNamePassword, setUserNamePassword] = useState({
    username: "",
    password: "", //since to store the username and password you should declare a empty key  and value pair
  }); //state for storing username and password
  const [isAuthenticated, setIsAuthenticated] = useState(false); //state for authentication

  const handleImageUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files); //images and text files we gonna select
    const allowedFormats = ["jpg", "jpeg", "png", "svg", "txt"]; //allowed image with extension

    //Handle Text file Upload
    const textFiles = uploadedFiles.filter(
      (file) => file.type === "text/plain"
    );
    if (textFiles.length > 1) {
      setSnackBarMessage(
        "Only one text file can be uploaded for authentication"
      );
      setOpenSnackbar(true);
      return;
    } else if (textFiles.length === 1) {
      handleTextFileUpload(textFiles[0]);
    }
    // Filter out images with unsupported formats
    const supportedImages = uploadedFiles.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase(); //takingout the extension
      return allowedFormats.includes(extension) && file.type !== "text/plain"; //includes images and exclude text files
    });
    //Filtering Unsupported Images  means image doesnt having supported extension type
    const unSupportedImages = uploadedFiles.filter(
      (file) => !supportedImages.includes(file) && file.type !== "text/plain"
    );

    if (unSupportedImages.length > 0) {
      setSnackBarMessage("Image Format not accepted for upload");
      setOpenSnackbar(true);
      return;
    }

    // Check if the total number of images exceeds the limit
    const totalImages = images.length + supportedImages.length;
    if (totalImages > 5) {
      setImages([]);
      setSnackBarMessage("More than 5 images cannot be uploaded");
      setOpenSnackbar(true);
    } else {
      setImages([...images, ...supportedImages]);
      setSnackBarMessage(`${totalImages} of 5 images uploaded`);
      setOpenSnackbar(true);
    }
  };

  const totalImages = images.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    //
  };
  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((image, ind) => ind !== index); //will show all the images other than match image with same index
    setImages(updatedImages);
    setSnackBarMessage(`${updatedImages.length} of 5 images uploaded`);
    setOpenSnackbar(true);
    if (updatedImages.length === 0) {
      setOpenModal(false); //when closing the last image in the modal ,modal itself should close
    }
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return; //when trying to drag outside list simply retuns nothing
    const reorderedImages = Array.from(images); //create a copy of the images array
    const [movedImage] = reorderedImages.splice(result.source.index, 1); //result.source.index is the image that has been dragged
    //1 image that is the selected image is removed using splice,destructured to get the first element returend by splice()
    reorderedImages.splice(result.destination.index, 0, movedImage); //0 indicates 0 elements has to be removed  from the array
    //This line inserts the dragged image (movedImage) into the reorderedImages array at the new position (result.destination.index).
    setImages(reorderedImages);
  };
  useEffect(() => {
    if (userNamePassword.username && userNamePassword.password) {
      console.log("Updated userNamePassword: ", userNamePassword); //Every time username password chnages it is getting updated
      verifyCredentials(); //Every change in username and password verifyCredentials function is called
    }
  }, [userNamePassword]);
  const handleTextFileUpload = (file) => {
    //takes event object as parameter
    const reader = new FileReader(); //file reader object to read the files
    reader.onload = (e) => {
      //After successfully when the file is read,this function will be called and it takes a parameter e
      const textContent = e.target.result; //contains the files content
      const lines = textContent.split("\n");
      const username = lines[0].trim();
      const password = lines[1].trim();
      setUserNamePassword({
        username: username,
        password: password,
      });
    };
    reader.readAsText(file); //finally read that fileContents as text
  };
  const verifyCredentials = async () => {
    //Function to verify the credentials
    try {
      const response = await axios.get(
        "https://mocki.io/v1/eb1f9aa9-d8ee-42f1-b99f-c3fae38c144b"
      );
      const apiData = response.data; //Storing the uername and password.
      const matchingCredentials = apiData.find(
        (item) =>
          item.username === userNamePassword.username &&
          item.password === userNamePassword.password
      );
      console.log("credentials", userNamePassword);
      if (matchingCredentials) {
        Swal.fire({
          title: "Authentication Successful",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          allowOutsideClick: false,
          backdrop: true,
          backdropFilter: "blur(5px",
        });
        setIsAuthenticated(true);
      } else {
        Swal.fire({
          title: "Authentication Failed",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
          allowOutsideClick: false,
          backdrop: true,
          backdropFilter: "blur(5px)",
        });
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching Data From API:", error);
      Swal.fire({
        title: "Error Authenticating",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        allowOutsideClick: false,
        backdrop: true,
        backdropFilter: "blur(5px)",
      });
    }
  };
  return (
    <StyledCard>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="h5"
            component="div"
            textAlign="center"
            sx={{ fontWeight: "bold" }}
          >
            Image Carousel and Authenticator
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <div style={{ display: "flex", gap: "16px" }}>
              <Button variant="contained" component="label">
                Upload Images
                <input
                  type="file"
                  multiple
                  accept="image/jpg, image/jpeg, image/png, image/svg  ,text/plain"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
              <Button variant="contained" component="label">
                Upload Text File
                <input
                  type="file"
                  accept="text/plain"
                  hidden
                  onChange={(e) => handleTextFileUpload(e.target.files[0])}
                />
              </Button>
            </div>
            {images.length > 0 && (
              <Button
                variant="contained"
                onClick={handleOpenModal}
                sx={{ ml: 2 }}
              >
                View All Images
              </Button>
            )}
          </Box>
        </div>
        {images.length > 0 && (
          <Box mt={4} width="100%" height="70%">
            <Carousel
              navButtonsProps={{
                style: {
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "50%",
                  margin: "0 10px",
                },
              }}
              navButtonsAlwaysVisible
              autoPlay={false}
              navButtonsWrapperProps={{
                style: {
                  marginBottom: "1rem",
                },
              }}
              activeItemIndex={currentIndex}
              next={handleNext}
              prev={handlePrev}
            >
              {images.map((image, index) => (
                <Box key={index} display="flex" justifyContent="center">
                  <CardMedia
                    component="img"
                    height="100%"
                    image={URL.createObjectURL(image)}
                    alt={`Image ${index + 1} of ${images.length}`}
                    style={{
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
            </Carousel>
            <Typography variant="h6" component="div" align="center" mt={2}>
              {`${currentIndex + 1} of ${totalImages}`}
            </Typography>
          </Box>
        )}
        {images.length === 0 && (
          <Box
            mt={4}
            width="100%"
            height="70%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography
              variant="h6"
              component="div"
              align="center"
              sx={{ justifyContent: "center" }}
            >
              No Images or Text File uploaded
            </Typography>
          </Box>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2500}
          onClose={handleCloseSnackbar}
          message={snackBarMessage}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        />
      </CardContent>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "60vw",
            height: "50vh",
            overflowY: "auto",
            background: "#A0DEFF",
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 0,
              right: 16,
              zIndex: 1,
              color: "black",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              margin: "0.1rem",
            }}
          >
            <CloseIcon />
          </IconButton>
          {images.length > 0 && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="images" direction="vertical">
                {(provided) => (
                  <Grid
                    container
                    spacing={1}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {images.map((image, index) => (
                      <Fragment
                        key={`${index}-${image.name.replace(
                          /[^a-zA-Z0-9]/g,
                          "_"
                        )}`}
                      >
                        <Draggable
                          key={`${index}-${image.name.replace(
                            /[^a-zA-Z0-9]/g,
                            "_"
                          )}`}
                          draggableId={`image-${index}-${image.name.replace(
                            /[^a-zA-Z0-9]/g,
                            "_"
                          )}`}
                          index={index}
                        >
                          {(provided) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={12}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CardMedia
                                component="img"
                                height="200"
                                image={URL.createObjectURL(image)}
                                alt={`Image ${index + 1} of ${images.length}`}
                                style={{
                                  width: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </Grid>
                          )}
                        </Draggable>
                        <IconButton
                          onClick={() => handleDeleteImage(index)}
                          sx={{
                            position: "absolute",
                            top: 50,
                            right: 200,
                            zIndex: 1,
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            borderRadius: "50%",
                            margin: "0.5rem",
                            "&:hover": {
                              color: "red",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Fragment>
                    ))}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Box>
      </Modal>
    </StyledCard>
  );
};

export default ImageCarouselCard;
