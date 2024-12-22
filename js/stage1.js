var stage1State = {
    create: function () {
        // Adiciona a imagem de fundo no Stage, Eixo X e Y com "0" para preencher tudo e "bg" é a imagem já carregada.
        game.add.sprite(0,0,'bg');

        /*
          Esse é o Mapa da fase, uma matriz onde os números são blocos e as linhas são outras celulas (matrizes).
          0 = Representa os espaços onde se caminha, aberto.
          1 = Representa os blocos fechados, paredes.
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
        // Agora ativa o corpo físico dos blocos para serem colididos.
        this.blocks.enableBody = true;

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

                // Primeiro adiciona os Blocos nos casos iguais a "1"
                if (tile === 1) {
                    var block = this.blocks.create(x,y,'block');
                    // Após criar o bloco, informa que o corpo ".body" dele não pode se mover ".immovable" como "true".
                    block.body.immovable = true;
                } else
                // Depois adiciona o Jogador caso seja igual a "2"
                if (tile === 2) {
                    // A variável "player" recebe o sprite do jogador. O "X" e "Y" somam "+ 25" para ficar no centro.
                    this.player = game.add.sprite(x + 25, y + 25,'player');
                    // E centraliza no próprio eixo.
                    this.player.anchor.set(.5);
                    // Ativa a movimentação do jogador já carregada no "load"
                    game.physics.arcade.enable(this.player);
                }
            }
        }

        /*
          Controles Movimentação
          Aqui a variável "controls" recebe as teclas de setas ".createCursorKeys()"  do teclado ".keyboard" de entrada
          ".input" no jogo "game".
        */
        this.controls = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        // Agora informa que os blocos e o jogador podem colidir entre si.
        game.physics.arcade.collide(this.player, this.blocks);

        this.movePlayer();
    },

    /*
      Função de Movimento
      Essa é a função que captura as entradas do teclado para movimentar o jogador.
      Eixo X se move na horizontal, direita e esquerda
      Eixo Y se move na vertical, para cima e para baixo.
    */
    movePlayer: function () {
        // Inicia o jogador parado
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        // Se o "controls" seta esquerda "left" estiver pressionada "isDown" e (&&) da direita não ("!" negação).
        if (this.controls.left.isDown && !this.controls.right.isDown) {
            // O jogador "this.player" move o corpo ".body" na velocidade ".velocity" do Eixo X ".x" a velocidade "-100".
            this.player.body.velocity.x = -100; // Número negativo "-" esquerda
        }
        // Se o "controls" seta direita "right" estiver pressionada "isDown" e (&&) da esqueda não ("!" negação).
        if (this.controls.right.isDown && !this.controls.left.isDown) {
            // O jogador "this.player" move o corpo ".body" na velocidade ".velocity" do Eixo X ".x" a velocidade "100".
            this.player.body.velocity.x = 100; // Número positivo direita
        }
        // Se o "controls" seta cima "up" estiver pressionada "isDown" e (&&) da baixo não ("!" negação).
        if (this.controls.up.isDown && !this.controls.down.isDown) {
            // O jogador "this.player" move o corpo ".body" na velocidade ".velocity" do Eixo Y ".y" a velocidade "-100".
            this.player.body.velocity.y = -100; // Número negativo "-" cima
        }
        // Se o "controls" seta baixo "left" estiver pressionada "isDown" e (&&) da cima não ("!" negação).
        if (this.controls.down.isDown && !this.controls.up.isDown) {
            // O jogador "this.player" move o corpo ".body" na velocidade ".velocity" do Eixo Y ".y" a velocidade "100".
            this.player.body.velocity.y = 100; // Número positivo baixo
        }
    }
};