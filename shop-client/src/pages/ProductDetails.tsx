import { Paper, Typography, Box, Stack } from '@mui/material'; // Ajout de Box et Stack
import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActionButtons } from '../components';
import { useAppContext, useToastContext } from '../context';
import { ProductService } from '../services';
import { FormattedProduct, Product } from '../types';
import { formatterLocalizedProduct, priceFormatter } from '../utils';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setLoading, locale } = useAppContext();
    const { setToast } = useToastContext();
    const [product, setProduct] = useState<Product | null>(null);
    const [formattedProduct, setFormattedProduct] = useState<FormattedProduct | null>();

    const getProduct = (productId: string) => {
        ProductService.getProduct(productId).then((res) => {
            setProduct(res.data);
        });
    };

    useEffect(() => {
        id && getProduct(id);
    }, [id]);

    useEffect(() => {
        product && setFormattedProduct(formatterLocalizedProduct(product, locale));
    }, [locale, product]);

    const handleDelete = () => {
        setLoading(true);
        id &&
            ProductService.deleteProduct(id)
                .then(() => {
                    navigate('/product');
                    setToast({ severity: 'success', message: 'Le produit a bien été supprimé' });
                })
                .catch(() => {
                    setToast({ severity: 'error', message: 'Une erreur est survenue lors de la suppresion' });
                })
                .finally(() => {
                    setLoading(false);
                });
    };

    const handleEdit = () => {
        navigate(`/product/edit/${id}`);
    };

    if (!formattedProduct) return <></>;

    return (
        <Paper
            elevation={1}
            sx={{
                position: 'relative',
                padding: { xs: 2, md: 4 }, 
                marginTop: { xs: 2, md: 4 }, 
                overflow: 'hidden' 
            }}
        >
            
            <ActionButtons handleDelete={handleDelete} handleEdit={handleEdit} />

            <Typography 
                variant="h3" 
                sx={{ 
                    textAlign: 'center', 
                    marginBottom: 3,
                    fontSize: { xs: '2rem', md: '3rem' }, 
                    wordBreak: 'break-word' 
                }}
            >
                {formattedProduct.name}
            </Typography>

            
            <Stack spacing={2}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    Prix : {priceFormatter(formattedProduct.price)}
                </Typography>

                {formattedProduct.description && (
                    <Typography color="text.secondary" sx={{ textAlign: 'justify' }}>
                        <Box component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>Description : </Box> 
                        {formattedProduct.description}
                    </Typography>
                )}

                <Typography>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Boutique : </Box>
                    {formattedProduct.shop?.name ? (
                        <Link to={`/shop/${formattedProduct.shop?.id}`} style={{ color: '#607d8b', textDecoration: 'none', fontWeight: 500 }}>
                            {formattedProduct.shop?.name}
                        </Link>
                    ) : (
                        "N'appartient à aucune boutique"
                    )}
                </Typography>

                <Typography sx={{ fontStyle: 'italic' }}>
                    <Box component="span" sx={{ fontWeight: 'bold', fontStyle: 'normal' }}>Catégories : </Box>
                    {formattedProduct.categories.length === 0
                        ? 'Aucune'
                        : formattedProduct.categories.map((cat, index) => (
                            <Fragment key={cat.id}>
                                <Link to={`/category/${cat.id}`} style={{ color: '#607d8b', textDecoration: 'none' }}>
                                    {cat.name}
                                </Link>
                                <span>{index === formattedProduct.categories.length - 1 ? '' : ', '}</span>
                            </Fragment>
                        ))}
                </Typography>
            </Stack>
        </Paper>
    );
};

export default ProductDetails;