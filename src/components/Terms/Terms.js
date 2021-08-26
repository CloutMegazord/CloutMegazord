import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from '@material-ui/core/Checkbox';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentMuiTypography from '@material-ui/core/DialogContentMuiTypography';
// import MuiTypographyField from '@material-ui/core/MuiTypographyField';
import DialogTitle from '@material-ui/core/DialogTitle';
import TermsContent from "components/Terms/TermsContent";

const styles = {}


export default function TermsAndConditions(props) {
    const [open, setOpen] = React.useState(!props.terms.accepted);
    const [checked, setChecked] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.terms.accepted = checked;
        setOpen(false);
    };

    const handleCheckedChange = (event) => {
        setChecked(event.target.checked)
    }

    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <TermsContent/>
                </DialogContent>
                <DialogActions>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={checked}
                                onChange={handleCheckedChange}
                                name="checkedB"
                                color="primary"
                            />
                        }
                        label="I agree to the terms of service"
                    />
                    <Button onClick={handleClose} color="primary" disabled={!checked} autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}