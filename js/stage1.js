var stage1State = {
  create: function () {
    /* 
      Cria um Objeto com as configurações da fase.
      Parametros: Moedas da Fase, Tempo da Fase, Fator de Bonus da Fase.
    */
    this.stageConfig = configFase(1, 99, 5);

    /*
      Iniciar a música do jogo.
      Variável Global "music" do "manuState" usando o "this" para isso.
    */
    this.music = game.add.audio('somstage1');
    // Informa que a música vai ficar repetindo em "loop"
    this.music.loop = true;
    // Informa a altura do som da música do menu será de 50%.
    this.music.volume = .5;
    // Inicia a música após as configurações.
    this.music.play();
    // Carrega o som do jogo ao pegar o item.
    this.somCoin = game.add.audio('getitem');
    this.somCoin.volume = .5;
    // Carrega o som de quando perde moedas.
    this.somLoseCoin = game.add.audio('loseitem');
    this.somLoseCoin.volume = .5;

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
      [1,3,0,0,0,3,1,3,0,0,0,0,0,3,1],
      [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
      [1,0,1,3,0,1,3,0,0,1,0,3,1,0,1],
      [1,0,1,0,1,1,1,1,0,1,0,1,1,0,1],
      [1,0,0,0,0,1,0,2,0,0,0,0,0,0,1],
      [1,0,1,3,0,0,0,0,1,0,1,3,1,0,1],
      [1,0,1,1,1,1,0,1,1,0,1,1,1,0,1],
      [1,3,0,0,3,1,0,3,1,0,0,0,0,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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
      Adicionar o Inimigo
      Primeiro cria a variável do inimigo que recebe o sprite da imagem do inimigo.
      Os parametros são Eixo X, Eixo Y e a Imagem carregada no "load".
    */
    this.inimigo1 = addInimigo(75, 75, 'enemy');
    this.inimigo2 = addInimigo(675, 425, 'enemy');

    /*
      Criar as Moedas no Jogo
      Primeira cria o Objeto das Moedas.
      Depois adiciona a nova posição no item do objeto ".position" da moeda recebendo a função criada "newPosition()".
    */
    this.coin = {};
    this.coin.position = newPosition(this.coinPositions);
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
    // Adionar a física a moeda para ela ser pegável, colidida.
    game.physics.arcade.enable(this.coin);

    /*
      Contador de moedas
      Primeiro cria a variável zerada com a quantidade de moedas coletadas.
      Depois cria a variável que irá exibir o texto das moedas no jogo.
      Recebendo o texto ".text" adiciona ".add" ao jogo "game".
      Entre os parenteses os parametros, Eixo X, Eixo Y, Texto concatenado a variável "this.coins" e estilo da fonte.
    */
    this.coins = 0;
    this.txtCoins = game.add.text(
      15, 
      15, 
      'MOEDAS: ' + getText(this.coins), 
      {font: '15px emulogic', fill: '#fff'}
    );

    /*
      Contador da pontuação
      Primeiro cria a variável que vai receber os pontos
    */
    this.txtPontos = game.add.text(
      game.world.centerX, 
      15, 
      'PONTOS: ' + getText(game.global.score), 
      {font:'15px emulogic', fill:'#fff'}
    );
    this.txtPontos.anchor.set(.5, 0);

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
    this.emitter = geraParcicula();

    /*
      Criação do tempo, temporizador do jogo
      Cria a variável que mostra o texto do tempo no jogo com suas configurações nos parametros.
      Usa a variável que armazena o tempo criada no inicio do código no "getText".
      E centraliza no final da tela.
    */
    this.txtTempo = game.add.text(
      game.world.width - 15, 
      15, 
      'TEMPO: ' + getText(this.stageConfig.tempoFase), 
      {font:'15px emulogic', fill:"#fff"}
    );
    this.txtTempo.anchor.set(1, 0);
    // Cria a variável "timer" que recebe um loop repetido ".loop()" que é um evento ".events" de Tempo ".time" no Jogo "game".
    // Parametros -> ( ): Tempo para repetir "1000ms", a Função pra chamar a cada repetição e o contexto "this".
    this.timer = game.time.events.loop(1000, function(){
      // Diminui o tempo em 1 segundo
      this.stageConfig.tempoFase--;
      // Atualiza o tempo visualmente no jogo.
      this.txtTempo.text = 'TEMPO: ' + getText(this.stageConfig.tempoFase);
    }, this);
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
      game.physics.arcade.overlap(this.player, this.coin, this.getCoin, null, this);
      // Informa que o Inimigo pode ter contato com o jogador para roubar moedas.
      game.physics.arcade.overlap(this.player, this.inimigo1, this.loseCoin, null, this);
      game.physics.arcade.overlap(this.player, this.inimigo2, this.loseCoin, null, this);

      // Inicia a função de movimentação do Inimigo.
      moveInimigo(this.mapa, this.inimigo1);
      moveInimigo(this.mapa, this.inimigo2);
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

        // Para a moeda ao concluir a fase.
        pararMoeda(this.coin);

        /*
          Condição para testar se o jogo acabou por causa do tempo ou passou de fase.
          SE o jogador pegar a quantidade de moedas suficientes, entra no primeiro caso.
          SE NÂO o jogador não conseguiu pegar as moedas no tempo do jogo.
        */
        if (this.coins >= this.stageConfig.moedasFase) {
          // Exibe na tela que passou de fase.
          const txtLevelComplete = game.add.text(
            game.world.centerX,
            150,
            'LEVEL COMPLETO!',
            {font:'30px emulogic', fill:'#fff'}
          );
          txtLevelComplete.anchor.set(.5);
          // Aumenta os Pontos de acordo com o tempo. O tempo restante multiplicado por "2" nesse caso.
          const bonus = this.stageConfig.tempoFase * this.stageConfig.fatorBonus;
          // Atualiza os pontos com o acrescimo do Bonus.
          game.global.score += bonus;
          // Atualiza o texto dos pontos.
          this.txtPontos.text = 'PONTOS: ' + getText(game.global.score);

          // Atualiza o record caso tenha sido atingido.
          verificaRecord();

          // Exibe a pontuação de Bonus.
          const txtBonus = game.add.text(
            game.world.centerX,
            250,
            'BONUS DE TEMPO: ' + getText(bonus),
            {font:'20px emulogic', fill:'#fff'}
          );
          txtBonus.anchor.set(.5);

          // Exibe a pontuação final da fase.
          const txtPontoFinal = game.add.text(
            game.world.centerX,
            300,
            'TOTAL DE PONTOS: ' + getText(game.global.score),
            {font:'20px emulogic', fill:'#fff'}
          );
          txtPontoFinal.anchor.set(.5);
        } else {
          // Exibe a mensagem de Fim de Jogo.
          const txtGameOver = game.add.text(game.world.centerX, 250, 'GAME OVER', {font:'30px emulogic', fill:'#fff'});
          txtGameOver.anchor.set(.5);
        }

        // Aqui exibe a melhor pontuação independente se passou de fase ou se perdeu.
        const txtBestScore = this.game.add.text(
          game.world.centerX, 
          375, 
          'MELHOR RESULTADO: ' + getText(game.global.record), 
          {font:'20px emulogic', fill:"#fff"}
        );
        txtBestScore.anchor.set(.5);

        /*
          Agora cria o evento que chama novamente o Menu Principal
          Primeiro cria um evento que após um tempo chama a função.
          Parametros: Tempo de duração para chamar o evento "5000ms", a Função que executa e o contexto "this".
        */
        game.time.events.add(5000, function() {
          // Para a musica do Stage atual.
          this.music.stop();
          // Verifica se passou de fase ou se acabou o tempo.
          if (this.coins >= this.stageConfig.moedasFase) {
            // SE atingiu as moedas suficientes, passa de fase.
            game.state.start('stage2');
          } else {
            // SE NÃO chama o "Menu"
            game.state.start('menu');
          }
        }, this);
      }
    }
  },

  /*
    Função da coleta das moedas
    Ela irá "coletar" a moeda, aumentar o valor da contagem e inserir outra moeda em outro local.
  */
  getCoin: function () {
    // Guarda as coordenadas da moeda para emitir as particulas dela.
    this.emitter.x = this.coin.position.x;
    this.emitter.y = this.coin.position.y;
    // Depois emite as partículas da moeda. 
    // Parametros "( )": Gerar todas ao mesmo tempo "true", Duração, Intervalo (caso gerar seja "false") e Quantidade.
    this.emitter.start(true, 500, null, 15);
    // Toca o som da moeda ao pegar ela.
    this.somCoin.play();
    // Adiciona mais "1" a variável do contador
    this.coins++;
    // Atualiza o contador visual no jogo.
    this.txtCoins.text = 'MOEDAS: ' + getText(this.coins);
    // Atualiza o contador dos pontos. Cada moeda aqui vale "5" pontos.
    game.global.score += 5;
    // Atualiza o contador visual dos pontos no jogo.
    this.txtPontos.text = 'PONTOS: ' + getText(game.global.score);
    // Agora verifica SE a pontuação superou o record e caso seja verdade, atualiza o record também.
    verificaRecord();

    // Reposiciona a nova moeda no mapa
    this.coin.position = newPosition(this.coinPositions);
  },

  /*
    Função da perca das moedas para o inimigo
    Ela irá "tomar" as moedas, diminuindo o valor da contagem ao tocar no inimigo.
  */
  loseCoin: function () {
    // Toca o som de quando perde as moedas.
    this.somLoseCoin.play();
    // Agora verifica SE tem moedas e caso tenha executa a açao de perca das moedas.
    if (this.coins > 0) {
      // Guarda as coordenadas do jogador para emitir as particulas dele.
      this.emitter.x = this.player.position.x;
      this.emitter.y = this.player.position.y;
      // Depois emite as partículas do personagem. 
      // Parametros "( )": Gerar todas ao mesmo tempo "true", Duração, Intervalo (caso gerar seja "false") e Quantidade.
      this.emitter.start(true, 500, null, 15);

      // Zera as moedas, perde todas as moedas.
      this.coins = 0;
      // E atualiza o contados das moedas.
      this.txtCoins.text = 'MOEDAS: ' + getText(this.coins);
    }
  }
};