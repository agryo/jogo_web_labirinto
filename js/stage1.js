var stage1State = {
  create: function () {
    // Adiciona a imagem de fundo no Stage, Eixo X e Y com "0" para preencher tudo e "bg" é a imagem já carregada.
    game.add.sprite(0, 0, "bg");

    /*
          Esse é o Mapa da fase, uma matriz onde os números são blocos e as linhas são outras celulas (matrizes).
          0 = Representa os espaços onde se caminha, aberto.
          1 = Representa os blocos fechados, paredes.
          2 = Representa onde o Jogador irá começar.
          3 = Representa onde as moedas irão aparecer.
        */
    this.mapa = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 3, 0, 1, 3, 0, 0, 1, 0, 3, 1, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 3, 0, 0, 0, 0, 1, 0, 0, 3, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 3, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    // Aqui a variável "blocks" vai receber um "group" do Phaser para ser o grupo dos blocos.
    this.blocks = game.add.group();
    // Agora ativa o corpo físico dos blocos para serem colididos.
    this.blocks.enableBody = true;
    // Array para as possíveis posições das moedas
    this.coinPositions = [];

    /*
          O "FOR" vai percorrer a matriz para detectar os números para em seguida montar o mapa.
          Primeiro ele percorre as linhas "row" no mapa "this.mapa".
          Depois ele percorre as colunas "col" na linha do mapa "this.mapa[row]".
          Durante a detecção ele cria a variável "tile" que recebe a linha e coluna do mapa.
          Cria as variáveis de "X" e "Y" para informar o tamanho dos blocos que serão 50px (multiplica por 50).
          E finalmente monta o mapa com o "IF" onde se o "tile" for igual a "1" o "block" recebe os dados.
        */
    for (var row in this.mapa) {
      for (var col in this.mapa[row]) {
        var tile = this.mapa[row][col];

        var x = col * 50;
        var y = row * 50;

        // Primeiro adiciona os Blocos nos casos iguais a "1"
        if (tile === 1) {
          var block = this.blocks.create(x, y, "block");
          // Após criar o bloco, informa que o corpo ".body" dele não pode se mover ".immovable" como "true".
          block.body.immovable = true;
        }
        // Depois adiciona o Jogador caso seja igual a "2"
        else if (tile === 2) {
          // A variável "player" recebe o sprite do jogador. O "X" e "Y" somam "+ 25" para ficar no centro.
          this.player = game.add.sprite(x + 25, y + 25, "player");
          // E centraliza no próprio eixo.
          this.player.anchor.set(0.5);
          // Ativa a movimentação do jogador já carregada no "load"
          game.physics.arcade.enable(this.player);
          /*
                      Criar a animação do personagem movimentando para todas as direções.
                      Adicione ".add" as Animações ".animations" ao Personagem "this.player"
                      Entre os parenteses são a ID "goDown", Array das Imagens, Velocidade e Loop ativo "true".
                    */
          this.player.animations.add("goDown", [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
          this.player.animations.add("goUp", [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
          this.player.animations.add("goLeft", [16, 17, 18, 19, 20, 21, 22, 23], 12, true);
          this.player.animations.add("goRight", [24, 25, 26, 27, 28, 29, 30, 31], 12, true);
        }
        // Depois adiciona as possíveis posições onde as moedas irão aparecer caso seja igual a "3".
        else if (tile === 3) {
            // Váriável que receberá um objeto com as coordenadas das posições em X e Y.
            var position = {
                // X e Y "+ 25" pois são o centro da célula.
                x: x + 25,
                y: y + 25
            };
            // Em seguida adiciona as posiçõoes ao Array criado mais acima.
            this.coinPositions.push(position);
        }
      }
    }

    /*
      Criar as Moedas no Jogo
      Primeira cria o Objeto das Moedas.
      Depois adiciona a nova posição no item do objeto ".position" da moeda recebendo a função criada "newPosition()".
    */
   this.coin = {};
   this.coin.position = this.newPosition();
   // Adiciona a moeda ao jogo recebendo a posição em X, posição em Y e a imagem da moeda "coin".
   this.coin = game.add.sprite(this.coin.position.x, this.coin.position.y, 'coin');
   // Centraliza no próprio eixo
   this.coin.anchor.set(.5);
   /* 
     Adiciona a animação da moeda.
     Adicione ".add" a Animação ".animations" à Moeda "this.coin" e inicie a reprodução ".play()".
     Entre os parenteses são a ID "spin", o Array de cada imagem (recortes), a velocidade "10" e ativar Loop "true".
   */
   this.coin.animations.add('spin', [0,1,2,3,4,5,6,7,8,9], 10, true).play();

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
      // Criar a subfunção de direção que não existe para adicionar as direções "direction".
      this.player.direction = "left";
    }
    // Se o "controls" seta direita "right" estiver pressionada "isDown" e (&&) da esqueda não ("!" negação).
    else if (this.controls.right.isDown && !this.controls.left.isDown) {
      // O jogador "this.player" move o corpo ".body" na velocidade ".velocity" do Eixo X ".x" a velocidade "100".
      this.player.body.velocity.x = 100; // Número positivo direita
      // Criar a subfunção de direção que não existe para adicionar as direções "direction".
      this.player.direction = "right";
    }

    // Se o "controls" seta cima "up" estiver pressionada "isDown" e (&&) da baixo não ("!" negação).
    if (this.controls.up.isDown && !this.controls.down.isDown) {
      // O jogador "this.player" move o corpo ".body" na velocidade ".velocity" do Eixo Y ".y" a velocidade "-100".
      this.player.body.velocity.y = -100; // Número negativo "-" cima
      // Criar a subfunção de direção que não existe para adicionar as direções "direction".
      this.player.direction = "up";
    }
    // Se o "controls" seta baixo "left" estiver pressionada "isDown" e (&&) da cima não ("!" negação).
    else if (this.controls.down.isDown && !this.controls.up.isDown) {
      // O jogador "this.player" move o corpo ".body" na velocidade ".velocity" do Eixo Y ".y" a velocidade "100".
      this.player.body.velocity.y = 100; // Número positivo baixo
      // Criar a subfunção de direção que não existe para adicionar as direções "direction".
      this.player.direction = "down";
    }

    /*
      Com as direções criadas e capturadas no movimento
      Usa o "Switch" para ativar as animações do personagem
      Seleciona no "switch" a variável criada com as direções "this.player.direction".
      E cria todos os casos com as animações ativadas.
      Dê o play ".play" na Animação ".animations" do Personagem "this.player".
      Entre os parenteses qual a animação será usada com as IDs criadas na animação.
    */
    switch (this.player.direction) {
      case "left":
        this.player.animations.play("goLeft"); break;
      case "right":
        this.player.animations.play("goRight"); break;
      case "up":
        this.player.animations.play("goUp"); break;
      case "down":
        this.player.animations.play("goDown"); break;
    }

    /* 
      Aqui é para parar a animação quando o personagem estiver parado.
      Se "if" no Eixo X ".x" a Velocidade ".velocity" do Corpo ".body" do Personagem "this.player" for igual a "0"
      E "&&" no Eixo Y ".y" a Velocidade ".velocity" do Corpo ".body" do Personagem "this.player" for igual a "0"
    */
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      // Pare ".stop()" a Animação ".animations" do personagem "this.player".
      this.player.animations.stop();
    }
  },

  /*
    Função Nova Posição das Moedas
    A variável "pos" recebe o Array "this.coinPosition" na posição arredondada para baixo "[Math.floor()]"
    E nos parenteses do arredondamento, gera um número aleatório "Math.random()" multiplicado pelo tamanho do Array.
    Sorteando uma nova posição para a moeda aparecer.
  */
  newPosition: function() {
    // Sorteia a nova posição para a variável.
    var pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];

    // Enquanto a posição sorteada for igual a posição nova, para não ser a mesma.
    while (this.coinPositions === pos) {
        // Sorteia novamente outra posição até que seja diferente.
        pos = this.coinPositions[Math.floor(Math.random() * this.coinPositions.length)];
    }
    // Quando tiver uma nova posição válida, retorna ela na função.
    return pos;
  }
};