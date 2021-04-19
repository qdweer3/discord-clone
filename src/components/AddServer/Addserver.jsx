import React, { useState } from 'react'
import AddIcon from '@material-ui/icons/AddCircle';
import { Container, DialogActions, DialogContent, DialogContentText, IconButton, makeStyles, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import PhotoIcon from '@material-ui/icons/Photo';
import Resizer from "react-image-file-resizer";
import './Addserver.scss'
import { auth, firestore } from '../../firebase/firebase';
import firebase from 'firebase/app'
const useStyles=makeStyles({
    addicon:{
        width:'4.8rem',
        height:'4.8rem',
        color:'#43b581'
    },
    header:{
        textAlign:'center'
    },
    header__heading:{
        fontSize:'2rem',
        color:'#060607',
        padding:'.3rem 2rem',
        fontFamily:'Whitney-bold',
        display:'block'
    },
    header__text:{
        fontSize:'1.5rem',
        display:'block'
    },
    header__servername:{
        marginRight:'80%',
        color:'#6a7480',
        fontSize:'1.25rem',
        fontFamily:'Whitney-medium'
    },
    dialogcontent:{
        backgroundColor:'#fff',
    },
    dialogaction:{
        backgroundColor:'#f6f6f7',
        padding:'4% 5% 4% 5%',
    },
    paper: { 
        minWidth: '25%',
    },
    input:{
        display:'none'
    },
})
function Addserver() {
    const classes=useStyles();
    const [open, setOpen] = useState(false);
    const [uploadfile,setuploadfile]=useState()
    const [formValue,setformValue]=useState('');
    const serverRef=firestore.collection('servers');
    const handleClickOpen = () => {
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
      const resizeFile = (file) =>
            new Promise((resolve) => {
                Resizer.imageFileResizer(
                file,
                100,
                100,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "base64"
                );
            });
        
      const handleSubmit=async (e)=>{
        e.preventDefault();
        if(formValue){
            if(uploadfile){
                await serverRef.add({
                     server:formValue,
                     createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                     email:auth.currentUser.email,
                     admin:auth.currentUser.displayName,
                     serverimage:uploadfile
                 })
             }
             else{
                 await serverRef.add({
                     servername:formValue,
                     createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                     email:auth.currentUser.email,
                     admin:auth.currentUser.displayName,
                     serverimage:'./discord_server.png'
                 })
             }
        }
        setformValue('');
      }
      const handleImageUpload=async(e)=>{
        const encodedimage=await resizeFile(e.target.files[0]);
        setuploadfile(encodedimage);
      }
      
    return (
    <div className='addserver'>
            <div className="addserver__addicon">
                <IconButton onClick={handleClickOpen} >
                   <AddIcon className={classes.addicon} />
                </IconButton>
            </div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" classes={{ paper: classes.paper}} >
            <DialogContent className={classes.dialogcontent}>
            <DialogContentText className={classes.header}>
                    <Typography component={'span'} className={classes.header__heading}>
                        Customize your server
                    </Typography>

                    <Typography component={'span'} className={classes.header__text}>
                        Give your new server a personality with a name and an icon.
                    </Typography>
                    <Typography component={'span'} className={classes.header__text}>
                        You can always change it later.
                    </Typography>
                    <Container maxWidth="sm">
                    <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={handleImageUpload} />
                        <label htmlFor="icon-button-file">
                            <IconButton className={classes.iconbutton} color="primary" aria-label="upload picture" component="span">
                                <PhotoIcon fontSize='large'/>
                            </IconButton>
                        </label>
                        </Container>
                    <Typography component={'span'} className={classes.header__servername}>
                        SERVER NAME
                    </Typography>                
            </DialogContentText>
                <input type="text" required className='input__content' autoFocus onChange={(e)=>setformValue(e.target.value)} value={formValue}/>
            </DialogContent>
            <DialogActions className={classes.dialogaction}>
            <button type='text' onClick={handleClose} className='addserver__form-back'>Back</button>
                <form onSubmit={handleSubmit} className='addserver__form'>
                    <button type='submit' onClick={handleClose} className='addserver__form-button'>Create</button>
                </form>
            </DialogActions>
        </Dialog>
    </div>
    )
}

export default Addserver