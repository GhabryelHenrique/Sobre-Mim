# 🚀 Deploy para GitHub Pages

Deploy automático usando `angular-cli-ghpages` para o domínio **ghabryelhenrique.com.br**

---

## 📋 Configuração Inicial (Fazer 1 vez)

### 1. Configurar DNS do Domínio

No seu provedor de domínio (Registro.br, GoDaddy, etc.), adicione os seguintes registros DNS:

#### Registros A (para domínio raiz):
```
Tipo: A
Nome: @
Valor: 185.199.108.153

Tipo: A
Nome: @
Valor: 185.199.109.153

Tipo: A
Nome: @
Valor: 185.199.110.153

Tipo: A
Nome: @
Valor: 185.199.111.153
```

#### Registro CNAME (para www):
```
Tipo: CNAME
Nome: www
Valor: SEU_USUARIO.github.io
```

⏱️ **Aguarde**: A propagação DNS pode levar de 5 minutos a 48 horas.

### 2. Configurar GitHub Pages no Repositório

1. Faça o primeiro deploy (instruções abaixo)
2. Vá em **Settings** > **Pages** no seu repositório GitHub
3. Em **Custom domain**, digite: `ghabryelhenrique.com.br`
4. Clique em **Save**
5. ✅ Marque **Enforce HTTPS** (após DNS propagar)

---

## 🚀 Como Fazer Deploy

### Comando Simples:

```bash
npm run deploy
```

Isso vai:
1. ✅ Buildar a aplicação em modo produção
2. ✅ Configurar base-href para o domínio
3. ✅ Criar arquivo CNAME automaticamente
4. ✅ Fazer deploy para branch `gh-pages`
5. ✅ Site fica disponível em `ghabryelhenrique.com.br`

### Processo Completo:

```bash
# 1. Salvar alterações
git add .
git commit -m "Descrição das alterações"

# 2. Fazer deploy para GitHub Pages
npm run deploy

# 3. (Opcional) Enviar para branch master
git push origin master
```

---

## 🔐 Autenticação (Primeira Vez)

### Opção 1: Token GitHub (Recomendado)

Se o deploy pedir autenticação:

1. Vá em: https://github.com/settings/tokens
2. Clique em **Generate new token** > **Generate new token (classic)**
3. Configure:
   - **Note**: `Deploy GitHub Pages`
   - **Expiration**: `No expiration` ou `90 days`
   - **Scopes**: Marque `repo` (acesso completo)
4. Clique em **Generate token**
5. **Copie o token** (não será mostrado novamente!)
6. Use quando solicitado:
   - **Username**: seu_usuario_github
   - **Password**: cole_o_token_aqui

### Opção 2: SSH (Alternativa)

```bash
# Configure SSH se preferir
npm run deploy -- --repo=git@github.com:SEU_USUARIO/ghabryelPage.git
```

---

## 📊 Verificar Deploy

### Ver Site Publicado:

- **Domínio principal**: https://ghabryelhenrique.com.br
- **URL GitHub**: https://SEU_USUARIO.github.io/ghabryelPage/

### Verificar Status:

1. Vá no repositório GitHub
2. Clique em **Environments** (ou **Settings > Pages**)
3. Veja o status do deploy
4. Clique para ver histórico

### Branch gh-pages:

O comando cria automaticamente a branch `gh-pages` com os arquivos buildados.
- **NÃO edite** essa branch manualmente
- É gerenciada automaticamente pelo `angular-cli-ghpages`

---

## ⚙️ Comandos Avançados

### Deploy com mensagem customizada:

```bash
npm run deploy -- --message="Deploy: nova funcionalidade X"
```

### Deploy para repositório diferente:

```bash
npm run deploy -- --repo=https://github.com/OUTRO_USER/outro-repo.git
```

### Fazer dry-run (testar sem publicar):

```bash
npm run deploy -- --dry-run
```

### Ver mais opções:

```bash
npx angular-cli-ghpages --help
```

---

## 🛠️ Solução de Problemas

### ❌ Erro: "fatal: could not read Username"

**Solução**: Configure o token do GitHub (veja seção Autenticação acima)

### ❌ Erro: "Permission denied"

**Solução**:
```bash
# Configure credenciais do Git
git config --global user.email "seu@email.com"
git config --global user.name "Seu Nome"
```

### ❌ Site não carrega CSS/JS

**Problema**: Base href incorreto

**Solução**: O script já está configurado corretamente com:
```bash
--base-href https://ghabryelhenrique.com.br/
```

Se precisar mudar:
```json
"deploy": "ng build --base-href /novo-caminho/ && npx angular-cli-ghpages ..."
```

### ❌ Domínio customizado não funciona

**Verificar**:
1. DNS propagou? Use `nslookup ghabryelhenrique.com.br`
2. CNAME configurado no GitHub Pages?
3. Aguardou tempo de propagação (até 48h)?

**Forçar atualização do CNAME**:
```bash
npm run deploy -- --cname=ghabryelhenrique.com.br
```

### ❌ Erro 404 em rotas do Angular

**Problema**: Refresh em rotas como `/projetos` dá 404

**Solução**: Criar arquivo `src/404.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Redirecionando...</title>
  <script>
    // Redireciona para index.html mantendo a rota
    var pathSegmentsToKeep = 0;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body></body>
</html>
```

E adicione no `angular.json` (assets):
```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  "src/404.html"  // <- Adicione esta linha
]
```

Depois rode `npm run deploy` novamente.

---

## 📈 Workflow Recomendado

### Desenvolvimento Normal:

```bash
# 1. Desenvolver localmente
npm start

# 2. Testar mudanças
# Navegue em http://localhost:4200

# 3. Commitar no Git
git add .
git commit -m "Descrição das alterações"
git push origin master

# 4. Deploy para produção
npm run deploy
```

### Deploy Rápido (sem commit):

```bash
# Apenas deploy (sem commit no master)
npm run deploy
```

---

## 🎯 Checklist de Deploy

### Primeira Vez:
- [ ] DNS configurado no provedor do domínio
- [ ] Token GitHub criado (se necessário)
- [ ] Primeiro deploy executado: `npm run deploy`
- [ ] Custom domain configurado no GitHub Pages
- [ ] HTTPS habilitado
- [ ] Site acessível via `ghabryelhenrique.com.br`

### Todo Deploy:
- [ ] Código testado localmente
- [ ] Mudanças commitadas (opcional)
- [ ] Executar: `npm run deploy`
- [ ] Aguardar 1-2 minutos
- [ ] Verificar site no navegador
- [ ] Limpar cache se necessário (Ctrl+Shift+R)

---

## 📝 Notas Importantes

1. **Branch gh-pages**: Criada automaticamente, não edite manualmente
2. **CNAME**: Gerado automaticamente pelo comando `--cname`
3. **Cache**: O GitHub Pages pode ter cache, aguarde 1-2 minutos
4. **HTTPS**: Certificado SSL gratuito e automático do GitHub
5. **CDN**: GitHub Pages usa CDN global para performance

---

## 🚀 Pronto!

Agora é só usar:

```bash
npm run deploy
```

Seu site estará disponível em:
**https://ghabryelhenrique.com.br**

Em caso de dúvidas, consulte a documentação oficial:
- https://github.com/angular-schule/angular-cli-ghpages
- https://docs.github.com/en/pages
