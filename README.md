node-boleto
=============

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Geração de boleto bancário em Node.js. Os algoritmos de geração da linha digitável e do código de barras são um fork de [node-boleto](https://github.com/pagarme/node-boleto).
Esta versão da biblioteca adiciona as seguintes funcionalidades à biblioteca original mencionada acima:
- Conversão de boletos do formato HTML para PDF
- Impressão de boletos do banco BV

Para a conversão de boletos para PDF é necessária a instalação da ferramenta de linha de comando `wkhtmltopdf`. Você pode fazer o download da versão corresponde ao seu sistema operacional [neste link](https://wkhtmltopdf.org/downloads.html). Certifique-se de que a `wkhtmltopdf` está no seu PATH.

Se você utiliza AWS Lambda, há uma seção abaixo que explica como instalar a `wkhtmltopdf` na lambda.

## Bancos suportados

- Santander - by [pedrofranceschi](https://github.com/pedrofranceschi) - homologado
- Bradesco - by [pedrofranceschi](https://github.com/pedrofranceschi)
- BV - by [veller](https://github.com/veller) - apenas impressão de boleto que já possua código de barras

## Instalação

```
npm i @natura-pay/node-boleto
```
## Instalando a dependência wkhtmltopdf em uma AWS Lambda

1. Baixe o [lambda zip](https://wkhtmltopdf.org/downloads.html) no site de downloads da wkhtmltopdf.
2. Extraia o conteúdo do zip e adicione na raiz do código da sua lambda, ficará assim:
```
.
│
└───bin
│   │   wkhtmltopdf
│
└───lib
│   │   libbz2.so.1
│   │   libexpat.so.1
│   │   libfontconfig.so.1
│   │   libfreetype.so.6
│   │   libjpeg.so.62
│   │   libpng15.so.15
│   │   libuuid.so.1
│   │   libX11.so.6
│   │   libXau.so.6
│   │   libxcb.so.1
│   │   libXext.so.6
│   │   libXrender.so.1
│
└───fonts
│   │   fonts.conf
│   │   .uuid
│   └───dejavu
```
3. Dê permissão de execução ao binário com o comeando `chmod 755 bin/wkhtmltopdf`
4. Atualize a sua variável PATH para:
```
process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'] + '/bin';
```
5. Atualize a sua variável FONTCONFIG_PATH para:
```
process.env['FONTCONFIG_PATH'] = process.env['LAMBDA_TASK_ROOT'] + '/fonts';
```
6. Faça deploy do código

## Exemplos de uso

### Emitindo um boleto Santander ou Bradesco e imprimindo em PDF:

```javascript
const Boleto = require('node-boleto').Boleto;
const fs = require('fs');

const boleto = new Boleto({
  'banco': "santander", // nome do banco dentro da pasta 'banks'
  'data_emissao': new Date(),
  'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000), // 5 dias futuramente
  'valor': 1500, // R$ 15,00 (valor em centavos)
  'nosso_numero': "1234567",
  'numero_documento': "123123",
  'cedente': "Pagar.me Pagamentos S/A",
  'cedente_cnpj': "18727053000174", // sem pontos e traços
  'agencia': "3978",
  'codigo_cedente': "6404154", // PSK (código da carteira)
  'carteira': "102"
});

console.log("Linha digitável: " + boleto['linha_digitavel'])

const pdfBuffer = await boleto.renderPDF();

fs.writeFileSync(`boleto-pdf-${Date.now()}.pdf`, pdfBuffer); // exemplo para salvar o pdf do boleto em arquivo

```

### Emitindo um boleto Santander ou Bradesco e imprimindo em HTML:

```javascript
const Boleto = require('node-boleto').Boleto;
const fs = require('fs');

const boleto = new Boleto({
  'banco': "santander", // nome do banco dentro da pasta 'banks'
  'data_emissao': new Date(),
  'data_vencimento': new Date(new Date().getTime() + 5 * 24 * 3600 * 1000), // 5 dias futuramente
  'valor': 1500, // R$ 15,00 (valor em centavos)
  'nosso_numero': "1234567",
  'numero_documento': "123123",
  'cedente': "Pagar.me Pagamentos S/A",
  'cedente_cnpj': "18727053000174", // sem pontos e traços
  'agencia': "3978",
  'codigo_cedente': "6404154", // PSK (código da carteira)
  'carteira': "102"
});

console.log("Linha digitável: " + boleto['linha_digitavel'])

const html = await boleto.renderHTML();

fs.writeFileSync(`boleto-pdf-${Date.now()}.html`, html); // exemplo para salvar o html do boleto em arquivo

```

### Parseando o arquivo-retorno EDI do banco:

```javascript
var ediParser = require('node-boleto').EdiParser,
	fs = require('fs');

var ediFileContent = fs.readFileSync("arquivo.txt").toString();

var parsedFile = ediParser.parse("santander", ediFileContent);

console.log("Boletos pagos: ");
console.log(parsedFile.boletos);
```

### Imprimindo um boleto BV:

Boletos BV não possuem suporte, por ora, para geração de código de barras e linha digitável.
Desta forma, para este banco a lib funciona apenas com o intuito de impressão de boleto a partir de um objeto como o exemplo abaixo.
Atenção para a obrigatoriedade do envio válido da opção `codigo_de_barras`.

```javascript
const Boleto = require('node-boleto').Boleto;
const fs = require('fs');

const boleto = new Boleto({
  'banco': 'bv',
  'data_emissao': new Date('2021-01-21T00:00:00Z'),
  'data_vencimento': new Date('2021-01-31'),
  'valor': 1500,
  'nosso_numero': '1571644678',
  'numero_documento': '0022300000010600000644678',
  'cedente': 'ARROWHEAD SOFTWARE LTDA',
  'cedente_cnpj': '56444538000140',
  'agencia': '1111',
  'codigo_cedente': '35524559000103',
  'carteira': '',
  'pagador': 'Nome do pagador\nCPF: 000.000.000-00',
  'local_de_pagamento': 'PAGÁVEL EM QUALQUER BANCO ATÉ O VENCIMENTO.',
  'instrucoes': 'Não receber após o vencimento',
  'codigo_de_barras': '34191851900260000001790001043510049102015000'
});

console.log("Linha digitável: " + boleto['linha_digitavel'])

const pdfBuffer = await boleto.renderPDF();

fs.writeFileSync(`boleto-pdf-${Date.now()}.pdf`, pdfBuffer); // exemplo para salvar o pdf do boleto em arquivo

```

## Adicionando novos bancos

## Renderização do código de barras

Atualmente, há duas maneiras de renderizar o código de barras: `img` e `bmp`.

A engine `img` utiliza imagens brancas e pretas intercaladas para gerar o código de barras. Dessa forma, todos os browsers desde o IE6 são suportados. Esse modo de renderização, porém, é um pouco mais pesado, já que muitas `divs` são inseridas no HTML para a renderização.

A engine `bmp` aproveita da característica monodimensional dos códigos de barra e gera apenas a primeira linha de pixels do boleto, repetindo as outras linhas por CSS. É mais leve e funciona na maioria dos browser - IE apenas a partir da versão 8.

Para alterar a engine de renderização padrão:

```javascript
Boleto.barcodeRenderEngine = 'bmp';
```

## Licença

(The MIT License)

Copyright (c) 2013-2017 Pagar.me Pagamentos S/A

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
