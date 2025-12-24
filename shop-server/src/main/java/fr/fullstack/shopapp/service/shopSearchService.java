package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.Shop;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class shopSearchService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Page<Shop> searchShops(
            String queryText,
            Boolean inVacations,
            LocalDate createdAfter,
            LocalDate createdBefore,
            Pageable pageable
    ) {
        SearchSession searchSession = Search.session(entityManager);

        SearchResult<Shop> result = searchSession.search(Shop.class)
                .where(f -> {
                    BooleanPredicateClausesStep<?> bool = f.bool();
                    boolean hasCondition = false;

                    // 1. Recherche floue sur le nom
                    if (queryText != null && !queryText.trim().isEmpty()) {
                        bool.must(f.match()
                                .field("name")
                                .matching(queryText)
                                .fuzzy());
                        hasCondition = true;
                    }

                    // 2. Filtre exact sur inVacations
                    if (inVacations != null) {
                        bool.must(f.match()
                                .field("inVacations")
                                .matching(inVacations));
                        hasCondition = true;
                    }

                    // 3. Filtre de plage de dates (Range) - CORRIGÉ
                    // On gère explicitement les 3 cas : Entre deux dates, Après une date, Avant une date
                    if (createdAfter != null && createdBefore != null) {
                        // Cas : Entre deux dates
                        bool.must(f.range().field("createdAt")
                                .between(createdAfter, createdBefore));
                        hasCondition = true;
                    } else if (createdAfter != null) {
                        // Cas : Après une date
                        bool.must(f.range().field("createdAt")
                                .atLeast(createdAfter));
                        hasCondition = true;
                    } else if (createdBefore != null) {
                        // Cas : Avant une date
                        bool.must(f.range().field("createdAt")
                                .atMost(createdBefore));
                        hasCondition = true;
                    }

                    // 4. Fallback si vide
                    if (!hasCondition) {
                        return f.matchAll();
                    }

                    return bool;
                })
                .fetch((int) pageable.getOffset(), pageable.getPageSize());

        return new PageImpl<>(
                result.hits(),
                pageable,
                result.total().hitCount()
        );
    }
}