import { Box, Fab, Grid, Pagination, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components';
import { useAppContext } from '../context';
import { ProductService } from '../services';
import { Product } from '../types';

const Products = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const getProducts = () => {
        setLoading(true);
        ProductService.getProducts(pageSelected, 9)
            .then((res) => {
                setProducts(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getProducts();
    }, [pageSelected]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: { xs: 3, md: 5 } // Réduit l'espacement vertical sur mobile
            }}
        >
            {/* Titre responsive */}
            <Typography 
                variant="h2" 
                sx={{ 
                    fontSize: { xs: '2rem', md: '3.75rem' }, 
                    textAlign: 'center' 
                }}
            >
                Les produits
            </Typography>

            {/* Bouton Ajouter : Centré sur mobile, à droite sur Desktop */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                }}
            >
                <Fab 
                    variant="extended" 
                    color="primary" 
                    aria-label="add" 
                    onClick={() => navigate('/product/create')}
                    size="medium" // Taille standard, adaptable si besoin
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter un produit
                </Fab>
            </Box>

            {/* Products Grid */}
            {/* alignItems="stretch" permet aux cartes d'avoir la même hauteur sur une même ligne */}
            <Grid container alignItems="stretch" rowSpacing={3} columnSpacing={3}>
                {products?.map((product) => (
                    <Grid 
                        item 
                        key={product.id} 
                        xs={12} // Mobile : 1 colonne (Pleine largeur)
                        sm={6}  // Tablette : 2 colonnes
                        md={4}  // Desktop : 3 colonnes
                    >
                        {/* Box optionnelle pour garantir la hauteur 100% si le composant Card ne le fait pas */}
                        <Box sx={{ height: '100%' }}>
                            <ProductCard product={product} displayShop={true} />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {products?.length !== 0 ? (
                <Pagination 
                    count={count} 
                    page={page} 
                    siblingCount={0} // Évite le dépassement sur petit écran
                    boundaryCount={1}
                    onChange={handleChangePagination} 
                    sx={{
                        '& .MuiPagination-ul': { justifyContent: 'center' }
                    }}
                />
            ) : (
                <Typography variant="h5" sx={{ mt: -1, textAlign: 'center', fontSize: { xs: '1.2rem', md: '1.5rem'} }}>
                    Aucun produit correspondant
                </Typography>
            )}
        </Box>
    );
};

export default Products;