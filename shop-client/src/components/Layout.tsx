import { 
    AppBar, 
    Box, 
    Button, 
    Toolbar, 
    Typography, 
    IconButton, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemText, 
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loader from './Loader';
import SwitchLanguage from './SwitchLanguage';
import { useToastContext } from '../context';
import { injectToast } from '../utils/http';


type Props = {
     //children: JSX.Element;
     children: React.ReactNode;
};

const navItems = [
    { label: 'Boutiques', path: '/' },
    { label: 'Produits', path: '/product' },
    { label: 'Catégories', path: '/category' },
];

const drawerWidth = 240;

const Layout = ({ children }: Props) => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1030);

    // 4. Recuperation de la fonction de toast depuis le contexte
    const { setToast} = useToastContext();
    useEffect(() => {
        injectToast((toast) => {
            setToast(toast);
        });
    }, [setToast]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1030);
        };

        window.addEventListener('resize', handleResize);

        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Gestion de boutiques
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton onClick={() => navigate(item.path)} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <AppBar component="nav" >
                <Toolbar className="header">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: isMobile ? 'block' : 'none' }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        onClick={() => navigate('/')}
                        sx={{ flexGrow: 1, cursor: 'pointer', display: { xs: 'none', sm: 'block' } }}
                    >
                        Gestion de boutiques
                    </Typography>

                    <Box sx={{ display: isMobile ? 'none' : 'block'  }}>
                        {navItems.map((item) => (
                            <Button key={item.label} sx={{ color: '#fff' }} onClick={() => navigate(item.path)}>
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ ml: 2 }}>
                        <SwitchLanguage />
                    </Box>
                </Toolbar>
            </AppBar>

            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: isMobile ? 'block' : 'none',
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>

            <Loader />
            
            <Box component="main" sx={{ p: 3, width: '100%' }}>
               {children}
            </Box>
        </Box>
    );
};

export default Layout;
