var menuState = {
  /*
    Agora todos os componentes já foram carregados na memória, não precisa mais do "preload".
    Vamos direto para o "create".
  */
  create: function() {
    /*
      Iniciar a música do jogo.
      Variável Global "music" do "manuState" usando o "this" para isso.
    */
    this.music = game.add.audio('music');
    // Informa que a música vai ficar repetindo em "loop"
    this.music.loop = true;
    // Informa a altura do som da música do menu será de 50%.
    this.music.volume = .5;
    // Inicia a música após as configurações.
    this.music.play();

    /* 
      Mesmo esquema para adicionar o título do jogo.
      Eixo X, Eixo Y, Texto e Configuração da fonte.
    */
    const txtTitulo = game.add.text(game.world.centerX, 150, 'LABIRINTO DE MOEDAS', { font: '35px emulogic', fill: '#fff' });
    // Centraliza no próprio eixo X e Y.
    txtTitulo.anchor.set(0.5);

    /* 
      Agora o texto do "Pressione ENTER" que terá uma animação subindo de baixo da tela.
      Ele irá começar fora da tela no Eixo Y em "550" e vai subir para o ponto de anchoragem.
    */
    var txtPressButton = game.add.text(game.world.centerX, 550, 'PRESSIONE ENTER', { font: '20px emulogic', fill: '#fff' });
    txtPressButton.anchor.set(0.5);

    /*
      Agora a animação subindo o "Pressione ENTER".
      O "tween" vai pegar o "txtPressButton" de onde ele está e vai mover ".to" até "250" no Eixo Y em 1000ms (1 seg)
      e vai iniciar isso ".start()" assim que for criado.
    */
    game.add.tween(txtPressButton).to({ y: 250 }, 1000).start();

    /* 
      Criar um "evento" que só aceita o comando "Pressione ENTER" após o tempo de ele subir para o centro da tela.
      Lendo da direito para a esquerda fica assim...
      Adicione ".add" um Evento ".events" de Tempo ".time" ao Jogo "game".
      Entre os parenteses vai os parametros de "Tempo" e a "Função" que vai disparar.
      E por fim o "this" que é pra dizer que o método pertence ao "menuState" e não dar erro.
    */
    game.time.events.add(1000, function() {
    /*
      Habilita a tecla "ENTER" para o jogador.
      Lendo da Direito para a Esquerda desde os parenteses.
      Entre os parenteses "Phaser" habilite no "Keyboard" a tecla "ENTER"
      E adicione a tecla ".addkey" do teclado ".keyborad" como entrada ".input" no Jogo "game".
    */
        var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    /*
      Após capturar o "ENTER" chama o método de iniciar o jogo.
      Entre os parenteses, chama o método "this.startGame" do próprio (this) "menuState" e roda dentro do "menuState".
      E adiciona uma única vez ".addOnce", após pressionada a tecla ".onDown" da variável "enterKey".
    */
        enterKey.onDown.addOnce(this.startGame, this);
    }, this);
  },

  /*
    Aqui vai o método "startGame".
    Parar a música antes de iniciar o "stage1"
    Entre os parenteses chame o "stage1".
    E inicie ".start" o State ".state" do Jogo "game".
  */
  startGame: function () {
    this.music.stop();
    game.state.start('stage1');
  }
};
