package xyz.dulli.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, xyz.dulli.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, xyz.dulli.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, xyz.dulli.domain.User.class.getName());
            createCache(cm, xyz.dulli.domain.Authority.class.getName());
            createCache(cm, xyz.dulli.domain.User.class.getName() + ".authorities");
            createCache(cm, xyz.dulli.domain.PersistentToken.class.getName());
            createCache(cm, xyz.dulli.domain.User.class.getName() + ".persistentTokens");
            createCache(cm, xyz.dulli.domain.RechnungKopf.class.getName());
            createCache(cm, xyz.dulli.domain.RechnungKopf.class.getName() + ".rechnungPositionens");
            createCache(cm, xyz.dulli.domain.RechnungPositionen.class.getName());
            createCache(cm, xyz.dulli.domain.Artikel.class.getName());
            createCache(cm, xyz.dulli.domain.Artikel.class.getName() + ".auftragPositionens");
            createCache(cm, xyz.dulli.domain.Artikel.class.getName() + ".rechnungPositionens");
            createCache(cm, xyz.dulli.domain.Artikel.class.getName() + ".artikelZuBauteilmenges");
            createCache(cm, xyz.dulli.domain.ArtikelTyp.class.getName());
            createCache(cm, xyz.dulli.domain.ArtikelTyp.class.getName() + ".artikels");
            createCache(cm, xyz.dulli.domain.ArtikelTyp.class.getName() + ".bauteilGruppes");
            createCache(cm, xyz.dulli.domain.Status.class.getName());
            createCache(cm, xyz.dulli.domain.Status.class.getName() + ".rechnungKopfs");
            createCache(cm, xyz.dulli.domain.Status.class.getName() + ".auftrags");
            createCache(cm, xyz.dulli.domain.Auftrag.class.getName());
            createCache(cm, xyz.dulli.domain.Auftrag.class.getName() + ".rechnungKopfs");
            createCache(cm, xyz.dulli.domain.Auftrag.class.getName() + ".auftragPositionens");
            createCache(cm, xyz.dulli.domain.AuftragPositionen.class.getName());
            createCache(cm, xyz.dulli.domain.Patner.class.getName());
            createCache(cm, xyz.dulli.domain.Patner.class.getName() + ".rechnungKopfs");
            createCache(cm, xyz.dulli.domain.Patner.class.getName() + ".auftrags");
            createCache(cm, xyz.dulli.domain.Bediener.class.getName());
            createCache(cm, xyz.dulli.domain.Bediener.class.getName() + ".rechnungKopfs");
            createCache(cm, xyz.dulli.domain.Bediener.class.getName() + ".auftrags");
            createCache(cm, xyz.dulli.domain.Organistation.class.getName());
            createCache(cm, xyz.dulli.domain.Organistation.class.getName() + ".patners");
            createCache(cm, xyz.dulli.domain.Rohstoff.class.getName());
            createCache(cm, xyz.dulli.domain.Rohstoff.class.getName() + ".bauteileZuRohstoffes");
            createCache(cm, xyz.dulli.domain.Bauteil.class.getName());
            createCache(cm, xyz.dulli.domain.Bauteil.class.getName() + ".bauteileZuRohstoffes");
            createCache(cm, xyz.dulli.domain.Bauteil.class.getName() + ".artikelZuBauteilmenges");
            createCache(cm, xyz.dulli.domain.BauteilGruppe.class.getName());
            createCache(cm, xyz.dulli.domain.BauteilGruppe.class.getName() + ".bauteils");
            createCache(cm, xyz.dulli.domain.BauteileZuRohstoffe.class.getName());
            createCache(cm, xyz.dulli.domain.ArtikelZuBauteilmenge.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
