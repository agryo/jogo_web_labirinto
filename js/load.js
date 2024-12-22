var loadState = {
  preload: function () {
    /*
      Adicionar o texto com o "Carregando".
      A variável "txtLoading" vai receber o "game.add.text" Game, Adicionar, Texto.
      E dentro dos parenteses tem os parametros de Eixo X, Eixo Y, Texto a ser exibido e Objeto da formatação do texto.
   */
    const txtLoading = game.add.text(game.world.centerX, 150, 'CARREGANDO...', {
      font: '15px emulogic',
      fill: '#fff',
    });
    txtLoading.anchor.set(0.5); // Centraliza no meio do próprio eixo em si

    /*   
      Esse "preload" cria a variável da imagem instanciada anteriormente.
      A variável "progressBar" recebe do "game" adicionando "add" um Sprite do jogo que é a imagem
      já carregada no "load".
      Nos parenteses coloca as coordenadas onde a imagem irá ser mostrada, X e Y.
      O "game.world.centerX" faz o calculo do Eixo X para ficar no centro.
      O Eixo Y fica a 250px.
      E por fim qual a imagem foi carregada lá no "load".
   */
    var progressBar = game.add.sprite(game.world.centerX, 250, 'progressBar');

    /* 
      Aqui está definindo o ponto de ancoragem da imagem no centro dela mesma.
      Eixo X = 0.5 e Eixo y = 0.5 como ambos são no centro, basta colocar apenas ".5".
      "anchor" .set(.5) é igual a .set(0.5,0.5)
   */
    progressBar.anchor.set(0.5);

    /* 
      Aqui está informando que a imagem será usada como "Barra de Progresso" o percentual de carregamento.
      O "game"  carrega "load" o Sprite de progresso "setPreloadSprite" usando a imagem "progressBar".
   */
    game.load.setPreloadSprite(progressBar);

    /* 
      Agora aqui é o carregamento do restante dos arquivos que serão usados no jogo.
      "load.image" é usado para imagens únicas.
      "load.spritesheet" é usado para as imagens com animação.
      Nos parenteses primeiro é o "ID" da imagem entre aspas simples.
      E no segundo é o caminho da imagem, também com aspas simples.
      O "ID" é como será usada a imagem no restante do código, sem precisar colocar novamente o caminho.
   */
    game.load.image('bg', 'img/bg.png');
    game.load.image('block', 'img/block.png');
    game.load.image('end', 'img/end.png');
    game.load.image('part', 'img/part.png');

    /* 
      Aqui os Sprites Sheets (animações)
      A principal diferença é que além do "ID" e do "Caminho", será preciso dizer o tamanho de cada bloco
      de imagem das várias que formam a animação pois elas serão exibidas individualmente claro.
      Primeiro "Largura" depois "Altura".
   */
    game.load.spritesheet('coin', 'img/coin.png', 32, 32);
    game.load.spritesheet('enemy', 'img/enemy.png', 24, 40);
    game.load.spritesheet('player', 'img/player.png', 24, 32);

    // E aqui fica o carregamento dos Áudios do jogo
    game.load.audio('getitem', 'assets/getitem.ogg');
    game.load.audio('loseitem', 'assets/loseitem.ogg');
    game.load.audio('musica', 'assets/music.ogg');
  },

  /*
      Aqui o método "create" chama o próximo State que nesse caso é o Menu Principal
  */
  create: function () {
    game.state.start('menu');
  },
};
