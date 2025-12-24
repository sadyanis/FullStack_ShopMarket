package fr.fullstack.shopapp.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.search.mapper.orm.Search;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
// Class copie les données depuis postgres vers elasticsearch
@Component
public class Indexer implements ApplicationListener<ApplicationReadyEvent> {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        System.out.println(" Démarrage de l'indexation Hibernate Search...");
        try {
            Search.session(entityManager)
                    .massIndexer() // copie les données SQL -> Elasticsearch
                    .startAndWait();
            System.out.println(" Indexation terminée avec succès !");
        } catch (InterruptedException e) {
            System.out.println(" Erreur durant l'indexation : " + e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}