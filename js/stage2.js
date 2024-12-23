var stage2State = {
  create: function () {
    // Cria a variável que informa se o jogo inicia ou para (acabou).
    this.onGame = true;
    // Cria a variável com a quantidade de moedas para passar de pase.
    this.moedasFase = 15;
    // Cria a variável com o tempo da fase.
    this.tempoFase = 110;
    // Cria a variável do fator multiplicador do Bonus da fase.
    this.fatorBonus = 5;

    /*
      Iniciar a música do jogo.
      Variável Global "music" do "manuState" usando o "this" para isso.
    */
    this.music = game.add.audio('somstage2');
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
			[1,0,0,0,0,0,1,3,0,0,0,0,0,3,1],
			[1,0,1,3,1,0,1,1,0,1,1,1,1,0,1],
			[1,0,1,1,1,0,2,0,0,1,3,1,0,0,1],
			[1,0,0,0,0,0,1,1,3,1,0,0,0,1,1],
			[1,1,0,1,0,0,3,1,1,1,0,1,0,1,1],
			[1,0,0,1,0,0,0,0,0,0,0,1,3,0,1],
			[1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
			[1,0,3,0,0,1,3,0,3,1,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
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
    this.inimigo = game.add.sprite(75, 75, 'enemy');
    // Centraliza no próprio eixo.
    this.inimigo.anchor.set(.5);
    // Habilita a física ao Inimigo.
    game.physics.arcade.enable(this.inimigo);
    // Adiciona a animação do Inimigo.
    this.inimigo.animations.add("goDown", [0, 1, 2, 3, 4, 5, 6, 7], 12, true);
    this.inimigo.animations.add("goUp", [8, 9, 10, 11, 12, 13, 14, 15], 12, true);
    this.inimigo.animations.add("goLeft", [16, 17, 18, 19, 20, 21, 22, 23], 12, true);
    this.inimigo.animations.add("goRight", [24, 25, 26, 27, 28, 29, 30, 31], 12, true);
    // Cria a variável da movimentação do Inimigo e já inicia em uma direção.
    this.inimigo.direction = 'DOWN';

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
      'MOEDAS: ' + this.getText(this.coins), 
      {font: '15px emulogic', fill: '#fff'}
    );

    /*
      Contador da pontuação
      Primeiro cria a variável que vai receber os pontos
    */
    this.txtPontos = game.add.text(
      game.world.centerX, 
      15, 
      'PONTOS: ' + this.getText(game.global.score), 
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
      Aqui a variável "emitter" recebe o emissor ".emitter()"  e adiciona ".add" ao jogo "game".
      Parametros -> "( )": Eixo X, Eixo Y e Quantidade máxima de partículas.
    */
    this.emitter = game.add.emitter(0, 0, 15);
    // Adiciona a imagem a ser usada nas partículas.
    this.emitter.makeParticles('part');
    // Configura a valocidade das partículas nos Eixos X e Y. De "-50" ate "50" de velocidade, dentro da célula.
    this.emitter.setXSpeed(-50, 50);
    this.emitter.setYSpeed(-50, 50);
    // E configura para elas não serem afetadas pela gravidade.
    this.emitter.gravity.y = 0;

    /*
      Criação do tempo, temporizador do jogo
      Cria a variável que mostra o texto do tempo no jogo com suas configurações nos parametros.
      Usa a variável que armazena o tempo criada no inicio do código no "getText".
      E centraliza no final da tela.
    */
    this.txtTempo = game.add.text(
      game.world.width - 15, 
      15, 
      'TEMPO: ' + this.getText(this.tempoFase), 
      {font:'15px emulogic', fill:"#fff"}
    );
    this.txtTempo.anchor.set(1, 0);
    // Cria a variável "timer" que recebe um loop repetido ".loop()" que é um evento ".events" de Tempo ".time" no Jogo "game".
    // Parametros -> ( ): Tempo para repetir "1000ms", a Função pra chamar a cada repetição e o contexto "this".
    this.timer = game.time.events.loop(1000, function(){
      // Diminui o tempo em 1 segundo
      this.tempoFase--;
      // Atualiza o tempo visualmente no jogo.
      this.txtTempo.text = 'TEMPO: ' + this.getText(this.tempoFase);
    }, this);
  },

  update: function () {
    // Condição para iniciar o jogo, SE a variável "this.onGame" for iniciar "true", então o jogo é iniciado.
    if (this.onGame) {
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
      game.physics.arcade.overlap(this.player, this.inimigo, this.loseCoin, null, this);

      // Inicia a função de movimentação do Inimigo.
      this.moveInimigo();
      // Inicia a função de movimentação do Jogador.
      this.movePlayer();

      /*
        Condição do fim de jogo.
        SE o tempo acabar OU o jogador atigir o objetivo de coletar "10" moedas nesse caso.
        Assim ela executa as operações nescessárias para finalizar o jogo.
      */
      if (this.tempoFase < 1 || this.coins >= this.moedasFase) {
        // Chama a Função de Fim de Jogo.
        this.gameOver();

        // Para o tempo removendo o evento criado acima.
        // Remova o Temporizador ".remove(this.timer)" do Evento ".events" de Tempo ".time" do Jogo "game".
        game.time.events.remove(this.timer);

        // Agora para o personagem no Eixo X e Eixo Y.
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        // Para a animação do personagem.
        this.player.animations.stop();
        // E para o personagem na primeira imagem que ele está virado para a tela do jogador.
        this.player.frame = 0;

        // Para o Inimigo também. O inimigo já para nois eixos pois a função dele está dentro do "Update".
        this.inimigo.animations.stop();
        this.inimigo.frame = 0;

        // Para a animação das moedas.
        this.coin.animations.stop();
        this.coin.frame = 4;

        /*
          Condição para testar se o jogo acabou por causa do tempo ou passou de fase.
          SE o jogador pegar a quantidade de moedas suficientes, entra no primeiro caso.
          SE NÂO o jogador não conseguiu pegar as moedas no tempo do jogo.
        */
        if (this.coins >= this.moedasFase) {
          // Exibe na tela que passou de fase.
          const txtLevelComplete = game.add.text(
            game.world.centerX,
            150,
            'LEVEL COMPLETO!',
            {font:'30px emulogic', fill:'#fff'}
          );
          txtLevelComplete.anchor.set(.5);
          // Aumenta os Pontos de acordo com o tempo. O tempo restante multiplicado por "2" nesse caso.
          const bonus = this.tempoFase * this.fatorBonus;
          // Atualiza os pontos com o acrescimo do Bonus.
          game.global.score += bonus;
          // Atualiza o texto dos pontos.
          this.txtPontos.text = 'PONTOS: ' + this.getText(game.global.score);

          // Atualiza o record caso tenha sido atingido.
          this.verificaRecord();

          // Exibe a pontuação de Bonus.
          const txtBonus = game.add.text(
            game.world.centerX,
            250,
            'BONUS DE TEMPO: ' + this.getText(bonus),
            {font:'20px emulogic', fill:'#fff'}
          );
          txtBonus.anchor.set(.5);

          // Exibe a pontuação final da fase.
          const txtPontoFinal = game.add.text(
            game.world.centerX,
            300,
            'TOTAL DE PONTOS: ' + this.getText(game.global.score),
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
          'MELHOR RESULTADO: ' + this.getText(game.global.record), 
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
          if (this.coins >= this.moedasFase) {
            // SE atingiu as moedas suficientes, passa de fase.
            game.state.start('end');
          } else {
            // SE NÃO chama o "Menu"
            game.state.start('menu');
          }
        }, this);
      }
    }
  },

  /*
    Função para verificar se o Record foi superado.
    Primeiro ele verifica SE a pontuação atual é maior que o Record.
    Se for verdade, ele atualiza o Record com a pontuação atual.
  */
  verificaRecord: function () {
    if (game.global.score > game.global.record) {
      game.global.record = game.global.score;
    }
  },

  /*
    Função Fim de Jogo (Game Over)
    Atualiza a variável que finaliza o Jogo.
  */
  gameOver: function () {
    // Quando o jogo acaba, por tempo ou conclusão, o jogo acaba. A variável "this.onGame" recebe "false".
    this.onGame = false;
  },

  /*
    Função de Movimentação do Inimigo
    Primeiro verifica se o inimigo está no centro da célula.
    Cada célula tem 50px de largura e 50px de altura.
  */
  moveInimigo: function () {
    // Se o Eixo X do inimigo menos "25" dividido por "50" obtiver resto "0" e "&&" mesma coisa no Eixo Y.
    if (Math.floor(this.inimigo.x -25) %50 === 0 && Math.floor(this.inimigo.y -25) %50 === 0) {
        // Cria as variáveis de coordenadas do inimigo em linha e coluna.
        var colInimigo = Math.floor(this.inimigo.x / 50);
        var rowInimigo = Math.floor(this.inimigo.y / 50);
        // Cria uma Array de possíveis direções a serem seguidas, para o inimigo.
        var validPath = [];

        /*
          Verifica ao redor do inimigo para onde ele pode ir.
          Se no mapa na mesma linha do inimigo e coluna menos "1" for diferente de "1" no mapa e "&&"
          o movimento atual do inimigo for diferente de direita "RIGHT" entra no primeiro "IF".
          A segunda condição da movimentação é para evitar que ele fique indo e voltando sem sair do lugar.
          Que é para mover para a esquerda.
        */
        if (this.mapa[rowInimigo][colInimigo - 1] !== 1 && this.inimigo.direction !== 'RIGHT') {
            // Adiciona um caminho válido ao "validPath".
            validPath.push('LEFT');
        }
        // Mesma lógica para o restante das direções possíveis.
        if (this.mapa[rowInimigo][colInimigo + 1] !== 1 && this.inimigo.direction !== 'LEFT') {
            validPath.push('RIGHT');
        }
        if (this.mapa[rowInimigo - 1][colInimigo] !== 1 && this.inimigo.direction !== 'DOWN') {
            validPath.push('UP');
        }
        if (this.mapa[rowInimigo + 1][colInimigo] !== 1 && this.inimigo.direction !== 'UP') {
            validPath.push('DOWN');
        }

        // Com todos as possíveis direções registradas, sorteia uma direção para o inimigo ir.
        this.inimigo.direction = validPath[Math.floor(Math.random() * validPath.length)];
    }

    // Movimenta o inimigo na direção sorteada.
    switch (this.inimigo.direction) {
        case 'LEFT':
            this.inimigo.x -= 1;
            this.inimigo.animations.play('goLeft');
            break;
        case 'RIGHT':
            this.inimigo.x += 1;
            this.inimigo.animations.play('goRight');
            break;
        case 'UP':
            this.inimigo.y -= 1;
            this.inimigo.animations.play('goUp');
            break;
        case 'DOWN':
            this.inimigo.y += 1;
            this.inimigo.animations.play('goDown');
            break;
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
    this.txtCoins.text = 'MOEDAS: ' + this.getText(this.coins);
    // Atualiza o contador dos pontos. Cada moeda aqui vale "5" pontos.
    game.global.score += 5;
    // Atualiza o contador visual dos pontos no jogo.
    this.txtPontos.text = 'PONTOS: ' + this.getText(game.global.score);
    // Agora verifica SE a pontuação superou o record e caso seja verdade, atualiza o record também.
    this.verificaRecord();

    // Reposiciona a nova moeda no mapa
    this.coin.position = this.newPosition();
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
      this.txtCoins.text = 'MOEDAS: ' + this.getText(this.coins);
    }
  },

  /*
    Função que gera os textos do jogo
    Ela irá receber um valor, da contagem por exemplo, e vai verificar quantos digitos tem, pois vão ter sempre 3 digitos.
    Ao verificar quantos digitos tem, ela irá preencher o restante com zeros até ficar com 3 digitos.
  */
  getText: function (valor) {
    // Se o valor for menor que "10"
    if (valor < 10) {
        // Retorna dois zeros mais o valor atual.
        return '00' + valor.toString();
    }
    // Se o valor for menor que "10"
    if (valor < 100) {
        // Retorna um zero mais o valor atual.
        return '0' + valor.toString();
    }
    // Se não for nenhuma dos acima, retorna apenas o valor atual.
    return valor.toString();
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