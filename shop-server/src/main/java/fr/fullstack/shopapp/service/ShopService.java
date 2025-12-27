package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.OpeningHoursShop;
import fr.fullstack.shopapp.model.Product;
import fr.fullstack.shopapp.model.Shop;
import fr.fullstack.shopapp.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;  
import jakarta.persistence.PersistenceContext;  
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ShopService {
    @PersistenceContext
    private EntityManager em;

    @Autowired
    private ShopRepository shopRepository;



    @Transactional
    public Shop createShop(Shop shop) throws Exception {
        // Validation des horaires
        validateOpeningHours(shop.getOpeningHours());
        try {
            Shop newShop = shopRepository.save(shop);
            em.flush();
            em.refresh(newShop);
            // ADDED (Indexer dans Elasticsearch)

            return newShop;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional
    public void deleteShopById(long id) throws Exception {
        try {
            Shop shop = getShop(id);
            deleteNestedRelations(shop);
            shopRepository.deleteById(id);

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional(readOnly = true)  // ADDED
    public Shop getShopById(long id) throws Exception {
        try {
            return getShop(id);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Transactional(readOnly = true)  // ADDED
    public Page<Shop> getShopList(
            Optional<String> sortBy,
            Optional<Boolean> inVacations,
            Optional<String> createdBefore,
            Optional<String> createdAfter,
            Pageable pageable
    ) {
        Page<Shop> result;
        
        // SORT
        if (sortBy.isPresent()) {
            switch (sortBy.get()) {
                case "name":
                    result = shopRepository.findByOrderByNameAsc(pageable);
                    break;
                case "createdAt":
                    result = shopRepository.findByOrderByCreatedAtAsc(pageable);
                    break;
                default:
                    result = shopRepository.findByOrderByNbProductsAsc(pageable);
            }
            return refreshShops(result);
        }

        // FILTERS
        Page<Shop> shopList = getShopListWithFilter(inVacations, createdBefore, createdAfter, pageable);
        if (shopList != null) {
            return refreshShops(shopList);
        }

        // NONE
        result = shopRepository.findByOrderByIdAsc(pageable);
        return refreshShops(result);
    }

    @Transactional
    public Shop updateShop(Shop shop) throws Exception {
        try {
            getShop(shop.getId());
            Shop updatedShop = this.createShop(shop);

            return updatedShop;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    
    private Page<Shop> refreshShops(Page<Shop> shops) {
        shops.getContent().forEach(shop -> em.refresh(shop));
        return shops;
    }

    private void deleteNestedRelations(Shop shop) {
        List<Product> products = shop.getProducts();
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            product.setShop(null);
            em.merge(product);
            em.flush();
        }
    }

    
    private Shop getShop(Long id) throws Exception {
        Optional<Shop> shop = shopRepository.findById(id);
        if (!shop.isPresent()) {
            throw new Exception("Shop with id " + id + " not found");
        }
        Shop foundShop = shop.get();
        
        em.refresh(foundShop);
        
        return foundShop;
    }

    
    private Page<Shop> getShopListWithFilter(
            Optional<Boolean> inVacations,
            Optional<String> createdAfter,
            Optional<String> createdBefore,
            Pageable pageable
    ) {
        if (inVacations.isPresent() && createdBefore.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtGreaterThanAndCreatedAtLessThan(
                    inVacations.get(),
                    LocalDate.parse(createdAfter.get()),
                    LocalDate.parse(createdBefore.get()),
                    pageable
            );
        }

        if (inVacations.isPresent() && createdBefore.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtLessThan(
                    inVacations.get(), LocalDate.parse(createdBefore.get()), pageable
            );
        }

        if (inVacations.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByInVacationsAndCreatedAtGreaterThan(
                    inVacations.get(), LocalDate.parse(createdAfter.get()), pageable
            );
        }

        if (inVacations.isPresent()) {
            return shopRepository.findByInVacations(inVacations.get(), pageable);
        }

        if (createdBefore.isPresent() && createdAfter.isPresent()) {
            return shopRepository.findByCreatedAtBetween(
                    LocalDate.parse(createdAfter.get()), LocalDate.parse(createdBefore.get()), pageable
            );
        }

        if (createdBefore.isPresent()) {
            return shopRepository.findByCreatedAtLessThan(
                    LocalDate.parse(createdBefore.get()), pageable
            );
        }

        if (createdAfter.isPresent()) {
            return shopRepository.findByCreatedAtGreaterThan(
                    LocalDate.parse(createdAfter.get()), pageable
            );
        }

        return null;
    }
    // Méthode privée pour vérifier les conflit d'horaires
    private void validateOpeningHours(List<OpeningHoursShop> openingHours) throws Exception {
        if (openingHours == null || openingHours.isEmpty()) {
            return;

        }
        // comparer les crénaux
        for (int i=0 ; i< openingHours.size(); i++) {
            OpeningHoursShop hours1 = openingHours.get(i);
            // l'heure de fin doit être après l'heure de début
            if(!hours1.getCloseAt().isAfter(hours1.getOpenAt())){
                throw new Exception("Pour le jour "+hours1.getDay() + " l'heur de fermeture (" + hours1.getCloseAt() + ") doit etre après l'heure d'ouverture ("+ hours1.getOpenAt()+") !");
            }
            for (int j = i+1 ; j< openingHours.size(); j++) {
                OpeningHoursShop hours2 = openingHours.get(j);
                // on compare que si c'est le meme jour
                if (hours1.getDay() == hours2.getDay()) {
                    boolean overlaps = hours1.getOpenAt().isBefore(hours2.getCloseAt()) && hours1.getCloseAt().isAfter(hours2.getOpenAt());
                    if (overlaps) {
                        throw new Exception("conflit d'horaire détecté le jour "+ hours1.getDay() + ": Les créneaux"+
                                hours1.getOpenAt() + "-" + hours1.getCloseAt() + " et " +
                                hours2.getOpenAt() + "-" + hours2.getCloseAt() + " se chevauchent");
                    }
                }
            }
        }
    }
}