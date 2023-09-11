import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const customization = useSelector((state) => state.customization);
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(true);
    const navigate = useNavigate();
    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();

    const googleHandler = async () => {
        console.error('Register');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with EY Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    phone: '',
                    adress: '',
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try { 
                        console.log(values)
                      const response = await axios.post('https://localhost:7031/api/User/register', values);

                      // Handle successful response, e.g., show success message, redirect to another page, etc.
                      console.log('Register successful:', response.data); // log the response data
                      navigate('/pages/login/login3');
                      setStatus({ success: true });
                      setSubmitting(false);
                    } catch (err) {
                      // Handle error response, e.g., display error message, highlight fields with errors, etc.
                      console.error(err);
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                    }
                  }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth error={Boolean(touched.firstName && errors.firstName)}
                                    sx={{ ...theme.typography.customInput }}>
                                    <InputLabel htmlFor="outlined-adornment-firstName-register">First Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-firstName-register"
                                        type="firstName"
                                        value={values.firstName}
                                        name="firstName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.phone && errors.firstName && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.firstName}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth error={Boolean(touched.lastName && errors.lastName)}
                                    sx={{ ...theme.typography.customInput }}>
                                    <InputLabel htmlFor="outlined-adornment-lastName-register">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-lastName-register"
                                        type="lastName"
                                        value={values.lastName}
                                        name="lastName"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.phone && errors.lastName && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.lastName}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.phone && errors.phone)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-phone-register">Phone Number</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-phone-register"
                                type="phone"
                                value={values.phone}
                                name="phone"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.phone && errors.phone && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.phone}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.adress && errors.adress)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-adress-register">Your Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-adress-register"
                                type="adress"
                                value={values.adress}
                                name="adress"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.adress && errors.adress && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.adress}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">EY Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Agree with &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Terms & Condition.
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid>
                        </Grid>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    sx={{ backgroundColor: '#2e2e38', color: '#ffe600' }}
                                >
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
