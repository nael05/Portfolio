# Portfolio

## Dépôts GitHub

Sans token, le portfolio affiche les dépôts publics possédés par `nael05`.
Pour inclure les dépôts publics auxquels ce compte contribue, créez un token
personnel GitHub à granularité fine avec les permissions de lecture **Metadata**
et **Contents**, puis ajoutez-le dans `.env.local` à la racine :

```env
GITHUB_TOKEN=github_pat_...
```

Ne partagez pas ce token et ne le préfixez pas avec `NEXT_PUBLIC_` : il est
utilisé uniquement côté serveur. Les dépôts privés ne sont jamais affichés.