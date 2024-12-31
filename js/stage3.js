var stage3State = {
  create: function () {
    /* 
      Cria um Objeto com as configurações da fase.
      Parametros: Moedas da Fase, Tempo da Fase, Fator de Bonus da Fase.
    */
    this.stageConfig = configFase(10, 120, 5);

    /*
      Adiciona e iniciar a música do jogo já configurada.
      Parametro: O string da ID da música da fase carregada no "load.js"
    */
    this.music = adicionarMusica('somstage3');
    // Carrega o som do jogo ao pegar o item.
    this.somCoin = addSons('getitem');
    // Carrega o som de quando perde moedas.
    this.somLoseCoin = addSons('loseitem');

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
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,0,0,0,3,1,3,0,0,3,1,3,0,1],
      [1,0,1,1,1,0,1,1,0,1,1,1,1,0,1],
      [1,0,1,0,0,0,2,0,0,1,0,3,1,0,1],
      [1,0,1,1,3,1,1,1,3,1,0,0,1,0,1],
      [1,3,0,0,0,0,0,1,1,1,3,0,0,0,1],
      [1,1,1,0,1,1,0,0,0,1,1,1,1,0,1],
      [1,0,1,0,3,1,0,1,0,0,0,0,1,0,1],
      [1,3,0,0,0,1,3,0,3,1,0,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];           

    // Aqui a variável "blocks" vai receber a função que cria o grupo de blocos.
    this.blocks = addBlocos();
    // Array para as possíveis posições das moedas
    this.coinPositions = [];
    // Cria variável para receber o jogador.
    this.player = adicionarPlayer(0, 0, 'player');

    // Chama a função que monta o mapa e os objetos da fase.
    montarFase(this.mapa, 'blocka', this.blocks, this.coinPositions, this.player);

    /*
      Adicionar o Inimigo
      Primeiro cria a variável do inimigo que recebe o sprite da imagem do inimigo.
      Os parametros são Eixo X, Eixo Y e a Imagem carregada no "load".
    */
    this.inimigo1 = addInimigo(75, 75, 'enemy');
    this.inimigo2 = addInimigo(675, 425, 'enemy');
    this.inimigo3 = addInimigo(275, 125, 'enemy');

    // Criar as Moedas no Jogo.
    this.coin = criarMoeda(this.coinPositions);      

    /*
      Contador de moedas
      Primeiro cria a variável zerada com a quantidade de moedas coletadas.
    */
    this.coins = 0;
    // Gera o texto das moedas para exibir no jogo.
    this.txtCoins = contarMoedas(this.coins);

    /*
      Contador da pontuação
      Primeiro cria a variável que vai receber os pontos.
      E recebe a função do contator de pontos.
    */
    this.txtPontos = contadorPontos();

    /*
      Controles Movimentação
      Aqui a variável "controls" recebe as teclas de setas ".createCursorKeys()"  do teclado ".keyboard" de entrada
      ".input" no jogo "game".
    */
    this.controls = game.input.keyboard.createCursorKeys();

    /*
      Criação do emissor das partículas da explosão
      Aqui a variável "emitter" a função que gera as partículas.
    */
    this.emitter = gerarParcicula();

    // A variável recebe o texto do tempo para exibir no jogo.
    this.txtTempo = contadorTempo(this.stageConfig.tempoFase);

    // Cria a variável "timer" que recebe a função que gera o cronometro.
    this.timer = cronometroFase(this.txtTempo);
  },
  
  update: function () {
    // Condição para iniciar o jogo, SE a variável "this.stageConfig.onGame" for iniciar "true", então o jogo é iniciado.
    if (this.stageConfig.onGame) {
      // Agora informa que os blocos e o jogador podem colidir entre si.
      game.physics.arcade.collide(this.player, this.blocks);
      /* 
        Agora informa que o jogador pode coletar as moedas. O "overlap" verifica se estão ocupando o mesmo espaço.
        Entre os parenteses os parametros são:
        Objeto1 a ser verificado se estão no mesmo espaço, Objeto2 da  verificação, Função para executar, Condição "null".
        Não vai ter condição para disparar a função então usa "null" e o "this" é o contexto da função.
      */
      game.physics.arcade.overlap(this.player, this.coin, () => getCoin(this), null, this);
      // Informa que o Inimigo pode ter contato com o jogador para roubar moedas.
      game.physics.arcade.overlap(this.player, this.inimigo1, () => loseCoin(this), null, this);
      game.physics.arcade.overlap(this.player, this.inimigo2, () => loseCoin(this), null, this);
      game.physics.arcade.overlap(this.player, this.inimigo3, () => loseCoin(this), null, this);

      // Inicia a função de movimentação do Inimigo.
      moveInimigo(this.mapa, this.inimigo1);
      moveInimigo(this.mapa, this.inimigo2);
      moveInimigo(this.mapa, this.inimigo3);
      // Inicia a função de movimentação do Jogador.
      movePlayer(this.controls, this.player);

      /*
        Condição do fim de jogo.
        SE o tempo acabar OU o jogador atigir o objetivo de coletar "10" moedas nesse caso.
        Assim ela executa as operações nescessárias para finalizar o jogo.
      */
      if (this.stageConfig.tempoFase < 1 || this.coins >= this.stageConfig.moedasFase) {
        // Chama a Função de Fim de Jogo.
        gameOver();

        // Para o tempo removendo o evento criado acima.
        // Remova o Temporizador ".remove(this.timer)" do Evento ".events" de Tempo ".time" do Jogo "game".
        game.time.events.remove(this.timer);

        // Para o jogador ao concluir a fase.
        pararPlayer(this.player);

        // Para os inimigos ao concluir a fase.
        pararInimigo(this.inimigo1);
        pararInimigo(this.inimigo2);
        pararInimigo(this.inimigo3);

        // Para a moeda ao concluir a fase.
        pararMoeda(this.coin);

        /*
          Condição para testar se o jogo acabou por causa do tempo ou passou de fase.
          SE o jogador pegar a quantidade de moedas suficientes, entra no primeiro caso.
          SE NÂO o jogador não conseguiu pegar as moedas no tempo do jogo.
        */
        if (this.coins >= this.stageConfig.moedasFase) {
          // Exibe na tela que passou de fase.
          const txtLevelComplete = levelCompleto(this.txtPontos);

          // Atualiza o record caso tenha sido atingido.
          verificaRecord();
        } else {
          // Exibe a mensagem de Fim de Jogo.
          txtGameOver();
        }

        // Chama a função que verifica se passou ou perdeu. Parametros: Moedas Atuais, Música da Fase, Próxima Fase.
        passaOuPerde(this.coins, this.music, 'stage4');
      }
    }
  },
};