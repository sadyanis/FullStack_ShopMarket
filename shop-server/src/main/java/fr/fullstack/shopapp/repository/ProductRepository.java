package fr.fullstack.shopapp.repository;

import fr.fullstack.shopapp.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByOrderByIdAsc(Pageable pageable);

    @Query(value = "SELECT * FROM Products WHERE shop_id = ?1", nativeQuery = true)
    Page<Product> findByShop(Long shopId, Pageable pageable);

    @Query(value = "SELECT * FROM Products p WHERE p.shop_id = ?1 AND p.id IN (SELECT pc.product_id FROM "
            + "products_categories pc WHERE pc.category_id = ?2)",
           nativeQuery = true)
    Page<Product> findByShopAndCategory(Long shopId, Long categoryId, Pageable pageable);

    @Modifying
    @Query("UPDATE Product p SET p.shop = NULL WHERE p.shop.id = :shopId")
    void detachShopFromProducts(@Param("shopId") Long shopId);
}
