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
import SearchBar from '../components/Navbar';
const Home = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [shops, setShops] = useState<Shop[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const [sort, setSort] = useState<string>('');
    const [filters, setFilters] = useState<string>('');
    // Etats pour la recherche Elasticsearch
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = (searchText: string) => {
        setSearchQuery(searchText);
        setPageSelected(0); // Reset à la page 1
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
        }

        else if (sort) {
            promisedShops = ShopService.getShopsSorted(pageSelected, 9, sort);
        } else if (filters) {
            promisedShops = ShopService.getShopsFiltered(pageSelected, 9, filters);
        } else {
            promisedShops = ShopService.getShops(pageSelected, 9);
        }
        promisedShops
            .then((res) => {
                setShops(res.data.content);
                console.log(res.data.content);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <Typography variant="h2">Les boutiques</Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <Fab variant="extended" color="primary" aria-label="add" onClick={() => navigate('/shop/create')}>
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter une boutique
                </Fab>
            </Box>

            {/* Sort and filters */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
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
                <SearchBar onSearch={handleSearch} />
                <Filters setUrlFilters={setFilters} setSort={setSort} sort={sort} setSearchQuery={setSearchQuery} />
            </Box>

            {/* Shops */}
            <Grid container alignItems="center" rowSpacing={3} columnSpacing={3}>
                {shops?.map((shop) => (
                    <Grid item key={shop.id} xs={4}>
                        <ShopCard shop={shop} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {shops?.length !== 0 ? (
                <Pagination count={count} page={page} siblingCount={1} onChange={handleChangePagination} />
            ) : (
                <Typography variant="h5" sx={{ mt: -1 }}>
                    Aucune boutique correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Home;
