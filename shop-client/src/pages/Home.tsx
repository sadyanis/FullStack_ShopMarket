import {
    Box,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filters, ShopCard } from '../components';
import { useAppContext } from '../context';
import { ShopService } from '../services';
import { ResponseArray, Shop } from '../types';
import SearchBar from '../components/Navbar'; // Assure-toi que ce composant supporte d'être dans une Box flexible

const Home = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [shops, setShops] = useState<Shop[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const [sort, setSort] = useState<string>('');
    const [filters, setFilters] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = (searchText: string) => {
        setSearchQuery(searchText);
        setPageSelected(0);
    };

    const getShops = () => {
        setLoading(true);
        let promisedShops: Promise<ResponseArray<Shop>>;
        if (searchQuery) {
            const filterParams = parseFilters(filters);
            promisedShops = ShopService.searchShops(
                pageSelected,
                9,
                searchQuery,
                filterParams.inVacations,
                filterParams.createdAfter,
                filterParams.createdBefore
            );
        } else if (sort) {
            promisedShops = ShopService.getShopsSorted(pageSelected, 9, sort);
        } else if (filters) {
            promisedShops = ShopService.getShopsFiltered(pageSelected, 9, filters);
        } else {
            promisedShops = ShopService.getShops(pageSelected, 9);
        }
        promisedShops
            .then((res) => {
                setShops(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    const parseFilters = (filterString: string) => {
        const params: {
            inVacations?: boolean;
            createdAfter?: string;
            createdBefore?: string;
        } = {};

        if (!filterString) return params;

        const filterPairs = filterString.split('&');
        filterPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key === 'inVacations') {
                params.inVacations = value === 'true';
            } else if (key === 'createdAfter') {
                params.createdAfter = value;
            } else if (key === 'createdBefore') {
                params.createdBefore = value;
            }
        });

        return params;
    };

    useEffect(() => {
        getShops();
    }, [pageSelected, sort, filters, searchQuery]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    const handleChangeSort = (event: SelectChangeEvent) => {
        setSort(event.target.value as string);
        setSearchQuery('');
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: { xs: 3, md: 5 } // Moins d'espace entre les éléments sur mobile
            }}
        >
            {/* Titre responsive : plus petit sur mobile (h4) */}
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '3.75rem' }, textAlign: 'center' }}>
                Les boutiques
            </Typography>

            {/* Bouton Ajouter : Aligné à droite sur PC, Centré ou pleine largeur sur Mobile */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: { xs: 'center', md: 'flex-end' }, // Centré sur mobile
                }}
            >
                <Fab 
                    variant="extended" 
                    color="primary" 
                    aria-label="add" 
                    onClick={() => navigate('/shop/create')}
                    size="medium" // Un peu plus petit pour être discret
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter une boutique
                </Fab>
            </Box>

            {/* Barre d'outils : Sort, Search, Filters */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    // MOBILE : Colonne (empilés) | DESKTOP : Ligne (côte à côte)
                    flexDirection: { xs: 'column', md: 'row' }, 
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' }, // 'stretch' force la largeur 100% sur mobile
                    gap: 2 // Espace entre les éléments quand ils sont empilés
                }}
            >
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label">Trier par</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Trier par"
                        onChange={handleChangeSort}
                    >
                        <MenuItem value="">
                            <em>Aucun</em>
                        </MenuItem>
                        <MenuItem value="name">Nom</MenuItem>
                        <MenuItem value="createdAt">Date de création</MenuItem>
                        <MenuItem value="nbProducts">Nombre de produits</MenuItem>
                    </Select>
                </FormControl>
                
                {/* On enveloppe SearchBar et Filters pour qu'ils s'adaptent */}
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                     <SearchBar onSearch={handleSearch} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
                    <Filters setUrlFilters={setFilters} setSort={setSort} sort={sort} setSearchQuery={setSearchQuery} />
                </Box>
            </Box>

            {/* Grille des Boutiques */}
            <Grid container alignItems="stretch" rowSpacing={3} columnSpacing={3}>
                {shops?.map((shop) => (
                    <Grid 
                        item 
                        key={shop.id} 
                        xs={12} // Mobile : 1 colonne (prend toute la largeur)
                        sm={6}  // Tablette : 2 colonnes
                        md={4}  // Desktop : 3 colonnes
                    >
                        {/* On ajoute height: '100%' pour que toutes les cartes aient la même hauteur */}
                        <Box sx={{ height: '100%' }}>
                            <ShopCard shop={shop} />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {shops?.length !== 0 ? (
                <Pagination 
                    count={count} 
                    page={page} 
                    siblingCount={0} // Réduit la taille de la pagination sur mobile
                    boundaryCount={1}
                    onChange={handleChangePagination} 
                    size="small" // Plus petit sur mobile par défaut, ou conditionnel
                    sx={{
                        '& .MuiPagination-ul': { justifyContent: 'center' }
                    }}
                />
            ) : (
                <Typography variant="h5" sx={{ mt: -1, textAlign: 'center' }}>
                    Aucune boutique correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Home;