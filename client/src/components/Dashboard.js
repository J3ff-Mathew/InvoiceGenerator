import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link, Outlet } from 'react-router-dom';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Dashboard() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate()
    React.useEffect(() => {
        if (JSON.parse(localStorage.getItem('credentials')) == undefined) {
            navigate('/');
        }
    }, [])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>

                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography style={{ margin: 'auto' }} noWrap component="div" >


                        <section className='d-flex justify-content-center align-items-center'>
                            <img src="./images/icon-512.png" alt="IniGenify_logo" style={{ borderRadius: '50%', height: '50px', width: '50px' }} />
                            <h1>IniGenify</h1>
                        </section>

                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <Link to='/dash'>
                        <ListItem button key="Dashboard">
                            <ListItemIcon>
                                <DashboardIcon />

                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                    </Link>
                    <Divider />
                    <Link to='/dash/genInvoice'>
                        <ListItem button key="genInvoice">
                            <ListItemIcon>
                                <ReceiptIcon />
                            </ListItemIcon>
                            <ListItemText primary="Generate Invoice" />
                        </ListItem>
                    </Link>
                    <Divider />

                    <Link to='/dash/records'>
                        <ListItem button key="Records">
                            <ListItemIcon>
                                <ReceiptLongRoundedIcon />

                            </ListItemIcon>
                            <ListItemText primary="Records" />
                        </ListItem>
                    </Link>
                    <Divider />
                    <Link to='/dash/setting'>
                        <ListItem button key="Settings">
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </Link>
                    <Divider />
                    <Link to='/' onClick={() => { localStorage.removeItem("credentials") }}>
                        <ListItem button key="Logout">
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </Link>
                    <Divider />
                </List>
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {(JSON.parse(localStorage.getItem('credentials')) != undefined) && <Outlet />}
            </Main>

        </Box>
    );
}
