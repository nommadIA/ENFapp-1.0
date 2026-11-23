# ENFapp

App para técnicos em enfermagem: documentos, assinatura e carimbo, plantões, homecares, relatórios,
produtividade (edição de PDF), financeiro e mercado. Multiusuário com 3 planos (Supabase + Netlify).

## Estrutura
- `public/index.html`: o app inteiro (um único arquivo).
- `netlify.toml`: publica a pasta `public`.
- `supabase/schema.sql`: tabelas, regras de segurança, planos e limites.
- `supabase/functions/lembretes`: Edge Function de lembretes.

## Segurança
O app usa somente a URL do projeto e a chave **anon** (pública). Nunca coloque a `service_role` nem a
`sb_secret_...` neste repositório.

## Supabase: Authentication > URL Configuration
- Site URL: `https://enfapp.netlify.app`
- Redirect URLs: `https://enfapp.netlify.app`
