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
    
    // Zera o contador de pontos.
    game.global.score = 0;
    
    /*
      Exibir o Record, a melhor pontuação atingida no jogo.
      Primeiro verifica SE na memória do navegador "cookie" existe alguma coisa gravada em "labirinto_highScore".
      E caso não exista "!", ele entra no "IF" e cria esse registro no navegador.
    */
    if (!localStorage.getItem('labirinto_highScore')) {
      // Aqui ele cria o arquivo no cookie e já inicia zerado o valor.
      localStorage.setItem('labirinto_highScore', 0);
    }

    // Adiciona o Record atualizado no Menu do Jogo.
    var txtRecord = game.add.text(
      game.world.centerX, 
      350, 
      'MAIOR RECORD: ' + game.global.record, 
      { font:'20px emulogic', fill:'#D26111' });
      // Centraliza no próprio eixo
      txtRecord.anchor.set(.5);
      // Deixa o texto transparente, invisível.
      txtRecord.alpha = 0;

    /*
      Agora ele verifica se a pontuação atual do jogo e maior que a pontuação armazenada no cookie.
      SE a pontuação for maior, ele atualiza a pontuação do Record do jogo para ficar gravada.
      Se não "ELSE" ele atualiza a pontuação no jogo com a armazenada no cookie.
    */
    if (game.global.record > localStorage.getItem('labirinto_highScore')) {
      localStorage.setItem('labirinto_highScore', game.global.record);
    } else {
      game.global.record = localStorage.getItem('labirinto_highScore');
    }

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
    const txtPressButton = game.add.text(game.world.centerX, 550, 'PRESSIONE ENTER', { font: '20px emulogic', fill: '#fff' });
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
        Após o tempo de 1 segundo até o "PRESSIONE ENTER" subir na tela, ele mostra o "MAIOR RECORD"
        Inicie ".start()" o Loop ".loop()" a cada meio segundo ".to( alpha 1 e 0 em 500ms)"
        Interpolado no texto ".to(txtRecord)" e Adicione ".add" ao Jogo "game".
        Isso da o efeito de ficar piscando na tela o maior record.
      */
      game.add.tween(txtRecord).to({ alpha: 1 }, 500).to({ alpha: 0 }, 500).loop().start();
      
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
