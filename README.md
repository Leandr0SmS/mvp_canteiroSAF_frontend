# MVP Canteiro SAF - Front End

## Descrição

Este projeto busca auxiliar no planejamento de sistemas agroflorestais (SAF) que combinem espécies vegetais de diferentes estratos verticais.  
A seleção das espécies que irão compor um SAF é de grande importância para sua eficiência.

O projeto permite ao usuário:

- Inserir/Excluir espécies do banco de dados;
- Selecionar uma espécie por estrato para criar um canteiro apresentando informações pertinentes para realizar o planejamento, manejo e colheita do SAF;

## Iniciando

### Dependências

Para que o front-end funcione de forma otimizada, será necessário iniciar a API [puc_rio-mvp_1-back_end](https://github.com/Leandr0SmS/puc_rio-mvp_1-back_end)

### Executando

> Caso precise atualizar o URL da API basta modificar o arquivo config.js.

#### Docker

```
docker build --no-cache -t meu_canteiro .
```
```
docker run -d -p 8080:80 meu_canteiro
```

[http://localhost:8080/](http://localhost:8080/)

#### Browser

Para executar basta abrir o arquivo index.html no browser.

## Autor

[Leandro Simões](https://github.com/Leandr0SmS)

## Licença

The MIT License (MIT)
Copyright © 2023 Leandro Simões

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Inspirações

- [PUC-Rio](https://www.puc-rio.br/index.html)
- [CodeCademy](https://www.codecademy.com/)
- [FreeCodeCamp](https://www.freecodecamp.org/learn/)
- [Cepeas](https://www.cepeas.org/)
- [Agenda Gotsch](https://agendagotsch.com/)
