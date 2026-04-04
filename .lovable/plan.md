

# HN - Immobilier — Plan de construction du MVP

## Note technique importante

Lovable utilise **React + Vite + Tailwind CSS** (pas Next.js). Le plan est adapté à cette stack. Pour le backend (auth, base de données, stockage), nous utiliserons **Lovable Cloud (Supabase)**.

---

## Phase 1 — Fondations et design system

**Fichiers concernés**: `index.css`, `tailwind.config.ts`, `index.html`, nouveaux composants

- Définir la palette de couleurs HN-immobilier (bleu professionnel, accents dorés)
- Configurer les polices (support arabe RTL + français/anglais)
- Mettre à jour le titre et les métadonnées du site
- Créer le layout principal : Header avec logo + navigation + sélecteur de langue, Footer

## Phase 2 — Pages publiques

**Nouvelles pages** : `Home`, `PropertyList`, `PropertyDetail`, `Contact`, `About`

- **Page d'accueil** : Hero avec barre de recherche (ville, type, prix), section propriétés en vedette, appel à l'action
- **Liste des propriétés** : Grille de cartes avec filtres (type, prix, surface, ville), pagination
- **Détail propriété** : Galerie photos, informations complètes, formulaire de contact rapide, carte de localisation
- **Contact** : Formulaire + coordonnées de l'agence
- **À propos** : Présentation de HN-immobilier

## Phase 3 — Authentification et rôles

**Via Lovable Cloud (Supabase)**

- 3 rôles : `visitor` (public), `owner` (propriétaire/agence), `admin`
- Inscription / Connexion par email
- Table `user_roles` séparée (sécurité)
- Protection des routes selon le rôle

## Phase 4 — Base de données et gestion des biens

**Tables Supabase** :

```text
profiles        → id, full_name, phone, type (individual/agency), city
properties      → id, owner_id, title, description, type (sale/rent), 
                   price, surface, rooms, city, address, status
property_images → id, property_id, image_url, is_primary
listings        → id, property_id, is_featured, published_at, expires_at
contact_requests→ id, listing_id, sender_name, sender_phone, 
                   sender_email, message, created_at
```

- RLS policies pour chaque table
- Storage bucket pour les photos

## Phase 5 — Tableaux de bord

- **Dashboard Propriétaire/Agence** : Ajouter/modifier/supprimer des biens, voir les demandes de contact reçues, statistiques simples (vues, demandes)
- **Dashboard Admin** : Modérer les annonces, gérer les utilisateurs, voir les statistiques globales

## Phase 6 — Modèle de revenus (annonces mises en avant)

- Option "Annonce Premium" : mettre en avant un bien (badge + position prioritaire)
- Gestion simple via le dashboard admin (marquer manuellement comme premium pour le MVP)

---

## Résumé de la structure des routes

```text
/                    → Accueil
/properties          → Liste des biens
/properties/:id      → Détail d'un bien
/contact             → Contact
/about               → À propos
/auth                → Connexion / Inscription
/dashboard           → Dashboard propriétaire
/dashboard/add       → Ajouter un bien
/dashboard/edit/:id  → Modifier un bien
/admin               → Dashboard admin
```

## Ordre de construction

1. Design system + Layout + Page d'accueil (données statiques)
2. Pages liste et détail (données statiques)
3. Lovable Cloud : auth + base de données + stockage
4. Connexion des pages aux données réelles
5. Dashboards propriétaire et admin
6. Annonces premium

Le MVP cible : **marché marocain**, **vente et location longue durée**, **français + arabe**.

