package fr.fullstack.shopapp.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shops") // Les index peuvent être définis ici ou dans les relations
@Indexed(index = "idx_shops")
public class Shop {
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    @NotNull(message = "InVacations may not be null")
    @GenericField
    private boolean inVacations;

    @Column(nullable = false)
    @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
    @NotNull(message = "Name may not be null")
    @FullTextField
    private String name;

    @Formula(value = "(SELECT COUNT(*) FROM products p WHERE p.shop_id = id)")
    private Long nbProducts;

    @Formula(value = "(SELECT COALESCE(COUNT(DISTINCT pc.category_id), 0) " +
            "FROM products p " +
            "JOIN products_categories pc ON p.id = pc.product_id " +
            "WHERE p.shop_id = id)")
    private Long nbCategories;

    @OneToMany(cascade = {CascadeType.ALL})
    // --- MODIFICATION ICI ---
    // On utilise @JoinTable car votre SQL contient la table 'shops_opening_hours'
    @JoinTable(
            name = "shops_opening_hours",
            joinColumns = @JoinColumn(name = "shop_id"),
            inverseJoinColumns = @JoinColumn(name = "opening_hours_id"),
            // On ajoute les index ici pour respecter l'exigence E_AME_20
            indexes = {
                    @Index(name = "idx_soh_shop", columnList = "shop_id"),
                    @Index(name = "idx_soh_oh", columnList = "opening_hours_id")
            }
    )
    private List<@Valid OpeningHoursShop> openingHours = new ArrayList<OpeningHoursShop>();

    @OneToMany(mappedBy = "shop", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products = new ArrayList<Product>();

    // Getters et Setters...
    public LocalDate getCreatedAt() { return createdAt; }
    public long getId() { return id; }
    public boolean getInVacations() { return inVacations; }
    public String getName() { return name; }
    public Long getNbProducts() { return nbProducts; }
    public Long getNbCategories() { return this.nbCategories; }
    public List<OpeningHoursShop> getOpeningHours() { return openingHours; }
    public List<Product> getProducts() { return this.products; }
    public void setId(long id) { this.id = id; }
    public void setInVacations(boolean inVacations) { this.inVacations = inVacations; }
    public void setName(String name) { this.name = name; }
    public void setNbProducts(long nbProducts) { this.nbProducts = nbProducts; }
    public void setOpeningHours(List<OpeningHoursShop> openingHours) { this.openingHours = openingHours; }
    public void setProducts(List<Product> products) { this.products = products; }
}