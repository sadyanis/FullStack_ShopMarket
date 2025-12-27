package fr.fullstack.shopapp.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_shop_id", columnList = "shop_id")
})
public class Product {
    @ManyToMany
    @JoinTable(
            name = "products_categories",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"),
            indexes = {
                    @Index(name = "idx_prod_cat_product", columnList = "product_id"),
                    @Index(name = "idx_prod_cat_category", columnList = "category_id")
            })
    private List<Category> categories = new ArrayList<Category>();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(cascade = {CascadeType.ALL}, orphanRemoval = true)
    // MODIFICATION ICI : Retour au JoinTable pour coller à votre SQL fill_tables.sql
    @JoinTable(
            name = "products_localized_product",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "localized_product_id"),
            indexes = {
                    // Exigence E_AME_20 respectée
                    @Index(name = "idx_plp_prod", columnList = "product_id"),
                    @Index(name = "idx_plp_loc", columnList = "localized_product_id")
            }
    )
    @Size(min = 1, message = "At least one name and one description must be provided")
    private List<@Valid LocalizedProduct> localizedProduct = new ArrayList<LocalizedProduct>();

    @Column(nullable = false)
    @PositiveOrZero(message = "Price must be positive")
    @NotNull(message = "Price may not be null")
    private Long price; // stocker les centimes

    @ManyToOne
    @JoinColumn(name="shop_id")
    private Shop shop;

    public List<Category> getCategories() {
        return categories;
    }

    public long getId() {
        return id;
    }

    public List<LocalizedProduct> getLocalizedProducts() {
        return localizedProduct;
    }

    public Long getPrice() {
        return price;
    }

    public Shop getShop() {
        return shop;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setLocalizedProducts(List<LocalizedProduct> localizedProduct) {
        this.localizedProduct = localizedProduct;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }
}