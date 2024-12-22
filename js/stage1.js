var stage1State = {
    create: function () {
        // Adiciona a imagem de fundo no Stage, Eixo X e Y com "0" para preencher tudo e "bg" é a imagem já carregada.
        game.add.sprite(0,0,'bg');

        /*
          Esse é o Mapa da fase, uma matriz onde os números são blocos e as linhas são outras celulas (matrizes).
          0 = Representa os espaços onde se caminha, aberto.
          1 = Representa os blocos fechados.
          2 = Representa onde o Jogador irá começar.
          3 = Representa onde as moedas irão aparecer.
        */
        this.mapa = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,3,0,0,0,0,0,0,0,0,0,0,0,3,1],
			[1,0,1,1,0,1,0,1,1,1,0,1,1,0,1],
			[1,0,1,3,0,1,3,0,0,1,0,3,1,0,1],
			[1,0,0,0,1,1,1,1,0,1,0,1,1,0,1],
			[1,0,0,0,0,1,0,2,0,0,0,0,0,0,1],
			[1,0,1,3,0,0,0,0,1,0,0,3,1,0,1],
			[1,0,1,1,1,1,0,1,1,0,1,1,1,0,1],
			[1,3,0,0,0,0,0,3,1,0,0,0,0,3,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        // Aqui a variável "blocks" vai receber um "group" do Phaser para ser o grupo dos blocos.
        this.blocks = game.add.group();

        /*
          O "FOR" vai percorrer a matriz para detectar os números para em seguida montar o mapa.
          Primeiro ele percorre as linhas "row" no mapa "this.mapa".
          Depois ele percorre as colunas "col" na linha do mapa "this.mapa[row]".
          Durante a detecção ele cria a variável "tile" que recebe a linha e coluna do mapa.
          Cria as variáveis de "X" e "Y" para informar o tamanho dos blocos que serão 50px (multiplica por 50).
          E finalmente monta o mapa com o "IF" onde se o "tile" for igual a "1" o "block" recebe os dados.
        */
        for(var row in this.mapa){
            for(var col in this.mapa[row]){
                var tile = this.mapa[row][col];

                var x = col * 50;
                var y = row * 50;

                if (tile === 1) {
                    var block = this.blocks.create(x,y,'block');
                }
            }
        }
    }
};